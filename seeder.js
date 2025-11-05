import prisma from "./src/config/database.js";
import bycrypt from "bcrypt"


const createRole = async () => {
       const createRole = await prisma.role.createMany({
              data: [
                     {
                            kode: 1,
                            name: 'Developer',
                     },
                     {
                            kode: 2,
                            name: 'Administrator',
                     },
                     {
                            kode: 3,
                            name: 'SKPD-RKPD',
                     },
                     {
                            kode: 4,
                            name: 'SKPD-DAK',
                     }
              ],
              skipDuplicates: true,
       });
       console.table(createRole);
}


const createMainUser = async () => {
       const dataUser = [
              {
                     name: 'developer-ms',
                     fullname: 'Developer',
                     email: 'dev.rafin@gmail.com',
                     role_id: 1,
                     skpd_id: null,
                     password: await bycrypt.hash('@2025dev', 10)
              },
              {
                     name: 'admin',
                     fullname: 'Administrator',
                     email: 'admin@gmail.com',
                     role_id: 2,
                     skpd_id: null,
                     password: await bycrypt.hash('@2025admin', 10)
              }
       ]
       const createUser = await prisma.users.createMany({
              data: dataUser,
              skipDuplicates: true,
       });
       console.table(createUser);
}


const seeder = async () => {
       // await createRole()
       await createMainUser()

}

seeder();
