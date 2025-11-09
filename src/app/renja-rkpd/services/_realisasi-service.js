import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";
import { groupHierarchy } from "./__rkpd-service.js";


export const list = async (req) => {
       const skpd_periode_id = parseInt(req.body.skpd_periode_id);
       const tahun_ke = parseInt(req.body.tahun_ke);

       const getProgram = await prisma.master.findMany({
              where: {
                     type: "program",
                     outcome: { some: { skpd_periode_id } }
              },
              include: {
                     outcome: {
                            where: { skpd_periode_id },
                            include: {
                                   indikatorOutcome: {
                                          where: { targetIndikatorOutcome: { some: { tahun_ke } } },
                                   }
                            }
                     },
                     paguProgram: {
                            where: { skpd_periode_id, tahun_ke }
                     },
                     parent: { include: { parent: true } },
                     children: {
                            where: { paguKegiatan: { some: { skpd_periode_id } } },
                            include: {
                                   paguKegiatan: { where: { skpd_periode_id, tahun_ke } },
                                   children: {
                                          where: { indikator: { some: { skpd_periode_id } } },
                                          include: {
                                                 paguIndikatif: {
                                                        where: { skpd_periode_id, tahun_ke },
                                                        include: { realisasi: true }
                                                 },
                                                 indikator: {
                                                        where: { skpd_periode_id },
                                                        include: { rincian: { where: { tahun_ke }, include: { capaian: true } } }
                                                 },
                                          }

                                   }
                            }

                     }

              }
       });
       if (getProgram.length === 0) {
              throw new errorHandling(400, "Data capaian tidak ditemukan");
       }

       const result = [];
       for (const p of getProgram) {
              const kegiatan = [];
              for (const k of p.children) {
                     const subKegiatan = [];
                     for (const sk of k.children) {
                            subKegiatan.push({
                                   id: sk.id,
                                   parent: sk.parent_id,
                                   kode: sk.kode,
                                   name: sk.name,
                                   indikator: mappingIndikator(sk.indikator),
                                   pagu: mappingPagu(sk.paguIndikatif[0])
                            })
                     }
                     kegiatan.push({
                            id: k.id,
                            parent: k.parent_id,
                            kode: k.kode,
                            name: k.name,
                            type: "kegiatan",
                            pagu: agregatPaguFromChild(k.paguKegiatan[0], subKegiatan),
                            // indikator: mappingIndikator(k.indikator),
                            subKegiatan
                     })
              }
              const program = {
                     id: p.id,
                     parent: p.parent_id,
                     kode: p.kode,
                     name: p.name,
                     type: "program",
                     pagu: agregatPaguFromChild(p.paguProgram[0], kegiatan),
                     kegiatan

              }

              const bidang = {
                     id: p.parent.id,
                     parent: p.parent.parent_id,
                     kode: p.parent.kode,
                     name: p.parent.name,
                     type: "bidang",
                     program
              }
              result.push({
                     id: p.parent.parent.id,
                     kode: p.parent.parent.kode,
                     name: p.parent.parent.name,
                     type: "urusan",
                     bidang
              })
       }
       return groupHierarchy(result);
}

const mappingPagu = (pagu) => {
       const target = pagu.pagu
       let total_realisasi = 0;
       let realisasi_per_triwulan = Array.from({ length: 4 }).map((_, index) => {
              return { triwulan: index + 1, realisasi: 0 }
       });


       if (pagu.realisasi.length === 0) {
              return {
                     id_pagu: pagu.id,
                     target,
                     realisasi_per_triwulan,
                     total_realisasi,
                     persen_realisasi: 0
              }
       } else {
              const mapRealisasi = [];
              for (const t of pagu.realisasi) {
                     const { triwulan, realisasi } = t;
                     total_realisasi += Number(realisasi);
                     mapRealisasi.push({ triwulan, realisasi });
              }
              realisasi_per_triwulan = mapRealisasi


              return {
                     id_pagu: pagu.id,
                     target,
                     realisasi_per_triwulan,
                     total_realisasi,
                     persen_realisasi: (total_realisasi / target) * 100

              }
       }

}

const agregatPaguFromChild = (pagu, children) => {
       // Inisialisasi nilai awal parent
       let total_target = pagu.pagu;
       let total_realisasi = 0;
       let realisasi_per_triwulan = Array.from({ length: 4 }, (_, index) => ({
              triwulan: index + 1,
              realisasi: 0
       }));

       // Loop semua children dan jumlahkan
       for (const r of children) {
              const child = r.pagu;
              total_realisasi += Number(child.total_realisasi) || 0;

              // Gabungkan realisasi per triwulan anak ke parent
              for (const r of child.realisasi_per_triwulan) {
                     const index = r.triwulan - 1;
                     if (index >= 0 && index < realisasi_per_triwulan.length) {
                            realisasi_per_triwulan[index].realisasi += Number(r.realisasi) || 0;
                     }
              }
       }

       const persen_realisasi = total_target > 0 ? (total_realisasi / total_target) * 100 : 0;

       return {
              id_pagu: pagu.id,
              target: total_target,
              realisasi_per_triwulan,
              total_realisasi,
              persen_realisasi
       };
};


const mappingIndikator = (indikator) => {
       const result = [];

       for (const ind of indikator) {
              let capaian = null

              if (ind.rincian[0].capaian.length === 0) {
                     capaian = {
                            id_rincian: ind.rincian[0].id,
                            tahun_ke: ind.rincian[0].tahun_ke,
                            target: ind.rincian[0].target,
                            capaianTriwulan: [1, 2, 3, 4].map(item => ({
                                   triwulan: item,
                                   capaian: 0
                            })),
                            capaianTotal: 0,
                            persenCapaian: 0,
                     }
              } else {
                     const capaianTotal = ind.rincian[0].capaian.reduce((sum, item) => sum + (item.capaian), 0);
                     const persenCapaian = ((capaianTotal / ind.rincian[0].target) * 100).toFixed(2);
                     const capaianTriwulan = ind.rincian[0].capaian.map(item => ({ triwulan: item.triwulan, capaian: item.capaian }));
                     capaian = { capaianTotal, persenCapaian, capaianTriwulan }
              }

              result.push({
                     id: ind.id,
                     name: ind.name,
                     satuan: ind.satuan,
                     target_capaian: capaian
              })
       }

       return result;
}

export const updateKinerja = async (req) => {
       const { id_rincian, capaian } = req.body;
       const cekCapaian = await prisma.capaianTriwulan.findMany({
              where: {
                     rincianIndikator_id: parseInt(id_rincian)

              }
       });
       for (const item of capaian) {
              const existing = cekCapaian.find(
                     (c) => c.triwulan === item.triwulan
              );
              if (existing) {
                     // Update existing record
                     await prisma.capaianTriwulan.update({
                            where: { id: existing.id },
                            data: { capaian: item.capaian },
                     });
              } else {
                     // Create new record
                     await prisma.capaianTriwulan.create({
                            data: {
                                   rincianIndikator_id: parseInt(id_rincian),
                                   triwulan: item.triwulan,
                                   capaian: item.capaian,
                            },
                     });
              }
       }
       const rincian = await prisma.rincianIndikator.findUnique({
              where: { id: parseInt(id_rincian) },
              include: {
                     indikator: true
              }
       });
       return await list({
              body: {
                     skpd_periode_id: rincian.indikator.skpd_periode_id,
                     tahun_ke: rincian.tahun_ke
              }
       });
}

export const updateAnggaran = async (req) => {
       const id = parseInt(req.body.id_pagu);
       const cekCapaian = await prisma.realisasiAnggaran.findMany({
              where: { paguIndikatif_id: id }
       });

       for (const item of req.body.realisasi) {
              const existing = cekCapaian.find(
                     (c) => c.triwulan === item.triwulan
              );
              if (existing) {
                     // Update existing record
                     await prisma.realisasiAnggaran.update({
                            where: { id: existing.id },
                            data: { realisasi: item.realisasi },
                     });
              } else {
                     // Create new record
                     await prisma.realisasiAnggaran.create({
                            data: {
                                   paguIndikatif_id: id,
                                   triwulan: item.triwulan,
                                   realisasi: item.realisasi,
                            },
                     });
              }
       }
       const getPagu = await prisma.paguIndikatif.findFirst({
              where: { id }
       });
       const params = { skpd_periode_id: getPagu.skpd_periode_id, tahun_ke: getPagu.tahun_ke }
       return await list({ body: params });
}

export const togglePerhitungan = async (req) => {
       const { id_indikator, type, perhitungan } = req.body
       if (type === "program") {

       } else {
              const exist = await prisma.indikator.findUnique({ where: { id: id_indikator } });
              if (!exist) throw new errorHandling(404, "Indikator tidak ditemukan");
              const update = await prisma.indikator.update({})
       }
}