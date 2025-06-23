const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    author: {
        name: String,
        profilePicture: String
    },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    content: String,
    image: String,
    timestamp: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    shares: { type: Number, default: 0 }
});

module.exports = mongoose.model('Post', PostSchema);