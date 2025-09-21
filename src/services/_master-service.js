import { errorHandling } from "../middlewares/erros-handling.js";
import prisma from "../config/database.js";
import response from "../utility/response.js";

export const addMaster = async (req) => {
       const { kode, name, type, parent } = req.body;

       if (type !== 'urusan' && !parent) {
              throw new errorHandling(400, false, "Parent is required for type other than 'urusan'");
       }

       if (type !== 'urusan') {
              const parentRecord = await prisma.master.findUnique({
                     where: { id: parent },
              });
              if (!parentRecord) {
                     throw new errorHandling(404, "Parent record not found");
              }
       }

       const newMaster = await prisma.master.create({
              data: {
                     kode,
                     name,
                     type,
                     parent_id: parent || null
              }
       });

       await prisma.logMaster.create({
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

       const existingMaster = await prisma.master.findUnique({
              where: { id: parseInt(id) },
       });

       if (!existingMaster) {
              throw new errorHandling(404, "Master record not found");
       }
       if (type !== 'urusan' && !parent) {
              throw new errorHandling(400, false, "Parent is required for type other than 'urusan'");
       }

       if (type !== 'urusan') {
              const parentRecord = await prisma.master.findUnique({
                     where: { id: parent },
              });
              if (!parentRecord) {
                     throw new errorHandling(404, "Parent record not found");
              }
       }

       const updatedMaster = await prisma.master.update({
              where: { id: parseInt(id) },
              data: {
                     kode,
                     name,
                     type,
                     parent_id: parent || null
              }
       });

       await prisma.logMaster.create({
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
       const existingMaster = await prisma.master.findUnique({
              where: { id: parseInt(id) },
       });

       if (!existingMaster) {
              throw new errorHandling(404, "Master record not found");
       }

       const updatedMaster = await prisma.master.update({
              where: { id: parseInt(id) },
              data: data
       });

       await prisma.logMaster.create({
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
       return await prisma.master.findMany({
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
       return await prisma.master.findMany({
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
       const data = await prisma.master.findMany({
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

       // ===== core logic per level (always use prisma.master) =====
       if (!type) return { message: "Parameter 'type' wajib diisi (urusan|bidang|program|kegiatan|subKegiatan)" };

       // ---------- URUSAN ----------
       if (type === "urusan") {
              const urusans = await prisma.master.findMany({
                     where: { type: "urusan" },
                     orderBy: { kode: "asc" },
              });

              return urusans.map(u => ({
                     kode_urusan: u.kode,
                     urusan: u.name,
                     id_urusan: u.id
              }));
       }

       // ---------- BIDANG ----------
       if (type === "bidang") {
              // filter by id_urusan -> get one urusan and its bidang children
              if (filter.id_urusan) {
                     const urusan = await prisma.master.findUnique({
                            where: { id: filter.id_urusan },
                            include: { children: { orderBy: { kode: "asc" } } }
                     });
                     if (!urusan) return { message: "Urusan tidak ditemukan", data: [] };

                     return {
                            kode_urusan: urusan.kode,
                            urusan: urusan.name,
                            id_urusan: urusan.id,
                            bidang: urusan.children.map(b => ({
                                   kode_bidang: b.kode,
                                   bidang: b.name,
                                   id_bidang: b.id
                            }))
                     };
              }

              // filter by id_bidang -> return that bidang + parent urusan
              if (filter.id_bidang) {
                     const bidang = await prisma.master.findUnique({
                            where: { id: filter.id_bidang },
                            include: { parent: true }
                     });
                     if (!bidang) return { message: "Bidang tidak ditemukan", data: null };

                     return {
                            kode_urusan: bidang.parent?.kode ?? null,
                            urusan: bidang.parent?.name ?? null,
                            id_urusan: bidang.parent?.id ?? null,
                            kode_bidang: bidang.kode,
                            bidang: bidang.name,
                            id_bidang: bidang.id
                     };
              }

              // default: all urusan + bidang
              const semuaUrusan = await prisma.master.findMany({
                     where: { type: "urusan" },
                     orderBy: { kode: "asc" },
                     include: { children: { orderBy: { kode: "asc" } } }
              });

              return semuaUrusan.map(u => ({
                     kode_urusan: u.kode,
                     urusan: u.name,
                     id_urusan: u.id,
                     bidang: u.children.map(b => ({
                            kode_bidang: b.kode,
                            bidang: b.name,
                            id_bidang: b.id
                     }))
              }));
       }

       // ---------- PROGRAM ----------
       if (type === "program") {
              // case: filter by bidang (direct parent)
              if (filter.id_bidang) {
                     const bidang = await prisma.master.findUnique({
                            where: { id: filter.id_bidang },
                            include: { parent: true, children: { orderBy: { kode: "asc" } } }
                     });
                     if (!bidang) return { message: "Bidang tidak ditemukan", data: null };

                     return {
                            kode_urusan: bidang.parent?.kode ?? null,
                            urusan: bidang.parent?.name ?? null,
                            id_urusan: bidang.parent?.id ?? null,
                            kode_bidang: bidang.kode,
                            bidang: bidang.name,
                            id_bidang: bidang.id,
                            program: bidang.children.map(p => ({
                                   kode_program: p.kode,
                                   program: p.name,
                                   id_program: p.id
                            }))
                     };
              }

              // case: filter by urusan (all bidang under urusan + their programs)
              if (filter.id_urusan) {
                     const urusan = await prisma.master.findUnique({
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
                            kode_urusan: urusan.kode,
                            urusan: urusan.name,
                            id_urusan: urusan.id,
                            bidang: urusan.children.map(b => ({
                                   kode_bidang: b.kode,
                                   bidang: b.name,
                                   id_bidang: b.id,
                                   program: b.children.map(p => ({
                                          kode_program: p.kode,
                                          program: p.name,
                                          id_program: p.id
                                   }))
                            }))
                     };
              }

              // default: all urusan -> bidang -> program
              const semua = await prisma.master.findMany({
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
                     kode_urusan: u.kode,
                     urusan: u.name,
                     id_urusan: u.id,
                     bidang: u.children.map(b => ({
                            kode_bidang: b.kode,
                            bidang: b.name,
                            id_bidang: b.id,
                            program: b.children.map(p => ({
                                   kode_program: p.kode,
                                   program: p.name,
                                   id_program: p.id
                            }))
                     }))
              }));
       }

       // ---------- KEGIATAN ----------
       if (type === "kegiatan") {
              // filter by program
              if (filter.id_program) {
                     const program = await prisma.master.findUnique({
                            where: { id: filter.id_program },
                            include: {
                                   parent: { include: { parent: true } }, // program.parent = bidang; bidang.parent = urusan
                                   children: { orderBy: { kode: "asc" } } // kegiatan
                            }
                     });
                     if (!program) return { message: "Program tidak ditemukan", data: null };

                     return {
                            kode_urusan: program.parent?.parent?.kode ?? null,
                            urusan: program.parent?.parent?.name ?? null,
                            id_urusan: program.parent?.parent?.id ?? null,
                            kode_bidang: program.parent?.kode ?? null,
                            bidang: program.parent?.name ?? null,
                            id_bidang: program.parent?.id ?? null,
                            program: [{
                                   kode_program: program.kode,
                                   program: program.name,
                                   id_program: program.id,
                                   kegiatan: program.children.map(k => ({
                                          kode_kegiatan: k.kode,
                                          kegiatan: k.name,
                                          id_kegiatan: k.id
                                   }))
                            }]
                     };
              }

              // filter by bidang -> get bidang -> programs -> kegiatan
              if (filter.id_bidang) {
                     const bidang = await prisma.master.findUnique({
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
                            kode_urusan: bidang.parent?.kode ?? null,
                            urusan: bidang.parent?.name ?? null,
                            id_urusan: bidang.parent?.id ?? null,
                            kode_bidang: bidang.kode,
                            bidang: bidang.name,
                            id_bidang: bidang.id,
                            program: bidang.children.map(p => ({
                                   kode_program: p.kode,
                                   program: p.name,
                                   id_program: p.id,
                                   kegiatan: p.children.map(k => ({
                                          kode_kegiatan: k.kode,
                                          kegiatan: k.name,
                                          id_kegiatan: k.id
                                   }))
                            }))
                     };
              }

              // filter by urusan -> all bidang -> their programs -> kegiatan
              if (filter.id_urusan) {
                     const urusan = await prisma.master.findUnique({
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
                            kode_urusan: urusan.kode,
                            urusan: urusan.name,
                            id_urusan: urusan.id,
                            bidang: urusan.children.map(b => ({
                                   kode_bidang: b.kode,
                                   bidang: b.name,
                                   id_bidang: b.id,
                                   program: b.children.map(p => ({
                                          kode_program: p.kode,
                                          program: p.name,
                                          id_program: p.id,
                                          kegiatan: p.children.map(k => ({
                                                 kode_kegiatan: k.kode,
                                                 kegiatan: k.name,
                                                 id_kegiatan: k.id
                                          }))
                                   }))
                            }))
                     };
              }

              // default: all urusan -> bidang -> program -> kegiatan
              const all = await prisma.master.findMany({
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
                     kode_urusan: u.kode,
                     urusan: u.name,
                     id_urusan: u.id,
                     bidang: u.children.map(b => ({
                            kode_bidang: b.kode,
                            bidang: b.name,
                            id_bidang: b.id,
                            program: b.children.map(p => ({
                                   kode_program: p.kode,
                                   program: p.name,
                                   id_program: p.id,
                                   kegiatan: p.children.map(k => ({
                                          kode_kegiatan: k.kode,
                                          kegiatan: k.name,
                                          id_kegiatan: k.id
                                   }))
                            }))
                     }))
              }));
       }

       // ---------- SUB KEGIATAN ----------
       if (type === "subKegiatan") {
              // id_kegiatan -> children of kegiatan
              if (filter.id_kegiatan) {
                     const kegiatan = await prisma.master.findUnique({
                            where: { id: filter.id_kegiatan },
                            include: {
                                   parent: { include: { parent: { include: { parent: true } } } }, // kegiatan.parent=program -> bidang -> urusan
                                   children: { orderBy: { kode: "asc" } } // subkegiatan
                            }
                     });
                     if (!kegiatan) return { message: "Kegiatan tidak ditemukan", data: null };

                     return {
                            kode_urusan: kegiatan.parent?.parent?.parent?.kode ?? null,
                            urusan: kegiatan.parent?.parent?.parent?.name ?? null,
                            id_urusan: kegiatan.parent?.parent?.parent?.id ?? null,
                            kode_bidang: kegiatan.parent?.parent?.kode ?? null,
                            bidang: kegiatan.parent?.parent?.name ?? null,
                            id_bidang: kegiatan.parent?.parent?.id ?? null,
                            program: [{
                                   kode_program: kegiatan.parent?.kode ?? null,
                                   program: kegiatan.parent?.name ?? null,
                                   id_program: kegiatan.parent?.id ?? null,
                                   kegiatan: [{
                                          kode_kegiatan: kegiatan.kode,
                                          kegiatan: kegiatan.name,
                                          id_kegiatan: kegiatan.id,
                                          sub_kegiatan: kegiatan.children.map(s => ({
                                                 kode_sub_kegiatan: s.kode,
                                                 sub_kegiatan: s.name,
                                                 id_sub_kegiatan: s.id
                                          }))
                                   }]
                            }]
                     };
              }

              // id_program -> get program -> its kegiatan -> their sub
              if (filter.id_program) {
                     const program = await prisma.master.findUnique({
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
                            kode_urusan: program.parent?.parent?.kode ?? null,
                            urusan: program.parent?.parent?.name ?? null,
                            id_urusan: program.parent?.parent?.id ?? null,
                            kode_bidang: program.parent?.kode ?? null,
                            bidang: program.parent?.name ?? null,
                            id_bidang: program.parent?.id ?? null,
                            program: [{
                                   kode_program: program.kode,
                                   program: program.name,
                                   id_program: program.id,
                                   kegiatan: program.children.map(k => ({
                                          kode_kegiatan: k.kode,
                                          kegiatan: k.name,
                                          id_kegiatan: k.id,
                                          sub_kegiatan: k.children.map(s => ({
                                                 kode_sub_kegiatan: s.kode,
                                                 sub_kegiatan: s.name,
                                                 id_sub_kegiatan: s.id
                                          }))
                                   }))
                            }]
                     };
              }

              // id_bidang -> all programs under bidang -> kegiatan -> sub
              if (filter.id_bidang) {
                     const bidang = await prisma.master.findUnique({
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
                            kode_urusan: bidang.parent?.kode ?? null,
                            urusan: bidang.parent?.name ?? null,
                            id_urusan: bidang.parent?.id ?? null,
                            kode_bidang: bidang.kode,
                            bidang: bidang.name,
                            id_bidang: bidang.id,
                            program: bidang.children.map(p => ({
                                   kode_program: p.kode,
                                   program: p.name,
                                   id_program: p.id,
                                   kegiatan: p.children.map(k => ({
                                          kode_kegiatan: k.kode,
                                          kegiatan: k.name,
                                          id_kegiatan: k.id,
                                          sub_kegiatan: k.children.map(s => ({
                                                 kode_sub_kegiatan: s.kode,
                                                 sub_kegiatan: s.name,
                                                 id_sub_kegiatan: s.id
                                          }))
                                   }))
                            }))
                     };
              }

              // id_urusan -> all bidang -> program -> kegiatan -> sub
              if (filter.id_urusan) {
                     const urusan = await prisma.master.findUnique({
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
                            kode_urusan: urusan.kode,
                            urusan: urusan.name,
                            id_urusan: urusan.id,
                            bidang: urusan.children.map(b => ({
                                   kode_bidang: b.kode,
                                   bidang: b.name,
                                   id_bidang: b.id,
                                   program: b.children.map(p => ({
                                          kode_program: p.kode,
                                          program: p.name,
                                          id_program: p.id,
                                          kegiatan: p.children.map(k => ({
                                                 kode_kegiatan: k.kode,
                                                 kegiatan: k.name,
                                                 id_kegiatan: k.id,
                                                 sub_kegiatan: k.children.map(s => ({
                                                        kode_sub_kegiatan: s.kode,
                                                        sub_kegiatan: s.name,
                                                        id_sub_kegiatan: s.id
                                                 }))
                                          }))
                                   }))
                            }))
                     };
              }

              // default: all tree
              const tree = await prisma.master.findMany({
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
                     kode_urusan: u.kode,
                     urusan: u.name,
                     id_urusan: u.id,
                     bidang: u.children.map(b => ({
                            kode_bidang: b.kode,
                            bidang: b.name,
                            id_bidang: b.id,
                            program: b.children.map(p => ({
                                   kode_program: p.kode,
                                   program: p.name,
                                   id_program: p.id,
                                   kegiatan: p.children.map(k => ({
                                          kode_kegiatan: k.kode,
                                          kegiatan: k.name,
                                          id_kegiatan: k.id,
                                          sub_kegiatan: k.children.map(s => ({
                                                 kode_sub_kegiatan: s.kode,
                                                 sub_kegiatan: s.name,
                                                 id_sub_kegiatan: s.id
                                          }))
                                   }))
                            }))
                     }))
              }));
       }

       return { message: "Type tidak valid. Gunakan urusan|bidang|program|kegiatan|subKegiatan" };
};



