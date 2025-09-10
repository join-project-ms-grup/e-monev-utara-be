import Joi from 'joi';
import * as service from '../services/periode-service.js';
import response from '../utility/response.js';

export const listPeriode = async (req, res, next) => {
       try {
              const result = await service.listPeriode();
              return response(res, 200, true, "List Periode berhasil diambil...", result);
       } catch (e) {
              next(e);
       }
}

export const addPeriode = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     mulai: Joi.date().required(),
                     akhir: Joi.date().required(),
                     status: Joi.boolean().required()
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     return response(res, 400, false, "Mohon maaf data belum sesuai dengan format yang diminta..", error.details[0].message);
              }

              const result = await service.addPeriode(req);
              return response(res, 201, true, "Periode berhasil ditambahkan...", result);
       } catch (e) {
              next(e);
       }
}

export const updatePeriode = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     mulai: Joi.date().required(),
                     akhir: Joi.date().required(),
                     status: Joi.boolean().required()
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     return response(res, 400, false, "Mohon maaf data belum sesuai dengan format yang diminta..", error.details[0].message);
              }

              const result = await service.updatePeriode(req);
              return response(res, 200, true, "Periode berhasil diupdate...", result);
       } catch (e) {
              next(e);
       }
}

export const deletePeriode = async (req, res, next) => {
       try {
              const result = await service.deletePeriode(req);
              return response(res, 200, true, "Periode berhasil dihapus...", result);
       } catch (e) {
              next(e);
       }
}      