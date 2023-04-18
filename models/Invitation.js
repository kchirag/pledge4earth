//invitation.js
// models/User.js
const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  sender: { type: String, required: true},
  recepient: { type: String, required: true},
  token:{type: String},
  created : { type : Date, default: Date.now },
  accepted : { type : Date, default: Date.now },
});

const Invitation = mongoose.model('Invitation', InvitationSchema);
module.exports = Invitation;
