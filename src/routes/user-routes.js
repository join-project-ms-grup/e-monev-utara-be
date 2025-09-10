import { Router } from "express";
import * as controller from "../controllers/user-controller.js"
import cekToken from "../middlewares/auth.js";
import { devAdminAccess } from "../middlewares/role.js";
const router = Router();

router.use(cekToken);

router.post("/add",
       devAdminAccess,
       controller.userAdd);

export default router;