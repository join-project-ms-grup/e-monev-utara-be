import { Router } from "express";
import * as controller from "../controllers/_realisasi-pagu-controller.js";

const router = Router();

router.get("/list/:skpd_periode_id/:tahun_ke", controller.getRealisasiAnggaranList);
router.post("/update", controller.updateRealisasi);

export default router;