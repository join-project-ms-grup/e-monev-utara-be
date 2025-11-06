import prisma from "../config/database.js";
import response from "../utility/response.js";

const cekToken = async (req, res, next) => {
       const token = req.get('Authorization')
       if (!token) {
              const respon = {
                     "pesanError": "Token tidak di set pada header"
              }
              return response(res, 401, false, 'Request data gagal', respon)
       }

       const tokenResult = token.replace("Bearer ", "");
       const user = await prisma.users.findFirst({
              where: {
                     token: tokenResult
              }
       })

       if (!user) {
              const respon = {
                     "pesanError": "Token tidak valid dan tidak terdaftar"
              }
              return response(res, 401, false, 'Request data gagal', respon)
       }

       const dateDb = new Date(user.session)
       const dateNow = new Date()
       const isTimevalid = dateDb.valueOf() > dateNow.valueOf()
       if (isTimevalid) {
              req.user = user
       } else {
              const respon = {
                     "pesanError": "Token sudah kadaluarsa, silahkan generate ulang"
              }
              return response(res, 401, false, 'Request data gagal', respon)
       }

       next()
}

export default cekToken;