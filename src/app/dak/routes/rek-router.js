import { Router } from "express";
import * as controller from "../controllers/rek-controller.js";

const router = Router();

router.post("/list-urusan", controller.listUrusan);
router.post("/list-bidang", controller.listBidang);
router.post("/list-program", controller.listProgram);
router.post("/list-kegiatan", controller.listKegiatan);
router.post("/list-sub", controller.listSub);
router.get("/list-all", controller.listAll);
router.post("/add", controller.addRek);
router.put("/update", controller.updateRek);


export default router