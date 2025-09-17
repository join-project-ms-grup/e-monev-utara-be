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
                            name: 'RKPD',
                     },
                     {
                            kode: 4,
                            name: 'DAK',
                     }
              ],
              skipDuplicates: true,
       });
       console.table(createRole);
}


const createMainUser = async () => {
       const password = await bycrypt.hash('admin123', 10);
       const createUser = await prisma.users.create({
              data: {
                     name: 'admin',
                     fullname: 'Administrator',
                     email: 'admin@mail.com',
                     role_id: 1,
                     skpd_id: null,
                     password: password,
                     created_at: new Date(),
                     updated_at: new Date(),
              }
       });
       console.table(createUser);
}


const seeder = async () => {
       await createRole()
       await createMainUser()

}

seeder();
