
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const LogModel = require('../models/LogModel');
const multer = require('multer');
//const upload = multer({ dest: 'uploads/' }); // configure multer
const ensureAuthenticated = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/uploadmedia'); // Adjust the path as per your project structure
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function generateTextVariations(prompt, language, variations = 15) {
  let responses = [];
  for (let i = 0; i < variations; i++) {
    try {
    let updatedprompt = "rewrite '" + prompt + "' in " + language; 
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct", // Adjust according to your needs
        prompt: prompt,
        max_tokens: 15,
        temperature: 0.7,
      });
      console.log(response);
      responses.push(response.choices[0].text.trim());
    } catch (error) {
      console.error("Error in generateTextVariations:", error.response || error);
      break;
    }
  }
  return responses;
}

router.post('/post/:language/:category', ensureAuthenticated, uploadMultiple, async (req, res) => {
    const { text } = req.body;
    const mediaUrls = req.files.map(file => `https://storage.googleapis.com/lead4earth/${file.filename}`);
    let language = req.params.language || 'English';
    let category = req.params.category || 'awareness';
    if (!['Hindi', 'English'].includes(language)) {
        language = "English";
    }

    try {
        const variations = await generateTextVariations(text,language,category); // Await the result directly
        const post = new Post({ text, variations, language, category, media: mediaUrls });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error("Error in POST /post:", error);
        res.status(500).json({ message: 'Error creating post' });
    }
});

router.get('/post/:postId', ensureAuthenticated, async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching post' });
    }
});

router.get('/posts/latest/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // default limit to 10 posts
    const skip = parseInt(req.query.skip) || 0; // default skip to 0

    try {
        const posts = await Post.find({})
            .sort({ createdAt: -1 }) // sorting by createdAt in descending order
            .skip(skip)
            .limit(limit);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

router.get('/posts/:language/:category/:deviceid', async (req, res) => {
    const { language, category, deviceid } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    try {
        const posts = await Post.find({ language: language })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Assuming you have a model or a method to save the log
        const logEntries = posts.map(post => ({
            deviceid: deviceid,
            language: language,
            timestamp: new Date(), // current server time
            postid: post._id // assuming each post has a unique _id
        }));

        // Save log entries to the database
        await LogModel.create(logEntries);

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

module.exports = router;
