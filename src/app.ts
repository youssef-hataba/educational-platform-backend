import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/",(req,res)=>{
  res.send("Hello, World! Server is running 🟢");
});

// Global Error Handler (MUST be after all routes)
app.use(errorHandler);

export default app;