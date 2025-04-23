import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import Review from "../../models/Course/ReviewModel";
import Course from "../../models/Course/CourseModel";
import User from "../../models/User/UserModel";
import { AuthRequest } from "../../types/authRequest";
import AppError from "../../utils/AppError";


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

  // Update the course's average rating and total reviews
  course.totalReviews += 1;
  course.averageRating = (course.averageRating * (course.totalReviews - 1) + rating) / course.totalReviews;
  await course.save();

  res.status(201).json({ message: "Review created successfully", review });
});

export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { rating, comment } = req.body;
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) {
    return res.status(404).json({ message: "Review not found or not authorized" });
  }

  const course = await Course.findById(review.course);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const oldRating = review.rating;

  if (rating) review.rating = rating;
  if (comment) review.comment = comment;
  await review.save();

  course.averageRating = (course.averageRating * course.totalReviews - oldRating + review.rating) / course.totalReviews;
  await course.save();

  res.status(200).json({ message: "Review updated successfully", review });
});

export const getCourseReviews = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const course = await Course.findById(courseId);
  if (!course) throw new AppError("Course not found", 404);


  const totalReviews = course.totalReviews;
  const totalPages = Math.ceil(totalReviews / limit);


  const reviews = await Review.find({ course: courseId })
    .populate("user", "fullName")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages,
    totalReviews,
    reviews,
  });
});
