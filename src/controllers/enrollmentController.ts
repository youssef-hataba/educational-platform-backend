import { Response, Request } from "express";
import Enrollment from "../models/EnrollmentModle";
import Course from "../models/Course/CourseModel";
import AppError from "../utils/AppError";
import asyncHandler from "../middlewares/asyncHandler";

interface AuthRequest extends Request {
  user?: any;
}

// 📌 1️⃣ Enroll a user in a course
export const enrollInCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (existingEnrollment) {
    throw new AppError("User is already enrolled in this course", 400);
  }

  const enrollment = await Enrollment.create({ user: userId, course: courseId });

  res.status(201).json({ message: "Enrollment successful", enrollment });
});

// 📌 2️⃣ Get a user’s enrollments
export const getUserEnrollments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const enrollments = await Enrollment.find({ user: userId }).populate("course", "thumbnail rating nstructor title");

  res.status(200).json(enrollments);
});

// 📌 3️⃣ Get all users enrolled in a specific course
export const getUsersInCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { courseId } = req.params;
  const enrollments = await Enrollment.find({ course: courseId }).populate("user", "firstName lastName");

  res.status(200).json(enrollments);
});
