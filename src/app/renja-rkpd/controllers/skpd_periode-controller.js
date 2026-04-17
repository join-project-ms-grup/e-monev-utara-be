import response from "../../../utility/response.js";
import * as service from "../services/skpd_periode-service.js"

export const sinkronisasiSKPD = async (req, res, next) => {
       try {
              const result = await service.sinkronisasiSKPD(req);
              return response(res, 200, true, "Berhasil sinkronisasi SKPD ke Periode Evaluasi", result);
       } catch (error) {
              next(error);
       }
}

export const list = async (req, res, next) => {
       try {
              return response(res, 200, true, "List berhasil diambil", await service.list(req));
       } catch (error) {
              next(error)
       }
}

export const statusToggle = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengubah status", await service.statusToggle(req));
       } catch (error) {
              next(error);
       }
}