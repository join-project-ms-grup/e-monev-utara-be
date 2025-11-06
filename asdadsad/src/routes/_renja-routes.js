import { Router } from "express";
import cekToken from "../middlewares/auth.js";
import * as controller from "../controllers/_renja-controller.js";

const router = Router();

router.use(cekToken);
router.post("/list-sub", controller.listSub);
router.post("/detail-sub", controller.detailSub);

export default router;