// routes/nearbyLeaders.js

const router = require('express').Router();
const Leader = require('../models/Leader');
//const mongoose = require('mongoose');

const fetchNearbyLeaders = async (latitude, longitude, distance = 10000) => {
  try {
    const nearbyLeaders = await Leader.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: distance * 1609.34, // Convert miles to meters
          spherical: true,
          distanceMultiplier: 1 / 1609.34, // Convert meters to miles
          isEmailConfirmed:true,
        },
      },
      {
        $sort: { distance: 1 },
      },
    ]);
    return nearbyLeaders;
  } catch (error) {
    console.error('Error fetching nearby users:', error);
  }
};

router.get('/', async (req, res) => {
  const { latitude, longitude, distance } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required query parameters.' });
  }

  const nearbyLeaders = await fetchNearbyLeaders(parseFloat(latitude), parseFloat(longitude), parseFloat(distance));
  res.json({ count: nearbyLeaders.length, users: nearbyLeaders });
});

module.exports = router;
