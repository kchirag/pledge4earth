// routes/userViews.js
const express = require('express');
const router = express.Router();
const UserView = require('../models/UserView');

router.post('/', async (req, res) => {
  const userView = new UserView(req.body);

  try {
    const savedUserView = await userView.save();
    res.status(201).json(savedUserView);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
