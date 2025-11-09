import prisma from "../../../config/database.js"
import response from "../../../utility/response.js";
import fs from "fs";

function strukturkanDataSederhana(data) {
       const result = [];

       for (const item of data) {
              // --- Level 1: Urusan
              let urusan = result.find(u => u.kode_urusan === item.kode_urusan);
              if (!urusan) {
                     urusan = {
                            kode_urusan: item.kode_urusan,
                            nama_urusan: item.nama_urusan,
                            children: []
                     };
                     result.push(urusan);
              }

              // --- Level 2: Bidang Urusan
              let bidang = urusan.children.find(b => b.kode_bidang_urusan === item.kode_bidang_urusan);
              if (!bidang) {
                     bidang = {
                            kode_bidang_urusan: item.kode_bidang_urusan,
                            nama_bidang_urusan: item.nama_bidang_urusan,
                            children: []
                     };
                     urusan.children.push(bidang);
              }

              // --- Level 3: Program
              let program = bidang.children.find(p => p.kode_program === item.kode_program);
              if (!program) {
                     program = {
                            kode_program: item.kode_program,
                            nama_program: item.nama_program,
                            children: []
                     };
                     bidang.children.push(program);
              }

              // --- Level 4: Kegiatan
              let kegiatan = program.children.find(g => g.kode_giat === item.kode_giat);
              if (!kegiatan) {
                     kegiatan = {
                            kode_giat: item.kode_giat,
                            nama_giat: item.nama_giat,
                            children: []
                     };
                     program.children.push(kegiatan);
              }

              // --- Level 5: Sub Kegiatan
              let sub = kegiatan.children.find(s => s.kode_sub_giat === item.kode_sub_giat);
              if (!sub) {
                     sub = {
                            kode_sub_giat: item.kode_sub_giat,
                            nama_sub_giat: item.nama_sub_giat
                     };
                     kegiatan.children.push(sub);
              }
       }

       return result;
}

const createMaster = async (type, name, kode, parent_id) => {
       const exist = await prisma.dak_master.findFirst({ where: { kode, parent_id: parent_id || null, type } });
       if (exist) {
              return exist;
       } else {
              return await prisma.dak_master.create({
                     data: {
                            type,
                            name,
                            kode,
                            parent_id: parent_id || null
                     }
              });
       }

}

const prosesData = async (data) => {
       const result = [];
       for (const u of data) {
              const urusan = await createMaster("urusan", u.nama_urusan, u.kode_urusan)

              const bid = [];
              for (const b of u.children) {
                     const bidang = await createMaster("bidang", b.nama_bidang_urusan, b.kode_bidang_urusan.split(".")[1], urusan.id);

                     const prog = [];
                     for (const p of b.children) {
                            const program = await createMaster("program", p.nama_program, p.kode_program.split('.')[2], bidang.id);

                            const giat = [];
                            for (const k of p.children) {
                                   const kodeGiat = k.kode_giat.split('.')[3] + "." + k.kode_giat.split('.')[4];
                                   const kegiatan = await createMaster("kegiatan", k.nama_giat, kodeGiat, program.id);

                                   const sub = [];
                                   for (const sk of k.children) {
                                          const subKegiatan = await createMaster("subKegiatan", sk.nama_sub_giat, sk.kode_sub_giat.split('.')[5], kegiatan.id);
                                          sub.push(subKegiatan);
                                   }
                                   giat.push({ ...kegiatan, sub })
                            }
                            prog.push({ ...program, giat })
                     }
                     bid.push({ ...bidang, prog });
              }
              result.push({ ...urusan, bid })
       }
       return result;


}



const seeder = async (req, res, next) => {
       try {
              const getskpd = await prisma.skpd.findMany({});

              const result = [];
              for (const s of getskpd) {
                     const filePath = `./src/app/renja-rkpd/seeder/renja-2026/${s.kode}.json`;

                     try {
                            if (!fs.existsSync(filePath)) {
                                   console.log(`File tidak ditemukan: ${filePath}, skip...`);
                                   continue; // lanjut ke iterasi berikutnya
                            }

                            const getFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                            const hasil = strukturkanDataSederhana(getFile);
                            result.push(await prosesData(hasil));

                            // result.push(await prosesData(tahun_ke, s.skpd_periode[0].id, hasil));
                     } catch (err) {
                            console.error(`Gagal memproses file ${filePath}:`, err.message);
                            continue; // skip jika error parsing atau lainnya
                     }
              }
              return response(res, 200, true, "Berhasil seed rekening", result);
       } catch (error) {
              next(error)
       }
}

export default seeder