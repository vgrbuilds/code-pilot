const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
    repo_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repo',
        required: true
    },
    file_path:{
        type: String,
        required: true,
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
    },
    timestamps: true
})