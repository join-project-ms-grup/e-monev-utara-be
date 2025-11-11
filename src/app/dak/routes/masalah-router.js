import { Router } from "express";
import * as controller from "../controllers/masalah-controller.js";

const router = Router();

router.post("/add", controller.setMasalah);
router.put("/update", controller.updateMasalah);
router.post("/list", controller.listMasalah);

export default router;