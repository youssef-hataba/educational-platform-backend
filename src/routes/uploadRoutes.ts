import express from "express";
import { uploadProfilePic, uploadThumbnail } from "../middlewares/upload";
import { uploadThumbnailController, uploadProfilePicture } from "../controllers/uploadController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/thumbnail", uploadThumbnail.single("thumbnail"), uploadThumbnailController);
router.post("/profile-pic", protect, uploadProfilePic.single("profilePic"), uploadProfilePicture);


export default router;