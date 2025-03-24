import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import Lesson from "../../models/Course/LessonModel";
import Section from "../../models/Course/SectionModel";
import AppError from "../../utils/AppError";

interface AuthRequest extends Request {
  user?: any;
};

// ✅ Create Lesson
export const createLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, videoUrl, duration, attachments, sectionId, quiz } = req.body;

  const section = await Section.findById(sectionId).populate("course", "instructor");
  if (!section) throw new AppError("Section not found", 404);

  if ((section.course as any).instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to add lessons to this course", 403);
  }

  const lesson = await Lesson.create({
    title,
    videoUrl,
    duration,
    attachments,
    section: sectionId,
    quiz,
  });

  section.lessons.push(lesson.id);
  await section.save();

  res.status(201).json({ success: true, message: "Lesson created successfully", lesson });
});

// ✅ Update Lesson
export const updateLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, videoUrl, duration, attachments, quiz } = req.body;
  const lesson = await Lesson.findById(req.params.id).populate("course", "instructor");

  if (!lesson) throw new AppError("Lesson not found", 404);

  if ((lesson.section as any).course.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to update this lesson", 403);
  }

  Object.assign(lesson, { title, videoUrl, duration, attachments, quiz });
  await lesson.save();

  res.status(200).json({ success: true, message: "Lesson updated successfully", lesson });
});

// ✅ Delete Lesson
export const deleteLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lesson = await Lesson.findById(req.params.id).populate("course", "instructor");

  if (!lesson) throw new AppError("Lesson not found", 404);

  if ((lesson.section as any).course.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to delete this lesson", 403);
  }

  // Remove lesson from the section
  await Section.findByIdAndUpdate(lesson.section, { $pull: { lessons: lesson._id } });

  await lesson.deleteOne();

  res.status(200).json({ success: true, message: "Lesson deleted successfully" });
});

// ✅ Get all lessons in a section
export const getLessonsInSection = asyncHandler(async (req: Request, res: Response) => {
  const lessons = await Lesson.find({ section: req.params.sectionId });
  res.status(200).json({ success: true, length: lessons.length, lessons });
});

// ✅ Get a single lesson
export const getLessonById = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new AppError("Lesson not found", 404);
  res.status(200).json({ success: true, lesson });
});