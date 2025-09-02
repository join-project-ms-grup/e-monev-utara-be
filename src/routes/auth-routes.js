import { Router } from "express";
import * as controller from "../controllers/auth-controller.js";

const routes = Router();

routes.get("/login", controller.Login);

export default routes;