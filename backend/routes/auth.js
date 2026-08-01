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

// @route   GET api/auth/reset-admin-key-241997
// @desc    Utility route to reset admin credentials on live database
// @access  Public
router.get('/reset-admin-key-241997', async (req, res) => {
  try {
    const newUsername = req.query.username || 'NewLook';
    const newPassword = req.query.password || '241997';

    if (newPassword.length < 5) {
      return res.status(400).send('Error: Password must be at least 5 characters long.');
    }

    // Delete existing users
    const deleteRes = await User.deleteMany({});
    
    // Create new admin
    const admin = new User({
      username: newUsername,
      password: newPassword
    });
    
    await admin.save();
    res.send(`Success! Cleared ${deleteRes.deletedCount} old user(s). Admin credentials have been reset to: Username: ${newUsername}, Password: ${newPassword}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Reset failed: ' + err.message);
  }
});

module.exports = router;
