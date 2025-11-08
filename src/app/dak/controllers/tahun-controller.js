import Joi from "joi";
import response from "../../../utility/response.js"
import * as service from "../services/tahun-service.js";

export const setTahun = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     tahun: Joi.number().required(),
                     keterangan: Joi.string().required().allow(null)

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil menambahkan data tahun", await service.addTahun(req));
       } catch (error) {
              next(error)
       }
}

export const updateTahun = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id: Joi.number().required(),
                     tahun: Joi.number().required(),
                     keterangan: Joi.string().required().allow(null)

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil menambahkan data tahun", await service.updateTahun(req));
       } catch (error) {
              next(error)
       }
}

export const statusToggle = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id: Joi.number().required(),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil menambahkan data tahun", await service.statusToggle(req));
       } catch (error) {
              next(error)
       }
}

export const listTahun = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengambil list tahun", await service.listTahun(req));
       } catch (error) {
              next(error);
       }
}
