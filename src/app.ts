import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import errorHandler from "./middlewares/errorHandler";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import courseRoutes from "./routes/course/courseRoutes"
import sectionRoutes from "./routes/course/sectionRoutes"
import lessonRoutes from "./routes/course/lessonRoutes"


dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/courses",courseRoutes);
app.use("/api/sections",sectionRoutes);
app.use("/api/lessons",lessonRoutes);

app.get("/",(req,res)=>{
  res.send("Hello, World! Server is running 🟢");
});

// Global Error Handler (MUST be after all routes)
app.use(errorHandler);

export default app;