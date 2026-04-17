import Joi from "joi";
import response from "../../../utility/response.js";
import * as service from "../services/opd-service.js";

export const addOpd = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode: Joi.string().required(),
                     shortname: Joi.string().required(),
                     fullname: Joi.string().required(),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil menambahkan opd..", await service.addOpd(req));
       } catch (error) {
              next(error);
       }
}


export const updateOpd = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id: Joi.number().required(),
                     kode: Joi.string().required(),
                     shortname: Joi.string().required(),
                     fullname: Joi.string().required(),
                     status: Joi.boolean().required()

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil mengubah data opd", await service.updateOpd(req));
       } catch (error) {
              next(error);
       }
}

export const listOpd = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengambil list opd", await service.listOpd(req));
       } catch (error) {
              next(error);
       }
}