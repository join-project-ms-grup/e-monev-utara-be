import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const addIdent = async (req) => {
       const {
              sub_jenis_id,
              sub_bidang_id,
              tahun,
              opd_id,
              bidang_opd,
              sub_kegiatan_id,
              catatan,
              nama_paket,
              detail_paket,
              volume,
              satuan,
              estimasi,
              jumlah_penerima,
              anggaran,
              des_kel,
              kec,
              bujur,
              lintang,
              foto,
              mekanisme,
              metode,
              dokumen
       } = req.body;

       const setIndent = await prisma.fisik_ident.create({
              data: {
                     sub_jenis: sub_jenis_id,
                     sub_bidang_dak: sub_bidang_id,
                     tahun,
                     opd_id,
                     bidangOpd: bidang_opd,
                     sub_kegiatan: sub_kegiatan_id,
                     catatan,
                     detail: {
                            create: {
                                   nama_paket,
                                   detail_paket,
                                   volume,
                                   satuan,
                                   estimasi,
                                   jumlah_penerima,
                                   anggaran,
                                   des_kel,
                                   kec,
                                   bujur,
                                   lintang,
                                   foto
                            }
                     },
                     mekanisme: {
                            create: {
                                   mekanisme,
                                   metode
                            }
                     },
                     fisikRealisasis: {
                            createMany: {
                                   data: [{ triwulan: 1 }, { triwulan: 2 }, { triwulan: 3 }, { triwulan: 4 }]
                            }
                     },
                     fisikDokumens: {
                            createMany: { data: [...dokumen] }
                     }

              }
       });

       return setIndent;
}

export const listIdent = async (req) => {
       const { tahun, opd_id, sub_jenis } = req.body

       const getIdent = await prisma.fisik_ident.findMany({
              where: {
                     tahun,
                     ...(opd_id && { opd_id }),          // hanya masuk kalau opd_id ada
                     ...(sub_jenis && { sub_jenis }),    // hanya masuk kalau sub_jenis ada
              },
              include: {
                     detail: true,
                     mekanisme: true,
                     subKegiatan: { include: { parent: { include: { parent: true } } } },
                     subBidang: { include: { dakBidang: true } },
                     subJenis: true,
                     opd: true,
              },
       });

       if (getIdent.length === 0) return [];

       const result = [];
       for (const ind of getIdent) {
              result.push({
                     id_ident: ind.id,
                     opd: ind.opd.fullname,
                     sub_jenis: ind.subJenis.nama,
                     bidang: `${ind.subBidang.dakBidang.name} (${ind.subBidang.name})`,
                     rekening: `${ind.subKegiatan.parent.parent.name}/${ind.subKegiatan.parent.name}/${ind.subKegiatan.name}`,
                     paket_detail: `${ind.detail.nama_paket}/${ind.detail.detail_paket} (${ind.detail.volume} ${ind.detail.satuan})`,
                     anggaran: ind.detail.anggaran
              })
       }
       return groupIdent(result);
}

function groupIdent(data) {
       const result = [];

       for (const item of data) {
              // 🔹 Cek apakah sudah ada OPD ini
              let opd = result.find(o => o.opd === item.opd);
              if (!opd) {
                     opd = { opd: item.opd, sub: [] };
                     result.push(opd);
              }

              // 🔹 Cek apakah sub_jenis sudah ada di dalam OPD ini
              let sub = opd.sub.find(s => s.nama === item.sub_jenis);
              if (!sub) {
                     sub = { nama: item.sub_jenis, row: [] };
                     opd.sub.push(sub);
              }

              // 🔹 Masukkan data selain opd & sub_jenis
              const { opd: _, sub_jenis: __, ...rowData } = item;
              sub.row.push(rowData);
       }

       return result;
}

export const detailIdent = async (req) => {
       const id = parseInt(req.params.id);
       const getIdent = await prisma.fisik_ident.findFirst({
              where: { id },
              include: {
                     detail: true,
                     mekanisme: true,
                     subKegiatan: { include: { parent: { include: { parent: { include: { parent: { include: { parent: true } } } } } } } },
                     subBidang: { include: { dakBidang: true } },
                     subJenis: { include: { dakJenis: true } },
                     opd: true,
                     fisikDokumens: {
                            include: { jenis_berkas: true }
                     }
              },
       });

       if (!getIdent) throw new errorHandling(404, "tidak menemukan data identifikasi");

       const subKegiatan = getIdent.subKegiatan;
       const kegiatan = subKegiatan.parent;
       const program = kegiatan.parent;
       const bidang = program.parent;
       const urusan = bidang.parent

       const result = {
              jenis_dak_id: getIdent.subJenis.dakJenis.id,
              jenis_dak: getIdent.subJenis.dakJenis.jenis,
              sub_jenis_dak_id: getIdent.subJenis.id,
              sub_jenis_dak: getIdent.subJenis.nama,
              tahun: getIdent.tahun,
              kab_kot: "Kabupaten Bengkulu Utara",
              opd_id: getIdent.opd.id,
              opd: getIdent.opd.fullname,
              bidang_opd: getIdent.bidangOpd,
              urusan_id: urusan.id,
              urusan_kode: urusan.kode,
              urusan: urusan.name,
              bidang_id: bidang.id,
              bidang_kode: bidang.kode,
              bidang: bidang.name,
              program_id: program.id,
              program_kode: program.kode,
              program: program.name,
              kegiatan_id: kegiatan.id,
              kegiatan_kode: kegiatan.kode,
              kegiatan: kegiatan.name,
              subKegiatan_id: subKegiatan.id,
              subKegiatan_kode: subKegiatan.kode,
              subKegiatan: subKegiatan.name,
              catatan: getIdent.catatan,
              verif_status: getIdent.verifikasi,
              nama_paket: getIdent.detail.nama_paket,
              detail_paket: getIdent.detail.detail_paket,
              volume: getIdent.detail.volume,
              satuan: getIdent.detail.satuan,
              estimasi_waktu: getIdent.detail.estimasi,
              jumlah_penerima_manfaat: getIdent.detail.jumlah_penerima,
              anggaran_dak: getIdent.detail.anggaran,
              desa_kel: getIdent.detail.des_kel,
              kec: getIdent.detail.kec,
              bujur: JSON.parse(getIdent.detail.bujur),
              lintang: JSON.parse(getIdent.detail.lintang),
              foto_kegiatan: getIdent.detail.foto,
              mekanisme: getIdent.mekanisme.mekanisme,
              mekanisme_volume: getIdent.mekanisme.volume,
              mekanisme_uang: getIdent.mekanisme.uang,
              metode_pembayaran: getIdent.mekanisme.metode,
              dokumen: getIdent.fisikDokumens
       }
       return result;
}

export const updateIdent = async (req) => {
       const {
              id_ident,
              sub_jenis_id,
              sub_bidang_id,
              tahun,
              opd_id,
              bidang_opd,
              sub_kegiatan_id,
              catatan,
              nama_paket,
              detail_paket,
              volume,
              satuan,
              estimasi,
              jumlah_penerima,
              anggaran,
              des_kel,
              kec,
              bujur,
              lintang,
              foto,
              mekanisme,
              metode,
              dokumen
       } = req.body;

       const exist = await prisma.fisik_ident.findUnique({ where: { id: id_ident } });
       if (!exist) throw new errorHandling(404, "ident tidak ditemukan");

       const setIndent = await prisma.fisik_ident.update({
              where: { id: id_ident },
              data: {
                     sub_jenis: sub_jenis_id,
                     sub_bidang_dak: sub_bidang_id,
                     tahun,
                     opd_id,
                     bidangOpd: bidang_opd,
                     sub_kegiatan: sub_kegiatan_id,
                     catatan,
                     detail: {
                            update: {
                                   nama_paket,
                                   detail_paket,
                                   volume,
                                   satuan,
                                   estimasi,
                                   jumlah_penerima,
                                   anggaran,
                                   des_kel,
                                   kec,
                                   bujur,
                                   lintang,
                                   foto
                            }
                     },
                     mekanisme: {
                            update: {
                                   mekanisme,
                                   metode
                            }
                     }

              }
       });

       return setIndent;
}


export const updateFile = async (req) => {
       const { id_dok, file, Kesesuaian, Waktu, Keterangan, pesan } = req.body;
       const exist = await prisma.fisik_dokumen.findUnique({ where: { id: id_dok } });

       if (!exist) throw new errorHandling(404, "File tidak ditemukan");

       const update = await prisma.fisik_dokumen.update({
              where: { id: id_dok },
              data: { file, Kesesuaian, Waktu, Keterangan, pesan }
       });

       return update
}

export const updateTindakan = async (req) => {
       const { id_ident, status } = req.body;

       const exist = await prisma.fisik_ident.findUnique({ where: { id: id_ident } });
       if (!exist) throw new errorHandling(404, "Tidak menemukan data identifikasi");

       const patch = await prisma.fisik_ident.update({
              where: { id: id_ident },
              data: { verifikasi: status }
       });
       return patch
}