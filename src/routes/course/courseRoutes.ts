import express from "express";
import { protect, checkAdmin, checkInstructor } from "../../middlewares/authMiddleware";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  getInstructorCourses,
  publishCourse,
  approveCourse,
  getPendingCourses
} from "../../controllers/course/courseController";

const router = express.Router();

// Public Routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/instructor/:instructorId", getInstructorCourses);

// Instructor Routes
router.use(protect);
router.post("/", checkInstructor, createCourse);
router.patch("/:id", checkInstructor, updateCourse);
router.patch("/publish/:id", checkInstructor, publishCourse);

// Admin Routes
router.use(checkAdmin);
router.get("/admin/pending", getPendingCourses);
router.patch("/admin/approve/:id", approveCourse);

export default router;
