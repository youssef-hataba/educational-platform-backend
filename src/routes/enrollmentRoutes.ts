import express from "express";
import {
  enrollInCourse,
  getUserEnrollments,
  getUsersInCourse,
  markLessonCompleted,
} from "../controllers/enrollmentController";
import { checkAdmin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

//Enroll in a course (Protected)
router.post("/enroll", enrollInCourse);

// Get user's enrollments (Protected)
router.get("/my-enrollments", getUserEnrollments);

router.post("/lesson/:lessonId/complete", protect, markLessonCompleted);

// Get all users enrolled in a course (Protected, Instructor/Admin)
router.get("/course/:courseId", checkAdmin, getUsersInCourse);


export default router;
