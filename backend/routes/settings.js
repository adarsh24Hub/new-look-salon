const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');
const Setting = require('../models/Setting');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'new-look-salon-settings',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// @route   GET api/settings/:key
// @desc    Get setting by key
// @access  Public
router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ msg: 'Setting not found' });
    }
    res.json(setting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/settings/:key
// @desc    Create or update a setting (with optional image file upload)
// @access  Private (Admin Only)
router.post('/:key', [auth, upload.single('image')], async (req, res) => {
  try {
    const { key } = req.params;
    let value = req.body.value;

    if (req.file) {
      value = req.file.path; // Cloudinary URL
    }

    if (!value) {
      return res.status(400).json({ msg: 'Please provide a value or upload an image' });
    }

    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = new Setting({ key, value });
      await setting.save();
    }

    res.json(setting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
