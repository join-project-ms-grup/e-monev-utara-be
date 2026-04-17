import Joi from "joi";
import response from "../../../utility/response.js";
import * as infoService from "../services/_info-service.js";

export const DashboardCardData = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mendapatkan data", await infoService.dashboardCardData(req));
       } catch (error) {
              next(error);
       }
}

export const rangkinSKPD = async (req, res, next) => {
       try {
              // 🧩 Validasi body
              const schema = Joi.object({
                     periode_id: Joi.number().required(),
                     tahun_ke: Joi.number().required(),
                     triwulan: Joi.number().required()
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path.join(".")]: item.message,
                     }));
                     return response(res, 400, false, "Perhatikan parameter harus sesuai format yang diminta", result);
              }

              // ✅ Jalankan service
              const result = await infoService.rankingSKPD(req);
              return response(res, 201, true, "Berhasil mengambil data perangkingan", result);

       } catch (error) {
              next(error);
       }
}