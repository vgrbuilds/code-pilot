const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
    repo_name:{
        type: String,
        required: true,
        unique: true
    },
    repo_url:{
        type: String,
        required: true,
        minlength: 6
    },
    tags:{
        type: [String],
        default: []
    },
    languages:{
        type: [String],
        default: []
    },
    timestamps: true
})
