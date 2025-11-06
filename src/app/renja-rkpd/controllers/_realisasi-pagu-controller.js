import response from "../../../utility/response.js";
import * as service from "../services/_realisasi-pagu-service.js";
import Joi from "joi";

export const getRealisasiAnggaranList = async (req, res, next) => {
       try {
              const schemaParams = Joi.object({
                     skpd_periode_id: Joi.number().integer().required(),
                     tahun_ke: Joi.number().integer().required(),
              });

              const { error: errorParams } = schemaParams.validate(req.params);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              const result = await service.getRealisasiAnggaranList(req);
              return response(res, 200, true, "Berhasil mengambil data realisasi anggaran", result);
       } catch (error) {
              next(error);
       }
}

export const updateRealisasi = async (req, res, next) => {
       try {
              const schemaBody = Joi.object({
                     id_pagu: Joi.number().required(),
                     realisasi: Joi.array()
                            .items(
                                   Joi.object({
                                          triwulan: Joi.number().integer().min(1).max(4).required(),
                                          realisasi: Joi.number().required(),
                                   })
                            )
                            .min(4)
                            .required(),
              });

              const { error: errorBody } = schemaBody.validate(req.body);
              if (errorBody) {
                     return response(res, 400, false, errorBody.details[0].message);
              }
              const result = await service.updateRealisasi(req);
              return response(res, 200, true, "Berhasil mengubah data realisasi", result);
       } catch (error) {
              next(error);
       }
}