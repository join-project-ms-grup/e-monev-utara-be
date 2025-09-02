import express from "express";
import response from "./utility/response.js";
import cors from "cors";
import morgan from "morgan";
import router from "./routes.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(morgan("dev"));
app.use("/", router);

// Error handling global
app.use((err, req, res, next) => {
       console.error(err.stack);
       response(res, 500, false, 'Something went wrong');
});

export default app;