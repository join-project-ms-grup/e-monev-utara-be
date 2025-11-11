import prisma from "../../../config/database.js";
import { errorHandling } from "../../../middlewares/erros-handling.js";
import { v4 as uuid } from "uuid"
import * as dates from "date-and-time";
import bycrypt from "bcrypt"

export const LoginCheck = async (req) => {
       const username = req.body.username;
       const password = req.body.password;
       const user = await prisma.users.findFirst({
              where: { name: username },
              select: {
                     password: true,
                     id: true,
                     token: true,
                     session: true,
                     fullname: true,
                     role_id: true,
                     skpd_id: true,
                     name: true,
                     userRole: true,
                     userSkpd: true
              },
       });

       if (user == null || Object.keys(user).length === 0) {
              throw new errorHandling(400, 'Username atau password salah');
       }

       const cekPass = await bycrypt.compare(password, user.password);
       if (!cekPass) {
              throw new errorHandling(400, 'Username atau password salah');
       }

       let result = {};

       if (user.token === null) {
              result = await createSession(user);
       } else {
              const sessionMs = new Date(user.session).getTime();
              const nowMs = Date.now();
              const isExpired = !user.token || sessionMs <= nowMs;
              if (isExpired) {
                     result = await createSession(user);
              } else {
                     const times = dates.format(new Date(), 'YYYY-MM-DD HH:MM:SS');
                     result = {
                            nama: user.fullname,
                            token: user.token,
                            date: times,
                            roleId: user.userRole.kode || null,
                            roleName: user.userRole.name || null,
                            opdId: user.skpd_id || null,
                            username: user.name,
                     }
              }
       }

       return result;
}

const createSession = async (user) => {
       // create token
       const token = uuid();
       const date = new Date();
       date.setHours(24, 0, 0);
       const createToken = await prisma.users.update({
              data: {
                     token: token,
                     session: date
              },
              where: {
                     id: user.id
              }
       });
       const times = dates.format(date, 'YYYY-MM-DD HH:MM:SS');

       return {
              nama: user.fullname,
              token: createToken.token,
              date: times,
              roleId: user.userRole.kode || null,
              roleName: user.userRole.name || null,
              opdId: user.skpd_id || null,
              username: user.name,
       }


}