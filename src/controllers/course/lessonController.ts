import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import Lesson from "../../models/Course/LessonModel";
import Section from "../../models/Course/SectionModel";
import AppError from "../../utils/AppError";
import Quiz from "../../models/Course/QuizModel";
import { AuthRequest } from "../../types/authRequest";

// ✅ Create Lesson
export const createLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, videoUrl, duration, attachments, sectionId } = req.body;

  const section = await Section.findById(sectionId);
  if (!section) throw new AppError("Section not found", 404);


  if (section.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to add lessons to this course", 403);
  }

  const lesson = await Lesson.create({
    section: sectionId,
    instructor: req.user.id,
    title,
    videoUrl,
    duration,
    attachments,
  });

  section.lessons.push(lesson.id);
  await section.save();

  res.status(201).json({ success: true, message: "Lesson created successfully", lesson });
});

// ✅ Update Lesson
export const updateLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
  const allowedUpdates = ["title", "videoUrl", "duration", "attachments", "quiz"];

  const updates = Object.keys(req.body).reduce((acc, key) => {
    if (allowedUpdates.includes(key)) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {} as Record<string, any>);

  if (Object.keys(updates).length === 0) {
    throw new AppError("No valid fields provided for update", 400);
  }

  const lesson = await Lesson.findOneAndUpdate(
    {
      _id: req.params.id,
      instructor: req.user.id
    },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!lesson) {
    throw new AppError("Lesson not found or not authorized", 404);
  }

  res.status(200).json({ success: true, message: "Lesson updated successfully", lesson });
});

// ✅ Delete Lesson
export const deleteLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) throw new AppError("Lesson not found", 404);

  if (lesson.instructor.toString() !== req.user.id) {
    throw new AppError("Not authorized to delete this lesson", 403);
  }

  // Remove lesson from the section
  await Section.findByIdAndUpdate(lesson.section, { $pull: { lessons: lesson._id } });

  await Quiz.deleteOne({ _id: lesson.quiz });

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