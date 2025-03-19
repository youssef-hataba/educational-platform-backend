import express from "express";
import { protect, checkAdmin ,checkInstuctor} from "../../middlewares/authMiddleware";
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
router.post("/",checkInstuctor, createCourse);
router.patch("/:id",checkInstuctor, updateCourse);
router.delete("/:id",checkInstuctor , deleteCourse);


router.get("/instructor/:instructorId",checkInstuctor, getInstructorCourses);

export default router;
