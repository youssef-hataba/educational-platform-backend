import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import Quiz from "../../models/Course/QuizModel";
import Lesson from "../../models/Course/LessonModel";
import Enrollment from "../../models/EnrollmentModle";
import AppError from "../../utils/AppError";

interface AuthRequest extends Request {
  user?: any;
}

// ✅ Create a Quiz
export const createQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { lessonId, title, questions, timeLimit, passingScore } = req.body;

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new AppError("Lesson not found", 404);

  if (lesson.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to create a quiz for this lesson", 403);
  }

  const quiz = await Quiz.create({
    lesson: lessonId,
    instructor: req.user.id,
    title,
    questions,
    timeLimit,
    passingScore
  });

  res.status(201).json({ success: true, message: "Quiz created successfully", quiz });
});

// ✅ Update a Quiz
// export const updateQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const { title, questions, timeLimit } = req.body;
//   const quiz = await Quiz.findById(req.params.quizId).populate("lesson");

//   if (!quiz) throw new AppError("Quiz not found", 404);

//   // Ensure only the course instructor can update
//   if ((quiz.lesson as any).section.course.instructor.toString() !== req.user.id) {
//     throw new AppError("Not authorized to update this quiz", 403);
//   }

//   Object.assign(quiz, { title, questions, timeLimit });
//   await quiz.save();

//   res.status(200).json({ success: true, message: "Quiz updated successfully", quiz });
// });

// // ✅ Delete a Quiz
// export const deleteQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const quiz = await Quiz.findById(req.params.quizId).populate("lesson");

//   if (!quiz) throw new AppError("Quiz not found", 404);

//   if ((quiz.lesson as any).section.course.instructor.toString() !== req.user.id) {
//     throw new AppError("Not authorized to delete this quiz", 403);
//   }

//   await quiz.deleteOne();

//   res.status(200).json({ success: true, message: "Quiz deleted successfully" });
// });

// // ✅ Get a Single Quiz
// export const getQuizById = asyncHandler(async (req: Request, res: Response) => {
//   const quiz = await Quiz.findById(req.params.quizId).populate("lesson", "title");
//   if (!quiz) throw new AppError("Quiz not found", 404);

//   res.status(200).json({ success: true, quiz });
// });

// // ✅ Get All Quizzes for a Lesson
// export const getQuizzesForLesson = asyncHandler(async (req: Request, res: Response) => {
//   const quizzes = await Quiz.find({ lesson: req.params.lessonId });
//   res.status(200).json({ success: true, count: quizzes.length, quizzes });
// });

// // ✅ Submit Quiz and Calculate Score
// export const submitQuiz = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const { quizId } = req.params;
//   const { answers } = req.body; // { "questionId": "selectedOption" }

//   const quiz = await Quiz.findById(quizId);
//   if (!quiz) throw new AppError("Quiz not found", 404);

//   let score = 0;
//   quiz.questions.forEach((question) => {
//     if (answers[question._id] === question.correctAnswer) {
//       score++;
//     }
//   });

//   const enrollment = await Enrollment.findOne({ user: req.user.id, "courses.course": quiz.lesson });
//   if (!enrollment) throw new AppError("User is not enrolled in this course", 403);

//   const quizResult = {
//     lesson: quiz.lesson,
//     quiz: quiz._id,
//     score,
//   };

//   enrollment.quizResults.push(quizResult);
//   await enrollment.save();

//   res.status(200).json({
//     success: true,
//     message: "Quiz submitted successfully",
//     score,
//     maxScore: quiz.questions.length,
//     passingScore: quiz.passingScore,
//     passed: score >= quiz.passingScore,
//   });
// });

// // ✅ Get Student's Quiz Results
// export const getStudentQuizResults = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const enrollment = await Enrollment.findOne({ user: req.user.id }).select("quizResults");
//   if (!enrollment) throw new AppError("No quiz results found", 404);

//   res.status(200).json({ success: true, quizResults: enrollment.quizResults });
// });
