import { validationResult } from "express-validator";
import response from "../utility/response.js";

class errorHandling extends Error {

       constructor(status, message) {
              super(message);
              this.status = status;
       }
}

const errorMidleware = async (err, req, res, next) => {
       if (!err) {
              next()
              return;
       }
       if (err instanceof errorHandling) {
              return response(res, err.status, false, err.message);
       } else {
              console.log(err);
              return response(res, 500, false, err.message);
       }
}

const requestValidator = (req, res, next) => {
       const errors = validationResult(req)
       if (!errors.isEmpty()) {
              return response(res, 400, false, 'Perhatikan parameter harus sesuai format yang di minta')
       }

       next()
}

export {
       errorHandling,
       errorMidleware,
       requestValidator
}