import Joi from "joi";
import * as service from "../services/skpd-service.js";
import response from "../../../utility/response.js";

export const listSKPD = async (req, res, next) => {
       try {
              const result = await service.listSKPD();
              return response(res, 200, true, "List SKPD", result);
       } catch (e) {
              next(e);
       }
}

export const skpdAdd = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode: Joi.number().required(),
                     name: Joi.string().required(),
                     shortname: Joi.string().required()
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => { return { [item.path]: item.message } });
                     return response(res, 400, false, "Mohon maaf data belum sesuai format yang diminta", result);
              }

              const result = await service.createSKPD(req);
              return response(res, 201, true, "SKPD berhasil ditambahkan", result);
       } catch (e) {
              next(e);
       }
}

export const skpdUpdate = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode: Joi.number().required(),
                     name: Joi.string().required(),
                     shortname: Joi.string().required(),
                     status: Joi.boolean().required()
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => { return { [item.path]: item.message } });
                     return response(res, 400, false, "Mohon maaf data belum sesuai format yang diminta", result);
              }

              const result = await service.updateSKPD(req);
              return response(res, 200, true, "SKPD berhasil diubah", result);
       } catch (e) {
              next(e);
       }
}

export const skpdDelete = async (req, res, next) => {
       try {
              const result = await service.deleteSKPD(req);
              return response(res, 200, true, "SKPD berhasil dihapus", result);
       } catch (e) {
              next(e);
       }
}