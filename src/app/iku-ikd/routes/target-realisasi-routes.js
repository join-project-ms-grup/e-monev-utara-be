import { Router } from "express";
import * as controller from "../controllers/target-realisasi-controller.js"
import { param } from "express-validator";
import { requestValidator } from "../../../middlewares/erros-handling.js";

const router = Router();

router.post("/list-target", controller.listTarget);
router.post("/list-target-iku", controller.listTargetIKU);
router.post("/list-target-ikd", controller.listTargetIKD);

router.patch("/toggle-iku-ikd/:id",
       param("id").isNumeric(),
       requestValidator,
       controller.IKUtoggleIKD
);

export default router;