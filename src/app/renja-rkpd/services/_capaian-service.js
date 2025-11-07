import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";
import { groupHierarchy } from "./__rkpd-service.js";

export const getCapaianList = async (req) => {
       const skpd_periode_id = parseInt(req.params.skpd_periode_id);
       const tahun_ke = parseInt(req.params.tahun_ke);

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
                     parent: { include: { parent: true } },
                     children: {
                            where: { paguKegiatan: { some: { skpd_periode_id } } },
                            include: {
                                   children: {
                                          where: { indikator: { some: { skpd_periode_id } } },
                                          include: {
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
                                   indikator: mappingIndikator(sk.indikator)
                            })
                     }
                     kegiatan.push({
                            id: k.id,
                            parent: k.parent_id,
                            kode: k.kode,
                            name: k.name,
                            type: "kegiatan",
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
                     // indikator: mappingIndikator(p.outcome.indikatorOutcome),
                     // indikator: mappingIndikator(p.outcome.indikatorOutcome),
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
const mappingIndikator = (indikator) => {
       const result = [];

       for (const ind of indikator) {
              const target = {
                     id_rincian: ind.rincian[0].id,
                     tahun_ke: ind.rincian[0].tahun_ke,
                     target: ind.rincian[0].target
              }
              let capaian = null

              if (ind.rincian[0].capaian.length === 0) {
                     capaian = {
                            capaianTotal: 0,
                            persenCapaian: 0,
                            capaianTriwulan: [1, 2, 3, 4].map(item => ({
                                   triwulan: item,
                                   capaian: 0
                            }))
                     }
              } else {
                     const capaianTotal = ind.rincian[0].capaian.reduce((sum, item) => sum + (item.capaian), 0);
                     const persenCapaian = ((capaianTotal / target.target) * 100).toFixed(2);
                     const capaianTriwulan = ind.rincian[0].capaian.map(item => ({ triwulan: item.triwulan, capaian: item.capaian }));
                     capaian = { capaianTotal, persenCapaian, capaianTriwulan }
              }

              result.push({
                     id: ind.id,
                     name: ind.name,
                     satuan: ind.satuan,
                     target: [{ ...target }],
                     capaian
              })
       }

       return result;
}

