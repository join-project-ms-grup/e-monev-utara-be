import Joi from "joi";
import response from "../../../utility/response.js";
import * as service from "../services/target-realisasi-service.js";

export const listMaster = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengambil list Master", await service.listMaster())
       } catch (error) {
              next(error)
       }
}
export const addTarget = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     master: Joi.number().required(),
                     name: Joi.string().required(),
                     satuan: Joi.string().required(),
                     base_line: Joi.string().required(),
                     perhitungan: Joi.string().required(),
                     is_iku: Joi.number().required(),
                     target: Joi.array().items(
                            Joi.object({
                                   tahun: Joi.number().required(),
                                   tahun_ke: Joi.number().required(),
                                   target: Joi.string().required(),
                            })
                     )
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path.join(".")]: item.message,
                     }));
                     return response(res, 400, false, "Perhatikan parameter harus sesuai format yang diminta", result);
              }

              //menjalankan service
              return response(res, 200, true, "Berhasil menambahkan data target", await service.addTarget(req));
       } catch (error) {
              next(error)
       }
}
export const updateTarget = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id: Joi.number().required(),
                     master: Joi.number().required(),
                     name: Joi.string().required(),
                     satuan: Joi.string().required(),
                     base_line: Joi.string().required(),
                     perhitungan: Joi.string().required(),
                     is_iku: Joi.number().required(),
                     target: Joi.array().items(
                            Joi.object({
                                   id: Joi.number().required(),
                                   target: Joi.string().required(),
                            })
                     )
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path.join(".")]: item.message,
                     }));
                     return response(res, 400, false, "Perhatikan parameter harus sesuai format yang diminta", result);
              }

              //menjalankan service
              return response(res, 200, true, "Berhasil menambahkan data target", await service.updateTarget(req));
       } catch (error) {
              next(error)
       }
}

export const deleteTarget = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengubah posisi indikator", await service.deleteTarget(req));
       } catch (error) {
              next(error)
       }
}

export const listTarget = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     skpd_id: Joi.number().required().allow("all"),
                     periodeId: Joi.number().required()
              });

              const { error: errorParams } = schema.validate(req.body);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }

              return response(res, 200, true, "Berhasil mengambil list target", await service.listTarget(req));
       } catch (error) {
              next(error);
       }
}

export const listTargetIKU = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     skpd_id: Joi.number().required().allow("all"),
                     periodeId: Joi.number().required()
              });

              const { error: errorParams } = schema.validate(req.body);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }

              return response(res, 200, true, "Berhasil mengambil list target", await service.listTargetIKU(req));
       } catch (error) {
              next(error);
       }
}

export const listTargetIKD = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     skpd_id: Joi.number().required().allow("all"),
                     periodeId: Joi.number().required()
              });

              const { error: errorParams } = schema.validate(req.body);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }

              return response(res, 200, true, "Berhasil mengambil list target", await service.listTargetIKD(req));
       } catch (error) {
              next(error);
       }
}
export const IKUtoggleIKD = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengubah posisi indikator", await service.IKUtoggleIKD(req));
       } catch (error) {
              next(error)
       }
}

export const setRealisasi = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id_target: Joi.number().required(),
                     realisasi: Joi.required()
              });

              const { error: errorParams } = schema.validate(req.body);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              return response(res, 200, true, "Berhasil menambahkan realisasi", await service.setRealisasi(req));
       } catch (error) {
              next(error);
       }
}

export const getHasilIKUIKD = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     type: Joi.string().required(),
                     skpd_id: Joi.number().required().allow("all"),
                     periodeId: Joi.number().required()
              });

              const { error: errorParams } = schema.validate(req.body);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              return response(res, 200, true, "Berhasil mengambil list", await service.getHasilIKUIKD(req));
       } catch (error) {
              next(error)
       }
}