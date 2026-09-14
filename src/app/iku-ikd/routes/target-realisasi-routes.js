import { Router } from "express";
import * as controller from "../controllers/target-realisasi-controller.js"
import { param } from "express-validator";
import { requestValidator } from "../../../middlewares/erros-handling.js";

const router = Router();

router.get("/list-master", controller.listMaster);
router.post("/add-target", controller.addTarget);
router.put("/update-target", controller.updateTarget);
router.delete("/delete-target/:id",
       param("id").isNumeric(),
       requestValidator,
       controller.deleteTarget);
router.post("/list-target", controller.listTarget);
router.post("/list-target-iku", controller.listTargetIKU);
router.post("/list-target-ikd", controller.listTargetIKD);
router.post("/realisasi", controller.setRealisasi);
router.post("/get-hasil", controller.getHasilIKUIKD);
router.patch("/toggle-iku-ikd/:id",
       param("id").isNumeric(),
       requestValidator,
       controller.IKUtoggleIKD
);

export default router;