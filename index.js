import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorMidleware } from "./src/middlewares/erros-handling.js";
import router from "./src/router.js";

dotenv.config();

process.env.TZ = 'Asia/Jakarta';

const port = parseInt(process.env.PORT) || 3000;
const host = process.env.HOST || "localhost";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(morgan("dev"));
app.use("/", router);
app.use(errorMidleware);



app.listen(port, host, () => {
       console.log(`🚀 Server running at http://${host}:${port}`);
});
