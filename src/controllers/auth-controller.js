import response from "../utility/response.js";

export const Login = (req, res, next) => {
       try {

              return response(res, 201, true, "Authenticated ...", []);
       } catch (e) {
              next(e);
       }
}