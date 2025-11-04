import prisma from "../config/database.js";


export const listLaporanTahunan = async (req) => {
       const skpd_periode_id = Number(req.params.skpdPeriodeId);
       const tahun_ke = Number(req.params.tahunKe);
       // 1) Ambil semua pagu indikatif
       const getMaster = await prisma.master.findMany({
              where: {
                     type: 'program',
                     status: true,
                     pagu: { some: { skpd_periode_id } },
                     indikator: { some: { skpd_periode_id } }
              },
              include: {
                     parent: { include: { parent: true } }, //ambil urusan dan bidang
                     pagu: {
                            where: { skpd_periode_id }
                     },
                     indikator: {
                            include: {
                                   rincian: {
                                          include: { capaian: true }
                                   }
                            }
                     },
                     children: { // ambil kegiatan
                            where: {
                                   pagu: { some: { skpd_periode_id } }
                            },
                            include: {
                                   pagu: {
                                          where: { skpd_periode_id }
                                   },
                                   indikator: {
                                          include: {
                                                 rincian: {
                                                        include: { capaian: true }
                                                 }
                                          }
                                   },
                                   children: {
                                          where: {
                                                 pagu: { some: { skpd_periode_id } }
                                          },
                                          include: {
                                                 pagu: {
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
                            subKegiatan.push({
                                   id: sk.id,
                                   parent: sk.parent_id,
                                   kode: sk.kode,
                                   name: sk.name,
                                   type: 'sub_kegiatan',
                                   indikator: mappingIndikatorTahunan(sk.indikator, tahun_ke),
                                   pagu: mappingPaguTahunan(sk.pagu, tahun_ke)
                            });
                     }
                     if (subKegiatan.length === 0) continue;
                     kegiatan.push({
                            id: k.id,
                            parent: k.parent_id,
                            kode: k.kode,
                            name: k.name,
                            type: 'kegiatan',
                            // indikator: mappingIndikatorTahunan(k.indikator, tahun_ke),
                            pagu: aggregatePaguFromChildrenTahunan(k.pagu, subKegiatan, tahun_ke),
                            subKegiatan
                     });
              }
              const program = {
                     id: p.id,
                     parent: p.parent_id,
                     kode: p.kode,
                     name: p.name,
                     type: 'program',
                     indikator: mappingIndikatorTahunan(p.indikator, tahun_ke),
                     pagu: aggregatePaguFromChildrenTahunan(p.pagu, kegiatan, tahun_ke),
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


const mappingPaguTahunan = (pagu, tahun_ke) => {
       const filterPaguTahunEval = pagu.find(p => p.tahun_ke === tahun_ke);
       const paguTahunEval = filterPaguTahunEval ? Number(filterPaguTahunEval.pagu) : 0
       const totalPaguPeriode = pagu.reduce((sum, item) => sum + (Number(item.pagu) || 0), 0);

       const totalRealisasi = filterPaguTahunEval?.realisasi?.reduce(
              (sum, item) => sum + (Number(item.realisasi) || 0),
              0
       ) || 0;

       const totalRealisasiPeriode = pagu.reduce((sum, rincian) => {
              const realisasiTahun = rincian.realisasi?.reduce(
                     (subSum, item) => subSum + (Number(item.realisasi) || 0),
                     0
              ) || 0;
              return sum + realisasiTahun;
       }, 0);

       return {
              paguPeriode: totalPaguPeriode,
              paguTahunEval,
              triwulan: [
                     {
                            triwulan: 1,
                            realisasi: filterPaguTahunEval ? filterPaguTahunEval.realisasi.find(c => c.triwulan === 1)?.realisasi || 0 : 0
                     },
                     {
                            triwulan: 2,
                            realisasi: filterPaguTahunEval ? filterPaguTahunEval.realisasi.find(c => c.triwulan === 2)?.realisasi || 0 : 0
                     },
                     {
                            triwulan: 3,
                            realisasi: filterPaguTahunEval ? filterPaguTahunEval.realisasi.find(c => c.triwulan === 3)?.realisasi || 0 : 0
                     },
                     {
                            triwulan: 4,
                            realisasi: filterPaguTahunEval ? filterPaguTahunEval.realisasi.find(c => c.triwulan === 4)?.realisasi || 0 : 0
                     },
              ],
              totalRealisasi,
              persenRealisasi: totalRealisasi !== 0 ? ((totalRealisasi / paguTahunEval) * 100).toFixed(2) : 0,
              totalRealisasiPeriode,
              persenRealisasiPeriode: totalRealisasiPeriode !== 0 ? ((totalRealisasiPeriode / totalPaguPeriode) * 100).toFixed(2) : 0
       }
}

const aggregatePaguFromChildrenTahunan = (selfPagu, subKegiatanList, tahun_ke) => {
       // Ambil data target dari kegiatan itu sendiri
       const filterSelfPagu = selfPagu?.find(p => p.tahun_ke === tahun_ke);
       const paguTahunEvalSelf = filterSelfPagu ? Number(filterSelfPagu.pagu) : 0;
       const totalPaguPeriodeSelf = selfPagu?.reduce((sum, item) => sum + (Number(item.pagu) || 0), 0) || 0;

       // Siapkan variabel akumulasi
       let paguPeriode = totalPaguPeriodeSelf;
       let paguTahunEval = paguTahunEvalSelf;
       let totalRealisasiPeriode = 0;
       let totalRealisasi = 0;

       // Inisialisasi triwulan
       const triwulanTotals = [1, 2, 3, 4].map((t) => ({
              triwulan: t,
              realisasi: 0
       }));

       // Loop subkegiatan
       for (const sk of subKegiatanList) {
              if (!sk.pagu) continue;

              // akumulasi realisasi total
              totalRealisasi += sk.pagu.totalRealisasi || 0;
              totalRealisasiPeriode += sk.pagu.totalRealisasiPeriode || 0;

              // akumulasi realisasi triwulan
              for (const t of triwulanTotals) {
                     const findTriwulan = sk.pagu.triwulan.find(tr => tr.triwulan === t.triwulan);
                     t.realisasi += findTriwulan ? Number(findTriwulan.realisasi || 0) : 0;
              }
       }

       // Gabungkan target kegiatan dengan realisasi subkegiatan
       return {
              paguPeriode,
              paguTahunEval,
              triwulan: triwulanTotals,
              totalRealisasi,
              persenRealisasi: totalRealisasi !== 0 ? ((totalRealisasi / paguTahunEval) * 100).toFixed(2) : 0,
              totalRealisasiPeriode,
              persenRealisasiPeriode: totalRealisasiPeriode !== 0 ? ((totalRealisasiPeriode / paguPeriode) * 100).toFixed(2) : 0
       };
}

const mappingIndikatorTahunan = (indicators, tahun_ke) => {
       const result = [];
       for (const ind of indicators) {
              const rincianFiltered = ind.rincian.find(r => r.tahun_ke === tahun_ke);

              const totalTargetPeriode = ind.rincian.reduce(
                     (sum, item) => sum + (item.target || 0),
                     0
              );

              const targetTahunEvaluasi = rincianFiltered?.target ?? 0;
              const totalCapaian = rincianFiltered?.capaian?.reduce(
                     (sum, item) => sum + (item.capaian || 0),
                     0
              ) || 0;

              // total capaian untuk seluruh periode (tahun 1–5)
              const totalCapaianPeriode = ind.rincian.reduce((sum, rincian) => {
                     const capaianTahun = rincian.capaian?.reduce(
                            (subSum, item) => subSum + (item.capaian || 0),
                            0
                     ) || 0;
                     return sum + capaianTahun;
              }, 0);

              result.push({
                     id: ind.id,
                     kode: ind.kode,
                     name: ind.name,
                     satuan: ind.satuan,
                     target_akhir_periode: totalTargetPeriode,
                     target_tahun_dievaluasi: targetTahunEvaluasi,
                     triwulan: [
                            {
                                   triwulan: 1,
                                   capaian: rincianFiltered ? rincianFiltered.capaian.find(c => c.triwulan === 1)?.capaian || 0 : 0
                            },
                            {
                                   triwulan: 2,
                                   capaian: rincianFiltered ? rincianFiltered.capaian.find(c => c.triwulan === 2)?.capaian || 0 : 0
                            },
                            {
                                   triwulan: 3,
                                   capaian: rincianFiltered ? rincianFiltered.capaian.find(c => c.triwulan === 3)?.capaian || 0 : 0
                            },
                            {
                                   triwulan: 4,
                                   capaian: rincianFiltered ? rincianFiltered.capaian.find(c => c.triwulan === 4)?.capaian || 0 : 0
                            },
                     ],
                     total_capaian: totalCapaian,
                     persen_capaian: totalCapaian != 0 && totalCapaian !== null ? ((totalCapaian / targetTahunEvaluasi) * 100).toFixed(2) : 0,
                     total_capaian_periode: totalCapaianPeriode,
                     persen_capaian_periode: totalCapaianPeriode != 0 && totalCapaianPeriode !== null ? ((totalCapaianPeriode / totalTargetPeriode) * 100).toFixed(2) : 0,
              });
       }
       return result;
}

export const listLaporan = async (req) => {
       const skpd_periode_id = Number(req.params.skpdPeriodeId);
       // 1) Ambil semua pagu indikatif
       const getMaster = await prisma.master.findMany({
              where: {
                     type: 'program',
                     status: true,
                     pagu: { some: { skpd_periode_id } },
                     indikator: { some: { skpd_periode_id } }
              },
              include: {
                     parent: { include: { parent: true } }, //ambil urusan dan bidang
                     pagu: {
                            where: { skpd_periode_id }
                     },
                     indikator: {
                            include: {
                                   rincian: {
                                          include: { capaian: true }
                                   }
                            }
                     },
                     children: { // ambil kegiatan
                            where: {
                                   pagu: {
                                          some: { skpd_periode_id }
                                   }
                            },
                            include: {
                                   pagu: {
                                          where: { skpd_periode_id }
                                   },
                                   indikator: {
                                          include: {
                                                 rincian: {
                                                        include: { capaian: true }
                                                 }
                                          }
                                   },
                                   children: {
                                          where: {
                                                 pagu: {
                                                        some: { skpd_periode_id }
                                                 }
                                          },
                                          include: {
                                                 pagu: {
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
                                   pagu: mappingPagu(sk.pagu)
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
                            pagu: aggregatePaguFromChildren(k.pagu, subKegiatan),
                            subKegiatan
                     });
              }
              const program = {
                     id: p.id,
                     parent: p.parent_id,
                     kode: p.kode,
                     name: p.name,
                     type: 'program',
                     indikator: mappingIndikator(p.indikator),
                     pagu: aggregatePaguFromChildren(p.pagu, kegiatan),
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

