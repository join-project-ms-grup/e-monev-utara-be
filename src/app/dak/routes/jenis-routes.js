import { Router } from "express";
import * as controller from "../controllers/jenis-controller.js"

const router = Router();

router.get("/list", controller.jenisDak)
router.post("/add-sub", controller.addSub);
router.post("/list-sub", controller.listSub);
router.put("/update-sub", controller.updateSub);


export default router