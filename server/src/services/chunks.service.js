import Chunk from '../models/chunk.model.js';
import getEmbedding from '../utils/gemini.js';

/**
 * Inserts multiple chunks into the database.
 * @param {Array<Object>} chunks - Array of chunk objects to save.
 * @returns {Promise<Array<Object>>} The saved chunk documents.
 */
export const saveChunksToDB = async (chunks) => {
    try {
        if (!chunks || chunks.length === 0) {
            return [];
        }
        return await Chunk.insertMany(chunks);
    } catch (error) {
        console.error("Error inserting chunks to DB:", error);
        throw error;
    }
};

/**
 * Gets a chunk by its database ID.
 * @param {string} id - The chunk ID.
 * @returns {Promise<Object|null>} The chunk document.
 */
export const getChunkById = async (id) => {
    try {
        return await Chunk.findById(id);
    } catch (error) {
        console.error(`Error finding chunk by id ${id}:`, error);
        throw error;
    }
};

/**
 * Gets all chunks for a specific repository.
 * @param {string} repoId - The MongoDB ID of the repository.
 * @returns {Promise<Array<Object>>} The list of chunks.
 */
export const getChunksByRepoId = async (repoId) => {
    try {
        return await Chunk.find({ repo_id: repoId }).sort({ file_path: 1, chunk_index: 1 });
    } catch (error) {
        console.error(`Error finding chunks for repo ${repoId}:`, error);
        throw error;
    }
};

/**
 * Simple search for similar chunks (mock or basic vector search if needed).
 * This can be expanded when vector indexes are configured in MongoDB.
 */
export const searchSimilarChunks = async (queryEmbedding, limit = 5) => {
    // Vector search query would go here once a MongoDB vector index is set up.
    // For now, we stub it or return empty.
    return [];
};
