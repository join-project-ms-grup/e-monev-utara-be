import { Router } from "express";
import * as controller from "../controllers/bidang-controller.js";

const router = Router();

router.post("/add", controller.addBidang);
router.put("/update", controller.updateBidang);
router.post("/list", controller.listBidang)
router.post("/list-sub", controller.listSub)
router.post("/add-sub", controller.addSub);
router.put("/update-sub", controller.updateSub);


export default router;