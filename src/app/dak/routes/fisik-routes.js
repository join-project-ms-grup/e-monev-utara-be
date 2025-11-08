import { Router } from "express";
import * as controller from "../controllers/fisik-controller.js";

const router = Router();

router.post("/add-ident", controller.addIdent);
router.post("/list-ident", controller.listIdent);

export default router;