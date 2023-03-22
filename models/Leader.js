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
});

const Leader = mongoose.model('Leader', LeaderSchema);
module.exports = Leader;
