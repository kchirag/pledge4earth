//InviteRouter.js

const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
// routes/sendemail.js
require('dotenv').config(); // Load environment variables from .env file

// ... other imports and code ...

//const appConstants = require('../app.js');


sgMail.setApiKey(process.env.SENDGRIDKEY);

router.get('/', async (req, res) => {
  try {
  	console.log("Sending invite")
	const msg = {
	  to: 'kchirag@gmail.com', // recipient's email address
	  email:'earth@lead4earth.org', 
	  name:'Lynda',
	  from:'earth@lead4earth.org',
	  templateId: 'd-05cae1428c5344bb8868df77614b284d', // template ID of your SendGrid template //d-05cae1428c5344bb8868df77614b284d
	  dynamic_template_data: { // dynamic data to replace in the template
	  	"ReceipentName": "Lynda",
	  	"Invitor": "Chris"
	  },
	};

	sgMail.send(msg)
	  .then(() => {
	    // email sent successfully
	    console.log("Invite Sent Successfully")
	  })
	  .catch((error) => {
	    // error occurred while sending email
	    console.error(error);
	    console.error(error.response.body);
	  });
  } catch (err) {
    res.status(500).json({ message: 'Error sending invite' });
  }
});


  module.exports = router;
