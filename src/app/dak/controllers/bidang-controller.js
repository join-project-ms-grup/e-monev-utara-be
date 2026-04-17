import Joi from "joi";
import * as service from "../services/bidang-service.js";
import response from "../../../utility/response.js";

export const addBidang = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     jenis_dak: Joi.number().required(),
                     name: Joi.string().required(),
                     keterangan: Joi.string().required().allow(null)

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil menambahkan bidang", await service.addBidang(req));
       } catch (error) {
              next(error);
       }
}

export const updateBidang = async (req, res, next) => {
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

              return response(res, 200, true, "Berhasil mengubah bidang", await service.updateBidang(req));
       } catch (error) {
              next(error);
       }
}

export const listBidang = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     jenis_dak: Joi.number().required()

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

export const listSub = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     dak_bidangId: Joi.number().required()

              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil mengambil list sub bidang", await service.listSub(req));
       } catch (error) {
              next(error);
       }
}

export const addSub = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id_bidang: Joi.number().required(),
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

              return response(res, 200, true, "Berhasil menambahkan sub bidang", await service.addSub(req));
       } catch (error) {
              next(error);
       }
}

export const updateSub = async (req, res, next) => {
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

              return response(res, 200, true, "Berhasil mengubah  sub bidang", await service.updateSub(req));
       } catch (error) {
              next(error);
       }
}



