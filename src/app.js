import express from "express";
import response from "./utility/response.js";
import cors from "cors";
import morgan from "morgan";
import router from "./routes.js";
import { errorMidleware } from "./middlewares/erros-handling.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(morgan("dev"));
app.use("/", router);
app.use(errorMidleware);

export default app;