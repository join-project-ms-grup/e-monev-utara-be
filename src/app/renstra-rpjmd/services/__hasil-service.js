import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const listRpjmd = async (req) => {
       const skpd_periode_id = parseInt(req.params.skpdPeriodeId);
       const getPeriode = await prisma.x_skpd_periode.findFirst({
              where: { id: skpd_periode_id },
              select: {
                     periode: true
              }
       })
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
                                   outcome: mapOutcome(p.outcome, getPeriode.periode.mulai),
                                   pagu: calculatePaguRecursive({ pagu: p.paguProgram, children: p.children }, 5, getPeriode.periode.mulai),
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
              const indikator = out?.indikatorOutcome || {};
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
       const skpd_periode_id = parseInt(req.params.skpdPeriodeId);
       const getPeriode = await prisma.x_skpd_periode.findFirst({
              where: { id: skpd_periode_id },
              select: {
                     periode: true
              }
       })
       return await listHierarkiRenja(skpd_periode_id, getPeriode.periode.mulai);
}
export const listHierarkiRenja = async (skpd_periode_id, tahunAwal) => {
       const tahunList = Array.from({ length: 5 }, (_, i) => tahunAwal + i);

       const data = await prisma.x_master.findMany({
              where: {
                     type: "program",
                     paguProgram: { some: { skpd_periode_id } },
              },
              select: {
                     id: true,
                     kode: true,
                     name: true,
                     type: true,
                     parent: {
                            select: {
                                   kode: true,
                                   name: true,
                                   type: true,
                                   parent: {
                                          select: {
                                                 kode: true,
                                                 name: true,
                                                 type: true,
                                          },
                                   },
                            },
                     },
                     paguProgram: {
                            where: { skpd_periode_id },
                            select: { tahun: true, tahun_ke: true, pagu: true },
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
                     children: {
                            select: {
                                   id: true,
                                   kode: true,
                                   name: true,
                                   type: true,
                                   paguKegiatan: {
                                          where: { skpd_periode_id },
                                          select: { tahun: true, tahun_ke: true, pagu: true },
                                   },
                                   children: {
                                          select: {
                                                 id: true,
                                                 kode: true,
                                                 name: true,
                                                 type: true,
                                                 paguIndikatif: {
                                                        where: { skpd_periode_id },
                                                        select: {
                                                               tahun: true,
                                                               tahun_ke: true,
                                                               pagu: true,
                                                               realisasi: true,
                                                        },
                                                 },
                                                 indikator: {
                                                        select: {
                                                               name: true,
                                                               satuan: true,
                                                               rincian: {
                                                                      select: {
                                                                             tahun: true,
                                                                             target: true,
                                                                             capaian: true,
                                                                      },
                                                               },
                                                        },
                                                 },
                                          },
                                   },
                            },
                     },
              },
       });

       const result = [];

       for (const program of data) {
              const urusan = program.parent?.parent;
              const bidang = program.parent;

              // Cari / buat urusan
              let urusanNode = result.find((u) => u.kode === urusan?.kode);
              if (!urusanNode) {
                     urusanNode = {
                            kode: urusan?.kode,
                            name: urusan?.name,
                            type: urusan?.type,
                            bidang: [],
                     };
                     result.push(urusanNode);
              }

              // Cari / buat bidang
              let bidangNode = urusanNode.bidang.find((b) => b.kode === bidang?.kode);
              if (!bidangNode) {
                     bidangNode = {
                            kode: bidang?.kode,
                            name: bidang?.name,
                            type: bidang?.type,
                            program: [],
                     };
                     urusanNode.bidang.push(bidangNode);
              }

              // Subkegiatan → pagu langsung dari DB
              const kegiatan = program.children.map((keg) => {
                     const subKegiatan = keg.children.map((sub) => {
                            const pagu = tahunList.map((tahun, i) => {
                                   const item = sub.paguIndikatif.find((x) => x.tahun === tahun);
                                   return {
                                          tahun,
                                          tahun_ke: i + 1,
                                          pagu: Number(item?.pagu || 0),
                                          realisasi: Number(item?.realisasi || 0),
                                   };
                            });

                            return {
                                   id: sub.id,
                                   kode: sub.kode,
                                   name: sub.name,
                                   type: sub.type,
                                   indikator: sub.indikator.map((i) => ({
                                          name: i.name,
                                          satuan: i.satuan,
                                          rincian: tahunList.map((tahun) => {
                                                 const r = i.rincian.find((x) => x.tahun === tahun);
                                                 return {
                                                        tahun,
                                                        target: Number(r?.target || 0),
                                                        capaian: r?.capaian ? Number(r.capaian) : null,
                                                 };
                                          }),
                                   })),
                                   pagu,
                            };
                     });

                     // Kegiatan → total dari subKegiatan
                     const paguKegiatan = tahunList.map((tahun, i) => {
                            const totalPagu = subKegiatan.reduce(
                                   (sum, s) => sum + (s.pagu.find((p) => p.tahun === tahun)?.pagu || 0),
                                   0
                            );
                            const totalRealisasi = subKegiatan.reduce(
                                   (sum, s) => sum + (s.pagu.find((p) => p.tahun === tahun)?.realisasi || 0),
                                   0
                            );
                            return {
                                   tahun,
                                   tahun_ke: i + 1,
                                   pagu: totalPagu,
                                   realisasi: totalRealisasi,
                            };
                     });

                     return {
                            id: keg.id,
                            kode: keg.kode,
                            name: keg.name,
                            type: keg.type,
                            pagu: paguKegiatan,
                            children: subKegiatan,
                     };
              });

              // Program → total dari kegiatan
              const paguProgram = tahunList.map((tahun, i) => {
                     const totalPagu = kegiatan.reduce(
                            (sum, k) => sum + (k.pagu.find((p) => p.tahun === tahun)?.pagu || 0),
                            0
                     );
                     const totalRealisasi = kegiatan.reduce(
                            (sum, k) => sum + (k.pagu.find((p) => p.tahun === tahun)?.realisasi || 0),
                            0
                     );
                     return {
                            tahun,
                            tahun_ke: i + 1,
                            pagu: totalPagu,
                            realisasi: totalRealisasi,
                     };
              });

              bidangNode.program.push({
                     kode: program.kode,
                     name: program.name,
                     type: program.type,
                     pagu: paguProgram,
                     outcome: mapOutcome(program.outcome, tahunAwal, 5),
                     children: kegiatan,
              });
       }

       return result;
};
