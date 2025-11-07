import Joi from "joi";
import response from "../../../utility/response.js";
import * as service from "../services/target-realisasi-service.js";

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