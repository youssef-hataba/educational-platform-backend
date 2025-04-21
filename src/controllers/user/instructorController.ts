import { Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { Instructor } from "../../models/User/instructorModel";
import { AuthRequest } from "../../types/authRequest";
import AppError from "../../utils/AppError";
import User, { UserRole } from "../../models/User/UserModel";


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
