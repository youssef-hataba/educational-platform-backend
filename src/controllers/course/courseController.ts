import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import Course from "../../models/Course/CourseModel";
import AppError from "../../utils/AppError";
import { AuthRequest } from "../../types/authRequest";
import { applyFilters } from "../../utils/filters";
import { getPagination } from "../../utils/pagination";
import { ApprovalStatus } from "../../types/course";


export const createCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, price, category, tags, thumbnail, requirements, whatYouWillLearn, language, level } = req.body;
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
    level,
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

  const courseQuery = await Course.findOneAndUpdate(
    {
      _id: req.params.id,
      instructor: req.user.id
    },
    { $set: updates },
    { new: true, runValidators: true }
  ) as any;

  courseQuery._skipIsPublishedCheck = true;

  const course = await courseQuery;

  if (!course) {
    throw new AppError("Course not found or not authorized", 404);
  }

  res.status(200).json({ success: true, course });
});

export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, ...filters } = req.query;
  const query: any = {};

  applyFilters(query, filters);

  const { pageNum, limitNum, skip } = getPagination(page as string, limit as string);

  const courses = await Course.find(query)
    .populate("instructor", "firstName lastName")
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const totalCourses = await Course.countDocuments(query);
  const totalPages = Math.ceil(totalCourses / limitNum);

  res.status(200).json({
    success: true,
    totalCourses,
    totalPages,
    currentPage: pageNum,
    courses
  });
});

export const getCourseById = asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "firstName lastName profilePic")
    .populate("sections");

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  res.status(200).json({ success: true, course });
});

export const getInstructorCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await Course.find({ instructor: req.params.instructorId });
  res.status(200).json({ success: true, length: courses.length, courses });
});

export const publishCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const courseQuery = Course.findById(req.params.id);
  (courseQuery as any)._skipIsPublishedCheck = true;

  const course = await courseQuery;

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (course.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to publish this course", 403);
  }

  if (course.isPublished) {
    return res.status(400).json({ success: false, message: "Course is already published" });
  }

  // Set course to pending approval
  course.approvalStatus = ApprovalStatus.PENDING;
  await course.save();

  res.status(200).json({
    success: true,
    message: "Course submitted for admin approval",
    course
  });
});

// Admin approval function
export const approveCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { action, rejectionReason } = req.body;

  const courseQuery = Course.findOne({ _id: id , approvalStatus: ApprovalStatus.PENDING });
  (courseQuery as any)._skipIsPublishedCheck = true;
  const course = await courseQuery;

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (action === "approve") {
    course.approvalStatus = ApprovalStatus.APPROVED;
    course.isPublished = true;
    await course.save();
    return res.status(200).json({
      success: true,
      message: "Course approved and published successfully",
      course
    });
  } else if (action === "reject") {
    if (!rejectionReason) {
      throw new AppError("Rejection reason is required", 400);
    }
    course.approvalStatus = ApprovalStatus.REJECTED;
    course.rejectionReason = rejectionReason;
    await course.save();
    return res.status(200).json({
      success: true,
      message: "Course rejected",
      course
    });
  } else {
    throw new AppError("Invalid action", 400);
  }
});

// Get courses pending approval (Admin only)
export const getPendingCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit } = req.query;
  const { pageNum, limitNum, skip } = getPagination(page as string, limit as string);

  const courseQuery = Course.find({ approvalStatus: ApprovalStatus.PENDING });
  (courseQuery as any)._skipIsPublishedCheck = true;

  const courses = await courseQuery
    .populate("instructor", "firstName lastName")
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: 1 });

  const totalQuery = Course.countDocuments({ approvalStatus: ApprovalStatus.PENDING });
  (totalQuery as any)._skipIsPublishedCheck = true;
  const totalCourses = await totalQuery;

  const totalPages = Math.ceil(totalCourses / limitNum);

  res.status(200).json({
    success: true,
    totalCourses,
    totalPages,
    currentPage: pageNum,
    courses
  });
});

