import Repo from '../models/repo.model.js';
import { ingestRepository } from '../services/repo.service.js';

/**
 * Controller to create (ingest) a repository.
 */
export const createRepo = async (req, res) => {
    try {
        const { repo_url } = req.body;
        if (!repo_url) {
            return res.status(400).json({ message: "repo_url is required in request body" });
        }

        const repo = await ingestRepository(repo_url);
        return res.status(201).json({
            message: "Repository ingested successfully",
            data: repo
        });
    } catch (error) {
        console.error("Error in createRepo controller:", error);
        return res.status(500).json({
            message: "Failed to ingest repository",
            error: error.message
        });
    }
};

/**
 * Controller to get all repositories.
 */
export const getAllRepos = async (req, res) => {
    try {
        const repos = await Repo.find({}).sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Repositories retrieved successfully",
            data: repos
        });
    } catch (error) {
        console.error("Error in getAllRepos controller:", error);
        return res.status(500).json({
            message: "Failed to retrieve repositories",
            error: error.message
        });
    }
};

/**
 * Controller to get a repository by ID.
 */
export const getRepoById = async (req, res) => {
    try {
        const { id } = req.params;
        const repo = await Repo.findById(id);
        if (!repo) {
            return res.status(404).json({ message: `Repository with ID ${id} not found` });
        }
        return res.status(200).json({
            message: "Repository retrieved successfully",
            data: repo
        });
    } catch (error) {
        console.error("Error in getRepoById controller:", error);
        return res.status(500).json({
            message: "Failed to retrieve repository",
            error: error.message
        });
    }
};

/**
 * Controller to search/filter repositories by query parameters.
 */
export const getRepoByFilter = async (req, res) => {
    try {
        const query = {};
        if (req.query.repo_name) {
            query.repo_name = new RegExp(req.query.repo_name, 'i');
        }
        if (req.query.repo_url) {
            query.repo_url = req.query.repo_url.toLowerCase();
        }
        
        const repos = await Repo.find(query);
        return res.status(200).json({
            message: "Filtered repositories retrieved successfully",
            data: repos
        });
    } catch (error) {
        console.error("Error in getRepoByFilter controller:", error);
        return res.status(500).json({
            message: "Failed to query repositories",
            error: error.message
        });
    }
};
