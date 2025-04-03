import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import AppError from "../../utils/AppError";
import Section from "../../models/Course/SectionModel";
import Course from "../../models/Course/CourseModel";
import Lesson from "../../models/Course/LessonModel";
import Quiz from "../../models/Course/QuizModel";

interface AuthRequest extends Request {
  user?: any;
};

// @desc    Create new section
// @route   POST /api/sections
// @access  Private (Instructor only)
export const createSection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (course.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to add sections to this course", 403);
  }

  const section = await Section.create({ title, description, course: courseId, instructor: req.user.id });
  course.sections.push(section.id);
  await course.save();

  res.status(201).json({ success: true, section });
});


// @desc    Update a section
// @route   PUT /api/sections/:id
// @access  Private (Instructor only)
export const updateSection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const section = await Section.findById(req.params.id);
  if (!section) {
    throw new AppError("Section not found", 404);
  }

  const course = await Course.findById(section.course);

  if (!course) throw new AppError("Course Not Found!", 404);

  if (course.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to update this section", 403);
  }

  section.title = req.body.title || section.title;
  section.description = req.body.description || section.description;

  await section.save();
  res.status(200).json({ success: true, section });
});

// @desc    Delete a section
// @route   DELETE /api/sections/:id
// @access  Private (Instructor only)
export const deleteSection = asyncHandler(async (req: AuthRequest, res: Response) => {
  const section = await Section.findById(req.params.id);
  if (!section) {
    throw new AppError("Section not found", 404);
  }

  const course = await Course.findById(section.course);

  if(!course) throw new AppError("Course Not Found!",404);

  if(course.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to delete this section", 403);
  }

  const lessons = await Lesson.find({ section: section.id });

  const quizIds = lessons.map(lesson => lesson.quiz).filter(quiz => quiz);

  await Quiz.deleteMany({ _id: { $in: quizIds } });

  await Lesson.deleteMany({ section: section.id });


  await Course.findByIdAndUpdate(section.course, { $pull: { sections: section._id } });

  await section.deleteOne();

  res.status(200).json({ success: true, message: "Section deleted successfully" });
});
