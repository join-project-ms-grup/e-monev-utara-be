import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";
import { groupHierarchy } from "./__hasil-service.js";


export const list = async (req) => {
       const skpd_periode_id = parseInt(req.body.skpd_periode_id);
       const tahun_ke = parseInt(req.body.tahun_ke);

       const getProgram = await prisma.x_master.findMany({
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
                                          include: {
                                                 targetIndikatorOutcome: {
                                                        where: { tahun_ke }
                                                 }
                                          }
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
                                                        where: { skpd_periode_id, tahun_ke }
                                                 },
                                                 indikator: {
                                                        where: { skpd_periode_id },
                                                        include: {
                                                               rincian: { where: { tahun_ke } }
                                                        },
                                                 }

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
                     outcome: mappingOutcome(p.outcome),
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
       return {
              id_pagu: pagu.id,
              target: pagu.pagu,
              realisasi: pagu.realisasi || 0,
              persen_realisasi: pagu.realisasi ? (Number(pagu.realisasi) / Number(pagu.target)) * 100 : 0
       }

}

const agregatPaguFromChild = (pagu, children) => {
       // Inisialisasi nilai awal parent
       let target = Number(pagu.pagu);
       let realisasi = 0;

       // Loop semua children dan jumlahkan
       for (const r of children) {
              const child = r.pagu;
              realisasi += Number(child.realisasi);
       }

       const persen_realisasi = realisasi > 0 ? (realisasi / target) * 100 : 0;

       return {
              id_pagu: pagu.id,
              target,
              realisasi,
              persen_realisasi
       };
};

const mappingOutcome = (outcome) => {
       const result = [];
       for (const o of outcome) {
              const ind = o.indikatorOutcome;
              result.push({
                     outcome: o.outcome,
                     indikator: {
                            id: ind.id,
                            name: ind.nama,
                            satuan: ind.satuan || "%",
                            target_capaian: {
                                   id: ind.targetIndikatorOutcome[0].id,
                                   target: ind.targetIndikatorOutcome[0].target,
                                   capaian: ind.targetIndikatorOutcome[0].capaian || 0,
                                   persen: ind.targetIndikatorOutcome[0].capaian ? (ind.targetIndikatorOutcome[0].capaian / ind.targetIndikatorOutcome[0].target) * 100 : 0
                            }
                     }
              })
       }
       return result
}

const mappingIndikator = (indikator) => {
       const result = [];

       for (const ind of indikator) {
              result.push({
                     id: ind.id,
                     name: ind.name,
                     satuan: ind.satuan,
                     target_capaian: {
                            id_rincian: ind.rincian[0].id,
                            tahun_ke: ind.rincian[0].tahun_ke,
                            target: ind.rincian[0].target,
                            capaian: ind.rincian[0].capaian || 0,
                            persenCapaian: ind.rincian[0].capaian ? (ind.rincian[0].target / ind.rincian[0].capaian) * 100 : 0
                     }
              })
       }

       return result;
}

export const updateKinerjaOutcome = async (req) => {
       const { id_target, capaian } = req.body;
       const rincian = await prisma.x_targetIndikatorOutcome.findUnique({
              where: { id: parseInt(id_target) },
              include: {
                     indikatorOutcome: {
                            include: { outcome: true }
                     }
              }
       });
       if (!rincian) {
              throw new errorHandling(404, "Data target tidak ditemukan");
       }
       await prisma.x_targetIndikatorOutcome.update({
              where: { id: id_target },
              data: { capaian }
       });

       return await list({
              body: {
                     skpd_periode_id: rincian.indikatorOutcome.outcome.skpd_periode_id,
                     tahun_ke: rincian.tahun_ke
              }
       });
}
export const updateKinerja = async (req) => {
       const { id_rincian, capaian } = req.body;
       const rincian = await prisma.x_rincianIndikator.findUnique({
              where: { id: parseInt(id_rincian) },
              include: {
                     indikator: true
              }
       });
       if (!rincian) {
              throw new errorHandling(404, "Data target tidak ditemukan");
       }
       await prisma.x_rincianIndikator.update({
              where: { id: id_rincian },
              data: { capaian }
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
       const realisasi = Number(req.body.realisasi);

       const getPagu = await prisma.x_paguIndikatif.findFirst({
              where: { id }
       });
       console.log(getPagu);

       if (!getPagu) {
              throw new errorHandling(404, "Target pagu tidak ditemukan");
       }

       await prisma.x_paguIndikatif.update({
              where: { id },
              data: { realisasi }
       });

       const params = { skpd_periode_id: getPagu.skpd_periode_id, tahun_ke: getPagu.tahun_ke }
       return await list({ body: params });
}