import prisma from "../config/database.js";

export const dashboardCardData = async (req) => {
       const totalSKPD = await prisma.skpd.count();
       const totalProgram = await prisma.master.count({
              where: { type: "program" }
       });
       const totalKegiatan = await prisma.master.count({
              where: { type: "kegiatan" }
       });
       const totalSubKegiatan = await prisma.master.count({
              where: { type: "subKegiatan" }
       });

       return {
              totalSKPD,
              totalProgram,
              totalKegiatan,
              totalSubKegiatan
       }
}