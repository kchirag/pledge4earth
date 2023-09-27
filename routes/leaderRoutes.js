// routes/leaderRoutes.js
const router = require('express').Router();
const Leader = require('../models/Leader');
const ensureAuthenticated = require('../middleware/auth');


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

// This is a basic middleware for demonstration purposes. 
// You should adjust this to your authentication strategy.

//console.log(ensureAuthenticated);
// update leader data
router.put('/:leaderId', ensureAuthenticated, async (req, res) => {
    const { leaderId } = req.params;
    const updatedData = req.body;

    try {
        const leader = await Leader.findByIdAndUpdate(leaderId, updatedData, { new: true });

        if (!leader) {
            return res.status(404).json({ message: 'Leader not found' });
        }

        res.json(leader);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating leader' });
    }
});

// Route to claim the profile
router.put('/claim/:id', async (req, res) => {
  const leader = await Leader.findById(req.params.id);
  leader.isClaimed = true;
  await leader.save();
  res.send(leader);
});

// Route to update the profile
router.put('/update/:id', async (req, res) => {
  const { name, profileInformation } = req.body;
  const leader = await Leader.findByIdAndUpdate(req.params.id, { name, profileInformation });
  res.send(leader);
});

module.exports = router;
