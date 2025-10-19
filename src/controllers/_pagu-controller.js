import Joi from "joi";
import * as service from "../services/_pagu-service.js";
import response from "../utility/response.js";

export const addPagu = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     skpd_periode_id: Joi.number().required(),
                     master_id: Joi.number().required(),
                     target: Joi.array()
                            .items(
                                   Joi.object({
                                          tahun_ke: Joi.number().integer().min(1).required(),
                                          pagu: Joi.number().required(),
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
              const result = await service.addPagu(req);
              return response(res, 201, true, "Pagu berhasil ditambahkan", result);
       } catch (e) {
              next(e);
       }
}

export const updatePagu = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     skpd_periode_id: Joi.number().required(),
                     master_id: Joi.number().required(),
                     target: Joi.array()
                            .items(
                                   Joi.object({
                                          tahun_ke: Joi.number().integer().min(1).required(),
                                          pagu: Joi.number().required(),
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

              const result = await service.updatePagu(req);
              return response(res, 200, true, "Pagu berhasil diperbarui", result);
       } catch (e) {
              next(e);
       }
};

export const deletePagu = async (req, res, next) => {
       try {
              // Implementation for deleting pagu
       } catch (e) {
              next(e);
       }
}

export const getPaguList = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     skpd_periode_id: Joi.number().required(),
              });
              const { error } = schema.validate(req.params);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path.join(".")]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              const result = await service.listPagu(req);
              return response(res, 200, true, "Data pagu berhasil diambil", result);
       } catch (e) {
              next(e);
       }
};
