import { Router } from "express";
import cekToken from "../middlewares/auth.js";
import * as controller from "../controllers/role-controller.js"
import { devAccess, devAdminAccess } from "../middlewares/role.js";
import { param } from "express-validator";
import { requestValidator } from "../middlewares/erros-handling.js";

const router = Router();

router.use(cekToken);

router.get("/list",
       devAdminAccess,
       controller.RoleList);

router.get("/list/dev",
       devAccess,
       controller.RoleListDev);

router.post("/add",
       devAccess,
       controller.RoleAdd);

router.put("/update/:id",
       devAccess,
       param('id').notEmpty().isNumeric(),
       requestValidator,
       controller.RoleUpdate);

router.delete("/delete/:id",
       devAdminAccess,
       param('id').notEmpty().isNumeric(),
       requestValidator,
       controller.RoleDelete);

export default router;