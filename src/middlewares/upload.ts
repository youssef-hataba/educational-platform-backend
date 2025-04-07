import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const thumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "thumbnails",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 400, height: 225, crop: "fill" }],
  } as any,
});

const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 200, height: 200, crop: "thumb", gravity: "face" }],
  } as any,
});

export const uploadThumbnail = multer({ storage: thumbnailStorage });

export const uploadProfilePic = multer({ storage: profilePicStorage });