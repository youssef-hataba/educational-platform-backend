import { NextFunction, Request, Response } from "express";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../utils/AppError";

// Generate JWT Token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// ✅ Register User
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("User already exists", 400);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  const token = generateToken(newUser.id);


  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      _id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      enrolledCourses: newUser.enrolledCourses
    },
  });
});


// ✅ Login User
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isMatch = await user.comparePassword(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = generateToken(user.id);

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      enrolledCourses: user.enrolledCourses
    },
  });
});
