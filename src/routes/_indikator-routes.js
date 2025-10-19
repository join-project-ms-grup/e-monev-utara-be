import { Router } from "express";
import cekToken from "../middlewares/auth.js";
import * as controller from "../controllers/_indikator-controller.js";
import { param } from "express-validator";
import { devAdminAccess } from "../middlewares/role.js";
import { requestValidator } from "../middlewares/erros-handling.js";
const router = Router();

router.use(cekToken);
router.post('/add',
       devAdminAccess,
       controller.addIndikator
);

router.put('/update/:id',
       devAdminAccess,
       param('id').isNumeric().notEmpty(),
       controller.updateIndikator
);
router.delete('/delete',
       devAdminAccess,
       controller.deleteIndikator);

router.get('/list/:skpd_periode_id',
       devAdminAccess,
       param('skpd_periode_id').isNumeric().notEmpty(),
       requestValidator,
       controller.listIndikator
);

export default router;