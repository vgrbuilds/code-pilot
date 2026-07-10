import express from "express";
import { getChatHistory, sendMessage } from "../controllers/chat.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Secure all chat paths with JWT authentication
router.use(authenticateUser);

router.get("/:repoId/history", getChatHistory);
router.post("/:repoId/message", sendMessage);

export default router;
