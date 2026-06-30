const mongoose = require('mongoose');

const ReelSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  embedUrl: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'other'],
    default: 'instagram'
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'both'],
    default: 'both'
  }
}, { timestamps: true });

module.exports = mongoose.model('Reel', ReelSchema);
