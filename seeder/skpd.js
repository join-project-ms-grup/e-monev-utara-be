import fs from "fs"
import prisma from "../src/config/database.js";

const seedSkpd = async () => {
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
              console.table(result);
       } catch (error) {
              next(error);
       }
}

seedSkpd();