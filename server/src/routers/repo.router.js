import express from "express";
import { createRepo, getAllRepos, getRepoById, getRepoByFilter } from "../controllers/repo.controller.js";

const router = express.Router();

router.post("/", createRepo);
router.get("/", getAllRepos);
router.get("/:id", getRepoById);
router.get("/filter", getRepoByFilter);

export default router;