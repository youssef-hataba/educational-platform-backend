import express from "express";
import {
  createQuiz,
  // updateQuiz,
  // deleteQuiz,
  // getQuizById,
  // getQuizzesForLesson,
  // submitQuiz,
  // getStudentQuizResults,
} from "../../controllers/course/quizController";
import { protect, checkInstructor } from "../../middlewares/authMiddleware";
import { checkOwnership} from "../../middlewares/checkCourseOwnership";

const router = express.Router();

// ✅ Create a Quiz (Instructor only)
router.post("/", protect,checkInstructor, createQuiz);

// // ✅ Update a Quiz (Instructor only)
// router.put("/:quizId", protect, checkInstructor, updateQuiz);

// // ✅ Delete a Quiz (Instructor only)
// router.delete("/:quizId", protect, checkInstructor, deleteQuiz);

// // ✅ Get a Quiz by ID
// router.get("/:quizId", protect, getQuizById);

// // ✅ Get All Quizzes for a Lesson
// router.get("/lesson/:lessonId", protect, getQuizzesForLesson);

// // ✅ Submit a Quiz (Students only)
// router.post("/:quizId/submit", protect, submitQuiz);

// // ✅ Get Quiz Results for a Student
// router.get("/results", protect, getStudentQuizResults);

export default router;
