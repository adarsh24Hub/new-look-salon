const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  discountCode: {
    type: String,
    trim: true
  },
  discountValue: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'both'],
    default: 'both'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
