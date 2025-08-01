import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import Review from "../../models/Course/ReviewModel";
import Course from "../../models/Course/CourseModel";
import User from "../../models/User/UserModel";
import { AuthRequest } from "../../types/authRequest";
import AppError from "../../utils/AppError";
import Enrollment from "../../models/EnrollmentModle";
import mongoose from "mongoose";


export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { rating, comment } = req.body;
  const { courseId } = req.params;
  const userId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  // Check if the user is enrolled in the course
  if (!enrollment) {
    throw new AppError("You must be enrolled in the course to leave a review", 403);
  }

  // Check if the user has already reviewed the course
  const existingReview = await Review.findOne({ course: courseId, user: userId });
  if (existingReview) {
    throw new AppError("You have already reviewed this course", 400);
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
  const { courseId } = req.params;
  const userId = req.user.id;

  const review = await Review.findOne({ course: courseId, user: userId });
  if (!review) {
    throw new AppError("Review not found or not authorized", 404);
  }

  const course = await Course.findById(review.course);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const oldRating = review.rating;

  if (rating) review.rating = rating;
  if (comment) review.comment = comment;
  await review.save();

  course.averageRating = (course.averageRating * course.totalReviews - oldRating + review.rating) / course.totalReviews;
  await course.save();

  res.status(200).json({ message: "Review updated successfully", review });
});

export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const review = await Review.findOneAndDelete({ course: courseId, user: userId });
  if (!review) {
    throw new AppError("Review not found or not authorized", 404);
  }

  const course = await Course.findById(courseId);
  if (course) {
    course.totalReviews -= 1;
    if (course.totalReviews === 0) {
      course.averageRating = 0;
    } else {
      course.averageRating = (course.averageRating * (course.totalReviews + 1) - review.rating) / course.totalReviews;
    }
    await course.save();
  } else {
    return new AppError("Course not found", 404);
  }

  res.status(200).json({ message: "Review deleted successfully" });
});

export const getCourseReviews = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { search, stars } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const course = await Course.findById(courseId);
  if (!course) throw new AppError("Course not found", 404);

  const filter: any = { course: courseId };

  // filter by number of stars
  if (stars) {
    filter.rating = Number(stars);
  }

  // search by comment
  if (search) {
    filter.comment = { $regex: search, $options: "i" };
  }

  const totalReviews = await Review.countDocuments(filter);
  const totalPages = Math.ceil(totalReviews / limit);

  const reviews = await Review.find(filter)
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

export const getRatingDistribution = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new AppError("Course not found", 404);

  const distribution = await Review.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    { $group: { _id: "$rating", count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);

  const totalReviews = distribution.reduce((acc, item) => acc + item.count, 0);

  const percentages: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  distribution.forEach(item => {
    percentages[item._id] = parseFloat(((item.count / totalReviews) * 100).toFixed(2));
  });

  res.status(200).json({
    success: true,
    totalReviews,
    averageRating: course.averageRating,
    percentages
  });
});

