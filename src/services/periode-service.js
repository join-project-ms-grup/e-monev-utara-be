import prisma from "../config/database.js";
import { errorHandling } from "../middlewares/erros-handling.js";

export const listPeriode = async (req) => {
       const list = await prisma.periode.findMany({
              orderBy: {
                     mulai: 'desc'
              }
       });
       if (!list) throw new errorHandling(500, "Gagal mengambil data periode");

       return list;
}

export const addPeriode = async (req) => {
       const data = req.body;
       const periode = await prisma.periode.create({
              data: {
                     mulai: data.mulai,
                     akhir: data.akhir,
                     status: data.status
              }
       });
       if (!periode) {
              throw new errorHandling(500, "Gagal menambahkan periode");
       }

       return await listPeriode();
}

export const updatePeriode = async (req) => {
       const id = parseInt(req.params.id);
       const data = req.body;

       const checkPeriode = await prisma.periode.findUnique({
              where: { id: id }
       });
       if (!checkPeriode) throw new errorHandling(404, "Data periode tidak ditemukan");

       const periode = await prisma.periode.update({
              where: { id: id },
              data: {
                     mulai: data.mulai,
                     akhir: data.akhir,
                     status: data.status
              }
       });
       if (!periode) throw new errorHandling(500, "Gagal mengupdate periode");

       return await listPeriode();
}

export const deletePeriode = async (req) => {
       const id = parseInt(req.params.id);

       const checkPeriode = await prisma.periode.findUnique({
              where: { id: id }
       });
       if (!checkPeriode) throw new errorHandling(404, "Data periode tidak ditemukan");

       const periode = await prisma.periode.delete({
              where: { id: id }
       });
       if (!periode) throw new errorHandling(500, "Gagal menghapus periode");

       return await listPeriode();
}