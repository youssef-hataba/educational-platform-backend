import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
import AppError from "../utils/AppError";
import asyncHandler from "./asyncHandler";
import { UserRole } from "../models/UserModel";

interface AuthRequest extends Request {
  user?: any;
};

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized, no token provided", 401);
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
  
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    throw new AppError("User not found, invalid token", 404);
  }

  req.user = user;
  next();
});

// ✅ Check if the user is an admin
export const checkAdmin = asyncHandler(async (req: AuthRequest, res: Response,next:NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, no user found" });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: "Access denied, admin only" });
  }

  next();
});

export const checkInstructor = asyncHandler(async (req: AuthRequest, res: Response,next:NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, no user found" });
  }

  if (req.user.role !== UserRole.INSTRUCTOR) {
    return res.status(403).json({ message: "Access denied, Instructor only" });
  }

  next();
});
