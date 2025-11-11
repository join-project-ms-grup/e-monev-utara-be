import { Router } from "express";
import * as controller from "../controllers/tahun-controller.js"

const router = Router();

router.post("/set", controller.setTahun);
router.put("/update", controller.updateTahun);
router.patch("/status", controller.statusToggle);
router.get("/list", controller.listTahun)

export default router