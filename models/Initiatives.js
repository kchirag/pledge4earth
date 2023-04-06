// models/Initiatives.js
const mongoose = require('mongoose');

const InitiativesSchema = new mongoose.Schema({
  image: String,
  description: String,
  link : String,
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  }
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});

InitiativesSchema.index({ location: '2dsphere' });


const Initiatives = mongoose.model('Leader', InitiativesSchema);
module.exports = Initiatives;
