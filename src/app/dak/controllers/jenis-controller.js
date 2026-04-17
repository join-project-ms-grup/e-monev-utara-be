import Joi from "joi";
import response from "../../../utility/response.js";
import * as service from "../services/jenis-service.js"

export const jenisDak = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengambil list jenis dak", await service.listJenis(req));
       } catch (error) {
              next(error);
       }
}

export const addSub = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode_jenis: Joi.number().required(),
                     nama: Joi.string().required(),
                     keterangan: Joi.string().required().allow(null),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil menambahkan sub jenis dak", await service.addSub(req));
       } catch (error) {
              next(error);
       }
}

export const listSub = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode_jenis: Joi.number().required(),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil menambahkan sub jenis dak", await service.listSub(req));
       } catch (error) {
              next(error)
       }
}

export const updateSub = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id: Joi.number().required(),
                     nama: Joi.string().required(),
                     keterangan: Joi.string().required().allow(null),
                     status: Joi.boolean().required()

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil menambahkan sub jenis dak", await service.updateSub(req));
       } catch (error) {
              next(error);
       }
}