import { Router } from "express";
import * as controller from "../controllers/fisik-controller.js";
import { param } from "express-validator";
import { requestValidator } from "../../../middlewares/erros-handling.js";

const router = Router();

router.post("/add-ident", controller.addIdent);
router.put("/update-ident", controller.updateIdent);
router.put("/update-file", controller.updateFile);
router.patch("/update-tindakan", controller.updateTindakan);
router.post("/list-ident", controller.listIdent);
router.get("/:id/detail-ident",
       param("id").isNumeric().notEmpty(),
       requestValidator,
       controller.detailIdent
);

export default router;