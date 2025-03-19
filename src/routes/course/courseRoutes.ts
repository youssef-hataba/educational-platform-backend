import express from "express";
import { protect, checkAdmin } from "../../middlewares/authMiddleware";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
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
router.post("/", createCourse);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);


router.get("/instructor/:instructorId", getInstructorCourses);

export default router;
