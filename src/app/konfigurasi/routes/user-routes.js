import { Router } from "express";
import * as controller from "../controllers/user-controller.js"
import { devAdminAccess } from "../../../middlewares/role.js";
const router = Router();

router.get("/list",
       devAdminAccess,
       controller.listUser);

router.post("/add",
       devAdminAccess,
       controller.userAdd);
router.put("/update/:id",
       devAdminAccess,
       controller.updateUser);

router.put("/change-password",
       devAdminAccess,
       controller.changePassword);

router.delete("/delete/:id",
       devAdminAccess,
       controller.deleteUser);

router.patch("/status/:id",
       devAdminAccess,
       controller.toggleStatusUser);


export default router;