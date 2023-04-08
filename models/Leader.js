// models/Leader.js
const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
  statement: String,
  upvotes: {
    type: Number,
    default: 0,
  },
  website : String,
  email : String,
  socialhandle: String,
  selectedView: String,
  isValidated: {type:Boolean, default:false},
  isEmailConfirmed: {type:Boolean, default:false},
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});

LeaderSchema.index({ location: '2dsphere' });


const Leader = mongoose.model('Leader', LeaderSchema);
module.exports = Leader;
