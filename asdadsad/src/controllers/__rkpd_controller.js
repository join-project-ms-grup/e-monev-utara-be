import Joi from "joi";
import response from "../utility/response.js";
import * as service from "../services/__rkpd-service.js";

export const listLaporanTahunan = async (req, res, next) => {
       try {
              const schemaParams = Joi.object({
                     skpdPeriodeId: Joi.number().integer().required(),
                     tahunKe: Joi.number().integer().required(),
              });
              const { error: errorParams } = schemaParams.validate(req.params);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              const result = await service.listLaporanTahunan(req);
              return response(res, 200, true, "List Laporan RKPD berhasil diambil...", result);
       } catch (error) {
              next(error);
       }
}

export const listLaporan = async (req, res, next) => {
       try {
              const schemaParams = Joi.object({
                     skpdPeriodeId: Joi.number().integer().required()
              })
              const { error: errorParams } = schemaParams.validate(req.params);
              if (errorParams) {
                     return response(res, 400, false, errorParams.details[0].message);
              }
              const result = await service.listLaporan(req);
              return response(res, 200, true, "List Laporan RKPD berhasil diambil...", result);
       } catch (error) {
              next(error)
       }
}