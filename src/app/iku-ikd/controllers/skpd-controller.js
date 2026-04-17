import response from "../../../utility/response.js";
import * as service from "../services/skpd-service.js";

export const list = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengambil list skpd", await service.listSkpd(req));
       } catch (error) {
              next(error);
       }
}