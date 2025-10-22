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

router.use((req, res) => {
       response(res, 404, false, "path tidak ditemukan, coba lagi");
});
// router.all('/', (req, res) => {
//        response(res, 404, false, "path tidak ditemukan, coba lagi");
// });

export default router;