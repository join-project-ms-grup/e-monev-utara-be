import response from "../utility/response.js";
import * as service from "../services/auth-service.js";
import Joi from "joi";

export const Login = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     username: Joi.string().required(),
                     password: Joi.string().required()
              });
              const { error, value } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => { return { [item.path]: item.message } });
                     return response(res, 400, false, "Perhatikan parameter harus sesuai format yang di minta", result);
              }

              const result = await service.LoginCheck(req);

              return response(res, 201, true, "Authenticated ...", result);
       } catch (e) {
              next(e);
       }
}