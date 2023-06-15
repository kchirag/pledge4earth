const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  url: String,
  startTime: Date,
  endTime: Date,
  venue: String,
  description:String,
  category:String,
  source: String,
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

eventSchema.index({ location: '2dsphere' }); // This is the important part

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
