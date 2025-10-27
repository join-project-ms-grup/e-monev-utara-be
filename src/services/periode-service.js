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

       if (data.skpds !== "all") {
              const skpdData = data.skpds.map((skpdId) => ({
                     periode_id: periode.id,
                     skpd_id: skpdId
              }));
              const skpdPeriode = await prisma.skpd_periode.createMany({
                     data: skpdData
              });

              if (!skpdPeriode) {
                     throw new errorHandling(500, "Gagal menambahkan skpd periode");
              }
       } else {
              const skpds = await prisma.skpd.findMany({ select: { id: true } });
              const skpdData = skpds.map((skpd) => ({
                     periode_id: periode.id,
                     skpd_id: skpd.id
              }));
              const skpdPeriode = await prisma.skpd_periode.createMany({
                     data: skpdData
              });

              if (!skpdPeriode) {
                     throw new errorHandling(500, "Gagal menambahkan skpd periode");
              }
       }

       return await listPeriode();
}

export const updatePeriode = async (req) => {
       const data = req.body;
       const id = parseInt(req.params.id);

       // Pastikan periode ada
       const existing = await prisma.periode.findUnique({
              where: { id },
              include: { skpd_periode: true },
       });

       if (!existing) {
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

       // Hapus semua relasi SKPD lama
       await prisma.skpd_periode.deleteMany({
              where: { periode_id: id },
       });

       // Tambahkan SKPD baru
       if (data.skpds !== "all") {
              const skpdData = data.skpds.map((skpdId) => ({
                     periode_id: id,
                     skpd_id: skpdId,
              }));

              const skpdPeriode = await prisma.skpd_periode.createMany({
                     data: skpdData,
              });

              if (!skpdPeriode) {
                     throw new errorHandling(500, "Gagal memperbarui SKPD periode");
              }
       } else {
              const skpds = await prisma.skpd.findMany({ select: { id: true } });
              const skpdData = skpds.map((skpd) => ({
                     periode_id: id,
                     skpd_id: skpd.id,
              }));

              const skpdPeriode = await prisma.skpd_periode.createMany({
                     data: skpdData,
              });

              if (!skpdPeriode) {
                     throw new errorHandling(500, "Gagal memperbarui SKPD periode");
              }
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

       // Hapus relasi SKPD terlebih dahulu (foreign key)
       await prisma.skpd_periode.deleteMany({
              where: { periode_id: id },
       });

       // Hapus periode utama
       const deleted = await prisma.periode.delete({
              where: { id },
       });

       if (!deleted) {
              throw new errorHandling(500, "Gagal menghapus periode");
       }

       return await listPeriode();
};

export const getSKPDByPeriode = async (req) => {
       const id = parseInt(req.params.id, 10);
       if (Number.isNaN(id)) {
              throw new errorHandling(400, "ID periode tidak valid");
       }

       // Pastikan periode ada (cek singkat)
       const existing = await prisma.periode.findUnique({
              where: { id },
              select: { id: true },
       });

       if (!existing) {
              throw new errorHandling(404, "Periode tidak ditemukan");
       }

       // Ambil relasi skpd_periode + nama SKPD
       const getSkpd = await prisma.skpd_periode.findMany({
              where: { periode_id: id },
              select: {
                     id: true, // id dari skpd_periode
                     skpd: {
                            select: {
                                   id: true,
                                   name: true
                            }, // hanya id dan nama dari tabel skpd
                     },
              },
       });

       // Jika terjadi kegagalan tak terduga (null), lempar error
       if (getSkpd === null) {
              throw new errorHandling(500, "Gagal mengambil data skpd periode");
       }

       // Kembalikan format yang diminta: [{ id, nama }]
       return getSkpd.map((sp) => ({
              id: sp.id,
              skpd_id: sp.skpd?.id ?? null,
              name: sp.skpd?.name ?? null,
       }));
};