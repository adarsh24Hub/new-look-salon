const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['hair', 'waxing', 'facial', 'spa', 'makeup'],
    required: true
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'both'],
    default: 'both'
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
