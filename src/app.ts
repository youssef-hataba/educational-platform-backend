import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/user/userRoutes";
import instructorRoutes from "./routes/user/instructorRoutes";
import courseRoutes from "./routes/course/courseRoutes"
import sectionRoutes from "./routes/course/sectionRoutes"
import lessonRoutes from "./routes/course/lessonRoutes"
import quizRoutes from "./routes/course/quizRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import uploadRoutes from "./routes/uploadRoutes"

dotenv.config();

const app = express();

connectDB();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://educational-platform-three.vercel.app"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/instructors",instructorRoutes)

app.get("/", (req, res) => {
  res.send("Hello, World! Server is running 🟢");
});

// Global Error Handler (MUST be after all routes)
app.use(errorHandler);

export default app;