const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { to, subject, text } = req.body;

  // Set up your email account credentials
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com', // Replace with your email provider's SMTP server
    port: 465,
    secure: true,
    auth: {
      user: 'lead@lead4earth.org', // Replace with your email address
      pass: 'Pledge4Earth', // Replace with your email password
    },
  });

  const mailOptions = {
    from: 'lead@lead4earth.org', // Replace with your email address
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to send email' });
  }
});

module.exports = router;
