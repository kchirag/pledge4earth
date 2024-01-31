const mongoose = require('mongoose');

// Define the schema
const LogSchema = new mongoose.Schema({
    deviceid: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post' // assuming 'Post' is the name of your Post model
    }
});

// Create the model
const LogModel = mongoose.model('Log', LogSchema);

module.exports = LogModel;
