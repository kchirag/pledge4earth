// routes/leaderRoutes.js
const router = require('express').Router();
const Leader = require('../models/Leader');


router.post('/', async (req, res) => {
  const leader = new Leader(req.body);
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (token){
    const decoded = jwt.verify(token, 'pledge4earth');
    leader.addedby = decoded.user;
  }

  try {
    const savedLeader = await leader.save();
    res.status(201).json(savedLeader);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//get the leader data
router.get('/id/:leaderId', async (req, res) => {
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

//get the leader data
router.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  try {
    const leader = await Leader.findOne({ url_slug: slug });

    if (!leader) {
      return res.status(404).json({ message: 'Leader for slug' + slug + ' not found'});
    }
    
    res.json(leader);
  } catch (err) {
    console.error(err);
    // This will handle cases where the leaderId is not a valid MongoDB ObjectId as well.
    res.status(500).json({ message: 'Error fetching leader' });
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

router.get('/', async (req, res) => {
  try {
    console.log("Get all leaders")
    const leaders = await Leader.find();
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaders' });
  }
});


// This is a basic middleware for demonstration purposes. 
// You should adjust this to your authentication strategy.
const ensureAuthenticated = require('../middleware/auth');

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


module.exports = router;
