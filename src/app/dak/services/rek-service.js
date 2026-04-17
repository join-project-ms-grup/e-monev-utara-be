import prisma from "../../../config/database.js"
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const listUrusan = async (req) => {
       const urusan = await prisma.dak_master.findMany({
              where: {
                     type: "urusan"
              },
              select: {
                     id: true,
                     kode: true,
                     name: true
              }
       });

       return urusan;

}

export const listBidang = async (req) => {
       const { urusan } = req.body;
       if (urusan) {
              return await prisma.dak_master.findMany({
                     where: { id: urusan, type: "urusan" },
                     select: {
                            id: true,
                            kode: true,
                            name: true,
                            children: {
                                   select: {
                                          id: true,
                                          parent_id: true,
                                          kode: true,
                                          name: true
                                   }

                            }
                     }
              })
       } else {
              return await prisma.dak_master.findMany({
                     where: { type: "urusan" },
                     select: {
                            id: true,
                            kode: true,
                            name: true,
                            children: {
                                   select: {
                                          id: true,
                                          parent_id: true,
                                          kode: true,
                                          name: true
                                   }

                            }
                     }
              })
       }
}

export const listProgram = async (req) => {
       const { urusan, bidang } = req.body;
       if (bidang) {
              return await prisma.dak_master.findMany({
                     where: { id: urusan, type: "urusan" },
                     select: {
                            id: true,
                            kode: true,
                            name: true,
                            children: {
                                   where: { id: bidang },
                                   select: {
                                          id: true,
                                          parent_id: true,
                                          kode: true,
                                          name: true,
                                          children: {
                                                 select: {
                                                        id: true,
                                                        parent_id: true,
                                                        kode: true,
                                                        name: true,
                                                 }
                                          }
                                   }

                            }
                     }
              })
       } else {
              return await prisma.dak_master.findMany({
                     where: { id: urusan, type: "urusan" },
                     select: {
                            id: true,
                            kode: true,
                            name: true,
                            children: {
                                   select: {
                                          id: true,
                                          parent_id: true,
                                          kode: true,
                                          name: true,
                                          children: {
                                                 select: {
                                                        id: true,
                                                        parent_id: true,
                                                        kode: true,
                                                        name: true,
                                                 }
                                          }
                                   }

                            }
                     }
              })
       }
}

export const listKegiatan = async (req) => {
       const { urusan, bidang, program } = req.body;
       if (program) {
              return await prisma.dak_master.findMany({
                     where: { id: urusan, type: "urusan" },
                     select: {
                            id: true,
                            kode: true,
                            name: true,
                            children: {
                                   where: { id: bidang },
                                   select: {
                                          id: true,
                                          parent_id: true,
                                          kode: true,
                                          name: true,
                                          children: {
                                                 where: { id: program },
                                                 select: {
                                                        id: true,
                                                        parent_id: true,
                                                        kode: true,
                                                        name: true,
                                                        children: {
                                                               select: {
                                                                      id: true,
                                                                      parent_id: true,
                                                                      kode: true,
                                                                      name: true,
                                                               }
                                                        }
                                                 }
                                          }
                                   }

                            }
                     }
              })
       } else {
              return await prisma.dak_master.findMany({
                     where: { id: urusan, type: "urusan" },
                     select: {
                            id: true,
                            kode: true,
                            name: true,
                            children: {
                                   where: { id: bidang },
                                   select: {
                                          id: true,
                                          parent_id: true,
                                          kode: true,
                                          name: true,
                                          children: {
                                                 select: {
                                                        id: true,
                                                        parent_id: true,
                                                        kode: true,
                                                        name: true,
                                                        children: {
                                                               select: {
                                                                      id: true,
                                                                      parent_id: true,
                                                                      kode: true,
                                                                      name: true,
                                                               }
                                                        }
                                                 }
                                          }
                                   }

                            }
                     }
              })
       }
}

export const listSub = async (req) => {
       const { urusan, bidang, program, kegiatan } = req.body;
       if (kegiatan) {
              return await prisma.dak_master.findMany({
                     where: { id: urusan, type: "urusan" },
                     select: {
                            id: true,
                            kode: true,
                            name: true,
                            children: {
                                   where: { id: bidang },
                                   select: {
                                          id: true,
                                          parent_id: true,
                                          kode: true,
                                          name: true,
                                          children: {
                                                 where: { id: program },
                                                 select: {
                                                        id: true,
                                                        parent_id: true,
                                                        kode: true,
                                                        name: true,
                                                        children: {
                                                               where: { id: kegiatan },
                                                               select: {
                                                                      id: true,
                                                                      parent_id: true,
                                                                      kode: true,
                                                                      name: true,
                                                                      children: {
                                                                             select: {
                                                                                    id: true,
                                                                                    parent_id: true,
                                                                                    kode: true,
                                                                                    name: true,
                                                                             }
                                                                      }
                                                               }
                                                        }
                                                 },
                                          }
                                   }

                            }
                     }
              })
       } else {
              return await prisma.dak_master.findMany({
                     where: { id: urusan, type: "urusan" },
                     select: {
                            id: true,
                            kode: true,
                            name: true,
                            children: {
                                   where: { id: bidang },
                                   select: {
                                          id: true,
                                          parent_id: true,
                                          kode: true,
                                          name: true,
                                          children: {
                                                 where: { id: program },
                                                 select: {
                                                        id: true,
                                                        parent_id: true,
                                                        kode: true,
                                                        name: true,
                                                        children: {
                                                               select: {
                                                                      id: true,
                                                                      parent_id: true,
                                                                      kode: true,
                                                                      name: true,
                                                                      children: {
                                                                             select: {
                                                                                    id: true,
                                                                                    parent_id: true,
                                                                                    kode: true,
                                                                                    name: true
                                                                             },
                                                                      }
                                                               },
                                                        }
                                                 },
                                          }
                                   }

                            }
                     }
              })
       }
}

export const listAll = async (req) => {
       return await prisma.dak_master.findMany({
              where: { type: "urusan" },
              select: {
                     id: true,
                     kode: true,
                     name: true,
                     children: {
                            select: {
                                   id: true,
                                   parent_id: true,
                                   kode: true,
                                   name: true,
                                   children: {
                                          select: {
                                                 id: true,
                                                 parent_id: true,
                                                 kode: true,
                                                 name: true,
                                                 children: {
                                                        select: {
                                                               id: true,
                                                               parent_id: true,
                                                               kode: true,
                                                               name: true,
                                                               children: {
                                                                      select: {
                                                                             id: true,
                                                                             parent_id: true,
                                                                             kode: true,
                                                                             name: true,
                                                                      }
                                                               }
                                                        }
                                                 }
                                          },
                                   }
                            }

                     }
              }
       })
}

export const addRek = async (req) => {
       const { type, parent_id, name, kode } = req.body;

       // mapping tipe parent yang diharapkan
       const validParent = {
              urusan: null,
              bidang: 'urusan',
              program: 'bidang',
              kegiatan: 'program',
              subKegiatan: 'kegiatan',
       };

       // --- 1️⃣ Validasi struktur parent_id ---
       const expectedParentType = validParent[type];
       if (expectedParentType === undefined) {
              throw new errorHandling(400, `Tipe '${type}' tidak dikenali.`);
       }

       // --- 2️⃣ Urusan tidak boleh punya parent ---
       if (expectedParentType === null && parent_id !== null) {
              throw new errorHandling(400, `Tipe '${type}' tidak boleh memiliki parent_id.`);
       }

       // --- 3️⃣ Selain urusan harus punya parent_id ---
       if (expectedParentType !== null && parent_id === null) {
              throw new errorHandling(400, `Tipe '${type}' wajib memiliki parent_id.`);
       }

       // --- 4️⃣ Cek apakah parent_id valid ---
       if (parent_id !== null) {
              const parent = await prisma.dak_master.findUnique({ where: { id: parent_id } });

              if (!parent) {
                     throw new errorHandling(400, `Parent dengan id ${parent_id} tidak ditemukan.`);
              }

              if (parent.type !== expectedParentType) {
                     throw new errorHandling(400, `Parent bertipe '${parent.type}' tidak valid untuk anak bertipe '${type}'. Seharusnya '${expectedParentType}'.`);
              }
       }

       // --- 5️⃣ Tambahkan data jika valid ---
       const newData = await prisma.dak_master.create({
              data: {
                     type,
                     parent_id,
                     name,
                     kode,
              },
       });

       return newData

}

export const updateRek = async (req) => {
       const { id, name, kode, status } = req.body;
       const exist = await prisma.dak_master.findUnique({ where: { id } });

       if (!exist) {
              throw new errorHandling(404, "Data rekening tidak ditemukan");
       }

       const update = await prisma.dak_master.update({
              where: { id },
              data: { name, kode, status }
       });
       return update
}