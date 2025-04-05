import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../utils/AppError";
import User from "../models/UserModel";
import cloudinary from "../config/cloudinary";
import { AuthRequest } from "../types/authRequest";

export const uploadThumbnailController = asyncHandler((req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded!" });
  }

  res.status(200).json({
    success: true,
    message: "Thumbnail uploaded successfully!",
    imageUrl: req.file.path,
  });
});

export const uploadProfilePicture = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new AppError("No image file uploaded", 400);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.profilePic) {
    const publicId = user.profilePic.split("/").pop()?.split(".")[0];
    await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
  }

  user.profilePic = req.file.path;
  await user.save();

  res.status(200).json({ success: true, message: "Profile picture updated successfully", profilePic: user.profilePic });
});
