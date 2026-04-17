import prisma from "../../../config/database.js"
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const addOpd = async (req) => {
       const { kode, shortname, fullname } = req.body;

       const create = await prisma.dak_opd.create({
              data: { kode, shortname, fullname }
       });

       return create;
}

export const updateOpd = async (req) => {
       const { id, kode, shortname, fullname, status } = req.body;
       const exist = await prisma.dak_opd.findUnique({ where: { id } });
       if (!exist) throw new errorHandling(400, "Tidak menemukan data opd");

       const update = await prisma.dak_opd.update({
              where: { id },
              data: { kode, shortname, fullname, status }
       });

       return update
}

export const listOpd = async (req) => {
       const list = await prisma.dak_opd.findMany({
              select: { id: true, kode: true, shortname: true, fullname: true, status: true }
       });
       return list;
}