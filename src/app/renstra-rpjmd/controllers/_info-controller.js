import response from "../../../utility/response.js";
import * as infoService from "../services/_info-service.js";

export const DashboardCardData = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mendapatkan data", await infoService.dashboardCardData(req));
       } catch (error) {
              next(error);
       }
}