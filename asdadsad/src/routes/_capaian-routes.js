import { Router } from "express";
import cekToken from "../middlewares/auth.js";
import { param } from "express-validator";
import { requestValidator } from "../middlewares/erros-handling.js";
import * as controller from "../controllers/_capaian-controller.js";


const router = Router();

router.use(cekToken);
router.get('/list/:skpd_periode_id/:tahun_ke',
       param('skpd_periode_id').isInt().notEmpty(),
       param('tahun_ke').isInt().notEmpty(),
       requestValidator,
       controller.getListCapaian
);
router.post('/update', controller.updateCapaian);

export default router;