import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";

export const listSub = async (req) => {
       const { skpd_periode_id, tahun_ke, bidang } = req.body;
       const skpd_periode = await prisma.skpd_periode.findUnique({
              where: { id: skpd_periode_id },
              include: {
                     skpd: true,
                     paguSkpd: {
                            where: { tahun_ke }
                     }
              }
       });

       let data_rekening = null;
       if (bidang) {
              // jika bidang dikirim, filter sub kegiatan berdasarkan bidang_id
              const master = await prisma.master.findMany({
                     where: {
                            type: "subKegiatan",
                            paguIndikatif: { some: { skpd_periode_id, tahun_ke } },
                            parent: {
                                   parent: {
                                          parent: {
                                                 // bidang ada di level ini
                                                 kode: bidang
                                          },
                                   },
                            },
                     },
                     include: {
                            parent: {
                                   include: {
                                          parent: {
                                                 include: {
                                                        parent: {
                                                               include: {
                                                                      parent: true,
                                                               },
                                                        },
                                                 },
                                          },
                                   },
                            },
                            paguIndikatif: { where: { skpd_periode_id, tahun_ke } },
                     },
              });

              data_rekening = buildHierarchy(master);
       } else {
              const master = await prisma.master.findMany({
                     where: {
                            type: "subKegiatan",
                            paguIndikatif: { some: { skpd_periode_id, tahun_ke } }
                     },
                     include: {
                            parent: { include: { parent: { include: { parent: { include: { parent: true } } } } } },
                            paguIndikatif: { where: { skpd_periode_id, tahun_ke } }
                     }
              });
              data_rekening = buildHierarchy(master);

       }
       return {
              data_rekening,
              data_skpd: {
                     kode: skpd_periode.skpd.kode,
                     nama: skpd_periode.skpd.name,
                     pagu: skpd_periode.paguSkpd[0]?.pagu
              }
       };
}


function buildHierarchy(data) {
       const result = [];

       for (const item of data) {
              const { parent, paguIndikatif } = item;

              // Ambil hierarki lengkap
              const urusan = parent.parent.parent.parent;
              const bidang = parent.parent.parent;
              const program = parent.parent;
              const kegiatan = parent;

              // Cari atau buat urusan
              let urusanNode = result.find(u => u.kode === urusan.kode);
              if (!urusanNode) {
                     const { id, kode, name, type } = urusan;
                     urusanNode = { id, kode, name, type, bidang: [] };
                     result.push(urusanNode);
              }

              // Cari atau buat bidang
              let bidangNode = urusanNode.bidang.find(b => b.kode === bidang.kode);
              if (!bidangNode) {
                     const { id, kode, name, type } = bidang;
                     bidangNode = { id, kode, name, type, program: [] };
                     urusanNode.bidang.push(bidangNode);
              }

              // Cari atau buat program
              let programNode = bidangNode.program.find(p => p.kode === program.kode);
              if (!programNode) {
                     const { id, kode, name, type } = program;
                     programNode = { id, kode, name, type, kegiatan: [] };
                     bidangNode.program.push(programNode);
              }

              // Cari atau buat kegiatan
              let kegiatanNode = programNode.kegiatan.find(k => k.kode === kegiatan.kode);
              if (!kegiatanNode) {
                     const { id, kode, name, type } = kegiatan;
                     kegiatanNode = { id, kode, name, type, subKegiatan: [] };
                     programNode.kegiatan.push(kegiatanNode);
              }

              // Tambahkan sub kegiatan
              kegiatanNode.subKegiatan.push({
                     id: item.id,
                     kode: item.kode,
                     name: item.name,
                     pagu: paguIndikatif?.[0]?.pagu ?? "0"
              });
       }

       return result;
}

export const detailSub = async (req) => {
       const { skpd_periode_id, sub_id, tahun_ke } = req.body;
       const exist = await prisma.master.findUnique({
              where: { id: sub_id, type: "subKegiatan" }
       });
       if (!exist) {
              throw new errorHandling(404, "Sub Kegiatan tidak ditemukan");
       }

       const subKegiatan = await prisma.master.findFirst({
              where: { id: sub_id, paguIndikatif: { some: { skpd_periode_id, tahun_ke } } },
              include: {
                     paguIndikatif: {
                            where: { skpd_periode_id, tahun_ke },
                            include: {
                                   skpdPeriode: { include: { skpd: true } }
                            }
                     },
                     indikator: {
                            where: { skpd_periode_id },
                            include: {
                                   rincian: { where: { tahun_ke } }
                            }
                     },
                     parent: { include: { parent: { include: { parent: { include: { parent: true } } } } } }
              }
       });
       const _kegiatan = subKegiatan.parent;
       const _program = _kegiatan.parent;
       const _bidang = _program.parent;
       const _urusan = _bidang.parent;
       const pagu = subKegiatan.paguIndikatif[0];
       const skpd = pagu.skpdPeriode.skpd;
       const indikator = subKegiatan.indikator.map(item => {
              return {
                     name: item.name,
                     target: `${item.rincian[0].target} ${item.satuan}`
              }
       });

       // return subKegiatan;

       return {
              skpd: `[${skpd.kode}] ${skpd.name}`,
              urusan: `[${_urusan.kode}] ${_urusan.name}`,
              bidang: `[${_urusan.kode}.${_bidang.kode}] ${_bidang.name}`,
              program: `[${_urusan.kode}.${_bidang.kode}.${_program.kode}] ${_program.name}`,
              kegiatan: `[${_urusan.kode}.${_bidang.kode}.${_program.kode}.${_kegiatan.kode}] ${_kegiatan.name}`,
              subKegiatan: `[${_urusan.kode}.${_bidang.kode}.${_program.kode}.${_kegiatan.kode}.${subKegiatan.kode}] ${subKegiatan.name}`,
              waktu: "Januari s/d Desember",
              pagu: pagu.pagu,
              lokasi: subKegiatan.indikator[0].lokasi,
              indikator

       };

}


