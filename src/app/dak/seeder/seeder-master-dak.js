import prisma from "../../../config/database.js"
import response from "../../../utility/response.js"

export const seedJenisDak = async (req, res, next) => {
       try {
              const create = await prisma.dak_jenis.createMany({
                     data: [
                            { kode: 1, jenis: "Fisik" },
                            { kode: 2, jenis: "Non Fisik" },

                     ]
              });
              return response(res, 200, true, "Berhasil menambahkan data jenis", create)
       } catch (error) {
              next(error);
       }
}

export const seedSubJenisDAKFisik = async (req, res, next) => {
       try {
              const result = [];
              const create = await prisma.dak_subJenis.createMany({
                     data: [
                            { jenis_dak: 1, nama: "DAK Penugasan" },
                            { jenis_dak: 1, nama: "DAK Reguler" },
                     ]
              });

              result.push({ fisik: create });

              const sub_non = [
                     "Akreditasi LabKesda",
                     "Akreditasi Puskesmas",
                     "Akreditasi Rumah Sakit",
                     "Bantuan Operasional KB",
                     "Bantuan operasional keluarga berencana (BOKB)x",
                     "Bantuan Operasional Kesehatan",
                     "Bantuan Operasional Penugasan (BOP) Paud",
                     "Bantuan Operasional Penyelanggaraan Museum",
                     "Bantuan Operasional Penyelenggaraan Paud",
                     "Bantuan Operasional Penyelenggaraan Pendidikan Kesetaraan",
                     "Bantuan Operasional Sekolah",
                     "Dana Pelayanan Administrasi Kependudukan",
                     "Dana Pelayanan Kepariwisataan",
                     "Dana Peningkatan Kapasitas Koperasi & UKM",
                     "Jaminan Persalinan",
                     "Pelatihan untuk pelaku UMK dan koperasi dan calon wirausaha/wirausaha pemula.",
                     "Pengawasan Makanan dan Minuman",
                     "Tambahan Penghasilan Guru",
                     "Tunjangan Khusus Guru",
                     "Tunjangan Profesi Guru"
              ];
              const fff = [];
              for (const nama of sub_non) {
                     const creates = await prisma.dak_subJenis.create({
                            data: { jenis_dak: 2, nama }
                     });
                     fff.push(creates);
              }

              result.push({ non_fisik: fff })

              return response(res, 200, true, "Berhasil menambahkan data sub jenis", result)
       } catch (error) {
              next(error)
       }
}

export const bidangDAK = async (req, res, next) => {
       try {
              const result = { fisik: [], non_fisik: [] }

              const fisik = [
                     {
                            bidang: "Bantuan operasional keluarga berencana (BOKB)",
                            sub_bidang: ["Bantuan operasional keluarga berencana (BOKB)"]
                     },
                     {
                            bidang: "Bantuan operasional kesehatan",
                            sub_bidang: [
                                   "Bantuan operasional kesehatan - Dinas Kab/Kota",
                                   "Bantuan operasional kesehatan - Puskesmas"
                            ]
                     },
                     {
                            bidang: "Dana bantuan pengembangan program perpustakaan daerah",
                            sub_bidang: ["Dana bantuan pengembangan program perpustakaan daerah"]
                     },
                     {
                            bidang: "Dana Pelayanan Perlindungan Perempuan dan anak",
                            sub_bidang: ["Dana Pelayanan Perlindungan Perempuan dan anak"]
                     }
              ]

              const non_fisik = [
                     {
                            bidang: "Bidang Air Minum",
                            sub_bidang: ["Air Minum"]
                     },
                     {
                            bidang: "Bidang Jalan",
                            sub_bidang: ["Jalan"]
                     },
                     {
                            bidang: "Bidang Kesehatan dan Keluarga Berencana",
                            sub_bidang: [
                                   "Kefarmasian",
                                   "Keluarga Berencana",
                                   "Pengendalian Penyakit",
                                   "Penguatan Penurunan Angka Kematian Ibu dan Bayi",
                                   "Penguatan Percepatan Penurunan Stunting",
                                   "Penguatan Sistem Kesehatan"
                            ]
                     },
                     {
                            bidang: "Bidang Pendidikan",
                            sub_bidang: [
                                   "Pendidikan Anak Usia DIni",
                                   "Perpustakaan Daerah",
                                   "Sanggar Kegiatan Belajar",
                                   "Sekolah Dasar",
                                   "Sekolah Luar Biasa",
                                   "Sekolah Menengah Atas",
                                   "Sekolah Menengah Kejuruan",
                                   "Sekolah Menengah Pertama"
                            ]
                     },
                     {
                            bidang: "Bidang Sanitasi",
                            sub_bidang: ["Sanitasi"]
                     },
                     {
                            bidang: "Tema Pengembangan Food Estate dan Penguatan Kawasan Sentra Produksi Pertanian, Perikanan, dan Hewani",
                            sub_bidang: [
                                   "Bidang Irigasi",
                                   "Bidang Jalan",
                                   "Bidang Kehutanan",
                                   "Bidang Kelautan dan Perikanan",
                                   "Bidang Lingkungan Hidup",
                                   "Bidang Perdagangan",
                                   "Bidang Pertanian"
                            ]
                     },
                     {
                            bidang: "Tema Penguatan Destinasi Pariwisata Prioritas dan Sentra Industri Kecil dan Menengah",
                            sub_bidang: [
                                   "Bidang Industri Kecil dan Menengah",
                                   "Bidang Jalan",
                                   "Bidang Lingkungan Hidup",
                                   "Bidang Pariwisata",
                                   "Bidang Perdagangan",
                                   "Bidang Usaha Mikro, Kecil dan Menengah"
                            ]
                     },
                     {
                            bidang: "Tema Peningkatan Konektivitas Kawasan untuk Pembangunan Inklusif di Wilayah Nusa Tenggara, Maluku,",
                            sub_bidang: [
                                   "Bidang Jalan",
                                   "Bidang Transportasi dan Perairan",
                                   "Bidang Transportasi Pedesaan"
                            ]
                     }
              ]

              for (const f of fisik) {
                     const createB = await prisma.dak_bidang.create({
                            data: { jenis_dak: 1, name: f.bidang }
                     })

                     for (const sb of f.sub_bidang) {
                            await prisma.dak_subBidang.create({
                                   data: { dak_bidangId: createB.id, name: sb }
                            })
                     }
              }

              for (const f of non_fisik) {
                     const createB = await prisma.dak_bidang.create({
                            data: { jenis_dak: 2, name: f.bidang }
                     })

                     for (const sb of f.sub_bidang) {
                            await prisma.dak_subBidang.create({
                                   data: { dak_bidangId: createB.id, name: sb }
                            })
                     }
              }

              return response(res, 200, true, "Berhasil menambahkan data sub jenis", result)
       } catch (error) {
              next(error)
       }
}


export const seedMasalahFisik = async (req, res, next) => {
       try {
              const data = [
                     "Permasalahan Terkait dengan DPA - SKPD",
                     "Permasalahan Terkait dengan Pelaksana Pekerjaan Swakelola",
                     "Permasalahan Terkait dengan Pelaksanaan Pekerjaan Kontrak",
                     "Permasalahan Terkait dengan Pelaksanaan Tender Pekerjaan Kontrak",
                     "Permasalahan Terkait dengan Penerbitan SP2D",
                     "Permasalahan Terkait dengan Peraturan Menteri Keuangan (PMK)",
                     "Permasalahan Terkait dengan Persiapan Pekerjaan Swakelola",
                     "Permasalahan Terkait dengan Petunjuk Teknis",
                     "Permasalahan Terkait dengan Rencana Kerja dan Anggaran SKPD",
                     "Permasalahan Terkait dengan SK Penetapan Pelaksanaan Kegiatan "
              ];
              const result = []
              for (const f of data) {
                     result.push(await prisma.dak_masalah.create({
                            data: {
                                   jenis_dak: 1,
                                   name: f
                            }
                     }))
              }

              return response(res, 200, true, "Berhasil menambahkan data sub jenis", result)
       } catch (error) {
              next(error)
       }
}

export const seedBerkasFisik = async (req, res, next) => {
       try {

              const data = [
                     {
                            no: 1,
                            group: "PERENCANAAN",
                            checklist: "PMK (Alokasi dan Pedoman Umum)"
                     },
                     {
                            no: 2,
                            group: "PERENCANAAN",
                            checklist: "Petunjuk Teknis (Juknis)"
                     },
                     {
                            no: 3,
                            group: "PERENCANAAN",
                            checklist: "Penyusunan Rencana Kerja dan Anggaran SKPD"
                     },
                     {
                            no: 4,
                            group: "PERENCANAAN",
                            checklist: "Penetapan DPA - SKPD"
                     },
                     {
                            no: 5,
                            group: "PELAKSANAAN",
                            checklist: "SK Penetapan Pelaksanaan Kegiatan"
                     },
                     {
                            no: 6,
                            group: "PELAKSANAAN",
                            checklist: "Pelaksanaan Tender Pekerjaan Kontrak"
                     },
                     {
                            no: 7,
                            group: "PELAKSANAAN",
                            checklist: "Persiapan Pekerjaan Swakelola"
                     },
                     {
                            no: 8,
                            group: "PELAKSANAAN",
                            checklist: "Pelaksanaan Pekerjaan Kontrak"
                     },
                     {
                            no: 9,
                            group: "PELAKSANAAN",
                            checklist: "Pelaksanaan Pekerjaan Swakelola"
                     },
                     {
                            no: 10,
                            group: "PELAKSANAAN",
                            checklist: "Penerbitan Surat Permintaan Pembayaran (SPP)"
                     },
                     {
                            no: 11,
                            group: "PELAKSANAAN",
                            checklist: "Penerbitan Surat Perintah Membayar (SPM)"
                     },
                     {
                            no: 12,
                            group: "PELAKSANAAN",
                            checklist: "Penerbitan Surat Perintah Pencairan Dana (SP2D)"
                     }
              ];

              const result = [];
              for (const t of data) {
                     result.push(await prisma.dak_berkas.create({
                            data: {
                                   jenis_dak: 1,
                                   group: t.group,
                                   no: t.no,
                                   name: t.checklist
                            }
                     }))
              }

              return response(res, 200, true, "Berhasil menambahkan data sub jenis", result)
       } catch (error) {
              next(error)
       }
}
