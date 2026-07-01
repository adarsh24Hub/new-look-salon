const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'new_look_secret_key_123',
      { expiresIn: '7d' }, // 7 days (prevents quick expiration)
      (err, token) => {
        if (err) throw err;
        res.json({ token, username: user.username });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/setup
// @desc    Self-bootstrap initial admin if no users exist
// @access  Public
router.post('/setup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if any user exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({ msg: 'Admin account already exists. Setup disabled.' });
    }

    if (!username || !password || password.length < 5) {
      return res.status(400).json({ msg: 'Username and password (min 5 chars) required' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ msg: 'Admin account created successfully. Please login now.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user details
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
