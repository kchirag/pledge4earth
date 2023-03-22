// routes/leaderRoutes.js
const router = require('express').Router();
const Leader = require('../models/Leader');

router.get('/', async (req, res) => {
  try {
    const leaders = await Leader.find();
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaders' });
  }
});

module.exports = router;
