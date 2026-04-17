import Joi from "joi";
import response from "../../../utility/response.js";
import * as service from "../services/rek-service.js";

export const listUrusan = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengambil list urusan", await service.listUrusan(req));
       } catch (error) {
              next(error)
       }
}

export const listBidang = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     urusan: Joi.number().required().allow(null),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil mengambil list bidang", await service.listBidang(req));
       } catch (error) {
              next(error);
       }
}
export const listProgram = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     urusan: Joi.number().required(),
                     bidang: Joi.number().required().allow(null),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil mengambil list program", await service.listProgram(req));
       } catch (error) {
              next(error);
       }
}
export const listKegiatan = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     urusan: Joi.number().required(),
                     bidang: Joi.number().required(),
                     program: Joi.number().required().allow(null),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil mengambil list kegiatan", await service.listKegiatan(req));
       } catch (error) {
              next(error);
       }
}

export const listSub = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     urusan: Joi.number().required(),
                     bidang: Joi.number().required(),
                     program: Joi.number().required(),
                     kegiatan: Joi.number().required().allow(null),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil mengambil list sub kegiatan", await service.listSub(req));
       } catch (error) {
              next(error);
       }
}

export const listAll = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengambil list semua rekening", await service.listAll(req));
       } catch (error) {
              next(error);
       }
}


export const addRek = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     type: Joi.string().required(),
                     parent_id: Joi.number().required().allow(null),
                     name: Joi.string().required(),
                     kode: Joi.string().required().allow(null),

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil menambahkan data rekening", await service.addRek(req));
       } catch (error) {
              next(error);
       }
}

export const updateRek = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id: Joi.number().required(),
                     name: Joi.string().required(),
                     kode: Joi.string().required(),
                     status: Joi.boolean().required()

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil mengubah data rekening", await service.updateRek(req));
       } catch (error) {
              next(error);
       }
}
