import { Router } from "express";
import { devAdminAccess } from "../../../middlewares/role.js";
import * as controller from "../controllers/_pagu-controller.js";
import { param } from "express-validator";
import { requestValidator } from "../../../middlewares/erros-handling.js";

const router = Router();

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
       param("skpd_periode_id").isNumeric().notEmpty(),
       requestValidator,
       controller.getPaguList
);

export default router;