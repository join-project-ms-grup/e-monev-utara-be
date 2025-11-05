import prisma from "../config/database.js";
import { errorHandling } from "../middlewares/erros-handling.js";

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
                     skpd: periode._count.skpd_periode
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
       const exist = await prisma.periode.findUnique({
              where: { id },
              include: { skpd_periode: true },
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

       // Ambil semua SKPD periode yang sudah ada
       const existing = await prisma.skpd_periode.findMany({
              where: { periode_id: id },
              select: { id: true, skpd_id: true },
       });

       // Daftar SKPD baru (semua atau pilihan)
       const newSkpds =
              data.skpds === "all"
                     ? (await prisma.skpd.findMany({ select: { id: true } })).map(s => s.id)
                     : data.skpds;

       const existingIds = existing.map(e => e.skpd_id);

       // 1️⃣ Nonaktifkan yang tidak ada di daftar baru
       await prisma.skpd_periode.updateMany({
              where: {
                     periode_id: id,
                     skpd_id: { notIn: newSkpds },
              },
              data: { status: false },
       });

       // 2️⃣ Aktifkan yang masih ada di daftar baru
       await prisma.skpd_periode.updateMany({
              where: {
                     periode_id: id,
                     skpd_id: { in: newSkpds },
              },
              data: { status: true },
       });

       // 3️⃣ Tambahkan yang belum ada sama sekali
       const toAdd = newSkpds.filter(skpdId => !existingIds.includes(skpdId));

       if (toAdd.length > 0) {
              await prisma.skpd_periode.createMany({
                     data: toAdd.map(skpdId => ({
                            periode_id: id,
                            skpd_id: skpdId,
                            status: true,
                     })),
              });
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
                                   name: true,
                                   kode: true
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
              kode: sp.skpd?.kode ?? null,
       }));
};