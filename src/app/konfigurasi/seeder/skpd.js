import fs from "fs"
import prisma from "../../../config/database.js";
import response from "../../../utility/response.js";

const seedSkpd = async (req, res, next) => {
       try {
              const skpd = JSON.parse(fs.readFileSync('./src/app/konfigurasi/seeder/skpd.json', 'utf8'));
              const result = [];
              for (const s of skpd) {
                     const exist = await prisma.skpd.findFirst({ where: { kode: s.kode_skpd } });
                     if (exist) {
                            const update = await prisma.skpd.update({
                                   where: { id: exist.id },
                                   data: {
                                          kode: s.kode_skpd,
                                          name: s.nama_skpd,
                                          author_id: 1
                                   }
                            });
                            result.push(update);
                     } else {
                            const set = await prisma.skpd.create({
                                   data: {
                                          kode: s.kode_skpd,
                                          name: s.nama_skpd,
                                          author_id: 1
                                   }
                            });
                            result.push(set);
                     }
              }
              return response(res, 200, true, "Behasil seed skpd", result);
       } catch (error) {
              next(error);
       }
}

export default seedSkpd;