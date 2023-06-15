const axios = require('axios');
const cheerio = require('cheerio');
const apiKey = 'f87a3fd935214b2bb2aa25e63614fa95';
const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const dotenv = require('dotenv');

dotenv.config();
//console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const fetchClimateEvents = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const eventPromises = [];
    const events = [];


    $('.p-0.bg-clip-padding.bg-cover.bg-transparent.relative.h-full.flex.bg-white.z-0.break-words.transition-shadow.duration-300.w-full.flex-row.justify-start.py-4.border-t.border-gray3.md\\:pt-4.md\\:pb-5').each((index, element) => {
      const eventName = $(element).find('h2.text-gray7.font-medium.text-base.pt-0.pb-1.line-clamp-3').text().trim();
      const eventDate = $(element).find('time').attr('datetime');
      const groupName = $(element).find('p.hidden.md\\:line-clamp-1.text-gray6').text().trim().replace('Group name:', '');
      const location = $(element).find('p.line-clamp-1.md\\:hidden').last().text().trim(); // assuming this is the location
      const eventUrl = $(element).find('a').attr('href'); // extracting the event URL

      const eventPromise = axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&limit=1`)
        .then((response) => {
          const { data } = response;
          if (data.results && data.results.length > 0) {
            const { geometry } = data.results[0];
            console.log('Event Name:', eventName);
            console.log('Event Date:', eventDate);
            console.log('Group Name:', groupName);
            console.log('Location:', location);
            console.log('Latitude:', geometry.lat);
            console.log('Longitude:', geometry.lng);
            console.log('Event URL:', eventUrl); // printing the event URL
            console.log('---------------------------------');
            const cleanDateStr = eventDate.replace('[UTC]', '');

            const eventDaten = new Date(cleanDateStr);
            console.log(eventDaten);

            const newEvent = new Event({
              'title':eventName,
              'startTime':eventDaten,
              'venue':location,
              'description':groupName,
              'source':'Meetup',
              'location': {
                type: 'Point',
                coordinates: [geometry.lng, geometry.lat],
              },
              'url':eventUrl,
              'category': 'Climate',
            });
            console.log(newEvent);
            events.push(newEvent);
          }
        })
        .catch((error) => {
          console.error(`Error fetching geocoding data for location "${location}":`, error);
        });

      eventPromises.push(eventPromise);
    });
    console.log('Starting insertMany() operation');
    Promise.all(eventPromises)
      .then(() => {
        // Now you can proceed with inserting into the database
        Event.insertMany(events)
          .then((events) => {
            console.log('Inserted');
          })
          .catch((err) => {
            console.log('Error writing event');
          });
      })
      .catch((err) => {
        console.error('Error fetching event data:', err);
      });

  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

const climateEventsUrl = 'https://www.meetup.com/find/in--mumbai/?keywords=Climate'; // Replace with the actual URL
fetchClimateEvents(climateEventsUrl);