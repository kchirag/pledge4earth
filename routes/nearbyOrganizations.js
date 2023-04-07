// routes/nearbyOrganizations.js

const router = require('express').Router();
const Organization = require('../models/Organization');

//const mongoose = require('mongoose');

const fetchNearbyOrganizations = async (latitude, longitude, distance = 10000) => {
  try {
    const nearbyOrganizations = await Organization.aggregate([
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
        },
      },
      {
        $sort: { distance: 1 },
      },
    ]).limit(20);
    return nearbyOrganizations;
  } catch (error) {
    console.error('Error fetching nearby users:', error);
  }
};

router.get('/', async (req, res) => {
  const { latitude, longitude, distance } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required query parameters.' });
  }

  const nearbyOrganizations = await fetchNearbyOrganizations(parseFloat(latitude), parseFloat(longitude), parseFloat(distance));
  res.json({ count: nearbyOrganizations.length, users: nearbyOrganizations });
});

module.exports = router;
