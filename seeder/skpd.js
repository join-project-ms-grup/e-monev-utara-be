import fs from "fs"
import response from "../src/utility/response.js";
import prisma from "../src/config/database.js";

export const seedSkpd = async (req, res, next) => {
       try {
              const skpd = JSON.parse(fs.readFileSync('./seeder/skpd.json', 'utf8'));
              const result = [];
              for (const s of skpd) {
                     const set = await prisma.skpd.create({
                            data: {
                                   kode: s.kode_skpd,
                                   name: s.nama_skpd,
                                   author_id: 1
                            }
                     });
                     result.push(set);
              }
              return response(res, 200, true, "berhasil", result);

       } catch (error) {
              next(error);
       }
}