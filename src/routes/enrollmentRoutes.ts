import express from "express";
import {
  enrollInCourse,
  getUserEnrollments,
  getUsersInCourse,
} from "../controllers/enrollmentController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

// 📌 Enroll in a course (Protected)
router.post("/enroll", enrollInCourse);

// 📌 Get user's enrollments (Protected)
router.get("/my-enrollments", getUserEnrollments);

// 📌 Get all users enrolled in a course (Protected, Instructor/Admin)
router.get("/course/:courseId", getUsersInCourse);


export default router;
