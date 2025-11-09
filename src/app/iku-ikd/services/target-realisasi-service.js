import prisma from "../../../config/database.js"
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const listTarget = async (req) => {
       const { skpd_id, periodeId } = req.body;

       const where = {
              periode_id: parseInt(periodeId),
              ...(skpd_id !== "all" && { skpd_id: parseInt(skpd_id) }), // hanya ditambahkan kalau bukan "all"
       };

       const getAllData = await prisma.w_skpd_periode.findMany({
              where,
              select: {
                     skpd: {
                            select: {
                                   name: true,
                            },
                     },
                     wMasters: {
                            select: {
                                   name: true,
                                   kode: true,
                                   uraian: {
                                          select: {
                                                 id: true,
                                                 name: true,
                                                 satuan: true,
                                                 base_line: true,
                                                 perhitungan: true,
                                                 is_iku: true,
                                                 target: true,
                                          },
                                   },
                            },
                     },
              },
       });

       return mapName(getAllData);


};

export const listTargetIKU = async (req) => {
       const { skpd_id, periodeId } = req.body;

       if (skpd_id === "all") {
              const getAllData = await prisma.w_skpd_periode.findMany({
                     where: {
                            periode_id: parseInt(periodeId),
                            wMasters: {
                                   some: { uraian: { some: { is_iku: true } } }
                            }
                     },
                     select: {
                            skpd: {
                                   select: {
                                          name: true,
                                   },
                            },
                            wMasters: {
                                   where: { uraian: { some: { is_iku: true } } },
                                   select: {
                                          name: true,
                                          kode: true,
                                          uraian: {
                                                 where: { is_iku: true },
                                                 select: {
                                                        id: true,
                                                        name: true,
                                                        satuan: true,
                                                        base_line: true,
                                                        perhitungan: true,
                                                        is_iku: true,
                                                        target: true
                                                 }

                                          }
                                   }
                            }
                     }
              });
              return mapName(getAllData)
       } else {
              const getAllData = await prisma.w_skpd_periode.findMany({
                     where: {
                            periode_id: parseInt(periodeId),
                            skpd_id: parseInt(skpd_id),
                            wMasters: {
                                   some: { uraian: { some: { is_iku: true } } }
                            }
                     },
                     select: {
                            skpd: {
                                   select: {
                                          name: true,
                                   },
                            },
                            wMasters: {
                                   where: { uraian: { some: { is_iku: true } } },
                                   select: {
                                          name: true,
                                          kode: true,
                                          uraian: {
                                                 where: { is_iku: true },
                                                 select: {
                                                        id: true,
                                                        name: true,
                                                        satuan: true,
                                                        base_line: true,
                                                        perhitungan: true,
                                                        is_iku: true,
                                                        target: true
                                                 }
                                          }

                                   }
                            }
                     }
              });
              return mapName(getAllData);
       }
}

export const listTargetIKD = async (req) => {
       const { skpd_id, periodeId } = req.body;
       if (skpd_id === "all") {
              const getAllData = await prisma.w_skpd_periode.findMany({
                     where: {
                            periode_id: parseInt(periodeId),
                            wMasters: {
                                   some: { uraian: { some: { is_iku: false } } }
                            }
                     },
                     select: {
                            skpd: {
                                   select: {
                                          name: true,
                                   },
                            },
                            wMasters: {
                                   where: { uraian: { some: { is_iku: false } } },
                                   select: {
                                          name: true,
                                          kode: true,
                                          uraian: {
                                                 where: { is_iku: false },
                                                 select: {
                                                        id: true,
                                                        name: true,
                                                        satuan: true,
                                                        base_line: true,
                                                        perhitungan: true,
                                                        is_iku: true,
                                                        target: true
                                                 }

                                          }
                                   }
                            }
                     }
              });
              return mapName(getAllData)
       } else {
              const getAllData = await prisma.w_skpd_periode.findMany({
                     where: {
                            periode_id: parseInt(periodeId),
                            skpd_id: parseInt(skpd_id),
                            wMasters: {
                                   some: { uraian: { some: { is_iku: false } } }
                            }
                     },
                     select: {
                            skpd: {
                                   select: {
                                          name: true,
                                   },
                            },
                            wMasters: {
                                   where: { uraian: { some: { is_iku: false } } },
                                   select: {
                                          name: true,
                                          kode: true,
                                          uraian: {
                                                 where: { is_iku: false },
                                                 select: {
                                                        id: true,
                                                        name: true,
                                                        satuan: true,
                                                        base_line: true,
                                                        is_iku: true,
                                                        perhitungan: true,
                                                        target: true
                                                 }
                                          }

                                   }
                            }
                     }
              });
              return mapName(getAllData);
       }
}



export const IKUtoggleIKD = async (req) => {
       const id = parseInt(req.params.id);
       const exist = await prisma.w_uraian.findUnique({ where: { id } });
       if (!exist) throw new errorHandling(404, "Data uraian tidak ditemukan");

       await prisma.w_uraian.update({
              where: { id },
              data: { is_iku: !exist.is_iku }
       });

       return null

}

export const setRealisasi = async (req) => {
       const { id_target, realisasi } = req.body;
       await prisma.w_targetRealisasiUraian.update({
              where: { id: parseInt(id_target) },
              data: {
                     realisasi: parseFloat(realisasi)
              }
       });
       return null
}

export const getHasilIKUIKD = async (req) => {
       const { type, skpd_id, periodeId } = req.body;
       if (type === "iku") {
              const dataIKu = await listTargetIKU({ body: { skpd_id, periodeId } });
              return mappingFormatHasil(dataIKu);
       } else {
              const dataIKD = await listTargetIKD({ body: { skpd_id, periodeId } });
              return mappingFormatHasil(dataIKD);
       }
}

const mappingFormatHasil = (data) => {
       const result = [];
       for (const skpd of data) {
              const urusan = [];
              for (const ur of skpd.wMasters) {
                     const uraian = [];
                     for (const urai of ur.uraian) {
                            const target_realisasi = [];
                            for (const t of urai.target) {
                                   const target = t.target;
                                   const capaian = t.realisasi || 0;
                                   const persetase = calculateAchievementPercentage(target, capaian, urai.perhitungan);
                                   target_realisasi.push({
                                          tahun: t.tahun,
                                          tahun_ke: t.tahun_ke,
                                          target,
                                          capaian,
                                          persetase
                                   });
                            }
                            uraian.push({
                                   name: urai.name,
                                   satuan: urai.satuan,
                                   base_line: urai.base_line,
                                   target_realisasi
                            })
                     }
                     urusan.push({
                            kode: ur.kode,
                            name: ur.name,
                            uraian
                     })
              }
              result.push({
                     pd: skpd.name,
                     urusan
              })
       }
       return result;
}

// utils/achievement.js
export function calculateAchievementPercentage(targetStr, capaian, perhitungan = 'standar') {
       if (!targetStr || capaian == null) return null;

       const normalized = targetStr.replace(",", ".");
       const capaianVal = parseFloat(String(capaian).replace(",", "."));
       if (isNaN(capaianVal)) return null;

       let targetValue;

       // Jika target adalah rentang, gunakan nilai tengahnya
       if (normalized.includes("-")) {
              const [min, max] = normalized.split("-").map(parseFloat);
              if (isNaN(min) || isNaN(max)) return null;
              targetValue = (min + max) / 2;
       } else {
              targetValue = parseFloat(normalized);
              if (isNaN(targetValue)) return null;
       }

       let percentage;

       switch (perhitungan.toLowerCase()) {
              case 'akumulatif':
              case 'naik':
                     // Makin tinggi capaian makin bagus
                     percentage = (capaianVal / targetValue) * 100;
                     break;

              case 'turun':
              case 'menurun':
                     // Makin rendah capaian makin bagus (misal angka kemiskinan)
                     percentage = (targetValue / capaianVal) * 100;
                     break;

              case 'standar':
              default:
                     percentage = (capaianVal / targetValue) * 100;
                     break;
       }

       return Number(percentage.toFixed(2));
}


const mapName = (data) => {
       const result = [];
       for (const ik of data) {
              result.push({
                     name: ik.skpd.name,
                     wMasters: ik.wMasters
              })
       }

       return result;
}