import { Router } from "express";
import cekToken from "../middlewares/auth.js";
import * as controller from "../controllers/_indikator-controller.js";
const router = Router();

router.use(cekToken);
router.post('/add', controller.addIndikator);

export default router;