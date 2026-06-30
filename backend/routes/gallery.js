const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   GET api/gallery
// @desc    Get all gallery photos (optional filters for category and gender)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, gender } = req.query;
    const query = {};
    if (category) query.category = category;
    if (gender) {
      // If gender is selected, return both gender-specific and general/both photos
      query.gender = { $in: [gender, 'both'] };
    }

    const photos = await Gallery.find(query).sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/gallery
// @desc    Upload new gallery image
// @access  Private (Admin Only)
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload an image file' });
    }

    const { caption, category, gender } = req.body;
    
    // Save relative image URL
    const imageUrl = `/uploads/${req.file.filename}`;

    const newPhoto = new Gallery({
      imageUrl,
      caption: caption || '',
      category: category || 'general',
      gender: gender || 'both'
    });

    const photo = await newPhoto.save();
    res.json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/gallery/:id
// @desc    Delete gallery photo and remove file from disk
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ msg: 'Photo not found' });
    }

    // Resolve absolute path to remove from disk
    const filename = photo.imageUrl.replace('/uploads/', '');
    const filePath = path.join(__dirname, '../uploads', filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting image file from disk:', err);
        // We still continue to delete from DB even if local file delete failed
      }
    });

    await photo.deleteOne();
    res.json({ msg: 'Photo deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
