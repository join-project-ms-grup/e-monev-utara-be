import fs from "fs";
import response from "../src/utility/response.js";
import prisma from "../src/config/database.js";

export const seedPagu = async (req, res, next) => {
       try {
              const tahun_ke = 1;
              const skpd = await prisma.skpd.findMany({
                     include: {
                            skpd_periode: {
                                   where: {
                                          periode: { mulai: 2026, akhir: 2030 }
                                   }
                            }
                     }
              });
              // return response(res, 200, true, "berhasil", skpd);
              const result = [];
              for (const s of skpd) {
                     const getFile = JSON.parse(fs.readFileSync(`./seeder/pagu/${s.kode}.json`, 'utf8'));
                     result.push(await prosesData(tahun_ke, s.skpd_periode[0].id, getFile));
              }
              return response(res, 200, true, "berhasil", result);
       } catch (error) {
              next(error)
       }
}

const prosesData = async (tahun_ke, skpd_periode_id, getFile) => {

       const grouped = [];

       for (const item of getFile) {
              // ===== URUSAN =====
              let urusan = grouped.find(u => u.id_urusan === item.id_urusan);
              if (!urusan) {
                     urusan = {
                            id_urusan: item.id_urusan,
                            kode_urusan: item.kode_urusan.split(".")[0],
                            nama_urusan: item.nama_urusan,
                            bidang: []
                     };
                     grouped.push(urusan);
              }

              // ===== BIDANG =====
              let bidang = urusan.bidang.find(b => b.id_bidang_urusan === item.id_bidang_urusan);
              if (!bidang) {
                     bidang = {
                            id_bidang_urusan: item.id_bidang_urusan,
                            kode_bidang_urusan: item.kode_bidang_urusan.split(".")[1],
                            nama_bidang_urusan: item.nama_bidang_urusan,
                            program: []
                     };
                     urusan.bidang.push(bidang);
              }

              // ===== PROGRAM =====
              let program = bidang.program.find(p => p.id_program === item.id_program);
              if (!program) {
                     program = {
                            id_program: item.id_program,
                            kode_program: item.kode_program.split(".")[2],
                            nama_program: item.nama_program,
                            kegiatan: []
                     };
                     bidang.program.push(program);
              }

              // ===== KEGIATAN =====
              let kegiatan = program.kegiatan.find(k => k.id_giat === item.id_giat);
              if (!kegiatan) {
                     kegiatan = {
                            id_giat: item.id_giat,
                            kode_giat: item.kode_giat.split(".")[3] + "." + item.kode_giat.split(".")[4],
                            nama_giat: item.nama_giat,
                            pagu_giat: item.pagu_giat,
                            subKegiatan: []
                     };
                     program.kegiatan.push(kegiatan);
              }

              // ===== SUB KEGIATAN =====
              kegiatan.subKegiatan.push({
                     id_sub_giat: item.id_sub_giat,
                     kode_sub_giat: item.kode_sub_giat.split(".")[5],
                     nama_sub_giat: item.nama_sub_giat,
                     pagu: item.pagu,
                     pagu_indikatif: item.pagu_indikatif,
                     rincian: item.rincian,
                     kode_sbl: item.kode_sbl,
                     user_created: item.user_created,
                     updated_date: item.updated_date
              });
       }
       const result = [];
       for (const u of grouped) {
              for (const b of u.bidang) {
                     for (const p of b.program) {
                            for (const k of p.kegiatan) {
                                   const getK = await prisma.master.findFirst({
                                          where: {
                                                 kode: k.kode_giat,
                                                 parent: {
                                                        kode: p.kode_program,
                                                        parent: { kode: b.kode_bidang_urusan, parent: { kode: u.kode_urusan } }
                                                 }
                                          }
                                   });
                                   if (getK) {
                                          const createPagu = await setpaGU(skpd_periode_id, tahun_ke, getK.id, k.pagu_giat);
                                          result.push(createPagu);
                                   }
                                   for (const sk of k.subKegiatan) {
                                          const getSk = await prisma.master.findFirst(
                                                 {
                                                        where: {
                                                               kode: sk.kode_sub_giat,
                                                               parent: {
                                                                      kode: k.kode_giat,
                                                                      parent: {
                                                                             kode: p.kode_program,
                                                                             parent: { kode: b.kode_bidang_urusan, parent: { kode: u.kode_urusan } }
                                                                      }
                                                               }
                                                        }
                                                 }
                                          );
                                          if (getSk) {
                                                 const createPaguSK = await setpaGU(skpd_periode_id, tahun_ke, getSk.id, sk.pagu);
                                                 result.push(createPaguSK);
                                          }
                                   }
                            }
                            const getP = await prisma.master.findFirst({
                                   where: {
                                          kode: p.kode_program,
                                          parent: { kode: b.kode_bidang_urusan, parent: { kode: u.kode_urusan } }
                                   },
                                   include: {
                                          children: {
                                                 where: { pagu: { some: { skpd_periode_id, tahun_ke } } },
                                                 include: { pagu: { where: { skpd_periode_id, tahun_ke } } }
                                          }
                                   }
                            });
                            if (getP) {
                                   const totalPagu = getP.children.reduce((sum, item) => sum + Number(item.pagu[0].pagu || 0), 0);
                                   const createPaguProgram = await setpaGU(skpd_periode_id, tahun_ke, getP.id, totalPagu);
                                   result.push(createPaguProgram);
                            }


                     }

              }
       }
       return result;
       // return response(res, 200, true, "berhasil", grouped);
}

export const setpaGU = async (skpd_periode_id, tahun_ke, id_master, pagu) => {
       const exist = await prisma.paguIndikatif.findFirst({ where: { skpd_periode_id, id_master, tahun_ke } });

       if (exist) {
              return await prisma.paguIndikatif.update({
                     where: { id: exist.id },
                     data: { skpd_periode_id, id_master, tahun_ke, pagu }
              })
       } else {
              return await prisma.paguIndikatif.create({
                     data: { skpd_periode_id, id_master, tahun_ke, pagu, }
              });
       }

}