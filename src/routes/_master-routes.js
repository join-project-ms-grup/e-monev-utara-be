import { Router } from "express";
import * as controller from "../controllers/_master-controller.js";
import cekToken from "../middlewares/auth.js";
import { devAdminAccess } from "../middlewares/role.js";
import { param } from "express-validator";
import { requestValidator } from "../middlewares/erros-handling.js";

const router = Router();


router.use(cekToken);
router.post('/add',
       devAdminAccess,
       controller.addMaster
);
router.put('/update/:id',
       devAdminAccess,
       param('id').isNumeric().notEmpty(),
       requestValidator,
       controller.updateMaster
);
router.get('/list/urusan',
       controller.listUrusan
);
router.get('/list/children/:parentId',
       param('parentId').isNumeric().notEmpty(),
       requestValidator,
       controller.listChildren
);
router.get('/list/all',
       controller.getAllMaster
);
router.post('/children-from',
       controller.getHierarchyByType
);

export default router;