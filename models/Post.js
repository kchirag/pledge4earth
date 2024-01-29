const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    variations: {
        type: [{
            type: String,
            required: true,
            maxlength: 1000
        }]
    },
    language: {
        type: String,
        enum: ['Hindi', 'English'], // Allow only 'Hindi' and 'English' as valid values
        default: 'English'
    },
    media: {
        type: [{
            type: String, // URL or path to the media file
        }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 5'] // Apply validator to the array itself.
    },
    createdAt: {
        type: Date,
        required: true,
        default:Date.now // Default date of creation
    }
    // ... include other fields like user reference, timestamps, etc.
});

// Helper function to limit media array
function arrayLimit(val) {
    return val.length <= 5;
}

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
