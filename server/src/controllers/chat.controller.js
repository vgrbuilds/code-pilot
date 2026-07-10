import mongoose from "mongoose";
import Chat from "../models/chat.model.js";
import Chunk from "../models/chunk.model.js";
import Repo from "../models/repo.model.js";
import { getEmbedding, generateChatResponse } from "../utils/gemini.js";

/**
 * Get conversation history for a specific repository
 */
export const getChatHistory = async (req, res) => {
    try {
        const { repoId } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findOne({ user_id: userId, repo_id: repoId });
        return res.status(200).json({
            message: "Chat history retrieved successfully",
            data: chat ? chat.messages : []
        });
    } catch (error) {
        console.error("Error in getChatHistory controller:", error);
        return res.status(500).json({
            message: "Failed to retrieve chat history",
            error: error.message
        });
    }
};

/**
 * Send a message to the RAG chat and save it in user/repo context
 */
export const sendMessage = async (req, res) => {
    try {
        const { repoId } = req.params;
        const { message } = req.body;
        const userId = req.user._id;

        if (!message || message.trim() === "") {
            return res.status(400).json({ message: "message is required in request body" });
        }

        // Validate repository exists
        const repo = await Repo.findById(repoId);
        if (!repo) {
            return res.status(404).json({ message: "Repository not found" });
        }

        // 1. Generate query embedding
        let queryEmbedding;
        try {
            queryEmbedding = await getEmbedding(message);
        } catch (embedErr) {
            console.error("Failed to generate query embedding:", embedErr);
            return res.status(500).json({ message: "Failed to process query embedding" });
        }

        // 2. Perform Vector search with fallback
        const repoObjId = new mongoose.Types.ObjectId(repoId);
        let chunks = [];
        try {
            chunks = await Chunk.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embedding_vector",
                        queryVector: queryEmbedding,
                        numCandidates: 100,
                        limit: 5,
                        filter: { repo_id: repoObjId }
                    }
                }
            ]);
        } catch (vectorSearchErr) {
            console.warn(
                "Atlas Vector Search failed or index not found. Falling back to fetching standard chunks:", 
                vectorSearchErr.message
            );
            // Fallback: load first 5 chunks of the repo to avoid empty context
            chunks = await Chunk.find({ repo_id: repoObjId }).limit(5);
        }

        // 3. Fetch conversation history for prompt context
        let chat = await Chat.findOne({ user_id: userId, repo_id: repoId });
        if (!chat) {
            chat = new Chat({
                user_id: userId,
                repo_id: repoId,
                messages: []
            });
        }

        // Extract last 6 messages to keep context window compact
        const historyContext = chat.messages.slice(-6);

        // 4. Construct prompt
        const systemInstruction = 
            "You are an expert developer assistant for CodePilot. " +
            "You will be asked questions about a repository's codebase. " +
            "Use the provided relevant code snippets to answer the question. " +
            "If the snippets do not contain enough information, use your general knowledge, but prioritize the provided codebase context. " +
            "Always format your response with clean markdown and correct syntax highlighting.";

        let promptContent = `Codebase context from repository (${repo.repo_name}):\n\n`;
        if (chunks.length > 0) {
            chunks.forEach((chunk, index) => {
                promptContent += `--- Snippet ${index + 1} ---\n`;
                promptContent += `File: ${chunk.file_path}\n`;
                promptContent += `Language: ${chunk.language}\n`;
                promptContent += `\`\`\`${chunk.language ? chunk.language.toLowerCase() : ''}\n`;
                promptContent += `${chunk.chunk_content}\n`;
                promptContent += `\`\`\`\n\n`;
            });
        } else {
            promptContent += "No repository snippets were found for this query.\n\n";
        }

        promptContent += "Prior Conversation History:\n";
        if (historyContext.length > 0) {
            historyContext.forEach(msg => {
                promptContent += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
            });
        } else {
            promptContent += "No prior history.\n";
        }

        promptContent += `\nUser's current question: ${message}\n`;
        promptContent += "Assistant's reply: ";

        // 5. Query Gemini API
        let aiReply;
        try {
            aiReply = await generateChatResponse(promptContent, systemInstruction);
        } catch (apiErr) {
            console.error("Gemini API inference failed:", apiErr);
            return res.status(500).json({ message: "Failed to generate response from Gemini API" });
        }

        // 6. Save messages to chat document
        chat.messages.push({ role: "user", content: message });
        chat.messages.push({ role: "assistant", content: aiReply });
        await chat.save();

        return res.status(200).json({
            message: "Response generated and saved",
            data: {
                role: "assistant",
                content: aiReply,
                createdAt: new Date()
            }
        });
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        return res.status(500).json({
            message: "Failed to process chat message",
            error: error.message
        });
    }
};

/**
 * Retrieve all conversation threads for the logged-in user
 */
export const getUserConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ user_id: userId })
            .populate('repo_id', 'repo_name repo_url languages tags')
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            message: "User conversations retrieved successfully",
            data: chats
        });
    } catch (error) {
        console.error("Error in getUserConversations controller:", error);
        return res.status(500).json({
            message: "Failed to retrieve user conversations",
            error: error.message
        });
    }
};
