import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import Course from "../../models/Course/CourseModel";
import AppError from "../../utils/AppError";

interface AuthRequest extends Request {
  user?: any;
};


export const createCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, price, category, tags, thumbnail, requirements, whatYouWillLearn, language } = req.body;
  const instructorId = req.user.id;

  const course = await Course.create({
    title,
    description,
    price,
    category,
    tags,
    thumbnail,
    requirements,
    whatYouWillLearn,
    language,
    instructor: instructorId,
  });

  res.status(201).json({ success: true, course });
});


export const updateCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const allowedUpdates = [
    "title",
    "description",
    "price",
    "category",
    "language",
    "requirements",
    "whatYouWillLearn",
    "tags",
    "thumbnail"
  ];

  const updates = Object.keys(req.body).reduce((acc, key) => {
    if (allowedUpdates.includes(key)) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {} as Record<string, any>);


  if (Object.keys(updates).length === 0) {
    throw new AppError("No valid fields provided for update", 400);
  }

  const course = await Course.findOneAndUpdate(
    {
      _id: req.params.id,
      instructor: req.user.id
    },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!course) {
    throw new AppError("Course not found or not authorized", 404);
  }

  res.status(200).json({ success: true, course });
});


export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await Course.find().populate("instructor", "firstName lastName");
  res.status(200).json({
    success: true,
    length: courses.length,
    courses
  });
});

export const getCourseById = asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "fistName lastName profilePic")
    .populate("sections");

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  res.status(200).json({ success: true, course });
});

// Get all courses by an instructor
export const getInstructorCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await Course.find({ instructor: req.params.instructorId, isPublished: true });
  res.status(200).json({ success: true, length: courses.length, courses });
});

export const publishCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (course.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to publish this course", 403);
  }

  if (course.isPublished) return res.status(400).json({ success: false, message: "Course is already published" });

  course.isPublished = true;
  await course.save();

  res.status(200).json({ success: true, message: "Course published successfully" });
});

