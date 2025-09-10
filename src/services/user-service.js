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
       return users;
}

export const userCreate = async (req) => {
       const { name, fullname, email, role_id, skpd_id, password } = req.body;
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
       const { name, fullname, email, role_id, skpd_id, password } = req.body;

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

       if (password) {
              updatedData.password = await bycrypt.hash(password, 10);
       }

       const updatedUser = await prisma.users.update({
              where: { id: parseInt(id) },
              data: updatedData
       });

       if (!updatedUser) throw new errorHandling(500, "Gagal memperbarui data user");

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