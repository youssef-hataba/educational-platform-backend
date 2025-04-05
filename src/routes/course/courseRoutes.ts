import express from "express";
import { protect, checkAdmin ,checkInstructor} from "../../middlewares/authMiddleware";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  getInstructorCourses,
  publishCourse,
} from "../../controllers/course/courseController";

const router = express.Router();

// Public Routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// get instructor courses 
router.get("/instructor/:instructorId", getInstructorCourses);

// Instructor Routes
router.use(protect,checkInstructor);
router.post("/", createCourse);
router.patch("/:id", updateCourse);
router.patch("/publish/:id",publishCourse);


export default router;
