// routes/organizationRoutes.js
const router = require('express').Router();
const Organization = require('../models/Organization');


router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
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


module.exports = router;
