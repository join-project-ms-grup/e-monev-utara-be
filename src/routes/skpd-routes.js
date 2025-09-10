import { Router } from "express";
import cekToken from "../middlewares/auth.js";
import * as controller from "../controllers/skpd-controller.js"
import { devAdminAccess } from "../middlewares/role.js";
import { param } from "express-validator";
import { requestValidator } from "../middlewares/erros-handling.js";

const router = Router();


router.use(cekToken);

router.get("/list",
       devAdminAccess,
       controller.listSKPD);

router.post("/add",
       devAdminAccess,
       controller.skpdAdd);

router.put("/update/:id",
       devAdminAccess,
       param("id").isInt().withMessage("ID harus berupa angka"),
       requestValidator,
       controller.skpdUpdate);

router.delete("/delete/:id",
       devAdminAccess,
       param("id").isInt().withMessage("ID harus berupa angka"),
       requestValidator,
       controller.skpdDelete);

export default router;