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
router.post('/', async (req, res) => {
  const leader = new Leader(req.body);

  try {
    const savedLeader = await leader.save();
    res.status(201).json(savedLeader);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//get the leader data
router.get('/:leaderId', async (req, res) => {
  const { leaderId } = req.params;

  try {
    const leader = await Leader.findById(leaderId);

    if (!leader) {
      return res.status(404).json({ message: 'Leader not found' });
    }

    res.json(leader);
  } catch (err) {
    console.error(err);
    // This will handle cases where the leaderId is not a valid MongoDB ObjectId as well.
    res.status(500).json({ message: 'Error fetching leader' });
  }
});

module.exports = router;
