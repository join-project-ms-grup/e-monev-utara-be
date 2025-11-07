import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const listRpjmd = async (req) => {
       const skpd_periode_id = parseInt(req.params.skpdPeriodeId);
       const getProgram = await prisma.x_master.findMany({
              where: {
                     type: "program",
                     paguProgram: { some: { skpd_periode_id } }
              },
              select: {
                     name: true,
                     kode: true,
                     parent: {
                            select: {
                                   kode: true,
                                   name: true,
                                   parent: {
                                          select: {
                                                 kode: true,
                                                 name: true
                                          }
                                   }
                            }
                     },
                     outcome: {
                            where: { skpd_periode_id },
                            select: {
                                   outcome: true,
                                   indikatorOutcome: {
                                          select: {
                                                 nama: true,
                                                 satuan: true,
                                                 targetIndikatorOutcome: {
                                                        select: {
                                                               tahun: true,
                                                               tahun_ke: true,
                                                               target: true,
                                                               capaian: true
                                                        }
                                                 }

                                          }
                                   }

                            }
                     },
                     paguProgram: {
                            where: { skpd_periode_id },
                            select: { tahun: true, tahun_ke: true, pagu: true }
                     },
                     children: {
                            select: {
                                   children: {
                                          select: {
                                                 paguIndikatif: { where: { skpd_periode_id } }
                                          }
                                   }
                            }
                     }
              }
       });
       if (getProgram.length === 0) {
              throw new errorHandling(404, "Tidak menemukan program pada periode ini");
       }
       const result = [];
       for (const p of getProgram) {
              result.push({
                     kode: p.parent.parent.kode,
                     name: p.parent.parent.name,
                     type: "urusan",
                     bidang: {
                            kode: p.parent.kode,
                            name: p.parent.name,
                            type: "bidang",
                            program: {
                                   kode: p.kode,
                                   name: p.name,
                                   outcome: mapOutcome(p.outcome, p.outcome[0].indikatorOutcome.targetIndikatorOutcome[0].tahun),
                                   pagu: calculatePaguRecursive({ pagu: p.paguProgram, children: p.children }, 5, p.paguProgram[0].tahun),
                                   // children: p.children
                            }
                     }
              })
       }
       return groupHierarchy(result);
       return getProgram;
}

// Helper untuk menambah tahun kosong
const fillMissingYears = (records, totalYears = 5, startYear = 2025) => {
       const map = new Map(records.map(r => [r.tahun_ke, r]));
       return Array.from({ length: totalYears }, (_, i) => {
              const tahun_ke = i + 1;
              const tahun = startYear + i;
              return map.get(tahun_ke) || {
                     tahun,
                     tahun_ke,
                     pagu: "0",
                     realisasi: "0"
              };
       });
};

// Fungsi rekursif untuk hitung total pagu & realisasi
const calculatePaguRecursive = (node, totalYears = 5, startYear = 2025, keepChildren = false) => {
       if (node.children && node.children.length > 0) {
              node.children = node.children.map(child =>
                     calculatePaguRecursive(child, totalYears, startYear, keepChildren)
              );

              const yearTotals = {};
              node.children.forEach(child => {
                     if (child.pagu && Array.isArray(child.pagu)) {
                            child.pagu.forEach(p => {
                                   if (!yearTotals[p.tahun_ke]) yearTotals[p.tahun_ke] = { pagu: 0, realisasi: 0 };
                                   yearTotals[p.tahun_ke].pagu += parseFloat(p.pagu || 0);
                                   yearTotals[p.tahun_ke].realisasi += parseFloat(p.realisasi || 0);
                            });
                     }
              });

              node.pagu = fillMissingYears(
                     Object.keys(yearTotals).map(k => {
                            const pagu = yearTotals[k].pagu || 0;
                            const realisasi = yearTotals[k].realisasi || 0;
                            const persen = pagu > 0 ? parseFloat(((realisasi / pagu) * 100).toFixed(2)) : 0;
                            return {
                                   tahun: startYear + (parseInt(k) - 1),
                                   tahun_ke: parseInt(k),
                                   pagu: pagu.toString(),
                                   realisasi: realisasi.toString(),
                                   persen
                            };
                     }),
                     totalYears,
                     startYear
              );
       } else {
              if (node.paguIndikatif && node.paguIndikatif.length > 0) {
                     node.pagu = fillMissingYears(
                            node.paguIndikatif.map(p => {
                                   const pagu = parseFloat(p.pagu || 0);
                                   const realisasi = parseFloat(p.realisasi || 0);
                                   const persen = pagu > 0 ? parseFloat(((realisasi / pagu) * 100).toFixed(2)) : 0;
                                   return {
                                          tahun: p.tahun,
                                          tahun_ke: p.tahun_ke,
                                          pagu: p.pagu,
                                          realisasi: p.realisasi || "0",
                                          persen
                                   };
                            }),
                            totalYears,
                            startYear
                     );
              } else {
                     node.pagu = fillMissingYears([], totalYears, startYear);
              }
       }

       // Hilangkan children kalau tidak ingin ditampilkan
       if (!keepChildren) delete node.children;

       return node;
};


const mapOutcome = (outcomes, startYear = 2026, totalYears = 5) => {
       return outcomes.map(out => {
              const indikator = out.indikatorOutcome || {};
              const targets = indikator.targetIndikatorOutcome || [];

              // Map untuk akses cepat berdasarkan tahun_ke
              const existingMap = new Map(targets.map(t => [t.tahun_ke, t]));

              // Susun ulang list tahun_ke = 1..totalYears
              const fullTargets = Array.from({ length: totalYears }, (_, i) => {
                     const tahun_ke = i + 1;
                     const tahun = startYear + i;
                     const existing = existingMap.get(tahun_ke);

                     const target = existing?.target ?? 0;
                     const capaian = existing?.capaian ?? 0;
                     const persen = target > 0 ? (capaian / target) * 100 : 0;

                     return {
                            tahun,
                            tahun_ke,
                            target,
                            capaian,
                            persen: parseFloat(persen.toFixed(2))
                     };
              });

              return {
                     ...out,
                     indikatorOutcome: {
                            ...indikator,
                            targetIndikatorOutcome: fullTargets
                     }
              };
       });
};

export function groupHierarchy(rows) {
       const urusanMap = new Map();

       for (const row of rows) {
              const urusanId = row.id;
              const bidang = row.bidang;
              const program = bidang.program;

              // --- Urusan
              if (!urusanMap.has(urusanId)) {
                     urusanMap.set(urusanId, {
                            id: row.id,
                            kode: row.kode,
                            name: row.name,
                            type: row.type,
                            bidang: [],
                     });
              }

              const urusan = urusanMap.get(urusanId);

              // --- Bidang
              let bidangObj = urusan.bidang.find(b => b.id === bidang.id);
              if (!bidangObj) {
                     bidangObj = {
                            id: bidang.id,
                            parent: bidang.parent,
                            kode: bidang.kode,
                            name: bidang.name,
                            type: bidang.type,
                            program: [],
                     };
                     urusan.bidang.push(bidangObj);
              }

              // --- Program
              let programObj = bidangObj.program.find(p => p.id === program.id);
              if (!programObj) {
                     programObj = program;
                     bidangObj.program.push(programObj);
              }
       }

       // hasil akhirnya berupa array
       return Array.from(urusanMap.values());
}


export const listLaporan = async (req) => {
       const skpd_periode_id = Number(req.params.skpdPeriodeId);
       // 1) Ambil semua pagu indikatif
       const getMaster = await prisma.master.findMany({
              where: {
                     type: 'program',
                     status: true,
                     paguProgram: { some: { skpd_periode_id } },
                     outcome: { some: { skpd_periode_id } }
              },
              include: {
                     parent: { include: { parent: true } }, //ambil urusan dan bidang
                     paguProgram: {
                            where: { skpd_periode_id }
                     },
                     // indikator: {
                     //        include: {
                     //               rincian: {
                     //                      include: { capaian: true }
                     //               }
                     //        }
                     // },
                     children: { // ambil kegiatan
                            where: {
                                   paguKegiatan: {
                                          some: { skpd_periode_id }
                                   }
                            },
                            include: {
                                   paguKegiatan: {
                                          where: { skpd_periode_id }
                                   },
                                   // indikator: {
                                   //        include: {
                                   //               rincian: {
                                   //                      include: { capaian: true }
                                   //               }
                                   //        }
                                   // },
                                   children: {
                                          where: {
                                                 paguIndikatif: {
                                                        some: { skpd_periode_id }
                                                 }
                                          },
                                          include: {
                                                 paguIndikatif: {
                                                        where: { skpd_periode_id },
                                                        include: { realisasi: true }
                                                 },
                                                 indikator: {
                                                        include: {
                                                               rincian: {
                                                                      include: { capaian: true }
                                                               }
                                                        }
                                                 }
                                          }
                                   }
                            },
                     }
              }
       });

       // 2) Strukturkan data berdasarkan urusan > bidang > program > kegiatan > sub kegiatan
       const result = [];
       for (const p of getMaster) {
              const kegiatan = [];
              for (const k of p.children) {
                     const subKegiatan = [];
                     for (const sk of k.children) {
                            if (sk.indikator.length === 0) continue;
                            subKegiatan.push({
                                   id: sk.id,
                                   parent: sk.parent_id,
                                   kode: sk.kode,
                                   name: sk.name,
                                   type: 'sub_kegiatan',
                                   indikator: mappingIndikator(sk.indikator),
                                   pagu: mappingPagu(sk.paguIndikatif)
                            });
                     }
                     if (subKegiatan.length === 0) continue;
                     kegiatan.push({
                            id: k.id,
                            parent: k.parent_id,
                            kode: k.kode,
                            name: k.name,
                            type: 'kegiatan',
                            // indikator: mappingIndikator(k.indikator),
                            pagu: aggregatePaguFromChildren(k.paguKegiatan, subKegiatan),
                            subKegiatan
                     });
              }
              const program = {
                     id: p.id,
                     parent: p.parent_id,
                     kode: p.kode,
                     name: p.name,
                     type: 'program',
                     // indikator: mappingIndikator(p.indikator),
                     pagu: aggregatePaguFromChildren(p.paguProgram, kegiatan),
                     kegiatan
              }

              const bidang = {
                     id: p.parent.id,
                     parent: p.parent.parent_id,
                     kode: p.parent.kode,
                     name: p.parent.name,
                     type: 'bidang',
                     program
              }
              result.push({
                     id: p.parent.parent.id,
                     kode: p.parent.parent.kode,
                     name: p.parent.parent.name,
                     type: 'urusan',
                     bidang
              });
       }
       return groupHierarchy(result);
}

const mappingPagu = (pagu) => {
       const totalPagu = pagu.reduce((sum, item) => sum + (Number(item.pagu) || 0), 0);
       const pagu_per_tahun = [1, 2, 3, 4, 5].map(tahun_ke => ({
              tahun_ke,
              pagu: pagu.find(p => p.tahun_ke === tahun_ke)?.pagu || 0
       }));
       const realisasi_per_tahun = [1, 2, 3, 4, 5].map(tahun_ke => {
              const getRealisasi = pagu.find(p => p.tahun_ke === tahun_ke);
              const realisasi = getRealisasi?.realisasi?.length >= 0 ? getRealisasi?.realisasi.reduce((sum, item) => sum + (Number(item.realisasi) || 0), 0) : 0;
              return {
                     tahun_ke,
                     realisasi
              }
       });
       const rasio_per_tahun = [1, 2, 3, 4, 5].map(tahun_ke => {
              const getRealisasi = pagu.find(p => p.tahun_ke === tahun_ke);
              const realisasi = getRealisasi?.realisasi?.length >= 0 ? getRealisasi?.realisasi.reduce((sum, item) => sum + (Number(item.realisasi) || 0), 0) : 0;
              return {
                     tahun_ke,
                     rasio: realisasi !== 0 ? ((realisasi / Number(getRealisasi?.pagu)) * 100).toFixed(2) : 0
              }
       });
       return {
              totalPagu,
              pagu_per_tahun,
              realisasi_per_tahun,
              rasio_per_tahun
       }
}

const aggregatePaguFromChildren = (parentPaguRaw, children) => {
       const tahunList = [1, 2, 3, 4, 5];
       const parentPagu = mappingPagu(parentPaguRaw); // supaya strukturnya konsisten

       const pagu_per_tahun = tahunList.map(tahun_ke => {
              // Ambil pagu parent-nya sendiri
              const parentTahun = parentPagu.pagu_per_tahun.find(p => p.tahun_ke === tahun_ke);
              const pagu = Number(parentTahun?.pagu || 0);

              return { tahun_ke, pagu };
       });

       const realisasi_per_tahun = tahunList.map(tahun_ke => {
              // Ambil total realisasi dari semua sub_kegiatan (anak)
              const totalRealisasi = children.reduce((sum, child) => {
                     const childRealisasiTahun = child.pagu?.realisasi_per_tahun.find(r => r.tahun_ke === tahun_ke);
                     return sum + Number(childRealisasiTahun?.realisasi || 0);
              }, 0);

              return { tahun_ke, realisasi: totalRealisasi };
       });

       const rasio_per_tahun = tahunList.map(tahun_ke => {
              const pagu = pagu_per_tahun.find(p => p.tahun_ke === tahun_ke)?.pagu || 0;
              const realisasi = realisasi_per_tahun.find(r => r.tahun_ke === tahun_ke)?.realisasi || 0;
              return {
                     tahun_ke,
                     rasio: pagu !== 0 ? ((realisasi / pagu) * 100).toFixed(2) : 0,
              };
       });

       // Total keseluruhan
       const totalPagu = pagu_per_tahun.reduce((sum, p) => sum + p.pagu, 0);
       // const totalRealisasi = realisasi_per_tahun.reduce((sum, r) => sum + r.realisasi, 0);

       return {
              totalPagu,
              pagu_per_tahun,
              realisasi_per_tahun,
              rasio_per_tahun,
       };
}

const mappingIndikator = (indikator) => {
       const result = [];
       for (const ind of indikator) {
              const totalTarget = ind.rincian.reduce((sum, item) => sum + (item.target || 0), 0);
              const target_per_tahun = [1, 2, 3, 4, 5].map(tahun_ke => ({
                     tahun_ke,
                     target: ind.rincian.find(p => p.tahun_ke === tahun_ke)?.target || 0
              }));
              const capaian_per_tahun = [1, 2, 3, 4, 5].map((tahun_ke) => {
                     const getCapaian = ind.rincian.find(p => p.tahun_ke === tahun_ke);
                     const capaian = getCapaian?.capaian.length >= 0 ? getCapaian?.capaian.reduce((sum, item) => sum + (item.capaian || 0), 0) : 0
                     return {
                            tahun_ke,
                            capaian
                     }
              });

              const rasio_per_tahun = [1, 2, 3, 4, 5].map((tahun_ke) => {
                     const getCapaian = ind.rincian.find(p => p.tahun_ke === tahun_ke);
                     const capaian = getCapaian?.capaian.length >= 0 ? getCapaian?.capaian.reduce((sum, item) => sum + (item.capaian || 0), 0) : 0
                     return {
                            tahun_ke,
                            rasio: capaian !== 0 ? ((capaian / getCapaian?.target) * 100).toFixed(2) : 0
                     }
              });

              result.push({
                     id: ind.id,
                     name: ind.name,
                     satuan: ind.satuan,
                     totalTarget,
                     target_per_tahun,
                     capaian_per_tahun,
                     rasio_per_tahun
              });
       }
       return result;
}

