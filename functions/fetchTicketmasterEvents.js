const axios = require('axios');

async function fetchTicketmasterEvents(location, keywords) {
  const apiKey = 'your_ticketmaster_api_key';

  try {
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events', {
      params: {
        apikey: apiKey,
        city: location,
        keyword: keywords,
      },
    });

    return response.data._embedded.events.map(event => ({
      title: event.name,
      url: event.url,
      startTime: event.dates.start.dateTime,
      endTime: event.dates.end ? event.dates.end.dateTime : null,
      venue: event._embedded.venues[0].name,
      source: 'Ticketmaster',
    }));
  } catch (error) {
    console.error('Error fetching Ticketmaster events:', error);
    return [];
  }
}

module.exports = fetchTicketmasterEvents;
