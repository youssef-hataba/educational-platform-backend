import express from "express";
import { createReview, deleteReview, getCourseReviews, getRatingDistribution, updateReview } from "../../controllers/course/reviewController";
import { protect } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/course/:courseId", getCourseReviews);

router.get("/distribution/:courseId", getRatingDistribution); 

router.use(protect);

router.post("/course/:courseId", createReview);

router.patch("/course/:courseId", updateReview);

router.delete("/course/:courseId", deleteReview);


export default router;
