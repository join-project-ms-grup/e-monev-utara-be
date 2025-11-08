import prisma from "../../../config/database.js"
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const listJenis = async (req) => {
       return await prisma.dak_jenis.findMany({
              select: {
                     id: true,
                     kode: true,
                     jenis: true,
              }
       });
}

export const addSub = async (req) => {
       const { kode_jenis, nama, keterangan } = req.body;
       const exist = await prisma.dak_jenis.findFirst({ where: { kode: kode_jenis } });
       if (!exist) {
              throw new errorHandling(404, "Jenis dak tidak ditemukan");
       }

       const add = await prisma.dak_subJenis.create({
              data: {
                     nama,
                     keterangan,
                     jenis_dak: kode_jenis
              }
       });

       return add;
}

export const listSub = async (req) => {
       const { kode_jenis } = req.body;
       const exist = await prisma.dak_jenis.findFirst({ where: { kode: kode_jenis } });
       if (!exist) {
              throw new errorHandling(404, "Jenis dak tidak ditemukan");
       }
       return await prisma.dak_subJenis.findMany({ where: { jenis_dak: kode_jenis } });

}

export const updateSub = async (req) => {
       const { id, nama, keterangan, status } = req.body;
       const exist = await prisma.dak_subJenis.findUnique({ where: { id } });
       if (!exist) {
              throw new errorHandling(404, "Sub Jenis dak tidak ditemukan");
       }

       const add = await prisma.dak_subJenis.update({
              where: { id },
              data: {
                     nama,
                     keterangan,
                     status
              }
       });

       return add;
}