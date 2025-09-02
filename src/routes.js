import { Router } from "express";
import response from "./utility/response.js";

import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

router.all('/', (req, res) => {
       response(res, 404, false, "path tidak ditemukan, coba lagi");
});

export default router;