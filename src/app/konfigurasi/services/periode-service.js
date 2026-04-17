import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const listPeriode = async (req) => {
       const list = await prisma.periode.findMany({
              orderBy: {
                     mulai: 'desc'
              },
              include: {
                     _count: {
                            select: { skpd_periode: true }
                     }
              }
       });


       if (!list) throw new errorHandling(500, "Gagal mengambil data periode");
       const result = [];
       for (const periode of list) {
              result.push({
                     id: periode.id,
                     mulai: periode.mulai,
                     akhir: periode.akhir,
                     status: periode.status,
                     skpd_rkpd: periode._count.skpd_periode
              });
       }

       return result;
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
       const data = req.body;
       const id = parseInt(req.params.id);

       // Pastikan periode ada
       const exist = await prisma.periode.findUnique({
              where: { id }
       });

       if (!exist) {
              throw new errorHandling(404, "Periode tidak ditemukan");
       }

       // Update data periode utama
       const periode = await prisma.periode.update({
              where: { id },
              data: {
                     mulai: data.mulai,
                     akhir: data.akhir,
                     status: data.status,
              },
       });

       if (!periode) {
              throw new errorHandling(500, "Gagal memperbarui periode");
       }

       return await listPeriode();
};

export const deletePeriode = async (req) => {
       const id = parseInt(req.params.id);

       // Pastikan periode ada
       const existing = await prisma.periode.findUnique({
              where: { id },
       });

       if (!existing) {
              throw new errorHandling(404, "Periode tidak ditemukan");
       }

       // Hapus periode utama
       const deleted = await prisma.periode.delete({
              where: { id },
       });

       if (!deleted) {
              throw new errorHandling(500, "Gagal menghapus periode");
       }

       return await listPeriode();
};
