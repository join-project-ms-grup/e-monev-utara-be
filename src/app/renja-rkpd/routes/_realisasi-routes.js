import { Router } from "express";
import * as controller from "../controllers/_realisasi-controller.js";

const router = Router();

router.post("/list", controller.list);
router.post("/anggaran", controller.updateAnggaran);
router.post("/kinerja", controller.updateKinerja);

export default router;