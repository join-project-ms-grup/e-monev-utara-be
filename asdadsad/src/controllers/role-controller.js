import response from "../utility/response.js";
import * as service from "../services/role-service.js"
import Joi from "joi";

export const RoleListDev = async (req, res, next) => {
       try {
              const result = await service.getListDev();

              return response(res, 200, true, "Request data berhasil", result);
       } catch (e) {
              next(e);
       }
}

export const RoleList = async (req, res, next) => {
       try {
              const result = await service.getList();

              return response(res, 200, true, "Request data berhasil", result);
       } catch (e) {
              next(e);
       }
}

export const RoleAdd = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode: Joi.number().required(),
                     name: Joi.string().required()
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => { return { [item.path]: item.message } });
                     return response(res, 400, false, "Mohon maaf data belum sesuai format yang diminta", result);
              }

              // cntinue to service
              const result = await service.addRole(req);
              return response(res, 201, true, "Role berhasil ditambahkan", result);
       } catch (e) {
              next(e);
       }
}

export const RoleUpdate = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode: Joi.number().required(),
                     name: Joi.string().required()
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => { return { [item.path]: item.message } });
                     return response(res, 400, false, "Mohon maaf data belum sesuai format yang diminta", result);
              }

              // continue to service
              const result = await service.updateRole(req);
              return response(res, 200, true, "Role berhasil diupdate", result);
       } catch (e) {
              next(e);
       }
}

export const RoleDelete = async (req, res, next) => {
       try {
              const result = await service.deleteRole(req);

              return response(res, 200, true, "Role berhasil dihapus", result);
       } catch (e) {
              next(e);
       }
}