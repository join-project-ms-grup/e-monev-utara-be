import fs from "fs";
import response from "../../../utility/response.js";
import prisma from "../../../config/database.js";

const mappingJSON = () => {
       const data = JSON.parse(fs.readFileSync('./src/app/iku-ikd/seeder/uraian.json', 'utf8'));

       const grouped = [];
       let lastSkpdName = null;
       let lastUrusanFull = null;

       for (const row of data) {
              // Gunakan nilai terakhir jika baris ini kosong
              const skpdName = row.skpd?.trim() || lastSkpdName;
              const urusanFull = row.urusan?.trim() || lastUrusanFull;

              // Update cache untuk baris berikutnya
              lastSkpdName = skpdName;
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
                            kode_skpd: null, // bisa diisi nanti dari data master
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
       return grouped
};

export const seedUraian = async (req, res, next) => {
       try {
              const mapJson = mappingJSON();
              // return response(res, 200, true, "Berhasil memasukan data iku-ikd ke databse", mapJson);
              const result = [];
              for (const skpd of mapJson) {
                     const setSkpd = await prisma.w_skpd.create({ data: { periodeId: 1, name: skpd.name } });
                     const urusan = [];
                     for (const u of skpd.urusan) {
                            const setMaster = await prisma.w_master.create({
                                   data: {
                                          kode: u.kode,
                                          name: u.name,
                                          skpdId: setSkpd.id,
                                          type: "urusan",
                                   }
                            });

                            const uraian = [];
                            for (const ur of u.uraian) {
                                   const setUraian = await prisma.w_uraian.create({
                                          data: {
                                                 master_id: setMaster.id,
                                                 name: ur.nama,
                                                 satuan: ur.satuan,
                                                 base_line: ur.base_line,
                                                 is_iku: false
                                          }
                                   });
                                   const target = [];
                                   for (const tr of ur.target) {
                                          const setTarget = await prisma.w_targetRealisasiUraian.create({
                                                 data: {
                                                        uraian_id: setUraian.id,
                                                        tahun: tr.tahun,
                                                        tahun_ke: tr.tahun_ke,
                                                        target: tr?.target ?? "0"
                                                 }
                                          });
                                          target.push({ ...setTarget })
                                   }
                                   uraian.push({ ...setUraian, target });
                            }
                            urusan.push({ ...setMaster, uraian });
                     }

                     result.push({ ...setSkpd, urusan })
              }

              return response(res, 200, true, "Berhasil memasukan data iku-ikd ke databse", result);
       } catch (error) {
              next(error);
       }
}
