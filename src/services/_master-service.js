import { errorHandling } from "../middlewares/erros-handling.js";
import prisma from "../config/database.js";

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
