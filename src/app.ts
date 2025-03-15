import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import errorHandler from "./middlewares/errorHandler";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";


dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);

app.get("/",(req,res)=>{
  res.send("Hello, World! Server is running 🟢");
});

// Global Error Handler (MUST be after all routes)
app.use(errorHandler);

export default app;