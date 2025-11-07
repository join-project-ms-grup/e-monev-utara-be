import prisma from "../../../config/database.js";

export const listSkpd = async (req) => {
       const periodeId = Number(req.params.id);
       const getListSkpd = await prisma.w_skpd.findMany({ where: { periodeId } });

       return getListSkpd;
}