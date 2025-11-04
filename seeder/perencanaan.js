import fs from "fs"
import response from "../src/utility/response.js";
import prisma from "../src/config/database.js";

function strukturkanData(data) {
       const result = [];

       for (const item of data) {
              // --- Level 1: Urusan
              let urusan = result.find(u => u.kode_urusan === item.kode_urusan);
              if (!urusan) {
                     urusan = {
                            kode_urusan: item.kode_urusan,
                            nama_urusan: item.nama_urusan,
                            pagu: 0,
                            children: []
                     };
                     result.push(urusan);
              }
              urusan.pagu += item.pagu || 0;

              // --- Level 2: Bidang Urusan
              let bidang = urusan.children.find(b => b.kode_bidang_urusan === item.kode_bidang_urusan);
              if (!bidang) {
                     bidang = {
                            kode_bidang_urusan: item.kode_bidang_urusan,
                            nama_bidang_urusan: item.nama_bidang_urusan,
                            pagu: 0,
                            children: []
                     };
                     urusan.children.push(bidang);
              }
              bidang.pagu += item.pagu || 0;

              // --- Level 3: Program
              let program = bidang.children.find(p => p.kode_program === item.kode_program);
              if (!program) {
                     program = {
                            kode_program: item.kode_program,
                            nama_program: item.nama_program,
                            outcome: item.outcome,
                            indikator_outcome: item.indikator_outcome,
                            target: item.target_akhir,
                            pagu: 0,
                            children: []
                     };
                     bidang.children.push(program);
              }
              program.pagu += item.pagu || 0;

              // --- Level 4: Kegiatan
              let kegiatan = program.children.find(g => g.kode_giat === item.kode_giat);
              if (!kegiatan) {
                     kegiatan = {
                            kode_giat: item.kode_giat,
                            nama_giat: item.nama_giat,
                            pagu: 0,
                            children: []
                     };
                     program.children.push(kegiatan);
              }
              kegiatan.pagu += item.pagu || 0;

              // --- Level 5: Sub Kegiatan
              let sub = kegiatan.children.find(s => s.kode_sub_giat === item.kode_sub_giat);
              if (!sub) {
                     sub = {
                            kode_sub_giat: item.kode_sub_giat,
                            nama_sub_giat: item.nama_sub_giat,
                            indikator: item.tolak_ukur_output,
                            target: item.target_teks_output,
                            pagu: item.pagu || 0
                     };
                     kegiatan.children.push(sub);
              }
       }

       return result;
}

const createMaster = async (type, name, kode, parent_id) => {
       const exist = await prisma.master.findFirst({ where: { kode, parent_id: parent_id || null, type } });
       if (exist) {
              return exist;
       } else {
              return await prisma.master.create({
                     data: {
                            type,
                            name,
                            kode,
                            parent_id: parent_id || null
                     }
              });
       }

}

const setpaGU = async (skpd_periode_id, tahun_ke, id_master, pagu) => {
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

const setIndikator = async (skpd_periode_id, master_id, name, satuan, target, tahun_ke) => {
       const exist = await prisma.indikator.findFirst({ where: { skpd_periode_id, master_id, name, satuan } });

       if (exist) {
              return await prisma.indikator.update({
                     where: { id: exist.id },
                     data: {
                            skpd_periode_id, master_id, name, satuan,
                            rincian: {
                                   upsert: {
                                          where: { indikator_id_tahun_ke: { indikator_id: exist.id, tahun_ke } },
                                          update: { target },
                                          create: { target, tahun_ke }
                                   }
                            }
                     }
              })
       } else {
              await prisma.indikator.create({
                     data: {
                            skpd_periode_id, master_id, name, satuan,
                            rincian: { create: [{ target, tahun_ke }] }
                     }
              });
       }
}

const setoutcome = async (skpd_periode_id, id_master, outcome) => {
       const exist = await prisma.outcome.findFirst({ where: { skpd_periode_id, id_master } });

       if (exist) {
              return await prisma.outcome.update({
                     where: { id: exist.id },
                     data: { skpd_periode_id, id_master, outcome }
              })
       } else {
              return await prisma.outcome.create({
                     data: { skpd_periode_id, id_master, outcome, }
              });
       }
}

const prosesData = async (tahun_ke, skpd_periode_id, data) => {
       const result = [];
       for (const urusan of data) {
              const creteUrusan = await createMaster(
                     "urusan",
                     urusan.nama_urusan,
                     urusan.kode_urusan
              );


              for (const bidang of urusan.children) {
                     const createBidang = await createMaster(
                            "bidang",
                            bidang.nama_bidang_urusan,
                            bidang.kode_bidang_urusan.split(".")[1],
                            creteUrusan.id
                     );

                     for (const program of bidang.children) {
                            const createProgram = await createMaster(
                                   "program",
                                   program.nama_program,
                                   program.kode_program.split('.')[2],
                                   createBidang.id
                            );

                            const outcome = program.outcome ? program.outcome.replace("[ ", "").replace(" ]", "") : null;
                            if (outcome) {
                                   await setoutcome(skpd_periode_id, createProgram.id, outcome);
                            }
                            if (program.indikator_outcome) {
                                   await setIndikator(skpd_periode_id, createProgram.id, program.indikator_outcome, "%", program.target, tahun_ke);
                            }
                            await setpaGU(skpd_periode_id, tahun_ke, createProgram.id, program.pagu);
                            result.push(createProgram);


                            for (const kegiatan of program.children) {
                                   const kodeGiat = kegiatan.kode_giat.split('.')[3] + "." + kegiatan.kode_giat.split('.')[4];
                                   const createKegiatan = await createMaster(
                                          "kegiatan",
                                          kegiatan.nama_giat,
                                          kodeGiat,
                                          createProgram.id
                                   );
                                   await setpaGU(skpd_periode_id, tahun_ke, createKegiatan.id, kegiatan.pagu);

                                   for (const sub of kegiatan.children) {
                                          const kodeSubGiat = sub.kode_sub_giat.split('.')[5];
                                          const createSubKegiatan = await createMaster(
                                                 "subKegiatan",
                                                 sub.nama_sub_giat,
                                                 kodeSubGiat,
                                                 createKegiatan.id
                                          );
                                          if (sub.indikator !== null) await setIndikator(
                                                 skpd_periode_id,
                                                 createSubKegiatan.id,
                                                 sub.indikator,
                                                 sub.target?.split(" ")[1] || "%",
                                                 sub.target?.split(" ")[0] || "0",
                                                 tahun_ke);
                                          await setpaGU(skpd_periode_id, tahun_ke, createSubKegiatan.id, sub.pagu);
                                   }
                            }
                     }
              }
       }
       return result;

}
export const seedPerencanaan = async (req, res, next) => {
       try {
              // const getFile = JSON.parse(fs.readFileSync(`./seeder/perencanaan/7.01.0.00.0.00.14.0000.json`, 'utf8'));
              // const hasil = strukturkanData(getFile);

              // return response(res, 200, true, "Berhasil", hasil || null);
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
                     const getFile = JSON.parse(fs.readFileSync(`./seeder/perencanaan/${s.kode}.json`, 'utf8'));
                     const hasil = strukturkanData(getFile);
                     result.push(await prosesData(tahun_ke, s.skpd_periode[0].id, hasil));
              }
              return response(res, 200, true, "Berhasil", result);
       } catch (error) {
              next(error);
       }
}