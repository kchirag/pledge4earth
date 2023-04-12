//routes/confirmEmailRouter
const router = require('express').Router();
const Leader = require('../models/Leader');
const UserView = require('../models/UserView');

const ConfirmEmail = require('../models/ConfirmEmail')

const confirmEmailRouter = async (req, res) => {
  // Extract the email confirmation token from the URL
  const { token } = req.params;
   try {
    // Find the email confirmation record in the database
    const emailConfirmation = await ConfirmEmail.findOne({ token:token });
    console.log(emailConfirmation);
    if (!emailConfirmation) {
      return res.status(404).send("Email confirmation not found");
    }

    // Check if the email is already confirmed
    if (emailConfirmation.Confirmed) {
      return res.status(400).send("Email is already confirmed");
    }

    // Update the email confirmation record
    emailConfirmation.Confirmed = new Date();
    await emailConfirmation.save();

    // Update the user's record in the database
    // Replace `User` with your own database model or function
    const leader = await Leader.findOne({ email: emailConfirmation.emailid });
    if (leader){
      leader.isEmailConfirmed = true;
      await leader.save()
    }
    else{
      const user = await UserView.findOne({ emailid: emailConfirmation.emailid });
      if (user){
        user.isEmailConfirmed = true;
        await user.save();
       }
	   }
    // Send a response to the user
    res.send("Email confirmed successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

module.exports = confirmEmailRouter;