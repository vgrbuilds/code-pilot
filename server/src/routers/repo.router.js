import express from "express";
import { createRepo, getAllRepos, getRepoById, getRepoByFilter } from "../controllers/repo.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all repository endpoints
router.use(authenticateUser);

router.post("/", createRepo);
router.get("/", getAllRepos);
router.get("/filter", getRepoByFilter);
router.get("/:id", getRepoById);

export default router;