// routes/feedback.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// POST route for processing feedback form submission
router.post('/', async (req, res) => {
  const { name, feedback, email, captcha } = req.body;
  
  // Find the feedback by email
  const feedbackEntry = await Feedback.findOne({ email });
  
  if (!feedbackEntry) {
    // Feedback not found, handle the error or return an appropriate response
    // Your code here...
  } else {
    // Verify the submitted CAPTCHA text
    const isCaptchaValid = feedbackEntry.verifyCaptcha(captcha);
    
    if (isCaptchaValid) {
      // CAPTCHA text matched, process the feedback form submission
      // Your code here...
    } else {
      // CAPTCHA text did not match, show an error or return an appropriate response
      // Your code here...
    }
  }
});

module.exports = router;
