// services/paguService.js

import prisma from "../../../config/database.js";
// import { errorHandling } from "../middlewares/erros-handling.js";
import { groupHierarchy } from "./__hasil-service.js";

export const addPagu = async (req) => {
       const { skpd_periode_id, master_id, target } = req.body;

       return await prisma.$transaction(async (tx) => {
              // Hapus data lama (jika ingin overwrite)
              await tx.paguIndikatif.deleteMany({
                     where: { skpd_periode_id, id_master: master_id },
              });

              // Insert semua target pagu baru
              const paguList = await Promise.all(
                     target.map((item) =>
                            tx.paguIndikatif.create({
                                   data: {
                                          skpd_periode_id,
                                          id_master: master_id,
                                          tahun_ke: item.tahun_ke,
                                          pagu: item.pagu,
                                   },
                            })
                     )
              );

              await tx.logPaguIndikatif.createMany({
                     data: paguList.map(p => ({
                            pagu_id: p.id,
                            user_id: req.user?.id || null,
                            action: "CREATE",
                            new_data: p,
                     })),
              });

              return paguList;
       });
};

export const updatePagu = async (req) => {
       const { skpd_periode_id, master_id, target } = req.body;

       return await prisma.$transaction(async (tx) => {
              // Ambil data pagu eksisting
              const existing = await tx.paguIndikatif.findMany({
                     where: { skpd_periode_id, id_master: master_id },
              });

              // Update jika tahun_ke sudah ada, atau create jika belum
              const result = await Promise.all(
                     target.map(async (item) => {
                            const found = existing.find((p) => p.tahun_ke === item.tahun_ke);
                            if (found) {
                                   return tx.paguIndikatif.update({
                                          where: { id: found.id },
                                          data: { pagu: item.pagu },
                                   });
                            } else {
                                   return tx.paguIndikatif.create({
                                          data: {
                                                 skpd_periode_id,
                                                 id_master: master_id,
                                                 tahun_ke: item.tahun_ke,
                                                 pagu: item.pagu,
                                          },
                                   });
                            }
                     })
              );

              return result;
       });
};


export const listPagu = async (req) => {
       const skpd_periode_id = parseInt(req.params.skpd_periode_id);
       const getProgram = await prisma.master.findMany({
              where: {
                     type: "program",
                     paguProgram: { some: { skpd_periode_id } }
              },
              include: {
                     parent: { include: { parent: true } },
                     paguProgram: { where: { skpd_periode_id } },
                     children: {
                            where: { paguKegiatan: { some: { skpd_periode_id } } },
                            include: {
                                   paguKegiatan: { where: { skpd_periode_id } },
                                   children: {
                                          where: { paguIndikatif: { some: { skpd_periode_id } } },
                                          include: {
                                                 paguIndikatif: { where: { skpd_periode_id } }
                                          }
                                   }
                            }
                     }
              }
       });
       const result = [];
       for (const p of getProgram) {

              const kegiatan = [];
              for (const k of p.children) {

                     const subKegiatan = [];
                     for (const sk of k.children) {
                            subKegiatan.push({
                                   id: sk.id,
                                   kode: sk.kode,
                                   name: sk.name,
                                   type: sk.type,
                                   pagu: mappingPagu(sk.paguIndikatif)
                            });
                     }
                     kegiatan.push({
                            id: k.id,
                            kode: k.kode,
                            name: k.name,
                            type: k.type,
                            pagu: mappingPagu(k.paguKegiatan),
                            subKegiatan
                     })
              }

              result.push({
                     id: p.parent.parent.id,
                     kode: p.parent.parent.kode,
                     name: p.parent.parent.name,
                     type: p.parent.parent.type,
                     bidang: {
                            id: p.parent.id,
                            kode: p.parent.kode,
                            name: p.parent.name,
                            type: p.parent.type,
                            program: {
                                   id: p.id,
                                   kode: p.kode,
                                   name: p.name,
                                   type: p.type,
                                   pagu: mappingPagu(p.paguProgram),
                                   kegiatan
                            }
                     }
              })
       }

       return groupHierarchy(result);
};

const mappingPagu = (pagu) => {
       const tahun = [1, 2, 3, 4, 5];

       return tahun.map(tahun_ke => {
              const p = pagu.find(item => item.tahun_ke === tahun_ke);
              if (p) {
                     return { tahun_ke, pagu: p.pagu }
              } else {
                     return { tahun_ke, pagu: 0 }
              }
       });

}


