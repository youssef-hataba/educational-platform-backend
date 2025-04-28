import { Response } from "express";
import Enrollment from "../models/EnrollmentModle";
import Course from "../models/Course/CourseModel";
import AppError from "../utils/AppError";
import asyncHandler from "../middlewares/asyncHandler";
import { AuthRequest } from "../types/authRequest";
import Lesson from "../models/Course/LessonModel";
import mongoose from "mongoose";

// Enroll a user in a course
export const enrollInCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  const course = await Course.findOne({ _id: courseId, isPublished: true });
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (existingEnrollment) {
    throw new AppError("User is already enrolled in this course", 400);
  }

  const enrollment = await Enrollment.create({ user: userId, course: courseId });

  // Increment totalStudents count
  course.totalStudents += 1;
  await course.save();

  res.status(201).json({ message: "Enrollment successful", enrollment });
});

// Get a user’s enrollments
export const getUserEnrollments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const enrollments = await Enrollment.find({ user: userId })
    .populate("course", "thumbnail rating instructor title category");

  res.status(200).json({
    success: true,
    lenght: enrollments.length,
    enrollments,
  });
});

// Get all users enrolled in a specific course (instructor , admin)
export const getUsersInCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { courseId } = req.params;
  const enrollments = await Enrollment.find({ course: courseId })
    .populate("user", "firstName lastName");

  res.status(200).json({
    success: true,
    length: enrollments.length,
    enrollments
  });
});

// mark lesson as completed & calculate progrees 
export const markLessonCompleted = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lessonId = new mongoose.Types.ObjectId(req.params.lessonId);
  const userId = req.user.id;

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }

  const courseId = lesson.course;

  // Check enrollment
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) {
    throw new AppError("User not enrolled in this course", 400);
  }

  // Check if already completed
  if (enrollment.completedLessons.includes(lessonId)) {
    return res.status(200).json({
      success: true,
      message: "Lesson already completed",
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
    });
  }


  // Mark as completed
  enrollment.completedLessons.push(lessonId);

  // Calculate progress
  const totalLessons = await Lesson.countDocuments({ course: courseId });
  const completedCount = enrollment.completedLessons.length;
  enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  await enrollment.save();

  res.status(200).json({
    success: true,
    message: "Lesson marked as completed",
    progress: enrollment.progress,
    completedLessons: enrollment.completedLessons,
  });
});
