import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const getRealisasiAnggaranList = async (req) => {
       const skpd_periode_id = Number(req.body.skpd_periode_id);
       const tahun_ke = Number(req.body.tahun_ke);

       // 1) Ambil semua pagu indikatif
       const paguRows = await prisma.paguIndikatif.findMany({
              where: { skpd_periode_id, tahun_ke, status: true },
              include: {
                     master: {
                            select: { id: true, parent_id: true, kode: true, name: true, type: true },
                     },
                     realisasi: { select: { triwulan: true, realisasi: true }, orderBy: { triwulan: "asc" } },
              },
       });

       if (!paguRows.length) {
              throw new errorHandling(404, "Data pagu indikatif tidak ditemukan untuk SKPD Periode dan Tahun Ke tersebut");
       }

       // 2) Ambil semua master untuk memetakan urusan & bidang juga
       const allMaster = await prisma.master.findMany({
              where: {
                     type: { in: ["urusan", "bidang"] },
                     status: true,
              },
              select: { id: true, parent_id: true, kode: true, name: true, type: true },
       });

       const masterAllMap = Object.fromEntries(allMaster.map((m) => [m.id, m]));

       // 3) Siapkan data dasar dari pagu
       const masterMap = {};
       for (const row of paguRows) {
              const { master, pagu, realisasi } = row;
              let realisasi_per_triwulan = [];
              if (master.type === "subKegiatan") {
                     // Ambil dari database
                     const mapTri = new Map(realisasi.map(r => [r.triwulan, Number(r.realisasi)]));

                     // Pastikan ada 4 triwulan
                     for (let i = 1; i <= 4; i++) {
                            realisasi_per_triwulan.push({
                                   triwulan: i,
                                   realisasi: mapTri.get(i) || 0,
                            });
                     }
              }

              masterMap[master.id] = {
                     ...master,
                     id_pagu: row.id,
                     pagu: Number(pagu),
                     realisasi:
                            master.type === "subKegiatan"
                                   ? realisasi_per_triwulan.reduce((sum, r) => sum + r.realisasi, 0)
                                   : 0,
                     realisasi_per_triwulan,
                     children: [],
              };
       }

       // 4) Tambahkan parent (bidang & urusan) jika belum ada di pagu
       for (const node of Object.values(masterMap)) {
              let currentParentId = node.parent_id;
              while (currentParentId) {
                     if (!masterMap[currentParentId] && masterAllMap[currentParentId]) {
                            masterMap[currentParentId] = {
                                   ...masterAllMap[currentParentId],
                                   pagu: 0,
                                   realisasi: 0,
                                   realisasi_per_triwulan: [],
                                   children: [],
                            };
                     }
                     currentParentId = masterAllMap[currentParentId]?.parent_id;
              }
       }

       // 5) Hubungkan parent-child
       let roots = [];
       for (const id in masterMap) {
              const node = masterMap[id];
              if (node.parent_id && masterMap[node.parent_id]) {
                     masterMap[node.parent_id].children.push(node);
              } else {
                     roots.push(node);
              }
       }

       // 6) Fungsi bantu untuk menjumlahkan realisasi per triwulan
       const sumTriwulan = (arr) => {
              const map = new Map();
              for (const { triwulan, realisasi } of arr) {
                     map.set(triwulan, (map.get(triwulan) || 0) + realisasi);
              }
              return Array.from(map, ([triwulan, realisasi]) => ({ triwulan, realisasi }));
       };

       // 7) Rekursif akumulasi realisasi dari anak ke parent (pagu tetap)
       const sumRecursive = (node) => {
              if (!node.children.length) return node;

              let totalRealisasi = node.realisasi;
              let totalRealisasiTriwulan = [...node.realisasi_per_triwulan];

              node.children = node.children.map((child) => sumRecursive(child));

              for (const child of node.children) {
                     totalRealisasi += child.realisasi;
                     totalRealisasiTriwulan.push(...child.realisasi_per_triwulan);
              }

              node.realisasi = totalRealisasi;
              node.realisasi_per_triwulan = sumTriwulan(totalRealisasiTriwulan);

              return node;
       };

       roots = roots.map((root) => sumRecursive(root));

       // 8) Format output akhir sesuai hierarki
       const formatOutput = (node) => {
              const formatted = {
                     kode: node.kode,
                     name: node.name,
                     type: node.type,
              };

              if (["program", "kegiatan", "subKegiatan"].includes(node.type)) {
                     formatted.id_pagu = node.id_pagu;
                     formatted.pagu = node.pagu;
                     formatted.realisasi = node.realisasi;
                     formatted.realisasi_per_triwulan = node.realisasi_per_triwulan;
              }

              if (node.children.length) {
                     if (node.type === "urusan") formatted.bidang = node.children.map(formatOutput);
                     else if (node.type === "bidang") formatted.program = node.children.map(formatOutput);
                     else if (node.type === "program") formatted.kegiatan = node.children.map(formatOutput);
                     else if (node.type === "kegiatan") formatted.subKegiatan = node.children.map(formatOutput);
              }

              return formatted;
       };

       const result = roots.map(formatOutput);

       return result;
};



