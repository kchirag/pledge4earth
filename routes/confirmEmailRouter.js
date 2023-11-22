//routes/confirmEmailRouter
const router = require('express').Router();
const Leader = require('../models/Leader');
const UserView = require('../models/UserView');
const crypto = require('crypto');
const EditToken = require('./models/EditToken'); // Your model for storing tokens


const ConfirmEmail = require('../models/ConfirmEmail')

function generateEditPageToken(userId) {
    const token = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now

    // Store the token in the database with the user ID and expiry
    const editToken = new EditToken({
        userId,
        token,
        expiry
    });
    await editToken.save();

    return token;
}
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
      if (req.originalUrl.toLowerCase().includes('claimpage')) {
        const userId = /* get user ID */;
        const token = await generateEditPageToken(userId);
        const editUrl = `https://lead4earth.org/LeaderEdit/id/${userId}?token=${token}`;

        // Handle profile claim logic
        // You might want to send a token for profile editing or directly enable profile editing
        // e.g., sendProfileClaimToken(emailConfirmation.emailid);
      } else {
        leader.isEmailConfirmed = true;
        await leader.save()
      }
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