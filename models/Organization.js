// models/Organizations.js
const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
  description: String,
  website : String,
  email : String,
  socialhandle: String,
  contactNumber: String,
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});

OrganizationSchema.index({ location: '2dsphere' });


const Organization = mongoose.model('Organization', OrganizationSchema);
module.exports = Organization;
