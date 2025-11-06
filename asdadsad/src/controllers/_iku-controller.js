import Joi from "joi"
import response from "../utility/response.js"
import * as service from "../services/_iku-service.js"

export const tagIku = async (req, res, next) => {
       try {
              const schemaValidasi = Joi.object({
                     skpd_periode: Joi.array().items(Joi.number()).required(),
              });
              const { error } = schemaValidasi.validate(req.body);
              if (error) {
                     const respon = {
                            "pesanError": error.details[0].message
                     }
                     return response(res, 400, false, 'Validasi data gagal', respon)
              }

              const result = await service.tagIku(req);
              return response(res, 200, true, "Tag IKU berhasil dilakukan", result);
       } catch (error) {
              next(error)
       }
}