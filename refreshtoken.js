const axios = require('axios');
const qs = require('qs');
const path = require('path'); 
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

require('dotenv').config({ path: path.join(__dirname, '.env') });


const refreshToken = '1//06jeUr9weSxq8CgYIARAAGAYSNwF-L9IrTh-HCl9Rwiu9zlkvKuwpHAJ94yMKGIBVgfgGpEfoAtI9xwspCUyKXkv9i0LkX9cI6Tw';
const clientID = '484870617830-b9bvu4r0292j1s3n714b1018qnjflvs1.apps.googleusercontent.com';
const clientSecret = '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';
//const authcode = '4/0AfJohXlH0WrMPwPcsdqmNib5ai3DUA6tNBjjulABdegUchIGikM0nORtJl5w3nZroy-Xzw';
const authcode1 = '4/0AfJohXm85KdEOt3APaHmY6hW6sNNccsFEVJujjgiM74cSwpXIXCyZTYmjbF1gynpu1e6_A';
const token = "1//06jeUr9weSxq8CgYIARAAGAYSNwF-L9IrTh-HCl9Rwiu9zlkvKuwpHAJ94yMKGIBVgfgGpEfoAtI9xwspCUyKXkv9i0LkX9cI6Tw"
//const state = "geturl";
//const state = "gettoken";
//const state = "testmail";
const state = "refreshtoken";

if (state == "geturl"){
  function getAuthUrl() {
    const oauth2Client = new google.auth.OAuth2(
      clientID, // Your clientID
      clientSecret, // Your clientSecret
      "https://lead4earth.org" // Your redirectUri
    );

    const scopes = ['https://mail.google.com/'];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // 'offline' access type is required for refresh token
      scope: scopes,
    });

    return url;
  }

  // Then, direct the user to this URL
  console.log(getAuthUrl());
}
// need to add code to go to url and fetch the code.
if (state == "gettoken"){
  async function exchangeCodeForTokens(authorizationCode) {
    const params = new URLSearchParams();
    params.append('code', authorizationCode);
    params.append('client_id', clientID);
    params.append('client_secret', clientSecret);
    params.append('redirect_uri', 'https://lead4earth.org');
    params.append('grant_type', 'authorization_code');

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', params);
      console.log(response.data);
      return response.data; // This will contain your access and refresh tokens
    } catch (error) {
      console.error('Error exchanging authorization code for tokens:', error);
      throw error;
    }
  }
  exchangeCodeForTokens(decodeURIComponent(authcode1));
}
// // send email test


const mailOptions = {
    from: 'lead@lead4earth.org', // Replace with your email address
    to: 'kchirag@gmail.com',
    subject:'test',
    text: 'testing the mailer via gmail',
  };

if (state == "testmail"){
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'lead@lead4earth.org',
        clientId: clientID,
        clientSecret: clientSecret,
        refreshToken: refreshToken
      }
    });

   transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error occurred');
      console.log(error.message);
      return process.exit(1);
    }
    console.log('Message sent successfully!');
    console.log('Server responded with "%s"', info.response);
  });

  // let transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     type: 'OAuth2',
  //     user: 'lead@lead4earth.org',
  //     accessToken:token, // Your valid access token here
  //   },
  // });

  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log('Error occurred');
  //     console.log(error);
  //     console.log(error.message);
  //     return;
  //   }
  //   console.log('Message sent successfully!');
  //   console.log('Server responded with "%s"', info.response);
  // });
}

if (state == "refreshtoken"){
  const data = qs.stringify({
    'refresh_token': token,
    'client_id': clientID,
    'client_secret': clientSecret,
    'grant_type': 'refresh_token',
  });
  axios.post('https://oauth2.googleapis.com/token', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    console.log( response.data);

    console.log('Access Token:', response.data.access_token);
    // Use the new access token
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

