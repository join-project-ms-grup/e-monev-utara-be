import express from "express";
// import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

// Routes
// app.use("/users", userRoutes);

// Error handling global
app.use((err, req, res, next) => {
       console.error(err.stack);
       res.status(500).json({ success: false, message: "Something went wrong" });
});

export default app;