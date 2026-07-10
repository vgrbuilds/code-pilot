import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    repo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repo',
        required: true,
        index: true
    },
    messages: [
        {
            role: {
                type: String,
                enum: ['user', 'assistant'],
                required: true
            },
            content: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

// A unique compound index guarantees exactly one conversation per user/repo pair
chatSchema.index({ user_id: 1, repo_id: 1 }, { unique: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
