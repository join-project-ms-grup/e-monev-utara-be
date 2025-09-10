import prisma from "../config/database.js";
import { errorHandling } from "../middlewares/erros-handling.js";

export const listSKPD = async () => {
       const result = await prisma.skpd.findMany({
              select: {
                     id: true,
                     kode: true,
                     name: true,
                     shortname: true,
                     status: true,
                     created_at: true,
                     updated_at: true
              }
       });
       return result;
}

export const createSKPD = async (req) => {
       const author = req.user.id;
       const { kode, name, shortname } = req.body;
       const skpdExist = await prisma.skpd.findUnique({
              where: { kode: Number(kode) }
       });

       if (skpdExist) {
              throw new errorHandling(409, "Kode SKPD sudah terdaftar");
       }

       await prisma.skpd.create({
              data: {
                     kode,
                     name,
                     shortname,
                     author_id: author
              }
       });

       return await listSKPD();
}

export const updateSKPD = async (req) => {
       const { id } = req.params;
       const { kode, name, shortname, status } = req.body;

       const skpd = await prisma.skpd.findUnique({
              where: { id: Number(id) }
       });

       if (!skpd) {
              throw new errorHandling(404, "SKPD tidak ditemukan");
       }

       await prisma.skpd.update({
              where: { id: Number(id) },
              data: {
                     kode,
                     name,
                     shortname,
                     status
              }
       });

       return await listSKPD();
}

export const deleteSKPD = async (req) => {
       const { id } = req.params;

       const skpd = await prisma.skpd.findUnique({
              where: { id: Number(id) }
       });

       if (!skpd) {
              throw new errorHandling(404, "SKPD tidak ditemukan");
       }

       await prisma.skpd.delete({
              where: { id: Number(id) }
       });

       return await listSKPD();
}