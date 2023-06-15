const axios = require('axios');
const jwt = require('jsonwebtoken');

async function fetchMeetupEvents(accessToken, query) {
  try {
    const response = await axios.post(
      'https://api.meetup.com/gql',
      {
        query: `
        {
          searchEvents(query: "${query}", first: 10) {
            edges {
              node {
                id
                title
                description
                time
                group {
                  name
                  urlname
                }
                venue {
                  name
                  address {
                    city
                    country
                  }
                }
              }
            }
          }
        }`
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data.searchEvents.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching Meetup events:', error);
    return [];
  }
}
