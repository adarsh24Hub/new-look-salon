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
    // See if user exists (case-insensitive and trimmed)
    let user = await User.findOne({ 
      username: new RegExp('^' + username.trim() + '$', 'i') 
    });
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
      { expiresIn: '3650d' }, // 10 years (prevents token expiration issues)
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

const mongoose = require('mongoose');

// @route   GET api/auth/db-info
// @desc    Get connected database details (diagnostics)
// @access  Public
router.get('/db-info', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    res.json({
      status: states[dbState] || 'Unknown',
      database: dbName,
      host: dbHost
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
