const express = require('express');
const router = express.Router();
const UserView = require('../models/UserView');

const fetchNearbyUsers = async (latitude, longitude, distance) => {
  try {
    const nearbyUsers = await UserView.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: distance * 1609.34, // Convert miles to meters
        },
      },
    });

    return nearbyUsers;
  } catch (error) {
    console.error('Error fetching nearby users:', error);
  }
};

router.get('/', async (req, res) => {
  const { latitude, longitude, distance } = req.query;

  if (!latitude || !longitude || !distance) {
    return res.status(400).json({ error: 'Missing required query parameters.' });
  }

  const nearbyUsers = await fetchNearbyUsers(parseFloat(latitude), parseFloat(longitude), parseFloat(distance));
  res.json({ count: nearbyUsers.length, users: nearbyUsers });
});

module.exports = router;
