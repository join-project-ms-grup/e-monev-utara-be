import prisma from "../../../config/database.js"
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const listTarget = async (req) => {
       const { skpd_id, periodeId } = req.body;
       if (skpd_id === "all") {
              const getAllData = await prisma.w_skpd.findMany({
                     where: { periodeId: parseInt(periodeId) },
                     select: {
                            name: true,
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
                                                        is_iku: true,
                                                        target: true
                                                 }

                                          }
                                   }
                            }
                     }
              });
              return getAllData
       } else {
              const getAllData = await prisma.w_skpd.findMany({
                     where: { periodeId: parseInt(periodeId), id: parseInt(skpd_id) },
                     select: {
                            name: true,
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
                                                        is_iku: true,
                                                        target: true
                                                 }

                                          }
                                   }
                            }
                     }
              });
              return getAllData;
       }
}

export const listTargetIKU = async (req) => {
       const { skpd_id, periodeId } = req.body;
       if (skpd_id === "all") {
              const getAllData = await prisma.w_skpd.findMany({
                     where: {
                            periodeId: parseInt(periodeId),
                            wMasters: {
                                   some: { uraian: { some: { is_iku: true } } }
                            }
                     },
                     select: {
                            name: true,
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
                                                        is_iku: true,
                                                        target: true
                                                 }

                                          }
                                   }
                            }
                     }
              });
              return getAllData
       } else {
              const getAllData = await prisma.w_skpd.findMany({
                     where: {
                            periodeId: parseInt(periodeId),
                            id: parseInt(skpd_id),
                            wMasters: {
                                   some: { uraian: { some: { is_iku: true } } }
                            }
                     },
                     select: {
                            name: true,
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
                                                        is_iku: true,
                                                        target: true
                                                 }
                                          }

                                   }
                            }
                     }
              });
              return getAllData;
       }
}

export const listTargetIKD = async (req) => {
       const { skpd_id, periodeId } = req.body;
       if (skpd_id === "all") {
              const getAllData = await prisma.w_skpd.findMany({
                     where: {
                            periodeId: parseInt(periodeId),
                            wMasters: {
                                   some: { uraian: { some: { is_iku: false } } }
                            }
                     },
                     select: {
                            name: true,
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
                                                        target: true
                                                 }

                                          }
                                   }
                            }
                     }
              });
              return getAllData
       } else {
              const getAllData = await prisma.w_skpd.findMany({
                     where: {
                            periodeId: parseInt(periodeId),
                            id: parseInt(skpd_id),
                            wMasters: {
                                   some: { uraian: { some: { is_iku: false } } }
                            }
                     },
                     select: {
                            name: true,
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
                                                        target: true
                                                 }
                                          }

                                   }
                            }
                     }
              });
              return getAllData;
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

}