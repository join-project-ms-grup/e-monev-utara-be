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
                     nama_paket: string.allow(null),
                     detail_paket: string.allow(null),
                     volume: number.allow(null),
                     satuan: string.allow(null),
                     estimasi: string.allow(null),
                     jumlah_penerima: string.allow(null),
                     anggaran: number.allow(null),
                     des_kel: string.allow(null),
                     kec: string.allow(null),
                     bujur: string.allow(null),
                     lintang: string.allow(null),
                     foto: string.allow(null),
                     mekanisme: string.valid('swakelola', 'kontrak', 'ekatalog'),
                     metode: string.allow(null),
                     volume_mekanisme: number.allow(null),
                     uang_mekanisme: number.allow(null),
                     dokumen: Joi.array().items(Joi.object({
                            id_berkas: number.allow(null),
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

              return response(res, 200, true, "Berhasil menambahkan identifikasi", await service.addIdent(req));
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

export const updateIdent = async (req, res, next) => {
       try {
              const string = Joi.string().required();
              const number = Joi.number().required();

              const schema = Joi.object({
                     id_ident: number,
                     sub_jenis_id: number,
                     sub_bidang_id: number,
                     tahun: number,
                     opd_id: number,
                     bidang_opd: string,
                     sub_kegiatan_id: number,
                     catatan: string.allow(null),
                     nama_paket: string.allow(null),
                     detail_paket: string.allow(null),
                     volume: number.allow(null),
                     satuan: string.allow(null),
                     estimasi: string.allow(null),
                     jumlah_penerima: string.allow(null),
                     anggaran: number.allow(null),
                     des_kel: string.allow(null),
                     kec: string.allow(null),
                     bujur: string.allow(null),
                     lintang: string.allow(null),
                     foto: string.allow(null),
                     mekanisme: string.valid('swakelola', 'kontrak', 'ekatalog'),
                     metode: string.allow(null),
                     volume_mekanisme: number.allow(null),
                     uang_mekanisme: number.allow(null)
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil menangubah identifikasi", await service.updateIdent(req));

       } catch (error) {
              next(error);
       }
}

export const updateFile = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id_dok: Joi.number().required(),
                     file: Joi.number().required().allow(null),
                     Kesesuaian: Joi.string().required().allow(null),
                     Waktu: Joi.string().required().allow(null),
                     Keterangan: Joi.string().required().allow(null),
                     pesan: Joi.string().required().allow(null),
              });

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil mengambil identifikasi", await service.updateFile(req));
       } catch (error) {
              next(error)
       }
}

export const updateTindakan = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     id_ident: Joi.number().required(),
                     status: Joi.string().required()
              })

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil mengubah tindakan...", await service.updateTindakan(req));
       } catch (error) {
              next(error)
       }
}

export const listMonit = async (req, res, next) => {
       try {
              const schema = Joi.object({
                     opd_id: Joi.number().required().allow(null),
                     sub_jenis: Joi.number().required().allow(null),
                     triwulan: Joi.number().required(),
                     tahun: Joi.number().required()
              })

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }
              return response(res, 200, true, "Berhasil mengambil list monitoring", await service.listMonit(req))
       } catch (error) {
              next(error)
       }
}



export const updateCapaian = async (req, res, next) => {
       try {
              const string = Joi.string().required();
              const number = Joi.number().required();

              const schema = Joi.object({
                     id_realisasi: number,
                     fisik: number,
                     anggaran: number,
                     sasaran_lokasi: Joi.boolean().allow(null),
                     kesesuaian_juknis: Joi.boolean().allow(null),
                     catatan: string.allow(null)
              })

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil mengubah realisasi", await service.updateCapaian(req));
       } catch (error) {
              next(error)
       }
}

export const toggleKunci = async (req, res, next) => {
       try {
              const string = Joi.string().required();
              const number = Joi.number().required();

              const schema = Joi.object({
                     id_realisasi: number,
              })

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil mengubah realisasi", await service.toggleKunci(req));
       } catch (error) {
              next(error)
       }
}

export const getMasalahCapaian = async (req, res, next) => {
       try {
              const string = Joi.string().required();
              const number = Joi.number().required();

              const schema = Joi.object({
                     id_realisasi: number,
              })

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil mengubah realisasi", await service.getMasalahCapaian(req));
       } catch (error) {
              next(error)
       }
}

export const updateMasalah = async (req, res, next) => {
       try {
              const string = Joi.string().required();
              const number = Joi.number().required();

              const schema = Joi.object({
                     id_realisasi: number,
                     masalah: string.allow(null),
                     masalah_lain: string.allow(null),
                     file_masalah: string.allow(null)
              })

              const { error } = schema.validate(req.body);
              if (error) {
                     const result = error.details.map((item) => ({
                            [item.path]: item.message,
                     }));
                     return response(res, 400, false, "Parameter tidak valid", result);
              }

              return response(res, 200, true, "Berhasil mengubah realisasi", await service.updateMasalah(req));
       } catch (error) {
              next(error)
       }
}