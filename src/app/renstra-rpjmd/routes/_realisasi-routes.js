import { Router } from "express";
import * as controller from "../controllers/_realisasi-controller.js";

const router = Router();

router.post("/list", controller.list);
router.post("/capaian-outcome", controller.updateKinerjaOutcome);
router.post("/capaian", controller.updateKinerja);
router.post("/anggaran", controller.updateAnggaran);

export default router;