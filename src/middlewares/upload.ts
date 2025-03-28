import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "thumbnails",
  }as any,
});

export const uploadImage = multer({ storage: imageStorage });