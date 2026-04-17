import prisma from "../../../config/database.js"
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const addTahun = async (req) => {
       const { tahun, keterangan } = req.body
       const exist = await prisma.dak_tahun.findFirst({ where: { tahun } });
       if (exist) {
              throw new errorHandling(400, "Mohon maaf tahun sudah ada");
       }
       const setTahun = await prisma.dak_tahun.create({ data: { tahun, keterangan } });
       return setTahun;
}

export const updateTahun = async (req) => {
       const { id, tahun, keterangan } = req.body;
       const exist = await prisma.dak_tahun.findFirst({ where: { tahun, NOT: { id } } });

       if (exist) {
              throw new errorHandling(400, "Mohon maaf tahun telah di set pada node lain");
       }

       const updateTahun = await prisma.dak_tahun.update({
              where: { id },
              data: { tahun, keterangan }
       });

       return updateTahun;
}

export const statusToggle = async (req) => {
       const { id } = req.body
       const exist = await prisma.dak_tahun.findUnique({ where: { id } });

       if (!exist) throw new errorHandling(404, "Data tahun tidak ditemukan");

       const toggle = await prisma.dak_tahun.update({
              where: { id },
              data: { status: !exist.status }
       });
       return toggle;
}

export const listTahun = async (req) => {
       const getTahun = await prisma.dak_tahun.findMany({
              select: { id: true, tahun: true, keterangan: true, status: true }
       })
       return getTahun;
}