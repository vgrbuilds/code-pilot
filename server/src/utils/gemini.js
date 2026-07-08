import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Warning: GEMINI_API or GEMINI_API_KEY environment variable is not defined.");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generates an embedding vector for a given text using Gemini's text-embedding-004 model.
 * @param {string} text - The input text content.
 * @returns {Promise<number[]>} The embedding vector (an array of floats).
 */
export const getEmbedding = async (text) => {
    try {
        if (!text || text.trim() === "") {
            throw new Error("Text content is required for embedding generation.");
        }
        
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        
        if (result && result.embedding && result.embedding.values) {
            return result.embedding.values;
        } else {
            throw new Error("Invalid response format from Gemini Embedding API");
        }
    } catch (error) {
        console.error("Error generating embedding from Gemini API:", error);
        throw error;
    }
};

export default getEmbedding;
