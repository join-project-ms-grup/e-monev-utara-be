import prisma from "./src/config/database.js";
import bycrypt from "bcrypt"

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
       console.log(createUser);
}

createMainUser()