const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const fetchClimateEvents = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const events = [];

    // Replace the following with the appropriate selector for the website you are scraping
    $('.event').each((index, element) => {
      const title = $(element).find('.event-title').text();
      const date = $(element).find('.event-date').text();
      const location = $(element).find('.event-location').text();
      const description = $(element).find('.event-description').text();

      const newEvent = new Event({
        title,
        date,
        location,
        description,
        category: 'Climate',
      });

      events.push(newEvent);
    });

    Event.insertMany(events, (error, docs) => {
      if (error) {
        console.log('Error inserting events:', error);
      } else {
        console.log('Events inserted successfully:', docs);
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

const climateEventsUrl = 'https://www.example.com/climate-events'; // Replace with the actual URL
fetchClimateEvents(climateEventsUrl);
