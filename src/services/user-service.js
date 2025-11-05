import bycrypt from "bcrypt";
import prisma from "../config/database.js";
import { errorHandling } from "../middlewares/erros-handling.js";

export const listUser = async () => {
       const users = await prisma.users.findMany({
              include: {
                     userRole: true,
                     userSkpd: true,
              }
       });
       if (!users) throw new errorHandling(500, "Gagal mengambil data user");
       const result = [];
       for (const user of users) {
              result.push({
                     id: user.id,
                     name: user.name,
                     fullname: user.fullname,
                     email: user.email,
                     status: user.status,
                     role_id: user.role_id,
                     skpd_id: user.skpd_id,
                     userRole: {
                            id: user.userRole.id,
                            kode: user.userRole.kode,
                            name: user.userRole.name,
                     },
                     userSkpd: {
                            id: user.userSkpd.id,
                            kode: user.userSkpd.kode,
                            name: user.userSkpd.name,
                            shortname: user.userSkpd.shortname,
                     }
              });
       }
       return result;
}

export const userCreate = async (req) => {
       const { name, fullname, email, role_id, skpd_id, password } = req.body;

       const existingUser = await prisma.users.findUnique({
              where: { email: email }
       });

       if (existingUser) throw new errorHandling(400, "Email sudah terdaftar, gunakan email lain");
       const existingUsername = await prisma.users.findUnique({
              where: { name: name }
       });

       if (existingUsername) throw new errorHandling(400, "Username sudah terdaftar, gunakan username lain");

       const hashedPassword = await bycrypt.hash(password, 10);
       const newUser = await prisma.users.create({
              data: {
                     name,
                     fullname,
                     email,
                     role_id,
                     skpd_id,
                     password: hashedPassword,
                     status: true,
                     created_at: new Date(),
                     updated_at: new Date(),
              }
       });

       if (!newUser) throw new errorHandling(500, "Gagal menambahkan user baru");

       return await listUser();
}

export const updateUser = async (req) => {
       const { id } = req.params;
       const { name, fullname, email, role_id, skpd_id } = req.body;

       const existingUser = await prisma.users.findUnique({
              where: { id: parseInt(id) }
       });

       if (!existingUser) throw new errorHandling(404, "User tidak ditemukan");

       let updatedData = {
              name: name || existingUser.name,
              fullname: fullname || existingUser.fullname,
              email: email || existingUser.email,
              role_id: role_id || existingUser.role_id,
              skpd_id: skpd_id !== undefined ? skpd_id : existingUser.skpd_id,
              updated_at: new Date(),
       };

       const updatedUser = await prisma.users.update({
              where: { id: parseInt(id) },
              data: updatedData
       });

       if (!updatedUser) throw new errorHandling(500, "Gagal memperbarui data user");

       return await listUser();
}

export const changePassword = async (req) => {
       const { id, password } = req.body;

       const existingUser = await prisma.users.findUnique({
              where: { id: parseInt(id) }
       });
       if (!existingUser) throw new errorHandling(404, "User tidak ditemukan");

       const hashedPassword = await bycrypt.hash(password, 10);
       const updatedUser = await prisma.users.update({
              where: { id: parseInt(id) },
              data: {
                     password: hashedPassword,
                     updated_at: new Date(),
              }
       });

       if (!updatedUser) throw new errorHandling(500, "Gagal memperbarui password");
       return await listUser();
}


export const deleteUser = async (req) => {
       const { id } = req.params;

       const existingUser = await prisma.users.findUnique({
              where: { id: parseInt(id) }
       });

       if (!existingUser) throw new errorHandling(404, "User tidak ditemukan");

       const deletedUser = await prisma.users.delete({
              where: { id: parseInt(id) }
       });

       if (!deletedUser) throw new errorHandling(500, "Gagal menghapus user");

       return await listUser();
}

export const toggleUserStatus = async (req) => {
       const { id } = req.params;

       const existingUser = await prisma.users.findUnique({
              where: { id: parseInt(id) }
       });

       if (!existingUser) throw new errorHandling(404, "User tidak ditemukan");

       const updatedUser = await prisma.users.update({
              where: { id: parseInt(id) },
              data: {
                     status: !existingUser.status,
                     updated_at: new Date(),
              }
       });

       if (!updatedUser) throw new errorHandling(500, "Gagal memperbarui status user");

       return await listUser();
}

export const getUserById = async (id) => {
       const user = await prisma.users.findUnique({
              where: { id: parseInt(id) },
              include: {
                     userRole: true,
                     userSkpd: true,
              }
       });

       if (!user) throw new errorHandling(404, "User tidak ditemukan");

       return user;
}

export const getUserByEmail = async (email) => {
       const user = await prisma.users.findUnique({
              where: { email: email },
              include: {
                     userRole: true,
                     userSkpd: true,
              }
       });

       if (!user) throw new errorHandling(404, "User tidak ditemukan");

       return user;
}