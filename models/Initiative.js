// models/Initiative.js
const mongoose = require('mongoose');

const InitiativeSchema = new mongoose.Schema({
  image: String,
  description: String,
  link : String,
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});

InitiativeSchema.index({ location: '2dsphere' });


const Initiative = mongoose.model('Initiative', InitiativesSchema);
module.exports = Initiative;
