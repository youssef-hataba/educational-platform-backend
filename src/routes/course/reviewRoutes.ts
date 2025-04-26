import express from "express";
import { createReview, deleteReview, getCourseReviews, updateReview } from "../../controllers/course/reviewController";
import { protect } from "../../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

router.post("/course/:courseId", createReview);

router.patch("/course/:courseId", updateReview);

router.get("/course/:courseId", getCourseReviews);

router.delete("/course/:courseId", deleteReview);


// router.patch("/course/:courseId", getReviewsByCourse);


export default router;
