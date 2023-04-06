const mongoose = require('mongoose');
const UserView = require('../models/UserView'); // Update this path to match your project structure

const uri = process.env.MONGODB_URI;
// Connect to the database (replace the connection string if necessary)
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const reinsertDocuments = async () => {
  try {
    await UserView.deleteMany({}); // Delete all existing documents

    console.log('Documents re-inserted successfully');
  } catch (error) {
    console.error('Error re-inserting documents:', error);
  } finally {
    mongoose.connection.close();
  }
};

reinsertDocuments();
