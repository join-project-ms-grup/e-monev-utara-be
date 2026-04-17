import prisma from "../../../config/database.js"
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const getListDev = async () => {
       const roles = await prisma.role.findMany();
       return roles;
}

export const getList = async () => {
       const roles = await prisma.role.findMany({
              where: {
                     kode: {
                            not: 1
                     }
              },
              select: {
                     kode: true,
                     name: true
              }
       });
       return roles;
}

export const addRole = async (req) => {
       const { kode, name, shortname } = req.body;

       const existingRole = await prisma.role.findFirst({
              where: {
                     OR: [
                            { kode: kode },
                            { name: name },
                     ]
              }
       });
       if (existingRole) {
              throw new errorHandling(400, "Role dengan kode, nama, atau singkatan tersebut sudah ada");
       }

       await prisma.role.create({
              data: {
                     kode,
                     name,
                     author_id: req.user.id
              }
       });
       return await getListDev();
}

export const updateRole = async (req) => {
       const { id } = req.params;
       const { kode, name, shortname } = req.body;

       const role = await prisma.role.findUnique({
              where: {
                     id: Number(id)
              }
       });

       if (!role) {
              throw new errorHandling(404, "Role tidak ditemukan");
       }

       if (role.name === "developer") {
              throw new errorHandling(403, "Role developer tidak dapat diubah");
       }

       const existingRole = await prisma.role.findFirst({
              where: {
                     AND: [
                            { id: { not: Number(id) } },
                            {
                                   OR: [
                                          { kode: kode },
                                          { name: name },
                                   ]
                            }
                     ]
              }
       });
       if (existingRole) {
              throw new errorHandling(400, "Role dengan kode, nama, atau singkatan tersebut sudah ada");
       }

       await prisma.role.update({
              where: {
                     id: Number(id)
              },
              data: {
                     kode,
                     name,
                     author_id: req.user.id
              }
       });
       return await getListDev();
}

export const deleteRole = async (req) => {
       const { id } = req.params;

       const role = await prisma.role.findUnique({
              where: {
                     id: Number(id)
              }
       });

       if (!role) {
              throw new errorHandling(404, "Role tidak ditemukan");
       }

       if (role.name === "developer") {
              throw new errorHandling(403, "Role developer tidak dapat dihapus");
       }
       await prisma.role.delete({
              where: {
                     id: Number(id)
              }
       });

       return await getListDev();
}