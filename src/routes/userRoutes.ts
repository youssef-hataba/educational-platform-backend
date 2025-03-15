import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  deactivateAccount,
} from "../controllers/userController";
import { checkAdmin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Get user profile 
router.get("/profile", protect, getUserProfile);


// Update user profile 
router.patch("/profile", protect, updateUserProfile);

// Deactivate account 
router.patch("/deactivate", protect, deactivateAccount);

// Get all users (Admin Only)
router.get("/", protect,checkAdmin, getAllUsers);

// Delete a user (Admin Only)
router.delete("/:id", protect,checkAdmin, deleteUser);



export default router;
