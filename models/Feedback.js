//models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  feedback: String,
  email : String,
  captcha: String, // Add a field to store the submitted CAPTCHA text

});

FeedbackSchema.methods.verifyCaptcha = function(submittedCaptcha) {
  // Compare the submitted CAPTCHA text with the stored CAPTCHA text
  return this.captcha === submittedCaptcha;
};


const Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = Leader;
