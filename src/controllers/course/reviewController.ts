import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import Review from "../../models/Course/ReviewModel";
import Course from "../../models/Course/CourseModel";
import User from "../../models/User/UserModel";
import { AuthRequest } from "../../types/authRequest";


export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { rating, comment } = req.body;
  const courseId = req.params.courseId;
  const userId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Check if the user has already reviewed the course
  const existingReview = await Review.findOne({ course: courseId, user: userId });
  if (existingReview) {
    return res.status(400).json({ message: "You have already reviewed this course" });
  }

  const review = await Review.create({
    rating,
    comment,
    course: courseId,
    user: userId,
  })

  course.totalReviews += 1;
  course.averageRating = (course.averageRating * (course.totalReviews - 1) + rating) / course.totalReviews;
  await course.save();

  res.status(201).json({ message: "Review created successfully", review });
});
