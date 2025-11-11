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

export const rangkingSKPD = async (req, res, next) => {
       try {
              // 🧩 Validasi body
              const schema = Joi.object({
                     skpd_periode_id: Joi.number().required(),
                     master_id: Joi.number().required(),
                     name: Joi.string().required(),
                     satuan: Joi.string().required(),
                     target: Joi.array()
                            .items(
                                   Joi.object({
                                          tahun_ke: Joi.number().integer().min(1).required(),
                                          target: Joi.number().required(),
                                   })
                            )
                            .min(1)
                            .required(),
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path.join(".")]: item.message,
                     }));
                     return response(res, 400, false, "Perhatikan parameter harus sesuai format yang diminta", result);
              }

              // ✅ Jalankan service
              const result = await service.rangkingSKPD(req);
              return response(res, 201, true, "Berhasil mengambil data perangkingan", result);

       } catch (error) {
              next(error);
       }
}