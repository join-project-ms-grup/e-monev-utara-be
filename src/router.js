import { Router } from "express"
import response from "./utility/response.js";
import cekToken from "./middlewares/auth.js";

// import router config
import authConfig from "./app/konfigurasi/routes/auth-routes.js";
import periodeConfig from "./app/konfigurasi/routes/periode-routes.js";
import roleConfig from "./app/konfigurasi/routes/role-routes.js";
import skpdConfig from "./app/konfigurasi/routes/skpd-routes.js";
import userConfig from "./app/konfigurasi/routes/user-routes.js";
import seedSkpd from "./app/konfigurasi/seeder/skpd.js";


// import router renja-rjkpd
import infoRKPD from "./app/renja-rkpd/routes/_info-routes.js";
import skpdPeriodeRKPD from "./app/renja-rkpd/routes/skpd_periode_routes.js";
import masterRKPD from "./app/renja-rkpd/routes/_master-routes.js";
import renjaRKPD from "./app/renja-rkpd/routes/_renja-routes.js";
import paguRKPD from "./app/renja-rkpd/routes/_pagu-routes.js";
import indikatorRKPD from "./app/renja-rkpd/routes/_indikator-routes.js";
import realisasiRKPD from "./app/renja-rkpd/routes/_realisasi-routes.js";
import hasilRKPD from "./app/renja-rkpd/routes/__rkpd-routes.js";
import { seedPerencanaan } from "./app/renja-rkpd/seeder/perencanaan.js";

// import router renstra-rpjmd
import infoRENSTRA from "./app/renstra-rpjmd/routes/_info-routes.js";
import skpdPeriodeRENSTRA from "./app/renstra-rpjmd/routes/skpd_periode_routes.js";
import masterRENSTRA from "./app/renstra-rpjmd/routes/_master-routes.js";
import renjaRENSTRA from "./app/renstra-rpjmd/routes/_renja-routes.js";
import paguRENSTRA from "./app/renstra-rpjmd/routes/_pagu-routes.js";
import indikatorRENSTRA from "./app/renstra-rpjmd/routes/_indikator-routes.js";
import realisasiRENSTRA from "./app/renstra-rpjmd/routes/_realisasi-routes.js";
import hasilRENSTRA from "./app/renstra-rpjmd/routes/__hasil-routes.js";
import * as seedRENSTRA from "./app/renstra-rpjmd/seeder/perencanaan.js";



//import router iku-ikd
import { seedUraian } from "./app/iku-ikd/seeder/seeder-uraian.js";
import skpdIK from "./app/iku-ikd/routes/skpd-routes.js"
import targetRealisasiIK from "./app/iku-ikd/routes/target-realisasi-routes.js"


// import router dak
import tahunDAK from "./app/dak/routes/tahun-routes.js"
import rekDAK from "./app/dak/routes/rek-router.js"
import jenisDAK from "./app/dak/routes/jenis-routes.js";
import bidangDAK from "./app/dak/routes/bidang-routes.js";
import opdDAK from "./app/dak/routes/opd-routes.js";
import masalahDAK from "./app/dak/routes/masalah-router.js"
import fisikDAK from "./app/dak/routes/fisik-routes.js"
import seedDAK from "./app/dak/seeder/routes-seed.js";

const router = Router();

// Endpoint config
router.use("/config/auth", authConfig);
router.use("/config/periode", cekToken, periodeConfig);
router.use("/config/role", cekToken, roleConfig);
router.use("/config/skpd", cekToken, skpdConfig);
router.use("/config/user", cekToken, userConfig);
router.get("/config/seeder-skpd", cekToken, seedSkpd);


// Endpoint renja-rkpd
router.use("/rkpd/skpd-periode", cekToken, skpdPeriodeRKPD);
router.use("/rkpd/info", cekToken, infoRKPD);
router.use("/rkpd/master", cekToken, masterRKPD);
router.use("/rkpd/renja", cekToken, renjaRKPD);
router.use("/rkpd/pagu", cekToken, paguRKPD);
router.use("/rkpd/indikator", cekToken, indikatorRKPD);
router.use("/rkpd/realisasi", cekToken, realisasiRKPD);
// router.use("/rkpd/hasil", hasilRKPD);
router.use("/rkpd/hasil", cekToken, hasilRKPD);
router.get("/rkpd/seed-perencanaan/:mulai/:akhir/:tahun_ke/:ren", cekToken, seedPerencanaan);


// Endpoint renstra-rpjmd
router.use("/renstra/skpd-periode", cekToken, skpdPeriodeRENSTRA);
router.use("/renstra/info", cekToken, infoRENSTRA);
router.use("/renstra/master", cekToken, masterRENSTRA);
router.use("/renstra/renja", cekToken, renjaRENSTRA);
router.use("/renstra/pagu", cekToken, paguRENSTRA);
router.use("/renstra/indikator", cekToken, indikatorRENSTRA);
router.use("/renstra/realisasi", cekToken, realisasiRENSTRA);
router.use("/renstra/hasil", cekToken, hasilRENSTRA);
// router.use("/renstra/hasil", hasilRENSTRA);
router.get("/renstra/seed-perencanaan/:mulai/:akhir/:tahun_ke/:ren", cekToken, seedRENSTRA.seedPerencanaan);

//Endpoint iku-ikd
router.use("/ik/skpd", cekToken, skpdIK);
router.use("/ik/target-realisasi", cekToken, targetRealisasiIK);
router.get("/ik/seed-uraian", cekToken, seedUraian);

//Endpoint DAK
router.use("/dak/tahun", cekToken, tahunDAK);
router.use("/dak/rek", cekToken, rekDAK);
router.use("/dak/jenis", cekToken, jenisDAK);
router.use("/dak/bidang", cekToken, bidangDAK);
router.use("/dak/opd", cekToken, opdDAK)
router.use("/dak/masalah", cekToken, masalahDAK);
router.use("/dak/fisik", cekToken, fisikDAK);
router.use("/dak/seed", seedDAK);


router.use((req, res) => {
       response(res, 404, false, "path tidak ditemukan, coba lagi");
});
export default router;