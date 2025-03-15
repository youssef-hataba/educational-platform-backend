import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
import AppError from "../utils/AppError";
import asyncHandler from "./asyncHandler";

interface AuthRequest extends Request {
  user?: any;
};

export const portect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized, no token provided", 401);
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new AppError("User not found, invalid token", 404);
  }

  req.user = user;
  next();
});