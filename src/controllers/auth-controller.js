import response from "../utility/response.js";
import * as service from "../services/auth-service.js";
import Joi from "joi";

export const Login = async (req, res, next) => {
       try {
              console.log('User Agent:', req.headers['user-agent']);
              const device = req.useragent?.isDesktop ? "Desktop" : req.useragent?.isMobile ? "Mobile" : "Unknown";
              const os = req.useragent?.os || "Unknown";
              const browser = req.useragent?.browser || "Unknown";
              console.log(`Device: ${device}, OS: ${os}, Browser: ${browser}`);
              const ip =
                     req.headers['x-forwarded-for']?.split(',').shift() ||
                     req.socket?.remoteAddress;

              console.log('IP Address:', ip);
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