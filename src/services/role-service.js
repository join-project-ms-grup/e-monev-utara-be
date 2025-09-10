import prisma from "../config/database.js"

export const getListDev = async () => {
       const roles = await prisma.role.findMany();
       return roles;
}

export const getList = async () => {
       const roles = await prisma.role.findMany({
              where: {
                     name: {
                            not: "developer"
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
              const error = new Error("Role dengan kode, nama, atau singkatan tersebut sudah ada");
              error.statusCode = 400;
              throw error;
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
              const error = new Error("Role tidak ditemukan");
              error.statusCode = 404;
              throw error;
       }

       if (role.name === "developer") {
              const error = new Error("Role developer tidak dapat diubah");
              error.statusCode = 403;
              throw error;
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
              const error = new Error("Role dengan kode, nama, atau singkatan tersebut sudah ada");
              error.statusCode = 400;
              throw error;
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
              const error = new Error("Role tidak ditemukan");
              error.statusCode = 404;
              throw error;
       }

       if (role.name === "developer") {
              const error = new Error("Role developer tidak dapat dihapus");
              error.statusCode = 403;
              throw error;
       }
       await prisma.role.delete({
              where: {
                     id: Number(id)
              }
       });

       return await getListDev();
}