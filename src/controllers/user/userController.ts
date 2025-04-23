import { Request, Response, NextFunction } from "express";
import User from "../../models/User/UserModel";
import asyncHandler from "../../middlewares/asyncHandler";
import AppError from "../../utils/AppError";
import { AuthRequest } from "../../types/authRequest";

export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user.id).select("firstName lastName email enrolledCourses profilePic");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

// Update User Profile
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
});

// Deactivate Account
export const deactivateAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("Your account is already deactivated.", 400);
  }

  user.isActive = false;
  user.deactivatedAt = new Date();
  await user.save();

  res.status(200).json({ message: "Your account has been deactivated." });
});


//  Get All Users (Admin Only)
export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    status: "success",
    length: users.length,
    users,
  });
});


// Delete User (Admin Only)
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await user.deleteOne();

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});