import { Router } from "express";
import * as controller from "../controllers/auth-controller.js";
import { body } from "express-validator";
import { requestValidator } from "../middlewares/erros-handling.js";

const routes = Router();

routes.post("/login", body('username').notEmpty(), body('password').notEmpty(), requestValidator, controller.Login);

export default routes;