const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');

router.get('/', async (req, res) => {
  const { latitude, longitude, distance = 1000 } = req.query; // distance in miles, default to 10 miles if not provided

  // Convert the latitude and longitude to a number
  const coordinates = [parseFloat(longitude), parseFloat(latitude)];

  try {
    // Find events near the provided coordinates
    const events = await Event.aggregate([
      {
        $geoNear: {
          near: coordinates, // Using legacy coordinate pair instead of GeoJSON
          distanceField: 'distance',
          maxDistance: distance * 1, 
          spherical: true,
          distanceMultiplier: 1609.34,
        },
      },
      {
        $sort: { distance: 1 },
      },
    ]);

    res.json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

module.exports = router;


