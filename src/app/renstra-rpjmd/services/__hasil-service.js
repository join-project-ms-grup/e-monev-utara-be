import { body } from "express-validator";
import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const createUpdateCatatan = async (req) => {
       const { skpd_periode_id, type, pendorong, penghambat, tl_1, tl_2 } = req.body;
       const exist = await prisma.x_catatan_eval.findFirst({
              where: {
                     skpd_periode: skpd_periode_id,
                     type: type
              }
       });

       if (exist) {
              return await prisma.x_catatan_eval.update({
                     where: { id: exist.id },
                     data: { pendorong, penghambat, tl_1, tl_2 }
              });
       } else {
              return await prisma.x_catatan_eval.create({
                     data: {
                            skpd_periode: skpd_periode_id,
                            type,
                            pendorong,
                            penghambat,
                            tl_1,
                            tl_2
                     }
              });
       }
}


export const getCatatan = async (req) => {
       const { skpd_periode_id, type } = req.body
       const exist = await prisma.x_catatan_eval.findFirst({
              where: { skpd_periode: skpd_periode_id, type }
       });

       if (exist) return {
              pendorong: exist.pendorong,
              penghambat: exist.penghambat,
              tl_1: exist.tl_1,
              tl_2: exist.tl_2
       };

       return {
              pendorong: "",
              penghambat: "",
              tl_1: "",
              tl_2: ""
       }
}

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

       // return getProgram;
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
       return { catatan: await getCatatan({ body: { skpd_periode_id, type: "rpjmd" } }), hasil: strukturkanData(result) }
}

export const listRpjmdAll = async (req) => {
       const { periode_id } = req.body;
       const listSKPD = await prisma.x_skpd_periode.findMany({
              where: { status: true, periode_id },
              select: {
                     id: true,
                     skpd: true
              }
       });

       const result = [];

       for (const skpd of listSKPD) {
              result.push({
                     kode: skpd.skpd.kode,
                     name: skpd.skpd.name,
                     rpjmd: (await listRpjmd({ params: { skpdPeriodeId: skpd.id } })).hasil
              })
       }

       return result
}

function strukturkanData(data) {
       const hasil = [];

       for (const item of data) {
              // cari urusan
              let urusan = hasil.find(u => u.kode === item.kode);
              if (!urusan) {
                     urusan = {
                            kode: item.kode,
                            name: item.name,
                            type: item.type,
                            bidang: []
                     };
                     hasil.push(urusan);
              }

              const bidangData = item.bidang;
              let bidang = urusan.bidang.find(b => b.kode === bidangData.kode);
              if (!bidang) {
                     bidang = {
                            kode: bidangData.kode,
                            name: bidangData.name,
                            type: bidangData.type,
                            program: []
                     };
                     urusan.bidang.push(bidang);
              }

              const programData = bidangData.program;
              let program = bidang.program.find(p => p.kode === programData.kode);
              if (!program) {
                     program = {
                            kode: programData.kode,
                            name: programData.name,
                            outcome: programData.outcome,
                            pagu: programData.pagu
                     };
                     bidang.program.push(program);
              }
       }

       return hasil;
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
              where: { id: skpd_periode_id, status: true },
              select: {
                     periode: true
              }
       });

       const getHasil = await prisma.x_master.findMany({
              where: {
                     type: "urusan",
                     children: { some: { children: { some: { paguProgram: { some: { skpd_periode_id } } } } } }
              },
              select: {
                     kode: true,
                     name: true,
                     children: {
                            where: { children: { some: { paguProgram: { some: { skpd_periode_id } } } } },
                            select: {
                                   kode: true,
                                   name: true,
                                   children: {
                                          where: { paguProgram: { some: { skpd_periode_id } } },
                                          select: {
                                                 kode: true,
                                                 name: true,
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
                                                        select: {
                                                               tahun: true,
                                                               tahun_ke: true,
                                                               pagu: true
                                                        }
                                                 },
                                                 children: {
                                                        where: { paguKegiatan: { some: { skpd_periode_id } } },
                                                        select: {
                                                               kode: true,
                                                               name: true,
                                                               paguKegiatan: {
                                                                      where: { skpd_periode_id },
                                                                      select: {
                                                                             tahun: true,
                                                                             tahun_ke: true,
                                                                             pagu: true
                                                                      }
                                                               },
                                                               children: {
                                                                      where: { paguIndikatif: { some: { skpd_periode_id } } },
                                                                      select: {
                                                                             kode: true,
                                                                             name: true,
                                                                             paguIndikatif: {
                                                                                    where: { skpd_periode_id },
                                                                                    select: {
                                                                                           tahun: true,
                                                                                           tahun_ke: true,
                                                                                           pagu: true,
                                                                                           realisasi: true
                                                                                    }
                                                                             },
                                                                             indikator: {
                                                                                    where: { skpd_periode_id },
                                                                                    select: {
                                                                                           name: true,
                                                                                           rincian: {
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
                                                               }
                                                        }
                                                 }
                                          }
                                   }
                            }
                     }
              }
       });

       const result = [];

       for (const u of getHasil) {
              const bidang = [];

              for (const b of u.children) {
                     const program = [];

                     for (const p of b.children) {
                            const kegiatan = [];

                            for (const k of p.children) {
                                   const subKegiatan = [];

                                   for (const sk of k.children) {
                                          subKegiatan.push({
                                                 kode: sk.kode,
                                                 name: sk.name,
                                                 indikator: mappingIndikator(sk.indikator, getPeriode.periode.mulai),
                                                 pagu: fillMissingYearsPagu(sk.paguIndikatif, getPeriode.periode.mulai)
                                          })
                                   }
                                   kegiatan.push({
                                          kode: k.kode,
                                          name: k.name,
                                          pagu: agregatPaguFromChild(k.paguKegiatan, subKegiatan),
                                          subKegiatan
                                   })
                            }
                            program.push({
                                   kode: p.kode,
                                   name: p.name,
                                   outcome: mapOutcome(p.outcome, getPeriode.periode.mulai),
                                   kegiatan
                            })
                     }
                     bidang.push({
                            kode: b.kode,
                            name: b.name,
                            program
                     });
              }
              result.push({
                     kode: u.kode,
                     name: u.kode,
                     bidang
              });
       }

       return { catatan: await getCatatan({ body: { skpd_periode_id, type: "renstra" } }), hasil: result }
}

const mappingIndikator = (indikator, start) => {
       const result = [];

       for (const ind of indikator) {
              result.push({
                     name: ind.name,
                     target: fillMissingYearsIndikator(ind.rincian, start)
              })
       }

       return result;
}

const fillMissingYearsIndikator = (indikator, start) => {
       const n = [1, 2, 3, 4, 5];
       const s = Number(start) - 1

       return n.map(item => {
              const f = indikator.find(i => i.tahun_ke === item);
              if (f) {
                     return {
                            tahun: f.tahun,
                            tahun_ke: f.tahun_ke,
                            target: f.target,
                            capaian: f.capaian,
                            persen: (f.capaian / f.target) * 100
                     }
              }
              else {
                     return {
                            tahun: s + item,
                            tahun_ke: item,
                            target: 0,
                            capaian: 0,
                            persen: 0
                     }
              }
       });

}

const fillMissingYearsPagu = (pagu, start) => {
       const n = [1, 2, 3, 4, 5];
       const s = Number(start) - 1;

       return n.map(item => {
              const f = pagu.find(i => i.tahun_ke === item);
              if (f) {
                     return {
                            tahun: f.tahun,
                            tahun_ke: f.tahun_ke,
                            pagu: f.pagu,
                            realisasi: f.realisasi,
                            persen: (f.realisasi / f.pagu) * 100

                     }
              } else {
                     return {
                            tahun: s + item,
                            tahun_ke: item,
                            pagu: 0,
                            realisasi: 0,
                            persen: 0
                     }
              }
       });
}

const toNum = (v) => parseFloat(v || 0);

const agregatPaguFromChild = (pagu, children, start) => {
       const n = [1, 2, 3, 4, 5];
       const s = Number(start) - 1;
       const pp = fillMissingYears(pagu);
       const paguC = children.map(item => (item.pagu))
       const data = { pagu: pp, paguChildren: paguC };

       return data.pagu.map((item) => {
              const tahun_ke = item.tahun_ke;
              const pagu = toNum(item.pagu);

              const realisasiTotal = data.paguChildren.reduce((sum, arr) => {
                     const c = arr.find((x) => x.tahun_ke === tahun_ke);
                     return sum + toNum(c?.realisasi);
              }, 0);

              const persen = pagu ? (realisasiTotal / pagu) * 100 : 0;

              return {
                     ...item,
                     pagu,
                     realisasi: realisasiTotal,
                     persen: Math.round(persen)
              };
       });


}

