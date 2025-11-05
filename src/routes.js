import { Router } from "express";
import response from "./utility/response.js";

import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import roleRoutes from "./routes/role-routes.js";
import skpdRoutes from "./routes/skpd-routes.js";
import periodeRoutes from "./routes/periode-routes.js";
import masterRoutes from "./routes/_master-routes.js";
import indikatorRoutes from "./routes/_indikator-routes.js";
import paguRoutes from "./routes/_pagu-routes.js";
import capaianRoutes from "./routes/_capaian-routes.js";
import realisasiAnggaranRoutes from "./routes/_realisasi-pagu-routes.js";
import rkpdRoutes from "./routes/__rkpd-routes.js";
import infoRoutes from "./routes/_info-routes.js";
import ikuRoutes from "./routes/_iku-routes.js";
import renjaRoutes from "./routes/_renja-routes.js";
import { seedPerencanaan } from "../seeder/perencanaan.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/role', roleRoutes);
router.use('/skpd', skpdRoutes);
router.use('/periode', periodeRoutes);
router.use('/master', masterRoutes);
router.use('/indikator', indikatorRoutes);
router.use('/pagu', paguRoutes);
router.use('/capaian', capaianRoutes);
router.use('/realisasi-anggaran', realisasiAnggaranRoutes);
router.use('/rkpd', rkpdRoutes);
router.use('/iku', ikuRoutes);
router.use('/info', infoRoutes);
router.use('/renja', renjaRoutes);
router.get('/seeder', seedPerencanaan);

router.use((req, res) => {
       response(res, 404, false, "path tidak ditemukan, coba lagi");
});
// router.all('/', (req, res) => {
//        response(res, 404, false, "path tidak ditemukan, coba lagi");
// });

export default router;