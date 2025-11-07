import prisma from "../../../config/database.js"
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const sinkronisasiSKPD = async (req) => {
       const periode_id = parseInt(req.params.id)
       const allSKPD = await prisma.skpd.findMany({ select: { id: true } });
       const skpdCollectIds = allSKPD.map(item => item.id);
       const result = [];
       for (const skpd_id of skpdCollectIds) {
              const exits = await prisma.x_skpd_periode.findFirst({ where: { skpd_id, periode_id } });
              if (exits) {
                     const updateSKPD_periode = await prisma.skpd_periode.update({
                            where: { id: exits.id },
                            data: { status: true },
                            include: {
                                   skpd: true
                            }
                     });
                     result.push(updateSKPD_periode.skpd);

              } else {
                     const setSKPD_periode = await prisma.x_skpd_periode.create({
                            data: { skpd_id, periode_id },
                            include: {
                                   skpd: true
                            }
                     });
                     result.push(setSKPD_periode.skpd);
              }
       }
       return result;

}

export const list = async (req) => {
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
       const getSkpd = await prisma.x_skpd_periode.findMany({
              where: { periode_id: id },
              select: {
                     id: true, // id dari skpd_periode
                     status: true,
                     periode: true,
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
              periode_id: sp.periode.id,
              periode: `${sp.periode.mulai} - ${sp.periode.akhir}`,
              skpd_id: sp.skpd.id,
              skpd_kode: sp.skpd.kode,
              skpd_name: sp.skpd.name,
              status: sp.status,
       }));
};

export const statusToggle = async (req) => {
       const id = Number(req.params.id);

       if (isNaN(id)) throw new errorHandling(400, "ID tidak valid");

       const exist = await prisma.x_skpd_periode.findUnique({
              where: { id },
       });

       if (!exist) {
              throw new errorHandling(404, "Tidak menemukan data skpd pada periode evaluasi");
       }

       await prisma.x_skpd_periode.update({
              where: { id },
              data: { status: !exist.status },
       });


       return await list(req);
};