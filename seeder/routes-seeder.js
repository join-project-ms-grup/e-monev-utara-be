import { Router } from "express";
import { seedMaster } from "./master.js";
import { seedSkpd } from "./skpd.js";
import { seedPagu } from "./pagu.js";
import { seedIndikator } from "./indikator.js";


const router = Router();

router.get("/master", seedMaster);
router.get("/skpd", seedSkpd);
router.get("/pagu", seedPagu);
router.get("/indikator", seedIndikator);

export default router