import prisma from "../../../config/database.js";

export const listSkpd = async (req) => {
       const periodeId = Number(req.params.id);
       const getListSkpd = await prisma.w_skpd_periode.findMany({
              where: { periode_id: periodeId },
              select: {
                     id: true,
                     skpd: {
                            select: {
                                   id: true,
                                   name: true,
                                   kode: true
                            }
                     }
              }
       });
       const result = [];
       for (const s of getListSkpd) {
              result.push({
                     periode_skpd_id: s.id,
                     id: s.skpd.id,
                     kode: s.skpd.kode,
                     name: s.skpd.name
              })
       }
       return result;
}