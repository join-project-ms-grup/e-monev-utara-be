import prisma from "./src/config/database.js";

const createKegiatan = async (kode, name, programId) => {
       return await prisma.master.create({
              data: {
                     kode,
                     name,
                     type: 'kegiatan',
                     parent_id: programId
              }
       });
}

const createProgram = async (kode, name, bidangId) => {
       return await prisma.master.create({
              data: {
                     kode,
                     name,
                     type: 'program',
                     parent_id: bidangId
              }
       });
}

const createBidang = async (kode, name, urusanId) => {
       return await prisma.master.create({
              data: {
                     kode,
                     name,
                     type: 'bidang',
                     parent_id: urusanId
              }
       });
}
const creteUrusan = async (kode, name) => {
       return await prisma.master.create({
              data: {
                     kode,
                     name,
                     type: 'urusan'
              }
       });
}

const fetchData = async () => {
       const kepmen = await fetch('https://gist.githubusercontent.com/rafinandika/e37c793576e01c52bda1a7591ee95359/raw/0345a03690e882efd64c5d0aa5fd6513870d5d64/Instrumen20250428.json').then(res => res.json());
       for (const urusan of kepmen) {
              const createdUrusan = await creteUrusan(urusan.kode, urusan.urusan);
              console.log(createdUrusan);
              for (const bidang of urusan.suburusan) {
                     const createdBidang = await createBidang(bidang.kode, bidang.suburusan, createdUrusan.id);
                     for (const program of bidang.program) {
                            const createdProgram = await createProgram(program.kode, program.program, createdBidang.id);
                            for (const kegiatan of program.kegiatan) {
                                   const createdKegiatan = await createKegiatan(kegiatan.kode, kegiatan.kegiatan, createdProgram.id);
                                   for (const subKegiatan of kegiatan.subkegiatan) {
                                          await prisma.master.create({
                                                 data: {
                                                        kode: subKegiatan.kode,
                                                        name: subKegiatan.subkegiatan,
                                                        type: 'subKegiatan',
                                                        parent_id: createdKegiatan.id
                                                 }
                                          });
                                   }
                            }
                     }
              }
       }
}

fetchData();