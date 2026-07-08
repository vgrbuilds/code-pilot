import mongoose from 'mongoose';

const repoSchema = new mongoose.Schema({
    repo_name:{
        type: String,
        required: true,
        unique: true
    },
    repo_url:{
        type: String,
        required: true,
        unique:true,
        index:true
    },
    tags:{
        type: [String],
        default: []
    },
    languages:{
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const Repo = mongoose.model('Repo', repoSchema);
export default Repo;
