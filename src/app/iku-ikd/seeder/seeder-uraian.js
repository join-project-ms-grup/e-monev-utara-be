import fs from "fs";
import response from "../../../utility/response.js";
import prisma from "../../../config/database.js";

const mappingJSON = () => {
       const data = JSON.parse(fs.readFileSync('./src/app/iku-ikd/seeder/uraian.json', 'utf8'));

       const grouped = [];
       let lastSkpdName = null;
       let lastSkpdKode = null;
       let lastUrusanFull = null;

       for (const row of data) {
              // Gunakan nilai terakhir jika baris ini kosong
              const skpdName = row.skpd?.trim() || lastSkpdName;
              const skpdKode = row.kode_skpd?.trim() || lastSkpdKode;
              const urusanFull = row.urusan?.trim() || lastUrusanFull;

              // Update cache untuk baris berikutnya
              lastSkpdName = skpdName;
              lastSkpdKode = skpdKode;
              lastUrusanFull = urusanFull;

              // Pisahkan kode dan nama urusan jika formatnya "4.01 - SEKRETARIAT DAERAH"
              const [kode_urusan, nama_urusan] = urusanFull?.includes(" - ")
                     ? urusanFull.split(" - ").map(v => v.trim())
                     : [null, urusanFull];

              const uraianName = row.uraian?.trim();
              const satuan = row.satuan?.trim();
              const base = row.base?.trim();

              const tahunList = [2025, 2026, 2027, 2028, 2029, 2030];
              const target = tahunList.map((tahun, i) => {
                     const raw = row[tahun]
                            ? row[tahun].toString().replace(',', '.').trim()
                            : null;
                     return {
                            tahun,
                            tahun_ke: i + 1,
                            target: raw,
                     };
              });

              // --- cari SKPD di hasil ---
              let skpdObj = grouped.find(g => g.name === skpdName);
              if (!skpdObj) {
                     skpdObj = {
                            kode_skpd: skpdKode || null, // ✅ ambil dari row
                            name: skpdName,
                            urusan: [],
                     };
                     grouped.push(skpdObj);
              }

              // --- cari urusan di dalam SKPD ---
              let urusanObj = skpdObj.urusan.find(u => u.name === nama_urusan);
              if (!urusanObj) {
                     urusanObj = {
                            kode: kode_urusan,
                            name: nama_urusan,
                            uraian: [],
                     };
                     skpdObj.urusan.push(urusanObj);
              }

              // --- tambahkan uraian ---
              urusanObj.uraian.push({
                     nama: uraianName,
                     satuan,
                     base_line: base,
                     target,
              });
       }

       return grouped;
};

export default mappingJSON;



const createOrGetSKPD = async (kode, name) => {
       const exist = await prisma.skpd.findFirst({ where: { kode } });
       if (exist) return exist;

       const create = await prisma.skpd.create({
              data: { kode, name }
       });

       return create;
}

const createOrGetSP = async (skpd, periode) => {
       const exist = await prisma.w_skpd_periode.findFirst({ where: { skpd_id: skpd, periode_id: periode } });
       if (exist) return exist;
       const create = await prisma.w_skpd_periode.create({
              data: {
                     skpd_id: skpd,
                     periode_id: periode
              }
       });
       return create;
}
export const seedUraian = async (req, res, next) => {
       try {
              const getPeriode = await prisma.periode.findFirst({});
              const mapJson = JSON.parse(fs.readFileSync('./src/app/iku-ikd/seeder/uraian_grouped.json', 'utf8'));
              const result = [];
              const errors = []; // kumpulkan error di sini juga kalau mau dicek setelahnya

              for (const skpd of mapJson) {
                     let setSkpd = null;

                     try {
                            const CGSkpd = await createOrGetSKPD(skpd.kode_skpd, skpd.name);
                            setSkpd = await createOrGetSP(CGSkpd.id, getPeriode.id);

                            const urusan = [];
                            for (const u of skpd.urusan) {
                                   try {
                                          const setMaster = await prisma.w_master.create({
                                                 data: {
                                                        kode: u.kode,
                                                        name: u.name,
                                                        skpdId: setSkpd.id,
                                                        type: "urusan",
                                                 },
                                          });

                                          const uraian = [];
                                          for (const ur of u.uraian) {
                                                 try {
                                                        const setUraian = await prisma.w_uraian.create({
                                                               data: {
                                                                      master_id: setMaster.id,
                                                                      name: ur.nama,
                                                                      satuan: ur.satuan,
                                                                      base_line: ur.base_line,
                                                                      is_iku: false,
                                                               },
                                                        });

                                                        const target = [];
                                                        for (const tr of ur.target) {
                                                               const setTarget = await prisma.w_targetRealisasiUraian.create({
                                                                      data: {
                                                                             uraian_id: setUraian.id,
                                                                             tahun: tr.tahun,
                                                                             tahun_ke: tr.tahun_ke,
                                                                             target: tr?.target ?? "0",
                                                                      },
                                                               });
                                                               target.push(setTarget);
                                                        }

                                                        uraian.push({ ...setUraian, target });
                                                 } catch (errUraian) {
                                                        console.error(
                                                               `❌ Error di URAIAN\n` +
                                                               `SKPD: ${skpd.name} (${skpd.kode_skpd})\n` +
                                                               `Urusan: ${u.name} (${u.kode})\n` +
                                                               `Uraian: ${ur.nama}\n` +
                                                               `Pesan: ${errUraian.message}\n`
                                                        );

                                                        errors.push({
                                                               skpd: skpd.name,
                                                               kode_skpd: skpd.kode_skpd,
                                                               urusan: u.name,
                                                               kode_urusan: u.kode,
                                                               uraian: ur.nama,
                                                               error: errUraian.message,
                                                        });
                                                 }
                                          }

                                          urusan.push({ ...setMaster, uraian });
                                   } catch (errUrusan) {
                                          console.error(
                                                 `❌ Error di URUSAN\n` +
                                                 `SKPD: ${skpd.name} (${skpd.kode_skpd})\n` +
                                                 `Urusan: ${u.name} (${u.kode})\n` +
                                                 `Pesan: ${errUrusan.message}\n`
                                          );

                                          errors.push({
                                                 skpd: skpd.name,
                                                 kode_skpd: skpd.kode_skpd,
                                                 urusan: u.name,
                                                 kode_urusan: u.kode,
                                                 error: errUrusan.message,
                                          });
                                   }
                            }

                            result.push({ ...setSkpd, urusan });
                     } catch (errSkpd) {
                            console.error(
                                   `❌ Error di SKPD\n` +
                                   `SKPD: ${skpd.name} (${skpd.kode_skpd})\n` +
                                   `Pesan: ${errSkpd.message}\n`
                            );

                            errors.push({
                                   skpd: skpd.name,
                                   kode_skpd: skpd.kode_skpd,
                                   error: errSkpd.message,
                            });
                     }
              }

              return response(res, 200, true, "Selesai seeding (cek console untuk detail error)", {
                     total_skpd: mapJson.length,
                     total_error: errors.length,
                     errors,
              });
       } catch (error) {
              next(error);
       }
};
