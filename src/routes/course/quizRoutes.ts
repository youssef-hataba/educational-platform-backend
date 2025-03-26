import express from "express";
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizById,
  // getQuizzesForLesson,
  // submitQuiz,
  // getStudentQuizResults,
} from "../../controllers/course/quizController";
import { protect, checkInstructor } from "../../middlewares/authMiddleware";


const router = express.Router();

router.use(protect);

router.get("/:id", getQuizById);


// // ✅ Submit a Quiz (Students only)
// router.post("/:quizId/submit", protect, submitQuiz);

// // ✅ Get Quiz Results for a Student
// router.get("/results", protect, getStudentQuizResults);

router.use(checkInstructor);

router.post("/",createQuiz);

router.patch("/:id",updateQuiz);

router.delete("/:id",deleteQuiz);


export default router;
