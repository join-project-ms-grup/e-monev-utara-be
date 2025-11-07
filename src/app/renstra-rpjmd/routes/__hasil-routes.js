import { Router } from "express";
import * as controller from "../controllers/__hasil_controller.js";

const router = Router();

router.get("/rpjmd/:skpdPeriodeId", controller.listRpjmd);
router.get("/renstra/:skpdPeriodeId", controller.listRenstra);

export default router;