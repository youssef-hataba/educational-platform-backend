import express from "express";
import { protect, checkInstructor } from "../../middlewares/authMiddleware";
import { createLesson, updateLesson, deleteLesson, getLessonsInSection, getLessonById } from "../../controllers/course/lessonController";
const router = express.Router();


// get all Lessons in section 
router.get("/section/:sectionId", getLessonsInSection);

router.get("/:id", protect, getLessonById)

router.use(protect, checkInstructor);

router.post("/", createLesson);

router.patch("/:id", updateLesson);

router.delete("/:id", deleteLesson);

export default router;
