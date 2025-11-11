import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const dashboardCardData = async (req) => {
       const totalSKPD = await prisma.skpd.count();
       const totalProgram = await prisma.master.count({
              where: { type: "program" }
       });
       const totalKegiatan = await prisma.master.count({
              where: { type: "kegiatan" }
       });
       const totalSubKegiatan = await prisma.master.count({
              where: { type: "subKegiatan" }
       });

       return {
              totalSKPD,
              totalProgram,
              totalKegiatan,
              totalSubKegiatan
       }
}

export const rankingSKPD = async (req) => {
       const { periode_id, tahun_ke, triwulan } = req.body;
       const twsd = Array.from({ length: triwulan }).map((_, index) => index + 1);

       const exist = await prisma.periode.findUnique({
              where: { id: periode_id }
       });
       if (!exist) throw new errorHandling(404, "gagal mendapatkan periode");

       const getSKPD = await prisma.skpd_periode.findMany({
              where: { status: true, periode_id },
              select: {
                     id: true,
                     skpd: { select: { kode: true, name: true } },
                     indikator: {
                            select: {
                                   rincian: {
                                          where: { tahun_ke },
                                          select: {
                                                 target: true,
                                                 capaian: {
                                                        where: { triwulan: { in: twsd } },
                                                        select: { capaian: true, triwulan: true }
                                                 }
                                          }
                                   }
                            }
                     },
                     paguIndikatif: {
                            select: {
                                   pagu: true,
                                   realisasi: {
                                          where: { triwulan: { in: twsd } },
                                          select: { triwulan: true, realisasi: true }
                                   }
                            }
                     }
              }
       });

       const getPredikat = (value) => {
              if (value < 0 || value > 100) return "UNK"; // Unknown
              if (value > 90) return "ST"; // Sangat Tinggi
              if (value > 75) return "T";  // Tinggi
              if (value > 65) return "S";  // Sedang
              if (value > 50) return "R";  // Rendah
              return "SR";                 // Sangat Rendah
       };

       const result = getSKPD.map((skpd) => {
              // === CAPAIAN ===
              const capaianAll = skpd.indikator.flatMap(ind =>
                     ind.rincian.flatMap(r =>
                            r.capaian.map(c => ({
                                   triwulan: c.triwulan,
                                   capaian: Number(c.capaian) || 0,
                                   target: Number(r.target) || 0
                            }))
                     )
              );

              const capaianPersen = capaianAll.map(c => ({
                     triwulan: c.triwulan,
                     persen: c.target > 0 ? (c.capaian / c.target) * 100 : 0
              }));

              const capaianTriwulan = capaianPersen.filter(c => c.triwulan === triwulan).map(c => c.persen);
              const capaianKumulatif = capaianPersen.filter(c => c.triwulan <= triwulan).map(c => c.persen);

              const avgCapaianTriwulan = capaianTriwulan.length
                     ? capaianTriwulan.reduce((a, b) => a + b, 0) / capaianTriwulan.length
                     : 0;

              const avgCapaianKumulatif = capaianKumulatif.length
                     ? capaianKumulatif.reduce((a, b) => a + b, 0) / capaianKumulatif.length
                     : 0;

              // === REALISASI ===
              const realisasiAll = skpd.paguIndikatif.flatMap(p =>
                     p.realisasi.map(r => ({
                            triwulan: r.triwulan,
                            realisasi: Number(r.realisasi) || 0,
                            pagu: Number(p.pagu) || 0
                     }))
              );

              const realisasiPersen = realisasiAll.map(r => ({
                     triwulan: r.triwulan,
                     persen: r.pagu > 0 ? (r.realisasi / r.pagu) * 100 : 0
              }));

              const realisasiTriwulan = realisasiPersen.filter(r => r.triwulan === triwulan).map(r => r.persen);
              const realisasiKumulatif = realisasiPersen.filter(r => r.triwulan <= triwulan).map(r => r.persen);

              const avgRealisasiTriwulan = realisasiTriwulan.length
                     ? realisasiTriwulan.reduce((a, b) => a + b, 0) / realisasiTriwulan.length
                     : 0;

              const avgRealisasiKumulatif = realisasiKumulatif.length
                     ? realisasiKumulatif.reduce((a, b) => a + b, 0) / realisasiKumulatif.length
                     : 0;

              const totalRealisasiTriwulan = realisasiAll
                     .filter(r => r.triwulan === triwulan)
                     .reduce((a, b) => a + b.realisasi, 0);

              const totalRealisasiKumulatif = realisasiAll
                     .filter(r => r.triwulan <= triwulan)
                     .reduce((a, b) => a + b.realisasi, 0);

              // === NILAI UNTUK RANKING ===
              const score = (avgCapaianKumulatif + avgRealisasiKumulatif) / 2;

              return {
                     kode: skpd.skpd.kode,
                     name: skpd.skpd.name,
                     score,
                     rata_rata_triwulan: {
                            capaian: parseFloat(avgCapaianTriwulan.toFixed(2)),
                            c_predikat: getPredikat(avgCapaianTriwulan),
                            realisasi: parseFloat(avgRealisasiTriwulan.toFixed(2)),
                            r_predikat: getPredikat(avgRealisasiTriwulan),
                     },
                     rata_rata_kumulatif: {
                            capaian: parseFloat(avgCapaianKumulatif.toFixed(2)),
                            c_predikat: getPredikat(avgCapaianKumulatif),
                            realisasi: parseFloat(avgRealisasiKumulatif.toFixed(2)),
                            r_predikat: getPredikat(avgRealisasiKumulatif),
                     },
                     total_realisasi: {
                            triwulan: totalRealisasiTriwulan,
                            kumulatif: totalRealisasiKumulatif
                     }
              };
       });

       // === SORT & BERIKAN RANK ===
       const ranked = result
              .sort((a, b) => b.score - a.score)
              .map((item, index) => ({
                     rangking: index + 1,
                     ...item
              }));

       return { triwulan, result: ranked };
};
