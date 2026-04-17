import { Router } from "express";
import * as controller from "../controllers/skpd_periode-controller.js";
import { param } from "express-validator";
import { requestValidator } from "../../../middlewares/erros-handling.js";
import { devAdminAccess } from "../../../middlewares/role.js";

const router = Router();

router.get("/sinkron/:id",
       devAdminAccess,
       param("id").isNumeric().notEmpty(),
       requestValidator,
       controller.sinkronisasiSKPD
);
router.get("/list/:id",
       devAdminAccess,
       param("id").isNumeric().notEmpty(),
       requestValidator,
       controller.list
)

router.patch("/status/:id",
       devAdminAccess,
       param("id").isNumeric().notEmpty(),
       requestValidator,
       controller.statusToggle
);

export default router;