import prisma from "../../../config/database.js";

export const dashboardCardData = async (req) => {
       const totalSKPD = await prisma.skpd.count();
       const totalProgram = await prisma.x_master.count({
              where: { type: "program" }
       });
       const totalKegiatan = await prisma.x_master.count({
              where: { type: "kegiatan" }
       });
       const totalSubKegiatan = await prisma.x_master.count({
              where: { type: "subKegiatan" }
       });

       return {
              totalSKPD,
              totalProgram,
              totalKegiatan,
              totalSubKegiatan
       }
}