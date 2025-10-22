import prisma from "../config/database.js";

export const getCapaianList = async (req) => {
       const skpd_periode_id = parseInt(req.params.skpd_periode_id);
       const tahun_ke = parseInt(req.params.tahun_ke);

       // 1️⃣ Ambil semua indikator berdasarkan SKPD periode
       const indikatorList = await prisma.indikator.findMany({
              where: { skpd_periode_id },
              include: {
                     master: {
                            select: { id: true, parent_id: true, kode: true, name: true, type: true },
                     },
                     rincian: {
                            where: { tahun_ke },
                            include: {
                                   capaian: {
                                          orderBy: { triwulan: "asc" },
                                   },
                            },
                     },
              },
       });

       if (indikatorList.length === 0) return [];

       // 2️⃣ Ambil semua master id yang terlibat
       const masterIds = indikatorList.map((i) => i.master.id);
       const collectedIds = new Set(masterIds);

       // 3️⃣ Ambil semua parent master sampai root
       let newParentsFound = true;
       while (newParentsFound) {
              const parents = await prisma.master.findMany({
                     where: { id: { in: Array.from(collectedIds) } },
                     select: { parent_id: true },
              });

              const newParents = parents
                     .map((p) => p.parent_id)
                     .filter((pid) => pid && !collectedIds.has(pid));

              if (newParents.length > 0) {
                     newParents.forEach((pid) => collectedIds.add(pid));
              } else {
                     newParentsFound = false;
              }
       }

       // 4️⃣ Ambil semua master terkait
       const masters = await prisma.master.findMany({
              where: { id: { in: Array.from(collectedIds) } },
              orderBy: { id: "asc" },
              select: {
                     id: true,
                     parent_id: true,
                     kode: true,
                     name: true,
                     type: true,
              },
       });

       // 5️⃣ Buat map master → children
       const masterMap = {};
       masters.forEach((m) => {
              masterMap[m.id] = {
                     kode: m.kode,
                     name: m.name,
                     type: m.type,
                     indikator: [],
                     children: [],
              };
       });

       // 6️⃣ Kaitkan indikator ke master
       indikatorList.forEach((ind) => {
              const m = ind.master;
              if (!m || !masterMap[m.id]) return;

              // Hitung capaian per triwulan (1–4), isi 0 jika tidak ada
              const capaianTriwulan = [1, 2, 3, 4].map((triwulan) => {
                     const data = ind.rincian?.[0]?.capaian?.find((c) => c.triwulan === triwulan);
                     return { triwulan, capaian: data ? parseFloat(data.capaian) : 0 };
              });

              // Hitung total & persentase capaian
              const capaianTotal = capaianTriwulan.reduce((a, b) => a + b.capaian, 0);
              const targetTotal = ind.rincian.reduce((a, r) => a + parseFloat(r.target || 0), 0);
              const perseCapaian = targetTotal > 0 ? (capaianTotal / targetTotal) * 100 : 0;

              masterMap[m.id].indikator.push({
                     id: ind.id,
                     name: ind.name,
                     satuan: ind.satuan,
                     target: ind.rincian.map((r) => ({
                            id_rincian: r.id,
                            tahun_ke: r.tahun_ke,
                            target: parseFloat(r.target || 0),
                     })),
                     capaian: {
                            capaianTotal,
                            perseCapaian,
                            capaianTriwulan,
                     },
              });
       });

       // 7️⃣ Bangun struktur tree
       Object.values(masterMap).forEach((m) => {
              const master = masters.find((x) => x.kode === m.kode);
              if (master.parent_id && masterMap[master.parent_id]) {
                     masterMap[master.parent_id].children.push(m);
              }
       });

       // 8️⃣ Ambil root (tanpa parent)
       const roots = masters
              .filter((m) => !m.parent_id)
              .map((m) => masterMap[m.id]);

       return roots;
};

export const updateCapaian = async (req) => {
       const { id_rincian, capaian } = req.body;
       const cekCapaian = await prisma.capaianTriwulan.findMany({
              where: {
                     rincianIndikator_id: parseInt(id_rincian)

              }
       });
       for (const item of capaian) {
              const existing = cekCapaian.find(
                     (c) => c.triwulan === item.triwulan
              );
              if (existing) {
                     // Update existing record
                     await prisma.capaianTriwulan.update({
                            where: { id: existing.id },
                            data: { capaian: item.capaian },
                     });
              } else {
                     // Create new record
                     await prisma.capaianTriwulan.create({
                            data: {
                                   rincianIndikator_id: parseInt(id_rincian),
                                   triwulan: item.triwulan,
                                   capaian: item.capaian,
                            },
                     });
              }
       }
       const rincian = await prisma.rincianIndikator.findUnique({
              where: { id: parseInt(id_rincian) },
              include: {
                     indikator: true
              }
       });
       return await getCapaianList({
              params: {
                     skpd_periode_id: rincian.indikator.skpd_periode_id,
                     tahun_ke: rincian.tahun_ke
              }
       });
}
