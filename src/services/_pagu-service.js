// services/paguService.js

import prisma from "../config/database.js";
import { errorHandling } from "../middlewares/erros-handling.js";

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
       // 1️⃣ Ambil semua data pagu milik skpd_periode_id
       const paguRows = await prisma.paguIndikatif.findMany({
              where: { skpd_periode_id: Number(req.params.skpd_periode_id) },
              include: {
                     logs: false,
              },
       });

       // 2️⃣ Kumpulkan master_id yang terkait dengan pagu
       const relatedMasterIds = new Set(
              paguRows
                     .map((p) => {
                            const candidate =
                                   p.id_master ?? p.master_id ?? p.masterId ?? (p.master && p.master.id);
                            return candidate ? Number(candidate) : undefined;
                     })
                     .filter((v) => Number.isFinite(v))
       );

       if (relatedMasterIds.size === 0) {
              console.debug("⚠️ Tidak ada master_id ditemukan dari paguRows.");
              return [];
       }

       // 3️⃣ Ambil seluruh rantai parent (urusan → bidang → program → kegiatan → subKegiatan)
       const allMasterIds = new Set(relatedMasterIds);
       let queue = Array.from(relatedMasterIds);

       while (queue.length) {
              const masters = await prisma.master.findMany({
                     where: { id: { in: queue } },
                     select: { id: true, parent_id: true },
              });

              const nextQueue = [];
              for (const m of masters) {
                     const pid = m.parent_id;
                     if (pid && !allMasterIds.has(pid)) {
                            allMasterIds.add(pid);
                            nextQueue.push(pid);
                     }
              }
              queue = nextQueue;
       }

       // 4️⃣ Ambil semua master yang termasuk dalam allMasterIds
       const masters = await prisma.master.findMany({
              where: { id: { in: Array.from(allMasterIds) } },
              select: {
                     id: true,
                     parent_id: true,
                     kode: true,
                     name: true,
                     type: true,
              },
       });

       // 5️⃣ Buat map master
       const masterMap = {};
       masters.forEach((m) => {
              masterMap[m.id] = {
                     id: m.id,
                     parent_id: m.parent_id,
                     kode: m.kode,
                     name: m.name,
                     type: m.type,
                     pagu: [],
              };
       });

       // 6️⃣ Tambahkan data pagu ke master yang sesuai
       for (const p of paguRows) {
              const masterId =
                     p.id_master ?? p.master_id ?? p.masterId ?? (p.master && p.master.id);
              if (!masterId || !masterMap[masterId]) continue;

              masterMap[masterId].pagu.push({
                     tahun_ke: p.tahun_ke,
                     pagu: Number(p.pagu),
              });
       }

       // 7️⃣ Bangun tree hierarki master
       const buildTree = (parentId = null) => {
              return Object.values(masterMap)
                     .filter((m) => m.parent_id === parentId)
                     .map((m) => ({
                            id: m.id,
                            kode: m.kode,
                            name: m.name,
                            pagu: m.pagu.length ? m.pagu : null,
                            children: buildTree(m.id),
                     }));
       };

       // Cari root node (biasanya parent_id === null)
       let tree = buildTree(null);
       if (tree.length === 0) {
              // fallback: cari root berdasarkan parent yang tidak ada
              const parentIds = new Set(
                     Object.values(masterMap)
                            .map((m) => m.parent_id)
                            .filter(Boolean)
              );
              const rootIds = Object.values(masterMap)
                     .map((m) => m.id)
                     .filter((id) => !parentIds.has(id));
              tree = rootIds.map((id) => ({
                     kode: masterMap[id].kode,
                     name: masterMap[id].name,
                     pagu: masterMap[id].pagu.length ? masterMap[id].pagu : null,
                     children: buildTree(id),
              }));
       }

       // 8️⃣ Format akhir: bidang → program → kegiatan → subKegiatan
        const result = tree.map((urusan) => ({
              id: urusan.id,
              kode: urusan.kode,
              name: urusan.name,
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
                            pagu: program.pagu,
                            kegiatan: program.children.map((kegiatan) => ({
                                   id: kegiatan.id,
                                   kode: kegiatan.kode,
                                   name: kegiatan.name,
                                   pagu: kegiatan.pagu,
                                   subKegiatan: kegiatan.children.map((sub) => ({
                                          id: sub.id,
                                          kode: sub.kode,
                                          name: sub.name,
                                          pagu: sub.pagu,
                            })),
                     })),
              })),
              })),
       }));

       return result;
};


