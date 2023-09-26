// models/Leader.js
const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  links:{
    linkedin:String,
    twitter: String,
    meta: String,
    web: String,
    threads: String,
    instagram: String,
    tiktok: String,
    youtube: String,
    blogURL: String,
    others:String
  }
  activeLink:String,
  image: String,
  images: [
    {
      type: String,
      validate: {
        // Simple URL validation
        validator: function(v) {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  ],
  statement: String,
  url_slug: String,
  isClaimed: { type: Boolean, default: false }

  aboutText: {
        type: String,
        default: 'Information about this leader is not available.'  // default about text
  },
  cityName:{
        type: String,
        default: '.'  // need to write nearby city name.
  },
  agendas: [String],
  
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
  created : { type : Date, default: Date.now },
});

LeaderSchema.index({ location: '2dsphere' });


const Leader = mongoose.model('Leader', LeaderSchema);
module.exports = Leader;
