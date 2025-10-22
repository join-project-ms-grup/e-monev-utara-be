import { Router } from "express";
import * as controller from "../controllers/_realisasi-pagu-controller.js";
import { requestValidator } from "../middlewares/erros-handling.js";
import cekToken from "../middlewares/auth.js";
import { param } from "express-validator";

const router = Router();

router.use(cekToken);
router.get("/list/:skpd_periode_id",
       param("skpd_periode_id").isInt().notEmpty(),
       requestValidator,
       controller.getRealisasiAnggaranList
);
router.post("/update", controller.updateRealisasi);

export default router;