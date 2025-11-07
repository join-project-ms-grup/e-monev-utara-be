import Joi from "joi";
import response from "../../../utility/response.js"
import * as service from "../services/_realisasi-service.js"

export const list = async (req, res, next) => {
       try {
              const schemaParam = Joi.object({
                     skpd_periode_id: Joi.number().integer().required(),
                     tahun_ke: Joi.number().integer().required(),
              });

              const { error: errorParam } = schemaParam.validate(req.body);
              if (errorParam) {
                     return response(res, 400, false, errorParam.details[0].message);
              }

              // return response(res, 200, true, "berhasil mengambil list...", await getRealisasiAnggaranList(req));
              return response(res, 200, true, "berhasil mengambil list...", await service.list(req));
       } catch (error) {
              next(error)
       }
}

export const updateKinerja = async (req, res, next) => {
       try {
              const schemaBody = Joi.object({
                     id_rincian: Joi.number().required(),
                     capaian: Joi.array()
                            .items(
                                   Joi.object({
                                          triwulan: Joi.number().integer().min(1).max(4).required(),
                                          capaian: Joi.number().required(),
                                   })
                            )
                            .min(4)
                            .required(),
              });

              const { error: errorBody } = schemaBody.validate(req.body);
              if (errorBody) {
                     return response(res, 400, false, errorBody.details[0].message);
              }

              const result = await service.updateKinerja(req);
              return response(res, 200, true, "Capaian berhasil diupdate", result);
       } catch (error) {
              next(error);
       }
}

export const updateAnggaran = async (req, res, next) => {
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
              const result = await service.updateAnggaran(req);
              return response(res, 200, true, "Berhasil mengubah data realisasi", result);
       } catch (error) {
              next(error);
       }
}