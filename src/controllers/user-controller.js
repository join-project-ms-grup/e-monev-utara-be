import Joi from "joi";
import response from "../utility/response.js";
import * as service from "../services/user-service.js";


export const listUser = async (req, res, next) => {
       try {
              const result = await service.listUser();
              return response(res, 200, true, "List user", result);
       } catch (e) {
              next(e);
       }
}

export const userAdd = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     name: Joi.string().min(3).max(30).required(),
                     fullname: Joi.string().min(3).max(100).required(),
                     email: Joi.string().email().required(),
                     role_id: Joi.number().integer().required(),
                     skpd_id: Joi.number().integer().allow(null),
                     password: Joi.string().min(6).required(),
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => { return { [item.path]: item.message } });
                     return response(res, 400, false, "Mohon maaf data belum sesuai format yang diminta", result);
              }

              // Further processing like saving to database can be done here
              const result = await service.userCreate(req);
              return response(res, 201, true, "User created successfully", result);
       } catch (e) {
              next(e);
       }
}

export const updateUser = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     name: Joi.string().min(3).max(30).optional(),
                     fullname: Joi.string().min(3).max(100).optional(),
                     email: Joi.string().email().optional(),
                     role_id: Joi.number().integer().optional(),
                     skpd_id: Joi.number().integer().allow(null).optional(),
                     password: Joi.string().min(6).optional(),
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => { return { [item.path]: item.message } });
                     return response(res, 400, false, "Mohon maaf data belum sesuai format yang diminta", result);
              }

              // Further processing like updating in database can be done here
              const result = await service.userUpdate(req);
              return response(res, 200, true, "User updated successfully", result);
       } catch (e) {
              next(e);
       }
}


export const getUserById = async (req, res, next) => {
       try {
              const { id } = req.params;
              if (!id || isNaN(id)) {
                     return response(res, 400, false, "Invalid user ID");
              }

              // Further processing like fetching from database can be done here
              const result = await service.getUserById(id);
              return response(res, 200, true, "User details", result);
              // return response(res, 200, true, "User details", { id: parseInt(id) });

       } catch (e) {
              next(e);
       }
}

export const toggleStatusUser = async (req, res, next) => {
       try {
              const { id } = req.params;
              if (!id || isNaN(id)) {
                     return response(res, 400, false, "Invalid user ID");
              }

              // Further processing like toggling status in database can be done here
              const result = await service.toggleStatusUser(req);
              return response(res, 200, true, "User status toggled successfully", result);
              // return response(res, 200, true, "User status toggled successfully", { id: parseInt(id) });

       } catch (e) {
              next(e);
       }
}

export const deleteUser = async (req, res, next) => {
       try {
              const { id } = req.params;
              if (!id || isNaN(id)) {
                     return response(res, 400, false, "Invalid user ID");
              }

              // Further processing like deleting from database can be done here
              const result = await service.userDelete(req);
              return response(res, 200, true, "User deleted successfully", result);
              // return response(res, 200, true, "User deleted successfully", { id: parseInt(id) });     

       } catch (e) {
              next(e);
       }
}