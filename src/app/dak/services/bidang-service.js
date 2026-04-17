import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const addBidang = async (req) => {
       const { jenis_dak, name, keterangan } = req.body;
       const exist = await prisma.dak_jenis.findFirst({ where: { kode: jenis_dak } });

       if (!exist) throw new errorHandling(404, "Jenis DAK tidak ditemukan");

       const add = await prisma.dak_bidang.create({
              data: { jenis_dak, name, keterangan }
       })

       return add;
}


export const updateBidang = async (req) => {
       const { id, name, keterangan, status } = req.body;
       const exist = await prisma.dak_bidang.findUnique({ where: { id } });

       if (!exist) throw new errorHandling(404, "Bidang DAK tidak ditemukan");

       const update = await prisma.dak_bidang.update({
              where: { id },
              data: { name, keterangan, status }
       });
       return update;
}

export const listBidang = async (req) => {
       const { jenis_dak } = req.body;
       const exist = await prisma.dak_jenis.findFirst({ where: { kode: jenis_dak } });

       if (!exist) throw new errorHandling(404, "Jenis DAK tidak ditemukan");

       const list = await prisma.dak_bidang.findMany({
              where: { jenis_dak },
              select: { id: true, name: true, keterangan: true, status: true }
       });

       return list
}

export const listSub = async (req) => {
       const { dak_bidangId } = req.body;
       const exist = await prisma.dak_bidang.findUnique({ where: { id: dak_bidangId } });

       if (!exist) throw new errorHandling(404, "Bidang DAK tidak ditemukan");

       const list = await prisma.dak_bidang.findMany({
              where: { id: dak_bidangId },
              select: {
                     id: true,
                     name: true,
                     keterangan: true,
                     status: true,
                     sub: true
              }
       });

       return list
}

export const addSub = async (req) => {
       const { id_bidang, name, keterangan } = req.body;
       const exist = await prisma.dak_bidang.findUnique({ where: { id: id_bidang } });

       if (!exist) throw new errorHandling(404, "Bidang DAK tidak ditemukan");

       const add = await prisma.dak_subBidang.create({
              data: { dak_bidangId: id_bidang, name, keterangan }
       });


       return add;
}

export const updateSub = async (req) => {
       const { id, name, keterangan, status } = req.body;
       const exist = await prisma.dak_subBidang.findUnique({ where: { id } });

       if (!exist) throw new errorHandling(404, "Sub Bidang DAK tidak ditemukan");

       const update = await prisma.dak_subBidang.update({
              where: { id },
              data: { name, keterangan, status }
       });


       return update;
}