import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";


export const uploadImageController = asyncHandler((req: Request, res: Response) => {
  if(!req.file){
    return res.status(400).json({success:false, message:"No Image Uploaded!"});
  }

  res.status(200).json({
    sucess:true,
    message:"Image Uploaded Successfully!",
    image: req.file.path,
  });
})