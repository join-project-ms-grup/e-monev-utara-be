import { Router } from "express";
import * as controller from '../controllers/periode-controller.js';
import cekToken from "../middlewares/auth.js";
import { devAdminAccess } from "../middlewares/role.js";
import { param } from "express-validator";
import { requestValidator } from "../middlewares/erros-handling.js";

const router = Router();

router.use(cekToken);
router.get('/list', controller.listPeriode);
router.post('/add', devAdminAccess, controller.addPeriode);
router.put('/update/:id', devAdminAccess, param('id').isNumeric(), requestValidator, controller.updatePeriode);
router.delete('/delete/:id', devAdminAccess, param('id').isNumeric(), requestValidator, controller.deletePeriode);
router.get('/skpd/:id', param('id').isNumeric(), requestValidator, controller.getSKPDByPeriodeId);

export default router;