import { Router } from "express";
import cekToken from "../middlewares/auth.js";
import { devAdminAccess } from "../middlewares/role.js";
import * as controller from "../controllers/_pagu-controller.js";
import { param } from "express-validator";
import { requestValidator } from "../middlewares/erros-handling.js";

const router = Router();

router.use(cekToken);
router.post("/add",
       devAdminAccess,
       controller.addPagu
);

router.put("/update",
       devAdminAccess,
       controller.updatePagu
);
router.delete("/delete",
       devAdminAccess,
       controller.deletePagu
);

router.get("/list/:skpd_periode_id",
       devAdminAccess,
       param("skpd_periode_id").isNumeric().notEmpty(),
       requestValidator,
       controller.getPaguList
);

export default router;