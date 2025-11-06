import Joi from "joi";
import response from "../utility/response.js";
import * as service from "../services/_master-service.js";


export const addMaster = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode: Joi.string().max(30).required(),
                     name: Joi.string().min(3).max(100).required(),
                     type: Joi.string().valid('urusan', 'bidang', 'program', 'kegiatan', 'subKegiatan').required(), // Adjust types as needed
                     parent: Joi.number().optional().allow(null)
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => { return { [item.path]: item.message } });
                     return response(res, 400, false, "Mohon maaf data belum sesuai format yang diminta", result);
              }

              // Further processing like saving to database can be done here
              const result = await service.addMaster(req); // Replace with actual service call
              return response(res, 201, true, "Master created successfully", result);
       } catch (e) {
              next(e);
       }
}

export const updateMaster = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     kode: Joi.string().max(30).required(),
                     name: Joi.string().min(3).max(100).required(),
                     type: Joi.string().valid('urusan', 'bidang', 'program', 'kegiatan', 'subKegiatan').required(), // Adjust types as needed
                     parent: Joi.number().optional().allow(null)
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => { return { [item.path]: item.message } });
                     return response(res, 400, false, "Mohon maaf data belum sesuai format yang diminta", result);
              }

              // Further processing like saving to database can be done here
              const result = await service.updateMaster(req); // Replace with actual service call
              return response(res, 200, true, "Master updated successfully", result);
       } catch (e) {
              next(e);
       }
}

export const listUrusan = async (req, res, next) => {
       try {
              const result = await service.getListUrusan(req); // Replace with actual service call
              return response(res, 200, true, "List of Urusan retrieved successfully", result);
       } catch (e) {
              next(e);
       }
}
export const listChildren = async (req, res, next) => {
       try {
              const result = await service.getListChildren(req); // Replace with actual service call
              return response(res, 200, true, "List of Children retrieved successfully", result);
       } catch (e) {
              next(e);
       }
}

export const getAllMaster = async (req, res, next) => {
       try {
              const result = await service.getAllMaster(req); // Replace with actual service call
              return response(res, 200, true, "List of Master retrieved successfully", result);
       } catch (e) {
              next(e);
       }
}

export const getHierarchyByType = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     type: Joi.string()
                            .valid("urusan", "bidang", "program", "kegiatan", "subKegiatan")
                            .required(),
                     id_urusan: Joi.number().integer().min(1).optional(),
                     id_bidang: Joi.number().integer().min(1).optional(),
                     id_program: Joi.number().integer().min(1).optional(),
                     id_kegiatan: Joi.number().integer().min(1).optional(),
              });

              const { error, value } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Mohon maaf data belum sesuai format yang diminta", result);
              }

              const result = await service.getHierarchyByType(req);
              return response(res, 200, true, "Hierarchy retrieved successfully", result);
       } catch (e) {
              next(e);
       }
};
