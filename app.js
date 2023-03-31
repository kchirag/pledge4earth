
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const leaderRoutes = require('./routes/leaderRoutes');
const userViewsRouter = require('./routes/userViews');
const viewsRouter = require('./routes/views');
const nearbyUsersRouter = require('./routes/nearbyUsers');
const nearbyLeadersRouter = require('./routes/nearbyLeaders')

// Import your routes
// const yourRoutes = require('./routes/yourRoutes');
const fs = require('fs');
const https = require('https');
// Initialize Express app
const app = express();
const httpApp = express();
const redirectHttps = (req, res) => {
  res.redirect(301, `https://${req.headers.host}${req.url}`);
};

// Use the middleware function for the HTTP server

httpApp.use(redirectHttps);


const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Read the certificate files
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8');
const certificate = fs.readFileSync(process.env.CERTIFICATE, 'utf8');
const ca = fs.readFileSync(process.env.CERTIFICATECA, 'utf8');
// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/leaders', leaderRoutes);
app.use('/api/userViews', userViewsRouter);
app.use('/api/views', viewsRouter);
app.use('/api/nearby-users', nearbyUsersRouter);
app.use('/api/nearby-leaders', nearbyLeadersRouter);

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

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