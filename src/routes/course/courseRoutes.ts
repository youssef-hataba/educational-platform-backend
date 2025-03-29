import express from "express";
import { protect, checkAdmin ,checkInstructor} from "../../middlewares/authMiddleware";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  getInstructorCourses,
  // enrollInCourse,
  // getEnrolledCourses,
} from "../../controllers/course/courseController";

const router = express.Router();

// Public Routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Protected Routes (Only authenticated users)
router.use(protect);
// router.post("/:id/enroll", enrollInCourse);
// router.get("/my-courses", getEnrolledCourses);

// Instructor & Admin Routes
router.post("/",checkInstructor, createCourse);
router.patch("/:id",checkInstructor, updateCourse);


router.get("/instructor/:instructorId",checkInstructor, getInstructorCourses);

export default router;
