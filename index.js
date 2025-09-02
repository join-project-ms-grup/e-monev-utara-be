import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const port = parseInt(process.env.PORT) || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
       console.log(`🚀 Server running at http://${host}:${port}`);
});
