import asyncHandler from "./asyncHandler";
import { Request, Response, NextFunction } from "express";
import Course from "../models/Course/CourseModel";
import Section from "../models/Course/SectionModel";
import Lesson from "../models/Course/LessonModel";
import Quiz from "../models/Course/QuizModel";
import AppError from "../utils/AppError";

interface AuthRequest extends Request {
  user?: any;
};

export const checkOwnership = (model: "course" | "section" | "lesson" | "quiz") =>
  asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let instructorId;

    if (model === "course") {
      const course = await Course.findById(req.params.id).select("instructorId");
      if (!course) throw new AppError("Course not found", 404);
      instructorId = course.instructor.toString();
    } else if (model === "section") {
      const section = await Section.findById(req.params.id).select("instructorId");
      if (!section) throw new AppError("Section not found", 404);
      instructorId = section.instructor.toString();
    } else if (model === "lesson") {
      const lesson = await Lesson.findById(req.params.id).select("instructorId");
      if (!lesson) throw new AppError("Lesson not found", 404);
      instructorId = lesson.instructor.toString();
    } else if (model === "quiz") {
      const quiz = await Quiz.findById(req.params.id).select("instructorId");
      if (!quiz) throw new AppError("Quiz not found", 404);
      instructorId = quiz.instructor.toString();
    }

    if (instructorId !== req.user.id) {
      throw new AppError("Not authorized to perform this action", 403);
    }

    next();
  });
