import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance = null;

const getGenAI = () => {
    if (!genAIInstance) {
        const apiKey = process.env.GEMINI_API || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API or GEMINI_API_KEY environment variable is not defined.");
        }
        genAIInstance = new GoogleGenerativeAI(apiKey);
    }
    return genAIInstance;
};

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
        
        const sdk = getGenAI();
        const model = sdk.getGenerativeModel({ model: "gemini-embedding-2" });
        const result = await model.embedContent({
            content: { parts: [{ text: text }] },
            outputDimensionality: 768
        });
        
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

/**
 * Generates a response using Gemini's model.
 * @param {string} prompt - The final compiled prompt text.
 * @param {string} systemInstruction - Optional system instruction/persona.
 * @returns {Promise<string>} The generated markdown text.
 */
export const generateChatResponse = async (prompt, systemInstruction = "") => {
    try {
        const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const modelConfig = { model: modelName };
        if (systemInstruction) {
            modelConfig.systemInstruction = systemInstruction;
        }
        
        const sdk = getGenAI();
        const model = sdk.getGenerativeModel(modelConfig);
        const result = await model.generateContent(prompt);
        
        if (result && result.response) {
            return result.response.text();
        } else {
            throw new Error("No response content from Gemini Text API");
        }
    } catch (error) {
        console.error("Error generating chat response from Gemini API:", error);
        throw error;
    }
};

export default getEmbedding;
