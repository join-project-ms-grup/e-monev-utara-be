import Joi from "joi";
import response from "../../../utility/response.js";
import * as service from "../services/masalah-service.js"

export const setMasalah = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode_jenis: Joi.number().required(),
                     name: Joi.string().required(),
                     keterangan: Joi.string().required().allow(null),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil menambahkan data masalah DAK", await service.setMasalah(req));
       } catch (error) {
              next(error);
       }
}

export const updateMasalah = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id: Joi.number().required(),
                     name: Joi.string().required(),
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
              return response(res, 200, true, "Berhasil mengubah data masalah DAK", await service.updateMasalah(req));
       } catch (error) {
              next(error);
       }
}

export const listMasalah = async (req, res, next) => {
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

              return response(res, 200, true, "Berhasil mengambil data masalah DAK", await service.listMasalah(req));
       } catch (error) {
              next(error)
       }

}