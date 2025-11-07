import fs from "fs"
import response from "../../../utility/response.js";
import prisma from "../../../config/database.js";

function strukturkanData(data) {
       let skpdPagu = 0;
       let result = [];

       for (const item of data) {
              if (item.total_pagu_indikatif_sub_skpd) {
                     skpdPagu = item.total_pagu_indikatif_sub_skpd;
              }

              // --- Level 1: Urusan
              let urusan = result.find(u => u.kode_urusan === item.kode_urusan);
              if (!urusan) {
                     urusan = {
                            kode_urusan: item.kode_urusan,
                            nama_urusan: item.nama_urusan,
                            pagu: item.total_pagu_indikatif_urusan || 0,
                            children: []
                     };
                     result.push(urusan);
              }

              // --- Level 2: Bidang Urusan
              let bidang = urusan.children.find(b => b.kode_bidang_urusan === item.kode_bidang_urusan);
              if (!bidang) {
                     bidang = {
                            kode_bidang_urusan: item.kode_bidang_urusan,
                            nama_bidang_urusan: item.nama_bidang_urusan,
                            pagu: item.total_pagu_indikatif_bidang_urusan || 0,
                            children: []
                     };
                     urusan.children.push(bidang);
              }

              // --- Level 3: Program
              let program = bidang.children.find(p => p.kode_program === item.kode_program);
              if (!program) {
                     const indikatorProgram = [];
                     if (item.indikator_outcome) {
                            if (item.indikator_outcome.includes("\n")) {
                                   const splitIndikator = item.indikator_outcome.split("\n");
                                   const splitTarget = item.target_maju_1.split("\n");

                                   for (const si of splitIndikator) {
                                          const ti = splitTarget[splitIndikator.indexOf(si)];
                                          indikatorProgram.push({ name: si.trim(), target: ti ? ti.trim() : "" });
                                   }
                            } else {
                                   indikatorProgram.push({ name: item.indikator_outcome.trim(), target: item.target_maju_1.trim() });
                            }
                     }
                     program = {
                            kode_program: item.kode_program,
                            nama_program: item.nama_program,
                            outcome: item.outcome,
                            indikator_outcome: indikatorProgram,
                            pagu: item.total_pagu_indikatif_program || 0,
                            children: []
                     };
                     bidang.children.push(program);
              }

              // --- Level 4: Kegiatan
              let kegiatan = program.children.find(g => g.kode_giat === item.kode_giat);
              if (!kegiatan) {
                     kegiatan = {
                            kode_giat: item.kode_giat,
                            nama_giat: item.nama_giat,
                            pagu: item.total_pagu_indikatif_kegiatan,
                            children: []
                     };
                     program.children.push(kegiatan);
              }

              // --- Level 5: Sub Kegiatan
              let sub = kegiatan.children.find(s => s.kode_sub_giat === item.kode_sub_giat);
              if (!sub) {
                     const indikatorSub = [];
                     if (item.tolak_ukur_output) {
                            if (item.tolak_ukur_output.includes("\n")) {
                                   const splitIndikator = item.tolak_ukur_output.split("\n");
                                   const splitTarget = item.target_teks_output.split("\n");

                                   for (const si of splitIndikator) {
                                          const ti = splitTarget[splitIndikator.indexOf(si)];
                                          indikatorSub.push({ name: si.trim(), target: ti ? ti.trim().split(" ")[0] : "" });
                                   }
                            } else {
                                   indikatorSub.push({ name: item.tolak_ukur_output.trim(), target: item.target_teks_output.trim().split(" ")[0] });
                            }
                     }
                     const kode_dana_split = item.kode_dana ? item.kode_dana.split(",") : [null];
                     const nama_dana_split = item.nama_dana ? item.nama_dana.split(",") : [null];
                     const sumber_data = [];
                     if (kode_dana_split.length > 1) {
                            for (let i = 0; i < kode_dana_split.length; i++) {
                                   sumber_data.push({
                                          kode_dana: kode_dana_split[i].trim(),
                                          nama_dana: nama_dana_split[i]?.trim() || ""
                                   });
                            }
                     } else {
                            sumber_data.push({
                                   kode_dana: item.kode_dana,
                                   nama_dana: item.nama_dana
                            });
                     }
                     sub = {
                            kode_sub_giat: item.kode_sub_giat,
                            nama_sub_giat: item.nama_sub_giat,

                            label_nasional: item.label_nasional || null,
                            label_prov: item.label_prov || null,
                            label_kab_kota: item.label_kokab || null,

                            indikator: indikatorSub,
                            satuan: item.satuan_output,

                            sumber_dana: sumber_data,
                            pagu: item.pagu || 0,
                            lokasi: item.lokasi_bl,
                     };
                     kegiatan.children.push(sub);
              }
       }

       return { result, skpdPagu };
}

const createMaster = async (type, name, kode, parent_id) => {
       const exist = await prisma.x_master.findFirst({ where: { kode, parent_id: parent_id || null, type } });
       if (exist) {
              return exist;
       } else {
              return await prisma.x_master.create({
                     data: {
                            type,
                            name,
                            kode,
                            parent_id: parent_id || null
                     }
              });
       }

}

const setoutcome = async (skpd_periode_id, id_master, outcomeText, program) => {
       const exist = await prisma.x_outcome.findFirst({
              where: { skpd_periode_id, id_master },
              include: { indikatorOutcome: true },
       });

       // CASE 1 — jika sudah ada outcome
       if (exist) {
              const indikator = exist.indikatorOutcome;

              // jika belum ada indikatorOutcome, buat dulu
              if (!indikator) {
                     return await prisma.x_outcome.update({
                            where: { id: exist.id },
                            data: {
                                   outcome: outcomeText,
                                   indikatorOutcome: {
                                          create: {
                                                 nama: program.indikator_outcome,
                                                 targetIndikatorOutcome: {
                                                        create: {
                                                               tahun: 2026,
                                                               tahun_ke: program.tahun_ke ?? 1,
                                                               target: program.target,
                                                        },
                                                 },
                                          },
                                   },
                            },
                            include: {
                                   indikatorOutcome: {
                                          include: { targetIndikatorOutcome: true },
                                   },
                            },
                     });
              }

              // jika indikatorOutcome sudah ada, update atau connectOrCreate target-nya
              return await prisma.x_outcome.update({
                     where: { id: exist.id },
                     data: {
                            outcome: outcomeText,
                            indikatorOutcome: {
                                   update: {
                                          nama: program.indikator_outcome,
                                          targetIndikatorOutcome: {
                                                 connectOrCreate: {
                                                        where: {
                                                               x_indikator_outcome_id_tahun_ke_unique: {
                                                                      indikator_outcome_id: indikator.id, // <- gunakan ID indikatorOutcome
                                                                      tahun_ke: program.tahun_ke ?? 1,
                                                               },
                                                        },
                                                        create: {
                                                               tahun: 2026,
                                                               tahun_ke: program.tahun_ke ?? 1,
                                                               target: program.target,
                                                        },
                                                 },
                                          },
                                   },
                            },
                     },
                     include: {
                            indikatorOutcome: {
                                   include: { targetIndikatorOutcome: true },
                            },
                     },
              });
       }

       // CASE 2 — jika belum ada outcome
       return await prisma.x_outcome.create({
              data: {
                     skpd_periode_id,
                     id_master,
                     outcome: outcomeText,
                     indikatorOutcome: {
                            create: {
                                   nama: program.indikator_outcome,
                                   targetIndikatorOutcome: {
                                          create: {
                                                 tahun: 2026,
                                                 tahun_ke: program.tahun_ke ?? 1,
                                                 target: program.target,
                                          },
                                   },
                            },
                     },
              },
              include: {
                     indikatorOutcome: {
                            include: { targetIndikatorOutcome: true },
                     },
              },
       });
};


const setPaguProgram = async (skpd_periode_id, tahun_ke, id_master, pagu) => {
       const exist = await prisma.x_paguProgram.findFirst({
              where: { skpd_periode_id, id_master, tahun_ke }
       });

       if (exist) {
              return await prisma.x_paguProgram.update({
                     where: { id: exist.id },
                     data: {
                            skpd_periode_id,
                            id_master,
                            tahun: 2026,
                            tahun_ke,
                            pagu
                     }
              });
       } else {
              return await prisma.x_paguProgram.create({
                     data: {
                            skpd_periode_id,
                            id_master,
                            tahun: 2026,
                            tahun_ke,
                            pagu
                     }
              });
       }
}

const setPaguKegiatan = async (skpd_periode_id, tahun_ke, id_master, pagu) => {
       const exist = await prisma.x_paguKegiatan.findFirst({
              where: { skpd_periode_id, id_master, tahun_ke }
       });

       if (exist) {
              return await prisma.x_paguKegiatan.update({
                     where: { id: exist.id },
                     data: {
                            skpd_periode_id,
                            id_master,
                            tahun: 2026,
                            tahun_ke,
                            pagu
                     }
              });
       } else {
              return await prisma.x_paguKegiatan.create({
                     data: {
                            skpd_periode_id,
                            id_master,
                            tahun: 2026,
                            tahun_ke,
                            pagu
                     }
              });
       }
}

const setIndikatorSubKegiatan = async (data) => {
       const {
              skpd_periode_id,
              master_id,
              label_nasional_id,
              label_prov_id,
              label_kab_id,
              name,
              target,
              satuan,
              tahun_ke,
              tahun,
              lokasi
       } = data;

       console.log({ skpd_periode_id, master_id, tahun_ke, tahun });

       const exist = await prisma.x_indikator.findFirst({
              where: { skpd_periode_id, master_id },
       });

       if (exist) {
              return await prisma.x_indikator.update({
                     where: { id: exist.id },
                     data: {
                            skpd_periode_id,
                            master_id,
                            label_nasional_id,
                            label_prov_id,
                            label_kab_id,
                            name: name || "Belum ditentukan",
                            satuan: satuan || "-",
                            lokasi: lokasi || "-",
                            rincian: {
                                   upsert: {
                                          where: {
                                                 indikator_id_tahun_ke: { // 👈 pakai composite unique name
                                                        indikator_id: exist.id,
                                                        tahun_ke,
                                                 },
                                          },
                                          update: {
                                                 target,
                                          },
                                          create: {
                                                 tahun_ke,
                                                 tahun,
                                                 target,
                                          },
                                   },
                            },
                     },
              });
       } else {
              return await prisma.x_indikator.create({
                     data: {
                            skpd_periode_id,
                            master_id,
                            label_nasional_id,
                            label_prov_id,
                            label_kab_id,
                            name: name || "Belum ditentukan",
                            satuan: satuan || "-",
                            lokasi: lokasi || "-",
                            rincian: {
                                   create: {
                                          tahun_ke,
                                          tahun,
                                          target,
                                   },
                            },
                     },
              });
       }
};

const setPaguSubKegiatan = async (skpd_periode_id, tahun_ke, id_master, pagu, sumber_dana = []) => {
       const tahun = 2026;

       const exist = await prisma.x_paguIndikatif.findFirst({
              where: { skpd_periode_id, id_master, tahun_ke },
              include: { sumberDanaRelasi: true },
       });

       if (exist) {
              // Ambil ID relasi lama
              const existingIds = exist.sumberDanaRelasi.map(r => r.sumber_dana_id);

              // Hitung yang perlu ditambah & dihapus
              const toAdd = sumber_dana.filter(id => !existingIds.includes(id));
              const toRemove = existingIds.filter(id => !sumber_dana.includes(id));

              // Jalankan update utama
              const updated = await prisma.x_paguIndikatif.update({
                     where: { id: exist.id },
                     data: {
                            tahun,
                            tahun_ke,
                            pagu,

                            // hapus relasi yang tidak ada di array baru
                            sumberDanaRelasi: {
                                   deleteMany: {
                                          sumber_dana_id: { in: toRemove },
                                   },
                                   // tambahkan relasi baru
                                   create: toAdd.map(id => ({
                                          sumber_dana_id: id,
                                   })),
                            },
                     },
                     include: {
                            sumberDanaRelasi: {
                                   include: { sumberDana: true },
                            },
                     },
              });

              return updated;
       } else {
              // Buat baru jika belum ada
              const created = await prisma.x_paguIndikatif.create({
                     data: {
                            skpd_periode_id,
                            id_master,
                            tahun,
                            tahun_ke,
                            pagu,
                            sumberDanaRelasi: {
                                   create: sumber_dana.map(id => ({
                                          sumber_dana_id: id,
                                   })),
                            },
                     },
                     include: {
                            sumberDanaRelasi: {
                                   include: { sumberDana: true },
                            },
                     },
              });

              return created;
       }
};

const prosesData = async (tahun_ke, skpd_periode_id, data) => {
       const { result, skpdPagu } = data;
       const gogo = [];

       // Create or update pagu skpd
       const existPaguSkpd = await prisma.x_pagu_skpd.findFirst({ where: { skpd_periode_id, tahun_ke } });
       if (existPaguSkpd) {
              await prisma.pagu_skpd.update({
                     where: { id: existPaguSkpd.id },
                     data: {
                            skpd_periode_id,
                            tahun: 2026,
                            tahun_ke,
                            pagu: skpdPagu
                     }
              });
       } else {
              await prisma.pagu_skpd.create({
                     data: {
                            skpd_periode_id,
                            tahun: 2026,
                            tahun_ke,
                            pagu: skpdPagu
                     }
              });
       }



       for (const urusan of result) {
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
                                   if (Array.isArray(program.indikator_outcome) && program.indikator_outcome.length > 0) {
                                          for (const indikator of program.indikator_outcome) {
                                                 await setoutcome(skpd_periode_id, createProgram.id, outcome, {
                                                        indikator_outcome: indikator.name,
                                                        target: parseFloat(indikator.target)
                                                 });
                                          }
                                   } else {
                                          await setoutcome(skpd_periode_id, createProgram.id, outcome, {
                                                 indikator_outcome: program.indikator_outcome?.name || '',
                                                 target: parseFloat(program.indikator_outcome?.target || 0)
                                          });
                                   }

                            }
                            await setPaguProgram(skpd_periode_id, tahun_ke, createProgram.id, program.pagu);


                            for (const kegiatan of program.children) {
                                   const kodeGiat = kegiatan.kode_giat.split('.')[3] + "." + kegiatan.kode_giat.split('.')[4];
                                   const createKegiatan = await createMaster(
                                          "kegiatan",
                                          kegiatan.nama_giat,
                                          kodeGiat,
                                          createProgram.id
                                   );
                                   await setPaguKegiatan(skpd_periode_id, tahun_ke, createKegiatan.id, kegiatan.pagu);

                                   for (const sub of kegiatan.children) {
                                          const kodeSubGiat = sub.kode_sub_giat.split('.')[5];
                                          const createSubKegiatan = await createMaster(
                                                 "subKegiatan",
                                                 sub.nama_sub_giat,
                                                 kodeSubGiat,
                                                 createKegiatan.id
                                          );
                                          let labelNasional = null;
                                          let labelProv = null;
                                          let labelKab = null;

                                          if (sub.label_nasional !== null) {
                                                 const splitLabelNasional = sub.label_nasional.toString().split(". ");
                                                 const existLabelNasional = await prisma.x_labelNasional.findFirst({
                                                        where: {
                                                               skpd_periode_id,
                                                               poin: parseInt(splitLabelNasional[0])
                                                        }
                                                 });
                                                 if (existLabelNasional) {
                                                        labelNasional = existLabelNasional.id;
                                                 } else {
                                                        const createLabelNasional = await prisma.x_labelNasional.create({
                                                               data: {
                                                                      skpd_periode_id,
                                                                      poin: parseInt(splitLabelNasional[0]),
                                                                      nama: splitLabelNasional[1]
                                                               }
                                                        });
                                                        labelNasional = createLabelNasional.id;
                                                 }
                                          }
                                          if (sub.label_prov !== null) {
                                                 const splitLabelProv = sub.label_prov.toString().split(". ");
                                                 const existLabelProv = await prisma.x_labelProv.findFirst({
                                                        where: {
                                                               skpd_periode_id,
                                                               poin: parseInt(splitLabelProv[0])
                                                        }
                                                 });
                                                 if (existLabelProv) {
                                                        labelProv = existLabelProv.id;
                                                 } else {
                                                        const createLabelProv = await prisma.x_labelProv.create({
                                                               data: {
                                                                      skpd_periode_id,
                                                                      poin: parseInt(splitLabelProv[0]),
                                                                      nama: splitLabelProv[1]
                                                               }
                                                        });
                                                        labelProv = createLabelProv.id;
                                                 }
                                          }
                                          if (sub.label_kab_kota !== null) {
                                                 const splitLabelKab = sub.label_kab_kota.toString().split(". ");
                                                 const existLabelKab = await prisma.x_labelKab.findFirst({
                                                        where: {
                                                               skpd_periode_id,
                                                               poin: parseInt(splitLabelKab[0])
                                                        }
                                                 });
                                                 if (existLabelKab) {
                                                        labelKab = existLabelKab.id;
                                                 } else {
                                                        const createLabelKab = await prisma.x_labelKab.create({
                                                               data: {
                                                                      skpd_periode_id,
                                                                      poin: parseInt(splitLabelKab[0]),
                                                                      nama: splitLabelKab[1]
                                                               }
                                                        });
                                                        labelKab = createLabelKab.id;
                                                 }
                                          }

                                          // insert indikator sub kegiatan
                                          if (Array.isArray(sub.indikator) && sub.indikator.length > 0) {
                                                 for (const indikator of sub.indikator) {
                                                        await setIndikatorSubKegiatan({
                                                               skpd_periode_id,
                                                               master_id: createSubKegiatan.id,
                                                               label_nasional_id: labelNasional,
                                                               label_prov_id: labelProv,
                                                               label_kab_id: labelKab,
                                                               name: indikator.name,
                                                               target: parseFloat(indikator.target),
                                                               satuan: sub.satuan,
                                                               lokasi: sub.lokasi,
                                                               tahun_ke,
                                                               tahun: 2026
                                                        });
                                                 }
                                          } else {
                                                 await setIndikatorSubKegiatan({
                                                        skpd_periode_id,
                                                        master_id: createSubKegiatan.id,
                                                        label_nasional_id: labelNasional,
                                                        label_prov_id: labelProv,
                                                        label_kab_id: labelKab,
                                                        name: sub.indikator?.name || '',
                                                        target: parseFloat(sub.indikator?.target || 0),
                                                        satuan: sub.satuan,
                                                        lokasi: sub.lokasi,
                                                        tahun_ke,
                                                        tahun: 2026
                                                 });
                                          }


                                          const sumber_dana = [];

                                          for (const sumber of sub.sumber_dana) {
                                                 // lewati jika kode_dana tidak ada
                                                 if (!sumber?.kode_dana) {
                                                        console.warn(`Lewati sumber dana tanpa kode_dana:`, sumber);
                                                        continue;
                                                 }

                                                 const sumberDana = await prisma.x_sumberDana.upsert({
                                                        where: { kode: sumber.kode_dana },
                                                        update: {}, // tidak perlu ubah data lama
                                                        create: {
                                                               kode: sumber.kode_dana,
                                                               nama: sumber.nama_dana || 'Tidak diketahui',
                                                        },
                                                 });

                                                 sumber_dana.push(sumberDana.id);
                                          }

                                          // connect sumber dana ke sub kegiatan
                                          const yes = await setPaguSubKegiatan(
                                                 skpd_periode_id,
                                                 tahun_ke,
                                                 createSubKegiatan.id,
                                                 sub.pagu,
                                                 sumber_dana
                                          );
                                          gogo.push(yes);
                                   }
                            }
                     }
              }
       }
       return gogo;

}
export const seedPerencanaan = async (req, res, next) => {
       try {
              const mulai = parseInt(req.params.mulai);
              const akhir = parseInt(req.params.akhir);
              const tahun_ke = parseInt(req.params.tahun_ke);
              const skpd = await prisma.skpd.findMany({
                     where: {
                            skpd_periode: {
                                   some: {
                                          status: true,
                                          periode: { mulai, akhir }
                                   }
                            }
                     },
                     include: {
                            skpd_periode: {
                                   where: {
                                          status: true,
                                          periode: { mulai, akhir }
                                   }
                            }
                     }
              });
              if (skpd.length < 1) {
                     return response(res, 400, true, "tidak ada skpd pada periode evaluasi", null);
              }
              // return response(res, 200, true, "berhasil", skpd);
              const result = [];
              for (const s of skpd) {
                     const getFile = JSON.parse(fs.readFileSync(`./src/app/renja-rkpd/seeder/renja-${req.params.ren}/${s.kode}.json`, 'utf8'));
                     const hasil = strukturkanData(getFile);
                     // result.push(hasil);

                     result.push(await prosesData(tahun_ke, s.skpd_periode[0].id, hasil));
              }
              console.log(result);
              return response(res, 200, true, "Berhasil", result);
       } catch (error) {
              console.log(error);
              next(error);
       }
}

// seedPerencanaan();