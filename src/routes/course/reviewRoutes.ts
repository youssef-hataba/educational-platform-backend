import express from "express";
import { createReview } from "../../controllers/course/reviewController";
import { protect } from "../../middlewares/authMiddleware";

const router = express.Router();


router.post("/course/:courseId", protect, createReview);

// router.get("/course/:courseId", getReviewsByCourse);

// router.patch("/course/:courseId", getReviewsByCourse);

// router.delete("/:reviewId", deleteReview);

export default router;
