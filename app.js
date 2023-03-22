const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const leaderRoutes = require('./routes/leaderRoutes');
const userViewsRouter = require('./routes/userViews');
const viewsRouter = require('./routes/views');
const nearbyUsersRouter = require('./routes/nearbyUsers');

// Import your routes
// const yourRoutes = require('./routes/yourRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/leaders', leaderRoutes);
app.use('/api/userViews', userViewsRouter);
app.use('/api/views', viewsRouter);
app.use('/api/nearby-users', nearbyUsersRouter);


// Connect to MongoDB
//const uri = 'mongodb://localhost:27017/pledge4earth';
const uri = 'mongodb+srv://kchirag:Belapur-123@pledge4earth.8he3kvu.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Register your routes
// app.use('/api/your-endpoint', yourRoutes);

// Define the port your server will listen on
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

