const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose = require('mongoose');
const ConfirmEmail = require('../models/ConfirmEmail')
require('dotenv').config(); // Load environment variables from .env file

router.post('/', async (req, res) => {
  const { to, subject, text, emailType } = req.body;

  // // Set up your email account credentials for generic
  // const transporter = nodemailer.createTransport({
  //   host: 'mail.privateemail.com', // Replace with your email provider's SMTP server
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: 'lead@lead4earth.org', // Replace with your email address
  //     pass: 'Pledge4Earth', // Replace with your email password
  //   },
  // });
  // now switched to gmail
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'lead@lead4earth.org',
      clientId: process.env.GMAIL_ClientID,
      clientSecret: process.env.GMAIL_clientSecret,
      refreshToken: process.env.GMAIL_REFRESHTOKEN
    }
  });
  const mailOptions = {
    from: 'lead@lead4earth.org', // Replace with your email address
    to,
    subject,
    text: text,
  };

  try{
    if (emailType === 'confirmation') {
      // Generate a unique token for email confirmation
      const uniqueToken = crypto.randomBytes(32).toString('hex');
      const confirmLink = `https://lead4earth.org/confirm-email/${uniqueToken}`;
      mailOptions.text = text.replace('confirmplaceholder', confirmLink);

      // Save the confirmation email details
      const confirmEmail = new ConfirmEmail();
      confirmEmail.emailid = to;
      confirmEmail.token = uniqueToken;
      await confirmEmail.save();
    }
    else if (emailType === 'claimPage') {    
      const uniqueToken = crypto.randomBytes(32).toString('hex');
      const leader = await Leader.findOne({ email: emailConfirmation.emailid });
      if (leader){
        const claimLink = `https://lead4earth.org/LeaderEdit/id/${leader._id}?token=${uniqueToken}`;

        mailOptions.text = text.replace('confirmplaceholder', claimLink);
        leader.isClaimed = true;
        // Save the confirmation email details
        await leader.save();
      }
    }
    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Email sent successfully' });
  }catch (error) {
    //console.log(process.env.GMAIL_ClientID + ";" + process.env.GMAIL_clientSecret + ";" + process.env.GMAIL_REFRESHTOKEN);
    //console.log(mailOptions);
    console.error(error);
    res.status(500).send({ message: 'Failed to send email' });
  }
});

module.exports = router;
