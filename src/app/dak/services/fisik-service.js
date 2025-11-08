import prisma from "../../../config/database.js";

export const addSub = async (req) => {
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