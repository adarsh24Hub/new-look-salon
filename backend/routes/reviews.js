const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// @route   GET api/reviews
// @desc    Get all user reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/reviews
// @desc    Submit new user review
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, details, text, rating } = req.body;

    if (!name || !text || !rating) {
      return res.status(400).json({ msg: 'Please enter name, rating, and review text' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    const newReview = new Review({
      name,
      details: details || 'Client Review',
      text,
      rating
    });

    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/reviews/:id
// @desc    Delete a review
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    await review.deleteOne();
    res.json({ msg: 'Review deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
