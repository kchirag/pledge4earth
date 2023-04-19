//InviteRouter.js

const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
// routes/sendemail.js
require('dotenv').config(); // Load environment variables from .env file
const Invitation = require('../models/Invitation')

const crypto = require('crypto');

sgMail.setApiKey(process.env.SENDGRIDKEY);

router.get('/', async (req, res) => {
//	console.log(req);
  const uniqueToken = crypto.randomBytes(32).toString('hex');

  try {
  	console.log("Sending invite")
	//validations
  	if (req.query.recepientEmail === '' || req.query.recepientName === '')
  		return res.status(400).json({ error: 'Bad Request.' });
  	const sender = req.query.senderName === ''? "Person":req.query.senderName; 
	//end validation
	console.log(req.query.isLeaderOrgoAll);
	const isLeaderOrgoAll = req.query.isLeaderOrgoAll;
	var templateId = process.env.EMAIL_GENERAL_TEMPLATE_ID;
	switch(isLeaderOrgoAll) {
	  case '0':
	 	templateId = process.env.EMAIL_LEADER_TEMPLATE_ID;
	    // code block
	    break;
	  case '1':
	    templateId = process.env.EMAIL_ORG_TEMPLATE_ID;
	    // code block
	    break;
	}
	//templateId = isLeaderOrgoAll ? process.env.EMAIL_LEADER_TEMPLATE_ID : process.env.EMAIL_GENERAL_TEMPLATE_ID; 
	const msg = {
	  to: req.query.recepientEmail, // recipient's email address
	  from:{
	  	email:'earth@lead4earth.org',
	  	name: sender,
	  }, 
	  name:req.query.recepientName,
	  email: sender + '<earth@lead4earth.org>',
	  templateId: templateId, // template ID of your SendGrid template //d-05cae1428c5344bb8868df77614b284d
	  dynamic_template_data: { // dynamic data to replace in the template
	  	"ReceipentName": req.query.recepientName,
	  	"Invitor": sender,
	  	"Token": uniqueToken,
	  	"Message": req.query.message,
	  },
	};
	console.log(msg);
    const invitation = new Invitation();
    invitation.sender = req.query.senderEmail;
    invitation.recepient = req.query.recepientEmail;
    invitation.token = uniqueToken;
    //confirmEmail.token = uniqueToken;
    await invitation.save();
	console.log("After writing invitation");
	if(process.env.NOEMAIL === 'true') return res.status(400).json({ error: 'emails are disabled.' });
	sgMail.send(msg)
	  .then(() => {
	    // email sent successfully
	    console.log("Invite Sent Successfully");
	    return res.status(200).json({ message: 'Invite sent successfully.' });
	  })
	  .catch((error) => {
	    // error occurred while sending email
	    console.error(error);
	    console.error(error.response.body);
        return res.status(500).json({ message: 'Sendgrid Error sending invite.' });

	  });
  } catch (err) {
  	console.error(err);
	console.error(err.response.body);
    res.status(500).json({ message: 'Generic Error sending invite' });
  }

});


  module.exports = router;
