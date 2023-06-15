const axios = require('axios');

async function fetchEventbriteEvents(location, keywords) {
  const apiKey = 'T6XOOGYY26P6SJ4VPRCB';

  try {
    const response = await axios.get('https://www.eventbriteapi.com/v3/events/search/', {
      params: {
        q: keywords,
        "location.address":location["address"],
        expand: 'venue',
        token: apiKey,
      },
    });

    return response.data.events.map(event => ({
      title: event.name.text,
      url: event.url,
      startTime: event.start.local,
      endTime: event.end.local,
      venue: event.venue.name,
      source: 'Eventbrite',
    }));
  } catch (error) {
    console.error('Error fetching Eventbrite events:', error);
    return [];
  }
}

module.exports = fetchEventbriteEvents;
