import { Router } from "express";
import * as controller from "../controllers/__rkpd_controller.js";
import cekToken from "../middlewares/auth.js";

const router = Router();

router.use(cekToken);
router.get("/laporan-tahunan/:skpdPeriodeId/:tahunKe", controller.listLaporanTahunan);
router.get("/laporan/:skpdPeriodeId", controller.listLaporan);

export default router;