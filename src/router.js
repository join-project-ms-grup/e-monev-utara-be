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
import { seedPerencanaan } from "./app/renja-rkpd/seeder/perencanaan.js";
import infoRKPD from "./app/renja-rkpd/routes/_info-routes.js";
import skpdPeriodeRKPD from "./app/renja-rkpd/routes/skpd_periode_routes.js";
import masterRKPD from "./app/renja-rkpd/routes/_master-routes.js";
import renjaRKPD from "./app/renja-rkpd/routes/_renja-routes.js";
import paguRKPD from "./app/renja-rkpd/routes/_pagu-routes.js";
import indikatorRKPD from "./app/renja-rkpd/routes/_indikator-routes.js";
import capaianRKPD from "./app/renja-rkpd/routes/_capaian-routes.js";
import realisasiRKPD from "./app/renja-rkpd/routes/_realisasi-pagu-routes.js";
import hasilRKPD from "./app/renja-rkpd/routes/__rkpd-routes.js";

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
router.use("/rkpd/capaian", cekToken, capaianRKPD);
router.use("/rkpd/realisasi-anggaran", cekToken, realisasiRKPD);
router.use("/rkpd/hasil", cekToken, hasilRKPD);
router.get("/rkpd/seed-perencanaan/:mulai/:akhir/:tahun_ke/:ren", cekToken, seedPerencanaan);


router.use((req, res) => {
       response(res, 404, false, "path tidak ditemukan, coba lagi");
});
export default router;