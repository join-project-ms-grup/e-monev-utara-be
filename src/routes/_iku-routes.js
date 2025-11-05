import { Router } from "express";
import cekToken from "../middlewares/auth.js";

import * as controller from "../controllers/_iku-controller.js";

const router = Router();

router.use(cekToken);
router.post("/tag-iku", controller.tagIku);

export default router;