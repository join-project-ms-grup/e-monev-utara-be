import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const setMasalah = async (req) => {
       const { kode_jenis, name, keterangan } = req.body;

       const exist = await prisma.dak_jenis.findFirst({ where: { kode: kode_jenis } });
       if (!exist) {
              throw new errorHandling(404, "Jenis DAK tidak ditemukan");
       }

       const addMasalah = await prisma.dak_masalah.create({ data: { jenis_dak: kode_jenis, name, keterangan } });
       return addMasalah;
}

export const updateMasalah = async (req) => {
       const { id, name, keterangan, status } = req.body;
       const exist = await prisma.dak_masalah.findUnique({ where: { id } });
       if (!exist) {
              throw new errorHandling(404, "Masalah DAK tidak ditemukan");
       }

       const update = await prisma.dak_masalah.update({
              where: { id },
              data: { name, keterangan, status }
       });

       return update
}

export const listMasalah = async (req) => {
       const { kode_jenis } = req.body
       const list = await prisma.dak_masalah.findMany({
              where: { jenis_dak: kode_jenis },
              select: { id: true, name: true, keterangan: true, status: true }
       });

       return list;
}