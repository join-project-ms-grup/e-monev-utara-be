import Joi from "joi";
import response from "../../../utility/response.js";
import * as service from "../services/_renja-service.js";


export const listSub = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     skpd_periode_id: Joi.number().integer().required(),
                     tahun_ke: Joi.number().integer().required(),
                     bidang: Joi.string().required().allow(null),
              });
              const { error } = schema.validate(req.body);
              if (error) {
                     return response(res, 400, false, error.details[0].message);
              }
              return response(res, 200, true, "List Berhasil diambil", await service.listSub(req));
       } catch (error) {
              next(error);
       }
}

export const detailSub = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     sub_id: Joi.number().required(),
                     skpd_periode_id: Joi.number().required(),
                     tahun_ke: Joi.number().required(),
              });
              const { error } = schema.validate(req.body);
              if (error) {
                     return response(res, 400, false, error.details[0].message);
              }

              return response(res, 200, true, "Detail berhasil diambil", await service.detailSub(req));
       } catch (error) {
              next(error);
       }
}