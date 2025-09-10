import response from "../utility/response.js";

export const devAccess = (req, res, next) => {
       const role = req.user.role_id;
       if (role !== 1) {
              return response(res, 403, false, 'Access denied | not a developer');
       }

       next()

}

export const adminAccess = (req, res, next) => {
       const role = req.user.role_id;
       if (role !== 2) {
              return response(res, 403, false, 'Access denied | not an admin');
       }
       next()
}

export const rkpdAccess = (req, res, next) => {
       const role = req.user.role_id;
       if (role !== 3) {
              return response(res, 403, false, 'Access denied | not a rkpd');
       }
       next()
}

export const dakAccess = (req, res, next) => {
       const role = req.user.role_id;
       if (role !== 4) {
              return response(res, 403, false, 'Access denied | not a dak');
       }
       next()
}

export const devAdminAccess = (req, res, next) => {
       const role = req.user.role_id;
       if (role !== 1 && role !== 2) {
              return response(res, 403, false, 'Access denied | not a developer or admin');
       }
       next()
}