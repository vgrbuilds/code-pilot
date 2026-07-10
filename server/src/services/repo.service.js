import fs from 'fs/promises';
import path from 'path';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import Repo from '../models/repo.model.js';
import downloadRepo from '../utils/download.repo.js';
import { extractRepoContent } from '../utils/extract.repo.js';
import normalizeRepoUrl from '../utils/normalise.repo_url.js';
import getEmbedding from '../utils/gemini.js';
import { saveChunksToDB } from './chunks.service.js';

const extensionToLanguage = {
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".py": "Python",
    ".java": "Java",
    ".cpp": "C++",
    ".c": "C",
    ".cs": "C#",
    ".go": "Go",
    ".rs": "Rust",
    ".php": "PHP",
    ".rb": "Ruby",
    ".swift": "Swift",
    ".kt": "Kotlin",
    ".md": "Markdown",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".toml": "TOML"
};

/**
 * Checks if repository already exists in database
 */
const checkIfRepoExists = async (repo_url) => {
    const normalizedUrl = normalizeRepoUrl(repo_url);
    const exists = await Repo.exists({ repo_url: normalizedUrl });
    return !!exists;
};

/**
 * Main ingestion service function
 */
export const ingestRepository = async (repo_url) => {
    const normalizedUrl = normalizeRepoUrl(repo_url);
    
    // 1. Check if repo already exists
    const existingRepo = await Repo.findOne({ repo_url: normalizedUrl });
    if (existingRepo) {
        return existingRepo;
    }

    // Extract repo name from URL (e.g. owner/repo)
    const urlParts = normalizedUrl.replace(/https?:\/\/(www\.)?github\.com\//, "").split("/");
    const repo_name = urlParts.length >= 2 ? `${urlParts[0]}/${urlParts[1]}` : urlParts[0];

    let tempDir = null;
    try {
        // 2. Download and extract repository zip
        tempDir = await downloadRepo(repo_url);

        // 3. Extract contents of permitted files
        const files = await extractRepoContent(tempDir);
        if (files.length === 0) {
            throw new Error("No files eligible for ingestion found in repository.");
        }

        // 4. Detect unique languages used in the repository
        const languagesSet = new Set();
        for (const file of files) {
            const ext = path.extname(file.file_path).toLowerCase();
            if (extensionToLanguage[ext]) {
                languagesSet.add(extensionToLanguage[ext]);
            }
        }
        const languages = Array.from(languagesSet);

        // 5. Create Repo entry in MongoDB
        const repo = await Repo.create({
            repo_name,
            repo_url: normalizedUrl,
            languages,
            tags: ["public", ...languages.map(l => l.toLowerCase())]
        });

        // 6. Split files into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        });

        const chunkDocs = [];
        for (const file of files) {
            const ext = path.extname(file.file_path).toLowerCase();
            const language = extensionToLanguage[ext] || "Unknown";
            
            const fileChunks = await splitter.splitText(file.content);
            
            // Limit sequential requests or batch them to avoid overloading rate limits.
            // For now, sequentially process each chunk and generate its embedding.
            for (let i = 0; i < fileChunks.length; i++) {
                const chunkText = fileChunks[i];
                try {
                    const embedding = await getEmbedding(chunkText);
                    chunkDocs.push({
                        repo_id: repo._id,
                        file_path: file.file_path,
                        language,
                        chunk_index: i,
                        chunk_content: chunkText,
                        embedding_vector: embedding
                    });
                } catch (embedError) {
                    console.error(`Skipping chunk ${i} of file ${file.file_path} due to embedding failure:`, embedError);
                }
            }
        }

        // 7. Save all chunks in MongoDB
        if (chunkDocs.length > 0) {
            await saveChunksToDB(chunkDocs);
        }

        return repo;
    } catch (error) {
        console.error("Error during repository ingestion:", error);
        throw error;
    } finally {
        // 8. Clean up temporary directory
        if (tempDir) {
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.error("Failed to clean up temporary directory:", cleanupError);
            }
        }
    }
};