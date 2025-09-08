import { Router } from "express";
import * as controller from "../controllers/user-controller.js"
import cekToken from "../middlewares/auth.js";
const router = Router();

router.use(cekToken);

router.post("/add", controller.userAdd);

export default router;