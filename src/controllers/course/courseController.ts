import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import Course from "../../models/Course/CourseModel";
import AppError from "../../utils/AppError";

interface AuthRequest extends Request {
  user?: any;
};

export const createCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, price, category, tags, thumbnail, duration, requirements, whatYouWillLearn, language, rating } = req.body;
  const instructorId = req.user.id;

  const course = await Course.create({
    title,
    description,
    price,
    category,
    duration,
    tags,
    thumbnail,
    requirements,
    whatYouWillLearn,
    language,
    rating,
    instructor: instructorId,
  });

  res.status(201).json({ success: true, course });
});


export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await Course.find().populate("instructor", "firstName lastName email");
  res.status(200).json({
    success: true,
    length: courses.length,
    courses
  });
});

//@route GET /api/courses/:id  (Public Routes)
export const getCourseById = asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id)
  .populate("instructor", "fistName lastName email")
  .populate("sections");

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  res.status(200).json({ success: true, course });
});

// @desc    Update a course
// @route   PATCH /api/courses/:id
// @access  Private (Instructor only)
export const updateCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const course = await Course.findOneAndUpdate(
    {
      _id: req.params.id,
      instructor: req.user.id
    },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!course) {
    throw new AppError("Course not found or not authorized", 404);
  }

  res.status(200).json({ success: true, course });
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor only)
export const deleteCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (course.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to delete this course", 403);
  }

  await course.deleteOne();
  res.status(200).json({ success: true, message: "Course deleted successfully" });
});

// @desc    Publish a course
// @route   PATCH /api/courses/:id/publish
// @access  Private (Instructor only)
// export const publishCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const course = await Course.findById(req.params.id);

//   if (!course) {
//     throw new AppError("Course not found", 404);
//   }

//   if (course.instructor.toString() !== req.user.id) {
//     throw new AppError("Not authorized to publish this course", 403);
//   }

//   course.isPublished = true;
//   await course.save();

//   res.status(200).json({ success: true, message: "Course published successfully" });
// });

// @desc    Get all courses by an instructor
// @route   GET /api/courses/instructor/:instructorId
// @access  Private (Instructor only)
export const getInstructorCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await Course.find({ instructor: req.params.instructorId });
  res.status(200).json({ success: true, length: courses.length, courses });
});
