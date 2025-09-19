import response from "../utility/response,js";

export const addIndikator = async (req, res, next) => {
       try {
              return response(res, 201, true, "Indikator berhasil ditambahkan", null);
       } catch (e) {
              next(e);
       }
}