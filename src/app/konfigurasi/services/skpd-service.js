import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const listSKPD = async () => {
       const result = await prisma.skpd.findMany({
              orderBy: { kode: 'asc' },
              include: {
                     skpd_periode: { select: { id: true } }
              }
       });
       if (!result) throw new errorHandling(500, "Gagal mengambil data SKPD");
       const finalResult = [];
       for (const skpd of result) {
              const bidang = [];
              if (skpd.skpd_periode.length > 0) {
                     for (const sp of skpd.skpd_periode) {
                            const skpd_periode_id = sp.id;
                            const master = await prisma.master.findMany({
                                   where: {
                                          type: 'program',
                                          outcome: {
                                                 some: { skpd_periode_id }
                                          }
                                   },
                                   include: {
                                          parent: true
                                   }
                            });
                            for (const m of master) {
                                   bidang.push({
                                          kode: m.parent.kode,
                                          name: m.parent.name
                                   })
                            }
                     }
                     finalResult.push({
                            id: skpd.id,
                            kode: skpd.kode,
                            name: skpd.name,
                            shortname: skpd.shortname,
                            status: skpd.status,
                            bidang: [...new Map(bidang.map(item => [item.kode, item])).values(),]
                     });
              }
       }
       return finalResult;
}

export const createSKPD = async (req) => {
       const author = req.user.id;
       const { kode, name, shortname } = req.body;
       const periode = await prisma.periode.findFirst({ where: { status: true } })
       const skpdExist = await prisma.skpd.findUnique({
              where: { kode }
       });

       if (skpdExist) {
              throw new errorHandling(409, "Kode SKPD sudah terdaftar");
       }

       const insert = await prisma.skpd.create({
              data: {
                     kode,
                     name,
                     shortname,
                     author_id: author
              }
       });

       await prisma.skpd_periode.create({
              data: {
                     skpd_id: insert.id,
                     periode_id: periode.id,
                     status: true
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
       const periode = await prisma.periode.findFirst({ where: { status: true } })

       const skpd = await prisma.skpd.findUnique({
              where: { id: Number(id) }
       });

       if (!skpd) {
              throw new errorHandling(404, "SKPD tidak ditemukan");
       }

       await prisma.skpd_periode.deleteMany({
              where: {
                     skpd_id: skpd.id,
                     periode_id: periode.id
              }
       })

       return await listSKPD();
}