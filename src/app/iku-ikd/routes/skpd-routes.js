import { Router } from "express";
import * as controller from "../controllers/skpd-controller.js";
import { param } from "express-validator";
import { requestValidator } from "../../../middlewares/erros-handling.js";

const router = Router();

router.get("/list/:id",
       param("id").isNumeric().notEmpty(),
       requestValidator,
       controller.list
);

export default router;