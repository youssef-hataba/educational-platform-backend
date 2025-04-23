import express from "express";
import { createReview, updateReview } from "../../controllers/course/reviewController";
import { protect } from "../../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

router.post("/course/:courseId", createReview);

router.patch("/:reviewId", updateReview);

// router.get("/course/:courseId", getReviewsByCourse);

// router.patch("/course/:courseId", getReviewsByCourse);

// router.delete("/:reviewId", deleteReview);

export default router;
