import prisma from "../config/database.js";
import { Prisma } from "@prisma/client";

export const addIndikator = async (req) => {
       const { skpd_periode_id, master_id, name, satuan, target } = req.body;
       const userId = req.user?.id || null; // ambil dari middleware auth jika ada

       // Jalankan semua dalam 1 transaksi agar atomic
       return await prisma.$transaction(async (tx) => {
              // 🔍 Validasi master & skpd_periode
              const [existMaster, existSkpdPeriode] = await Promise.all([
                     tx.master.findUnique({ where: { id: master_id } }),
                     tx.skpd_periode.findUnique({ where: { id: skpd_periode_id } }),
              ]);

              if (!existMaster) throw { code: 400, message: "Master tidak ditemukan" };
              if (!existSkpdPeriode) throw { code: 400, message: "SKPD Periode tidak ditemukan" };

              // 🧱 Buat indikator utama
              const indikator = await tx.indikator.create({
                     data: {
                            skpd_periode_id,
                            master_id,
                            name,
                            satuan,
                     },
              });

              // 🧮 Siapkan data rincian
              const targetData = target.map((item) => ({
                     indikator_id: indikator.id,
                     tahun_ke: item.tahun_ke,
                     target: item.target,
              }));

              // 🧾 Simpan rincian indikator (gunakan createManyAndReturn jika pakai Prisma v6+)
              await tx.rincianIndikator.createMany({ data: targetData });

              // ✍️ Logging indikator
              await tx.indikatorLog.create({
                     data: {
                            indikator_id: indikator.id,
                            user_id: userId,
                            action: "CREATE",
                            new_data: indikator,
                     },
              });

              // ✍️ Logging rincian indikator
              const rincianList = await tx.rincianIndikator.findMany({
                     where: { indikator_id: indikator.id },
              });

              const rincianLogs = rincianList.map((r) => ({
                     rincian_id: r.id,
                     user_id: userId,
                     action: "CREATE",
                     new_data: r,
              }));

              await tx.rincianIndikatorLog.createMany({
                     data: rincianLogs,
              });

              // ✅ Hasil akhir
              return {
                     indikator,
                     rincian: rincianList,
              };
       });
};

export const updateIndikator = async (req) => {
       const { id } = req.params;
       const { skpd_periode_id, master_id, name, satuan, target } = req.body;
       const userId = req.user?.id || null;

       return await prisma.$transaction(async (tx) => {
              // 🔍 Ambil indikator beserta rincian lama
              const indikator = await tx.indikator.findUnique({
                     where: { id: Number(id) },
                     include: { rincian: true },
              });

              if (!indikator) throw { code: 404, message: "Indikator tidak ditemukan" };

              // 🔍 Validasi foreign key bila diubah
              if (master_id) {
                     const existMaster = await tx.master.findUnique({ where: { id: master_id } });
                     if (!existMaster) throw { code: 400, message: "Master tidak ditemukan" };
              }

              if (skpd_periode_id) {
                     const existSkpdPeriode = await tx.skpd_periode.findUnique({
                            where: { id: skpd_periode_id },
                     });
                     if (!existSkpdPeriode) throw { code: 400, message: "SKPD Periode tidak ditemukan" };
              }

              // 🧾 Simpan data lama untuk logging
              const oldIndikatorData = { ...indikator };

              // 🧱 Update indikator utama
              const updatedIndikator = await tx.indikator.update({
                     where: { id: indikator.id },
                     data: {
                            skpd_periode_id: skpd_periode_id ?? indikator.skpd_periode_id,
                            master_id: master_id ?? indikator.master_id,
                            name: name ?? indikator.name,
                            satuan: satuan ?? indikator.satuan,
                     },
              });

              // ✍️ Log perubahan indikator
              await tx.indikatorLog.create({
                     data: {
                            indikator_id: indikator.id,
                            user_id: userId,
                            action: "UPDATE",
                            old_data: oldIndikatorData,
                            new_data: updatedIndikator,
                     },
              });

              // =============================
              // ⚙️ Sinkronisasi rincian
              // =============================
              const rincianLogs = [];

              const tahunRequest = target.map((t) => t.tahun_ke);
              const tahunExisting = indikator.rincian.map((r) => r.tahun_ke);

              // 🔹 Hapus rincian yang tidak ada di request
              const toDelete = indikator.rincian.filter((r) => !tahunRequest.includes(r.tahun_ke));
              for (const r of toDelete) {
                     await tx.rincianIndikator.delete({ where: { id: r.id } });

                     rincianLogs.push({
                            rincian_id: r.id,
                            user_id: userId,
                            action: "DELETE",
                            old_data: r,
                     });
              }

              // 🔹 Update atau tambah rincian baru
              for (const item of target) {
                     const existing = indikator.rincian.find((r) => r.tahun_ke === item.tahun_ke);

                     if (existing) {
                            // Update rincian lama
                            const updated = await tx.rincianIndikator.update({
                                   where: { id: existing.id },
                                   data: {
                                          target: item.target,
                                   },
                            });

                            rincianLogs.push({
                                   rincian_id: updated.id,
                                   user_id: userId,
                                   action: "UPDATE",
                                   old_data: existing,
                                   new_data: updated,
                            });
                     } else {
                            // Tambah rincian baru
                            const created = await tx.rincianIndikator.create({
                                   data: {
                                          indikator_id: indikator.id,
                                          tahun_ke: item.tahun_ke,
                                          target: item.target,
                                   },
                            });

                            rincianLogs.push({
                                   rincian_id: created.id,
                                   user_id: userId,
                                   action: "CREATE",
                                   new_data: created,
                            });
                     }
              }

              // 🧾 Simpan log rincian (semua aksi)
              if (rincianLogs.length > 0) {
                     await tx.rincianIndikatorLog.createMany({ data: rincianLogs });
              }

              // ✅ Ambil ulang rincian terbaru
              const rincianBaru = await tx.rincianIndikator.findMany({
                     where: { indikator_id: indikator.id },
                     orderBy: { tahun_ke: "asc" },
              });

              return {
                     indikator: updatedIndikator,
                     rincian: rincianBaru,
              };
       });
};

export const deleteIndikator = async (req) => {
       const { id_indikator } = req.body;

       // 1️⃣ Pastikan indikator ada
       const indikator = await prisma.indikator.findUnique({
              where: { id: id_indikator },
              include: { rincian: true },
       });
       if (!indikator) {
              throw { code: 404, message: "Indikator tidak ditemukan" };
       }

       // 2️⃣ Simpan data lama untuk log
       const oldData = {
              indikator,
              rincian: indikator.rincian,
       };

       // 3️⃣ Jalankan transaksi untuk hapus data dan simpan log
       await prisma.$transaction(async (tx) => {
              // Hapus rincian dulu karena ada relasi
              await tx.rincianIndikator.deleteMany({
                     where: { indikator_id: id_indikator },
              });

              // Hapus indikator
              await tx.indikator.delete({
                     where: { id: id_indikator },
              });

              // Simpan log penghapusan indikator
              await tx.indikatorLog.create({
                     data: {
                            indikator_id: id_indikator,
                            user_id: req.user?.id || null, // pastikan middleware auth isi req.user
                            action: "DELETE",
                            old_data: oldData,
                            new_data: null,
                     },
              });
       });

       return {
              message: "Indikator dan seluruh rincian berhasil dihapus",
              deleted: oldData,
       };
};

export async function listIndikator(req) {
       const skpd_periode_id = parseInt(req.params.skpd_periode_id);

       // 1️⃣ Ambil semua indikator sesuai SKPD periode
       const indikatorData = await prisma.indikator.findMany({
              where: { skpd_periode_id },
              include: {
                     master: {
                            select: {
                                   id: true,
                                   parent_id: true,
                                   kode: true,
                                   name: true,
                                   type: true,
                            },
                     },
                     rincian: {
                            select: {
                                   tahun_ke: true,
                                   target: true,
                            },
                     },
              },
       });

       if (indikatorData.length === 0) return [];

       // 2️⃣ Kumpulkan semua master_id yang terlibat
       const masterIds = indikatorData.map((i) => i.master.id);
       const parentsToFetch = new Set(masterIds);

       // 3️⃣ Ambil semua parent master hingga ke root
       let newParentsFound = true;
       while (newParentsFound) {
              newParentsFound = false;

              const parentList = await prisma.master.findMany({
                     where: { id: { in: Array.from(parentsToFetch) } },
                     select: { parent_id: true },
              });

              const newParents = parentList
                     .map((p) => p.parent_id)
                     .filter((pid) => pid && !parentsToFetch.has(pid));

              if (newParents.length > 0) {
                     newParents.forEach((pid) => parentsToFetch.add(pid));
                     newParentsFound = true;
              }
       }

       // 4️⃣ Ambil semua master yang relevan
       const masters = await prisma.master.findMany({
              where: { id: { in: Array.from(parentsToFetch) } },
              orderBy: { id: 'asc' },
              select: {
                     id: true,
                     parent_id: true,
                     kode: true,
                     name: true,
                     type: true,
              },
       });
       console.debug(masters);

       // 5️⃣ Bentuk map master
       const masterMap = {};
       masters.forEach((m) => {
              masterMap[m.id] = {
                     id: m.id,
                     parent_id: m.parent_id,
                     kode: m.kode,
                     name: m.name,
                     type: m.type,
                     indikator: null,
                     children: [],
              };
       });

       // 6️⃣ Kaitkan indikator ke master
       indikatorData.forEach((item) => {
              const m = item.master;
              if (!m) return;

              if (!masterMap[m.id].indikator) masterMap[m.id].indikator = [];

              masterMap[m.id].indikator.push({
                     id: item.id,
                     name: item.name,
                     satuan: item.satuan,
                     target: item.rincian.map((r) => ({
                            tahun_ke: r.tahun_ke,
                            target: r.target,
                     })),
              });
       });

       // 7️⃣ Bangun tree
       Object.values(masterMap).forEach((m) => {
              if (m.parent_id && masterMap[m.parent_id]) {
                     masterMap[m.parent_id].children.push(m);
              }
       });

       const roots = Object.values(masterMap).filter((m) => !m.parent_id);

       // 8️⃣ Format hasil akhir sesuai format kamu
       const result = roots.map((urusan) => ({
              id: urusan.id,
              kode: urusan.kode,
              nama: urusan.name,
              type: "urusan",
              bidang: urusan.children.map((bidang) => ({
                     id: bidang.id,
                     kode: bidang.kode,
                     name: bidang.name,
                     type: "bidang",
                     program: bidang.children.map((program) => ({
                            id: program.id,
                            kode: program.kode,
                            name: program.name,
                            indikator: program.indikator,
                            kegiatan: program.children.map((kegiatan) => ({
                                   id: kegiatan.id,
                                   kode: kegiatan.kode,
                                   name: kegiatan.name,
                                   indikator: kegiatan.indikator,
                                   subKegiatan: kegiatan.children.map((sub) => ({
                                          id: sub.id,
                                          kode: sub.kode,
                                          name: sub.name,
                                          indikator: sub.indikator,
                                   })),
                            })),
                     })),
              })),
       }));


       return result;
}

