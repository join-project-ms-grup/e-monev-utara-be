import { Router } from "express";
import response from "./utility/response.js";

import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import roleRoutes from "./routes/role-routes.js";
import skpdRoutes from "./routes/skpd-routes.js";
import periodeRoutes from "./routes/periode-routes.js";
import masterRoutes from "./routes/_master_routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/role', roleRoutes);
router.use('/skpd', skpdRoutes);
router.use('/periode', periodeRoutes);
router.use('/master', masterRoutes);

router.all('/', (req, res) => {
       response(res, 404, false, "path tidak ditemukan, coba lagi");
});

export default router;