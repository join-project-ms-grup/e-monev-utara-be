import { Router } from "express";
import * as controller from "../controllers/opd-controller.js"


const router = Router();

router.post("/add", controller.addOpd);
router.put("/update", controller.updateOpd);
router.get("/list", controller.listOpd);

export default router