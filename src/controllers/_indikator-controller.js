import Joi from "joi";
import * as service from "../services/_indikator-service.js";
import response from "../utility/response.js";

export const addIndikator = async (req, res, next) => {
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
              const result = await service.addIndikator(req);
              return response(res, 201, true, "Indikator berhasil ditambahkan", result);
       } catch (e) {
              next(e);
       }
};

export const updateIndikator = async (req, res, next) => {
       try {
              // 🧩 Validasi params & body
              const schemaParams = Joi.object({
                     id: Joi.number().required(),
              });

              const schemaBody = Joi.object({
                     skpd_periode_id: Joi.number().optional(),
                     master_id: Joi.number().optional(),
                     name: Joi.string().required(),
                     satuan: Joi.string().required(),
                     target: Joi.array()
                            .items(
                                   Joi.object({
                                          tahun_ke: Joi.number().integer().min(1).required(),
                                          target: Joi.number().required(),
                                          pagu: Joi.number().required(),
                                   })
                            )
                            .min(1)
                            .required(),
              });

              const { error: errorParams } = schemaParams.validate(req.params);
              if (errorParams) {
                     const result = errorParams.details.map((item) => ({
                            [item.path.join(".")]: item.message,
                     }));
                     return response(res, 400, false, "Parameter ID indikator tidak valid", result);
              }

              const { error: errorBody } = schemaBody.validate(req.body);
              if (errorBody) {
                     const result = errorBody.details.map((item) => ({
                            [item.path.join(".")]: item.message,
                     }));
                     return response(res, 400, false, "Perhatikan parameter harus sesuai format yang diminta", result);
              }

              // ✅ Jalankan service
              const result = await service.updateIndikator(req);
              return response(res, 200, true, "Indikator berhasil diperbarui", result);
       } catch (e) {
              next(e);
       }
};

export const deleteIndikator = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id_indikator: Joi.number().required(),
              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              const result = await service.deleteIndikator(req);
              return response(res, 200, true, "Indikator berhasil dihapus", result);
       } catch (e) {
              next(e);
       }
};

export const listIndikator = async (req, res, next) => {
       try {
              const result = await service.listIndikator(req);
              return response(res, 200, true, "Berhasil mendapatkan daftar indikator", result);
       } catch (error) {
              next(error)
       }
}