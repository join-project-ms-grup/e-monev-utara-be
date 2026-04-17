import { Router } from "express";
import seedRek from "./seeder-rekening.js";
import * as seedMaster from "./seeder-master-dak.js";

const router = Router();

router.get("/rek", seedRek);
router.get("/jenis", seedMaster.seedJenisDak);
router.get("/sub-jenis", seedMaster.seedSubJenisDAKFisik);
router.get("/bidang", seedMaster.bidangDAK);
router.get("/masalah-fisik", seedMaster.seedMasalahFisik);
router.get("/berkas-fisik", seedMaster.seedBerkasFisik);


export default router;