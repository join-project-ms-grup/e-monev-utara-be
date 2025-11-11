import { Router } from "express";
import * as controller from "../controllers/_renja-controller.js";

const router = Router();

router.post("/list-sub", controller.listSub);
router.post("/detail-sub", controller.detailSub);

export default router;