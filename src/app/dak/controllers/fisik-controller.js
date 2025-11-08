import Joi from "joi"
import * as service from "../services/fisik-service.js"
import response from "../../../utility/response.js";

export const addIdent = async (req, res, next) => {
       try {
              const string = Joi.string().required();
              const number = Joi.number().required();

              const schema = Joi.object({
                     sub_jenis_id: number,
                     sub_bidang_id: number,
                     tahun: number,
                     opd_id: number,
                     bidang_opd: string,
                     sub_kegiatan_id: number,
                     catatan: string.allow(null),
                     nama_paket: string,
                     detail_paket: string,
                     volume: number,
                     satuan: string,
                     estimasi: string,
                     jumlah_penerima: string,
                     anggaran: number,
                     des_kel: string,
                     kec: string,
                     bujur: string,
                     lintang: string,
                     foto: string.allow(null),
                     mekanisme: string.valid('swakelola', 'kontrak', 'ekatalog'),
                     metode: string,
                     dokumen: Joi.array().items(Joi.object({
                            id_berkas: number,
                            file: string.allow(null),
                            Waktu: string.allow(null),
                            Keterangan: string.allow(null)

                     })).required()
              });
              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil menambahkan identifikasi", await service.addSub(req));
       } catch (error) {
              next(error)
       }
}

export const listIdent = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     tahun: Joi.number().required(),
                     opd_id: Joi.number().required().allow(null),
                     sub_jenis: Joi.number().required().allow(null)
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }


              return response(res, 200, true, "Berhasil mengambil identifikasi", await service.listIdent(req));
       } catch (error) {

       }
}

export const detailIdent = async (req, res, next) => {
       try {
              return response(res, 200, true, "Berhasil mengambil detail ident", await service.detailIdent(req));
       } catch (error) {
              next(error);
       }
}