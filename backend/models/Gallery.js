const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['hair', 'spa', 'makeup', 'experience', 'general'],
    default: 'general'
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'both'],
    default: 'both'
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
