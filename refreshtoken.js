const axios = require('axios');
const qs = require('qs');
const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });


const refreshToken = 'your-refresh-token';
const clientID = 'your-client-id';
const clientSecret = 'your-client-secret';

const data = qs.stringify({
  'refresh_token': process.env.GMAIL_REFRESHTOKEN,
  'client_id': process.env.GMAIL_ClientID,
  'client_secret': process.env.GMAIL_clientSecret,
  'grant_type': 'refresh_token',
});

axios.post('https://oauth2.googleapis.com/token', data, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
.then(response => {
  console.log('Access Token:', response.data.access_token);
  // Use the new access token
})
.catch(error => {
  console.error('Error:', error);
});