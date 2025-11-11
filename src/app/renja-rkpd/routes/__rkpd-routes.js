import { Router } from "express";
import * as controller from "../controllers/__rkpd_controller.js";

const router = Router();

router.get("/laporan-tahunan/:skpdPeriodeId/:tahunKe", controller.listLaporanTahunan);
router.get("/laporan/:skpdPeriodeId", controller.listLaporan);

export default router;