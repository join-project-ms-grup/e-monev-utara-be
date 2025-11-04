import { Router } from "express";
import { seedMaster } from "./master.js";
import { seedSkpd } from "./skpd.js";
import { seedPagu } from "./pagu.js";
import { seedPerencanaan } from "./perencanaan.js";


const router = Router();

router.get("/master", seedMaster);
router.get("/skpd", seedSkpd);
router.get("/pagu", seedPagu);
router.get("/perencanaan", seedPerencanaan);

export default router