import express from "express";
import { createReview, getCourseReviews, updateReview } from "../../controllers/course/reviewController";
import { protect } from "../../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

router.post("/course/:courseId", createReview);

router.patch("/:reviewId", updateReview);

router.get("/course/:courseId", getCourseReviews);

// router.patch("/course/:courseId", getReviewsByCourse);

// router.delete("/:reviewId", deleteReview);

export default router;
