import { Response, Request } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { Instructor } from "../../models/User/instructorModel";
import { AuthRequest } from "../../types/authRequest";
import AppError from "../../utils/AppError";
import User, { UserRole } from "../../models/User/UserModel";
import Enrollment from "../../models/EnrollmentModle";
import Course from "../../models/Course/CourseModel";


export const becomeInstructor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { title, bio, socialLinks } = req.body;

  const existingUser = await User.findById(userId).select("+role");
  if (!existingUser) throw new AppError("User not found", 404);
  if (existingUser.role === "instructor") throw new AppError("User is already an instructor", 400);

  // Step 1: Change role in base User model
  existingUser.role = UserRole.INSTRUCTOR;
  await existingUser.save();

  // Step 2: Update the instructor-specific fields via the Instructor model
  const instructor = await Instructor.findByIdAndUpdate(
    userId,
    {
      title,
      bio,
      socialLinks,
    },
    { new: true }
  );

  res.status(200).json({ message: "You are now an instructor", instructor });
});

export const updateInstructor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const instructorId = req.user.id;
  const { title, bio, socialLinks } = req.body;

  const instructor = await Instructor.findById(instructorId);

  if (!instructor) {
    return res.status(404).json({ message: "Instructor not found" });
  }

  if (title) instructor.title = title;
  if (bio) instructor.bio = bio;
  if (socialLinks) instructor.socialLinks = socialLinks;

  await instructor.save();

  res.status(200).json({ message: "Instructor updated successfully", instructor });
});

export const getInstructorProfile = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const instructor = await Instructor.findById(id).select("-__v -password");

  const courses = await Course.find({ instructor: id });

  if (!instructor) {
    return res.status(404).json({ message: "Instructor not found" });
  }

  const totalStudents = courses.reduce((acc: number, course: any) => {
    return acc + (course.totalStudents || 0);
  }, 0);

  const totalReviews = courses.reduce((acc: number, course: any) => {
    return acc + (course.totalReviews || 0);
  }, 0);

  res.status(200).json({
    totalStudents,
    reviews: totalReviews,
    instructor,
    courses,
  });
});

