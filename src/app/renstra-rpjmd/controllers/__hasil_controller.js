import Joi from "joi";
import response from "../../../utility/response.js";
import * as service from "../services/__hasil-service.js";

export const listRpjmd = async (req, res, next) => {
       try {
              const schemaParams = Joi.object({
                     skpdPeriodeId: Joi.number().integer().required()
              })
              const { error: errorParams } = schemaParams.validate(req.params);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              const result = await service.listRpjmd(req);
              return response(res, 200, true, "List Laporan RPJMD berhasil diambil...", result);
       } catch (error) {
              next(error)
       }
}

export const listRenstra = async (req, res, next) => {
       try {
              const schemaParams = Joi.object({
                     skpdPeriodeId: Joi.number().integer().required()
              })
              const { error: errorParams } = schemaParams.validate(req.params);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              const result = await service.listLaporan(req);
              return response(res, 200, true, "List Laporan RENSTRA berhasil diambil...", result);
       } catch (error) {
              next(error)
       }
}

export const createUpdateCatatan = async (req, res, next) => {
       try {
              const schemaParams = Joi.object({
                     skpd_periode_id: Joi.number().integer().required(),
                     type: Joi.string().required(),
                     pendorong: Joi.string().required(),
                     penghambat: Joi.string().required(),
                     tl_1: Joi.string().required(),
                     tl_2: Joi.string().required(),
              });

              const { error: errorParams } = schemaParams.validate(req.body);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              return response(res, 200, true, "Berhasil mengubah catatan", await service.createUpdateCatatan(req));
       } catch (error) {
              next(error)
       }
}

export const getCatatan = async (req, res, next) => {
       try {
              const schemaParams = Joi.object({
                     skpd_periode_id: Joi.number().integer().required(),
                     type: Joi.string().required()
              });

              const { error: errorParams } = schemaParams.validate(req.body);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              return response(res, 200, true, "Berhasil mengubah catatan", await service.getCatatan(req));
       } catch (error) {
              next(error)
       }
}

export const listRpjmdAll = async (req, res, next) => {
       try {
              const schemaParams = Joi.object({
                     periode_id: Joi.number().integer().required()
              });

              const { error: errorParams } = schemaParams.validate(req.body);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              return response(res, 200, true, "Berhasil mengubah catatan", await service.listRpjmdAll(req));

       } catch (error) {
              next(error)
       }
}
