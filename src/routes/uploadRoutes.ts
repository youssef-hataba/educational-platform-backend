import express from "express";
import { uploadImage } from "../middlewares/upload";
import { uploadImageController } from "../controllers/uploadController";

const router = express.Router();

router.post("/upload-thumbnail", uploadImage.single("thumbnail"),uploadImageController);

export default router;