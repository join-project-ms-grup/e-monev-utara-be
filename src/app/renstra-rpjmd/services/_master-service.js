import { errorHandling } from "../../../middlewares/erros-handling.js";
import prisma from "../../../config/database.js";

export const addMaster = async (req) => {
       const { kode, name, type, parent } = req.body;

       if (type !== 'urusan' && !parent) {
              throw new errorHandling(400, false, "Parent is required for type other than 'urusan'");
       }

       if (type !== 'urusan') {
              const parentRecord = await prisma.x_master.findUnique({
                     where: { id: parent },
              });
              if (!parentRecord) {
                     throw new errorHandling(404, "Parent record not found");
              }
       }

       const newMaster = await prisma.x_master.create({
              data: {
                     kode,
                     name,
                     type,
                     parent_id: parent || null
              }
       });

       await prisma.x_logMaster.create({
              data: {
                     action: `add`,
                     userId: req.user.id, // Assuming req.user contains authenticated user info
                     entity: type,
                     entityId: newMaster.id,
                     oldValue: null,
                     newValue: JSON.stringify(newMaster)
              }

       });

       return newMaster;
}

export const updateMaster = async (req) => {
       const { id } = req.params;
       const { kode, name, type, parent } = req.body;

       const existingMaster = await prisma.x_master.findUnique({
              where: { id: parseInt(id) },
       });

       if (!existingMaster) {
              throw new errorHandling(404, "Master record not found");
       }
       if (type !== 'urusan' && !parent) {
              throw new errorHandling(400, false, "Parent is required for type other than 'urusan'");
       }

       if (type !== 'urusan') {
              const parentRecord = await prisma.x_master.findUnique({
                     where: { id: parent },
              });
              if (!parentRecord) {
                     throw new errorHandling(404, "Parent record not found");
              }
       }

       const updatedMaster = await prisma.x_master.update({
              where: { id: parseInt(id) },
              data: {
                     kode,
                     name,
                     type,
                     parent_id: parent || null
              }
       });

       await prisma.x_logMaster.create({
              data: {
                     action: `update`,
                     userId: req.user.id, // Assuming req.user contains authenticated user info
                     entity: type,
                     entityId: existingMaster.id,
                     oldValue: JSON.stringify(existingMaster),
                     newValue: JSON.stringify(updatedMaster)
              }

       });

       return updatedMaster;
}

export const updateMasterById = async (id, data) => {
       const existingMaster = await prisma.x_master.findUnique({
              where: { id: parseInt(id) },
       });

       if (!existingMaster) {
              throw new errorHandling(404, "Master record not found");
       }

       const updatedMaster = await prisma.x_master.update({
              where: { id: parseInt(id) },
              data: data
       });

       await prisma.x_logMaster.create({
              data: {
                     action: `update`,
                     userId: 1, // Assuming req.user contains authenticated user info
                     entity: existingMaster.type,
                     entityId: existingMaster.id,
                     oldValue: JSON.stringify(existingMaster),
                     newValue: JSON.stringify(updatedMaster)
              }

       });

       return updatedMaster;
}

export const getListUrusan = async () => {
       return await prisma.x_master.findMany({
              where: { type: 'urusan' },
              select: {
                     id: true,
                     kode: true,
                     name: true
              },
              orderBy: { kode: 'asc' },
       });
}

export const getListChildren = async (req) => {
       return await prisma.x_master.findMany({
              where: { parent_id: parseInt(req.params.parentId) },
              select: {
                     id: true,
                     kode: true,
                     name: true,
                     type: true,
                     parent_id: true
              },
              orderBy: { kode: 'asc' }
       });
}

export const getAllMaster = async () => {
       const data = await prisma.x_master.findMany({
              where: { type: "urusan" },
              include: {
                     children: {
                            orderBy: { kode: "asc" },
                            include: {
                                   children: {
                                          orderBy: { kode: "asc" },
                                          include: {
                                                 children: {
                                                        orderBy: { kode: "asc" },
                                                        include: {
                                                               children: {
                                                                      orderBy: { kode: "asc" },
                                                               },
                                                        },
                                                 },
                                          },
                                   },
                            },
                     },
              },
              orderBy: { kode: "asc" },
       });

       const mapNode = (node, level = 0) => {
              const base = {
                     id: node.id,
                     kode: node.kode,
                     name: node.name,
              };

              switch (level) {
                     case 0: // urusan
                            return { ...base, bidang: node.children?.map(c => mapNode(c, 1)) || [] };
                     case 1: // bidang
                            return { ...base, program: node.children?.map(c => mapNode(c, 2)) || [] };
                     case 2: // program
                            return { ...base, kegiatan: node.children?.map(c => mapNode(c, 3)) || [] };
                     case 3: // kegiatan
                            return { ...base, subKegiatan: node.children?.map(c => mapNode(c, 4)) || [] };
                     default: // subKegiatan (level 4)
                            return base;
              }
       };

       const result = data.map((urusan) => mapNode(urusan, 0));

       return result;
};

/**
 * Flexible service that works with your single 'master' Prisma model (self-relation).
 * Accepts multiple call shapes:
 *  - getHierarchyByType(req)           // req.body = { type, id_urusan?, ... }
 *  - getHierarchyByType(type, filter)
 *  - getHierarchyByType(filter, type)
 */
export const getHierarchyByType = async (arg1, arg2 = {}) => {
       // ===== normalize input =====
       let type;
       let rawFilter = {};

       // case: express req passed
       if (arg1 && typeof arg1 === "object" && arg1.body) {
              const body = arg1.body || {};
              type = body.type || (typeof arg2 === "string" ? arg2 : undefined);
              rawFilter = { ...body };
              delete rawFilter.type;
       } else if (typeof arg1 === "string") {
              // getHierarchyByType("program", { id_urusan: 1 })
              type = arg1;
              rawFilter = arg2 || {};
       } else if (typeof arg1 === "object" && arg1 !== null) {
              // getHierarchyByType({ id_bidang: 2 }, "program")
              if (typeof arg2 === "string") {
                     rawFilter = arg1;
                     type = arg2;
              } else {
                     // getHierarchyByType({ type: "program", id_bidang: 2 })
                     type = arg1.type;
                     rawFilter = { ...arg1 };
                     delete rawFilter.type;
              }
       }

       // sanitize numeric filters
       const filter = {
              id_urusan: rawFilter.id_urusan ? Number(rawFilter.id_urusan) : undefined,
              id_bidang: rawFilter.id_bidang ? Number(rawFilter.id_bidang) : undefined,
              id_program: rawFilter.id_program ? Number(rawFilter.id_program) : undefined,
              id_kegiatan: rawFilter.id_kegiatan ? Number(rawFilter.id_kegiatan) : undefined,
       };

       // helper safe getters
       const safe = v => (v === undefined ? null : v);

       // ===== core logic per level (always use prisma.x_master) =====
       if (!type) return { message: "Parameter 'type' wajib diisi (urusan|bidang|program|kegiatan|subKegiatan)" };

       // ---------- URUSAN ----------
       if (type === "urusan") {
              const urusans = await prisma.x_master.findMany({
                     where: { type: "urusan" },
                     orderBy: { kode: "asc" },
              });

              return urusans.map(u => ({
                     kode: u.kode,
                     name: u.name,
                     id: u.id
              }));
       }

       // ---------- BIDANG ----------
       if (type === "bidang") {
              // filter by id_urusan -> get one urusan and its bidang children
              if (filter.id_urusan) {
                     const urusan = await prisma.x_master.findUnique({
                            where: { id: filter.id_urusan },
                            include: { children: { orderBy: { kode: "asc" } } }
                     });
                     if (!urusan) return { message: "Urusan tidak ditemukan", data: [] };

                     return {
                            kode: urusan.kode,
                            name: urusan.name,
                            id: urusan.id,
                            bidang: urusan.children.map(b => ({
                                   kode: b.kode,
                                   name: b.name,
                                   id: b.id
                            }))
                     };
              }

              // filter by id_bidang -> return that bidang + parent urusan
              if (filter.id_bidang) {
                     const bidang = await prisma.x_master.findUnique({
                            where: { id: filter.id_bidang },
                            include: { parent: true }
                     });
                     if (!bidang) return { message: "Bidang tidak ditemukan", data: null };

                     return {
                            kode: bidang.parent?.kode ?? null,
                            name: bidang.parent?.name ?? null,
                            id: bidang.parent?.id ?? null,
                            bidang: [{
                                   kode: bidang.kode,
                                   name: bidang.name,
                                   id: bidang.id
                            }]
                     };
              }

              // default: all urusan + bidang
              const semuaUrusan = await prisma.x_master.findMany({
                     where: { type: "urusan" },
                     orderBy: { kode: "asc" },
                     include: { children: { orderBy: { kode: "asc" } } }
              });

              return semuaUrusan.map(u => ({
                     kode: u.kode,
                     name: u.name,
                     id: u.id,
                     bidang: u.children.map(b => ({
                            kode: b.kode,
                            name: b.name,
                            id: b.id
                     }))
              }));
       }

       // ---------- PROGRAM ----------
       if (type === "program") {
              // case: filter by bidang (direct parent)
              if (filter.id_bidang) {
                     const bidang = await prisma.x_master.findUnique({
                            where: { id: filter.id_bidang },
                            include: { parent: true, children: { orderBy: { kode: "asc" } } }
                     });
                     if (!bidang) return { message: "Bidang tidak ditemukan", data: null };

                     return {
                            kode: bidang.parent?.kode ?? null,
                            name: bidang.parent?.name ?? null,
                            id: bidang.parent?.id ?? null,
                            bidang: [{
                                   kode: bidang.kode,
                                   name: bidang.name,
                                   id: bidang.id,
                            }],
                            program: bidang.children.map(p => ({
                                   kode: p.kode,
                                   name: p.name,
                                   id: p.id
                            }))
                     };
              }

              // case: filter by urusan (all bidang under urusan + their programs)
              if (filter.id_urusan) {
                     const urusan = await prisma.x_master.findUnique({
                            where: { id: filter.id_urusan },
                            include: {
                                   children: {
                                          orderBy: { kode: "asc" },
                                          include: { children: { orderBy: { kode: "asc" } } } // bidang -> program
                                   }
                            }
                     });
                     if (!urusan) return { message: "Urusan tidak ditemukan", data: null };

                     return {
                            kode: urusan.kode,
                            name: urusan.name,
                            id: urusan.id,
                            bidang: urusan.children.map(b => ({
                                   kode: b.kode,
                                   name: b.name,
                                   id: b.id,
                                   program: b.children.map(p => ({
                                          kode: p.kode,
                                          name: p.name,
                                          id: p.id
                                   }))
                            }))
                     };
              }

              // default: all urusan -> bidang -> program
              const semua = await prisma.x_master.findMany({
                     where: { type: "urusan" },
                     orderBy: { kode: "asc" },
                     include: {
                            children: {
                                   orderBy: { kode: "asc" },
                                   include: { children: { orderBy: { kode: "asc" } } } // bidang -> program
                            }
                     }
              });

              return semua.map(u => ({
                     kode: u.kode,
                     name: u.name,
                     id: u.id,
                     bidang: u.children.map(b => ({
                            kode: b.kode,
                            name: b.name,
                            id: b.id,
                            program: b.children.map(p => ({
                                   kode: p.kode,
                                   name: p.name,
                                   id: p.id
                            }))
                     }))
              }));
       }

       // ---------- KEGIATAN ----------
       if (type === "kegiatan") {
              // filter by program
              if (filter.id_program) {
                     const program = await prisma.x_master.findUnique({
                            where: { id: filter.id_program },
                            include: {
                                   parent: { include: { parent: true } }, // program.parent = bidang; bidang.parent = urusan
                                   children: { orderBy: { kode: "asc" } } // kegiatan
                            }
                     });
                     if (!program) return { message: "Program tidak ditemukan", data: null };

                     return {
                            kode: program.parent?.parent?.kode ?? null,
                            name: program.parent?.parent?.name ?? null,
                            id: program.parent?.parent?.id ?? null,
                            bidang: [{
                                   kode: program.parent?.kode ?? null,
                                   name: program.parent?.name ?? null,
                                   id: program.parent?.id ?? null,
                                   program: [{
                                          kode: program.kode,
                                          name: program.name,
                                          id: program.id,
                                          kegiatan: program.children.map(k => ({
                                                 kode: k.kode,
                                                 name: k.name,
                                                 id: k.id
                                          }))
                                   }]
                            }],
                     };
              }

              // filter by bidang -> get bidang -> programs -> kegiatan
              if (filter.id_bidang) {
                     const bidang = await prisma.x_master.findUnique({
                            where: { id: filter.id_bidang },
                            include: {
                                   parent: true,
                                   children: {
                                          orderBy: { kode: "asc" },
                                          include: { children: { orderBy: { kode: "asc" } } } // program -> kegiatan
                                   }
                            }
                     });
                     if (!bidang) return { message: "Bidang tidak ditemukan", data: null };

                     return {
                            kode: bidang.parent?.kode ?? null,
                            name: bidang.parent?.name ?? null,
                            id: bidang.parent?.id ?? null,
                            bidang: [{
                                   kode: bidang.kode,
                                   name: bidang.name,
                                   id: bidang.id,
                                   program: bidang.children.map(p => ({
                                          kode: p.kode,
                                          name: p.name,
                                          id: p.id,
                                          kegiatan: p.children.map(k => ({
                                                 kode: k.kode,
                                                 name: k.name,
                                                 id: k.id
                                          }))
                                   }))
                            }]
                     };
              }

              // filter by urusan -> all bidang -> their programs -> kegiatan
              if (filter.id_urusan) {
                     const urusan = await prisma.x_master.findUnique({
                            where: { id: filter.id_urusan },
                            include: {
                                   children: {
                                          orderBy: { kode: "asc" },
                                          include: {
                                                 children: {
                                                        orderBy: { kode: "asc" },
                                                        include: { children: { orderBy: { kode: "asc" } } } // program -> kegiatan
                                                 }
                                          }
                                   }
                            }
                     });
                     if (!urusan) return { message: "Urusan tidak ditemukan", data: null };

                     return {
                            kode: urusan.kode,
                            name: urusan.name,
                            id: urusan.id,
                            bidang: urusan.children.map(b => ({
                                   kode: b.kode,
                                   name: b.name,
                                   id: b.id,
                                   program: b.children.map(p => ({
                                          kode: p.kode,
                                          name: p.name,
                                          id: p.id,
                                          kegiatan: p.children.map(k => ({
                                                 kode: k.kode,
                                                 name: k.name,
                                                 id: k.id
                                          }))
                                   }))
                            }))
                     };
              }

              // default: all urusan -> bidang -> program -> kegiatan
              const all = await prisma.x_master.findMany({
                     where: { type: "urusan" },
                     orderBy: { kode: "asc" },
                     include: {
                            children: {
                                   orderBy: { kode: "asc" },
                                   include: {
                                          children: {
                                                 orderBy: { kode: "asc" },
                                                 include: { children: { orderBy: { kode: "asc" } } } // program -> kegiatan
                                          }
                                   }
                            }
                     }
              });

              return all.map(u => ({
                     kode: u.kode,
                     name: u.name,
                     id: u.id,
                     bidang: u.children.map(b => ({
                            kode: b.kode,
                            name: b.name,
                            id: b.id,
                            program: b.children.map(p => ({
                                   kode: p.kode,
                                   name: p.name,
                                   id: p.id,
                                   kegiatan: p.children.map(k => ({
                                          kode: k.kode,
                                          name: k.name,
                                          id: k.id
                                   }))
                            }))
                     }))
              }));
       }

       // ---------- SUB KEGIATAN ----------
       if (type === "subKegiatan") {
              // id_kegiatan -> children of kegiatan
              if (filter.id_kegiatan) {
                     const kegiatan = await prisma.x_master.findUnique({
                            where: { id: filter.id_kegiatan },
                            include: {
                                   parent: { include: { parent: { include: { parent: true } } } }, // kegiatan.parent=program -> bidang -> urusan
                                   children: { orderBy: { kode: "asc" } } // subkegiatan
                            }
                     });
                     if (!kegiatan) return { message: "Kegiatan tidak ditemukan", data: null };

                     return {
                            kode: kegiatan.parent?.parent?.parent?.kode ?? null,
                            name: kegiatan.parent?.parent?.parent?.name ?? null,
                            id: kegiatan.parent?.parent?.parent?.id ?? null,
                            bidang: [{
                                   kode: kegiatan.parent?.parent?.kode ?? null,
                                   name: kegiatan.parent?.parent?.name ?? null,
                                   id: kegiatan.parent?.parent?.id ?? null,
                                   program: [{
                                          kode: kegiatan.parent?.kode ?? null,
                                          name: kegiatan.parent?.name ?? null,
                                          id: kegiatan.parent?.id ?? null,
                                          kegiatan: [{
                                                 kode: kegiatan.kode,
                                                 name: kegiatan.name,
                                                 id: kegiatan.id,
                                                 sub_kegiatan: kegiatan.children.map(s => ({
                                                        kode: s.kode,
                                                        name: s.name,
                                                        id: s.id
                                                 }))
                                          }]
                                   }]
                            }]

                     };
              }

              // id -> get program -> its kegiatan -> their sub
              if (filter.id_program) {
                     const program = await prisma.x_master.findUnique({
                            where: { id: filter.id_program },
                            include: {
                                   parent: { include: { parent: true } }, // program.parent=bidang->urusan
                                   children: {
                                          orderBy: { kode: "asc" },
                                          include: { children: { orderBy: { kode: "asc" } } } // kegiatan -> sub
                                   }
                            }
                     });
                     if (!program) return { message: "Program tidak ditemukan", data: null };

                     return {
                            kode: program.parent?.parent?.kode ?? null,
                            name: program.parent?.parent?.name ?? null,
                            id: program.parent?.parent?.id ?? null,
                            bidang: [{
                                   kode: program.parent?.kode ?? null,
                                   name: program.parent?.name ?? null,
                                   id: program.parent?.id ?? null,
                                   program: [{
                                          kode: program.kode,
                                          name: program.name,
                                          id: program.id,
                                          kegiatan: program.children.map(k => ({
                                                 kode: k.kode,
                                                 name: k.name,
                                                 id: k.id,
                                                 subKegiatan: k.children.map(s => ({
                                                        kode: s.kode,
                                                        name: s.name,
                                                        id: s.id
                                                 }))
                                          }))
                                   }]
                            }]
                     };
              }

              // id_bidang -> all programs under bidang -> kegiatan -> sub
              if (filter.id_bidang) {
                     const bidang = await prisma.x_master.findUnique({
                            where: { id: filter.id_bidang },
                            include: {
                                   parent: true,
                                   children: {
                                          orderBy: { kode: "asc" },
                                          include: {
                                                 children: {
                                                        orderBy: { kode: "asc" },
                                                        include: { children: { orderBy: { kode: "asc" } } } // program->kegiatan->sub
                                                 }
                                          }
                                   }
                            }
                     });
                     if (!bidang) return { message: "Bidang tidak ditemukan", data: null };

                     return {
                            kode: bidang.parent?.kode ?? null,
                            name: bidang.parent?.name ?? null,
                            id: bidang.parent?.id ?? null,
                            bidang: [{
                                   kode: bidang.kode,
                                   name: bidang.name,
                                   id: bidang.id,
                                   program: bidang.children.map(p => ({
                                          kode: p.kode,
                                          name: p.name,
                                          id: p.id,
                                          kegiatan: p.children.map(k => ({
                                                 kode: k.kode,
                                                 name: k.name,
                                                 id: k.id,
                                                 subKegiatan: k.children.map(s => ({
                                                        kode: s.kode,
                                                        name: s.name,
                                                        id: s.id
                                                 }))
                                          }))
                                   }))
                            }]
                     };
              }

              // id_urusan -> all bidang -> program -> kegiatan -> sub
              if (filter.id_urusan) {
                     const urusan = await prisma.x_master.findUnique({
                            where: { id: filter.id_urusan },
                            include: {
                                   children: {
                                          orderBy: { kode: "asc" },
                                          include: {
                                                 children: {
                                                        orderBy: { kode: "asc" },
                                                        include: {
                                                               children: {
                                                                      orderBy: { kode: "asc" },
                                                                      include: { children: { orderBy: { kode: "asc" } } } // depth -> sub
                                                               }
                                                        }
                                                 }
                                          }
                                   }
                            }
                     });
                     if (!urusan) return { message: "Urusan tidak ditemukan", data: null };

                     return {
                            kode: urusan.kode,
                            name: urusan.name,
                            id: urusan.id,
                            bidang: urusan.children.map(b => ({
                                   kode: b.kode,
                                   name: b.name,
                                   id: b.id,
                                   program: b.children.map(p => ({
                                          kode: p.kode,
                                          name: p.name,
                                          id: p.id,
                                          kegiatan: p.children.map(k => ({
                                                 kode: k.kode,
                                                 name: k.name,
                                                 id: k.id,
                                                 subKegiatan: k.children.map(s => ({
                                                        kode: s.kode,
                                                        name: s.name,
                                                        id: s.id
                                                 }))
                                          }))
                                   }))
                            }))
                     };
              }

              // default: all tree
              const tree = await prisma.x_master.findMany({
                     where: { type: "urusan" },
                     orderBy: { kode: "asc" },
                     include: {
                            children: {
                                   orderBy: { kode: "asc" },
                                   include: {
                                          children: {
                                                 orderBy: { kode: "asc" },
                                                 include: {
                                                        children: {
                                                               orderBy: { kode: "asc" },
                                                               include: { children: { orderBy: { kode: "asc" } } }
                                                        }
                                                 }
                                          }
                                   }
                            }
                     }
              });

              return tree.map(u => ({
                     kode: u.kode,
                     name: u.name,
                     id: u.id,
                     bidang: u.children.map(b => ({
                            kode: b.kode,
                            name: b.name,
                            id: b.id,
                            program: b.children.map(p => ({
                                   kode: p.kode,
                                   name: p.name,
                                   id: p.id,
                                   kegiatan: p.children.map(k => ({
                                          kode: k.kode,
                                          name: k.name,
                                          id: k.id,
                                          subKegiatan: k.children.map(s => ({
                                                 kode: s.kode,
                                                 name: s.name,
                                                 id: s.id
                                          }))
                                   }))
                            }))
                     }))
              }));
       }

       return { message: "Type tidak valid. Gunakan urusan|bidang|program|kegiatan|subKegiatan" };
};



