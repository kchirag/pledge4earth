
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const ensureAuthenticated = require('./middleware/auth');
const leaderRoutes = require('./routes/leaderRoutes');
const userViewsRouter = require('./routes/userViews');
const viewsRouter = require('./routes/views');
const nearbyUsersRouter = require('./routes/nearbyUsers');
const nearbyLeadersRouter = require('./routes/nearbyLeaders')
const emailRouter = require('./routes/emailRouter');
const nearbyOrganizationRouter = require('./routes/nearbyOrganizations');
const confirmEmailRouter = require('./routes/confirmEmailRouter')
const uploadRoute = require('./routes/upload');
const inviteRouter = require('./routes/InviteRouter')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const FacebookStrategy = require('passport-facebook').Strategy;
//const TwitterStrategy = require('passport-twitter').Strategy;
//const fetchMeetupEvents = require('./functions/fetchMeetupEvents');
//const fetchTicketmasterEvents = require('./functions/fetchTicketmasterEvents');
//const fetchFacebookEvents = require('./functions/fetchFacebookEvents');
//const apiRoutes = require('./routes/eventsRoutes');
const eventsRoutes = require('./routes/newEventsRoute');

// Import your routes
// const yourRoutes = require('./routes/yourRoutes');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Initialize Express app
const app = express();
const httpApp = express();
const redirectHttps = (req, res) => {
  res.redirect(301, `https://lead4earth.org${req.url}`);
};
//const redirectHttps = (req, res) => {
//  res.redirect(301, `https://lead4earth.org${req.url}`);
//};

// Use the middleware function for the HTTP server

httpApp.use(redirectHttps);


const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });


async function fetchAllEvents(location, keywords) {
  const accessToken = 'YOUR_MEETUP_ACCESS_TOKEN'; // Replace with your access token
  const query = 'environment';

  const meetupEvents = await fetchMeetupEvents(accessToken, query);
  //const eventbriteEvents = await fetchEventbriteEvents(location, keywords);
  //const meetupEvents = await fetchMeetupEvents(location, keywords);
  //const ticketmasterEvents = await fetchTicketmasterEvents(location, keywords);
  //const facebookEvents = await fetchFacebookEvents(location, keywords);

  const allEvents = [
    //...eventbriteEvents,
    ...meetupEvents,
    //...ticketmasterEvents,
    //...facebookEvents,
  ];

  // Cache the combined events in your database
  await cacheEventsInDatabase(allEvents);

  return allEvents;
}

// Read the certificate files
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8');
const certificate = fs.readFileSync(process.env.CERTIFICATE, 'utf8');
const ca = fs.readFileSync(process.env.CERTIFICATECA, 'utf8');
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/leaders', leaderRoutes);
app.use('/api/userViews', userViewsRouter);
app.use('/api/views', viewsRouter);
app.use('/api/nearby-users', nearbyUsersRouter);
app.use('/api/nearby-leaders', nearbyLeadersRouter);
app.use('/api/sendEmail', emailRouter);
app.use('/api/nearby-organizations', nearbyOrganizationRouter);
app.get("/confirm-email/:token", confirmEmailRouter);
app.use('/upload', uploadRoute);
app.use('/sendInvite', inviteRouter);
//app.use('/api/events', apiRoutes);
app.use('/api/events', eventsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.use(ensureAuthenticated);

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

//const storagekeyPath=process.env.STORAGEKEY;

// Define the port your server will listen on
const port = process.env.PORT || 5000;

if (process.env.SSLENABLED = 'true'){
// Setup the HTTPS credentials
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, () => {
    console.log(`HTTPS server running on port ${port}`);
  });
}
else{

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}
// Register your routes
// app.use('/api/your-endpoint', yourRoutes);

const httpServer = http.createServer(httpApp);

httpServer.listen(80, () => {
  console.log('HTTP server running on port 80, redirecting to HTTPS');
});



// ...

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Add this catch-all route to serve index.html for any request that doesn't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

