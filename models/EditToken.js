// models/EditToken
const mongoose = require('mongoose');

const EditTokenSchema = new mongoose.Schema({
  userid: String,
  token: String,
  created : { type : Date, default: Date.now },
  Confirmed : { type : Date },
});


const EditToken = mongoose.model('EditToken', EditTokenSchema);

module.exports = EditToken;