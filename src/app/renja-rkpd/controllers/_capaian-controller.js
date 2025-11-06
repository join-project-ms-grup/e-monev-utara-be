import Joi from "joi";
import response from "../../../utility/response.js";
import * as service from "../services/_capaian-service.js";

export const getListCapaian = async (req, res, next) => {
       try {
              const schemaParam = Joi.object({
                     skpd_periode_id: Joi.number().integer().required(),
                     tahun_ke: Joi.number().integer().required(),
              });

              const { error: errorParam } = schemaParam.validate(req.params);
              if (errorParam) {
                     return response(res, 400, false, errorParam.details[0].message);
              }

              const result = await service.getCapaianList(req);
              return response(res, 200, true, "List of Capaian", result);


       } catch (error) {
              next(error);
       }
}

export const updateCapaian = async (req, res, next) => {
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

              const result = await service.updateCapaian(req);
              return response(res, 200, true, "Capaian berhasil diupdate", result);
       } catch (error) {
              next(error);
       }
}