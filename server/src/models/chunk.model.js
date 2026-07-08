import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema({
    repo_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repo',
        required: true,
        index: true,
    },
    file_path:{
        type: String,
        required: true,
        index: true,
    },
    language:{
        type: String,
        required: true,
    },
    chunk_index:{
        type: Number,
        required: true,
    },
    chunk_content:{
        type: String,
        required: true,
    },
    embedding_vector:{
        type: [Number],
        required: true,
    }
}, {
    timestamps: true
});

const Chunk = mongoose.model('Chunk', chunkSchema);
export default Chunk;