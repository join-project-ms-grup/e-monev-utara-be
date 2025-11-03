import fs from "fs"
import response from "../src/utility/response.js";

function strukturkanData(data) {
       const result = [];

       for (const item of data) {
              // --- Level 1: Urusan
              let urusan = result.find(u => u.kode_urusan === item.kode_urusan);
              if (!urusan) {
                     urusan = {
                            kode_urusan: item.kode_urusan,
                            nama_urusan: item.nama_urusan,
                            pagu: 0,
                            children: []
                     };
                     result.push(urusan);
              }
              urusan.pagu += item.pagu || 0;

              // --- Level 2: Bidang Urusan
              let bidang = urusan.children.find(b => b.kode_bidang_urusan === item.kode_bidang_urusan);
              if (!bidang) {
                     bidang = {
                            kode_bidang_urusan: item.kode_bidang_urusan,
                            nama_bidang_urusan: item.nama_bidang_urusan,
                            pagu: 0,
                            children: []
                     };
                     urusan.children.push(bidang);
              }
              bidang.pagu += item.pagu || 0;

              // --- Level 3: Program
              let program = bidang.children.find(p => p.kode_program === item.kode_program);
              if (!program) {
                     program = {
                            kode_program: item.kode_program,
                            nama_program: item.nama_program,
                            outcome: item.outcome,
                            indikator_outcome: item.indikator_outcome,
                            pagu: 0,
                            children: []
                     };
                     bidang.children.push(program);
              }
              program.pagu += item.pagu || 0;

              // --- Level 4: Kegiatan
              let kegiatan = program.children.find(g => g.kode_giat === item.kode_giat);
              if (!kegiatan) {
                     kegiatan = {
                            kode_giat: item.kode_giat,
                            nama_giat: item.nama_giat,
                            pagu: 0,
                            children: []
                     };
                     program.children.push(kegiatan);
              }
              kegiatan.pagu += item.pagu || 0;

              // --- Level 5: Sub Kegiatan
              let sub = kegiatan.children.find(s => s.kode_sub_giat === item.kode_sub_giat);
              if (!sub) {
                     sub = {
                            kode_sub_giat: item.kode_sub_giat,
                            nama_sub_giat: item.nama_sub_giat,
                            indikator: item.tolak_ukur_output,
                            target: item.target_teks_output,
                            pagu: item.pagu || 0
                     };
                     kegiatan.children.push(sub);
              }
       }

       return result;
}

export const seedIndikator = (req, res, next) => {
       try {
              const data = JSON.parse(fs.readFileSync("./seeder/indikator/sdas.json", "utf-8"));
              const hasil = strukturkanData(data);
              return response(res, 200, true, "Berhasil", hasil);
       } catch (error) {
              next(error);
       }
}