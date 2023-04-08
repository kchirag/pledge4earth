// models/ConfirmEmail
const mongoose = require('mongoose');

const confirmEmailSchema = new mongoose.Schema({
  emailid: String,
  token: String,
  created : { type : Date, default: Date.now },
  Confirmed : { type : Date },
});


const ConfirmEmail = mongoose.model('ConfirmEmail', confirmEmailSchema);

module.exports = ConfirmEmail;