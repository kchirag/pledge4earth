const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // configure multer
const ensureAuthenticated = require('../middleware/auth');


router.post('/post', ensureAuthenticated, upload.array('media', 5), async (req, res) => {
    const { text } = req.body;
    const mediaUrls = req.files.map(file => file.path); // assuming local storage; modify if using cloud storage

    try {
        const post = new Post({ text, media: mediaUrls });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post' });
    }
});
