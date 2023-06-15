const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const fetchEventbriteEvents = require('../functions/fetchEventbriteEvents');


async function getEventsFromDatabase(location, latitude, longitude) {
  try {
    const events = await Event.find({ latitude, longitude });
    return events;
  } catch (error) {
    console.error('Error retrieving events from the database:', error);
    return [];
  }
}
async function cacheEventsInDatabase(events) {
  try {
    // Delete events with the same latitude and longitude
    await Event.deleteMany({ latitude: events[0].latitude, longitude: events[0].longitude });

    // Insert the new events
    await Event.insertMany(events);

    console.log('Successfully cached events in the database');
  } catch (error) {
    console.error('Error caching events in the database:', error);
  }
}
async function fetchAllEvents(location, keywords, latitude, longitude) {
  const eventbriteEvents = await fetchEventbriteEvents(location, keywords);
  //const meetupEvents = await fetchMeetupEvents(location, keywords);
  //const ticketmasterEvents = await fetchTicketmasterEvents(location, keywords);
  //const facebookEvents = await fetchFacebookEvents(location, keywords);

  const allEvents = [
    ...eventbriteEvents,
    //...meetupEvents,
    //...ticketmasterEvents,
    //...facebookEvents,
  ].map(event => ({ ...event, latitude, longitude }));

  await cacheEventsInDatabase(allEvents);

  return allEvents;
}
router.get('/', async (req, res) => {
//  const keywords = req.query.keywords;
  const city = req.query.location;

  const keywords = "climate,environment,sustainability,cleanliness,tree planting,save soil";
  const latitude = parseFloat(req.query.latitude);
  const longitude = parseFloat(req.query.longitude);

  if (!city || !latitude || !longitude) {
    res.status(400).json({ error: 'location, latitude, and longitude are required.' });
    return;
  }

  // Get cached events for the given location
  let events = await getEventsFromDatabase( latitude, longitude);

  const location = {"address":city,latitude,longitude}
  // If no cached events are found, fetch events and cache them
  if (events.length === 0) {
    events = await fetchAllEvents(location, keywords, latitude, longitude);
  }

  res.json(events);

});



module.exports = router;
