import express from "express";
import { protect, checkInstructor } from "../../middlewares/authMiddleware";
import { createSection, deleteSection, updateSection } from "../../controllers/course/sectionController";

const router = express.Router();

router.use(protect, checkInstructor);

router.post("/", createSection);

router.patch("/:id", updateSection);

router.delete("/:id", deleteSection);

export default router;
