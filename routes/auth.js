// routes/auth.js
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json('Username already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const newUser = new User({
    username,
    password: hashedPassword,
  });

  // Save the user and return a response
  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json('Invalid username or password');
  }

  // Check if the password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json('Invalid username or password');
  }

  // Create and sign a JWT
  const token = jwt.sign({ _id: user._id }, 'pledge4earth');
  res.header('auth-token', token).json(token);
});

module.exports = router;
