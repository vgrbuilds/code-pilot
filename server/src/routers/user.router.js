import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile } from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";


const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// profile routes
router.get("/profile", authenticateUser, getUserProfile);
router.put("/profile", authenticateUser, updateUserProfile);
router.delete("/profile", authenticateUser, deleteUserProfile);

export default router;