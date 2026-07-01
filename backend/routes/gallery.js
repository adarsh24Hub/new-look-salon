const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'new-look-salon-gallery',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
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
    
    // Save Cloudinary image URL
    const imageUrl = req.file.path;

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

// Helper to extract Cloudinary public ID from URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1) {
      // Check if next part is version (starts with 'v' and followed by numbers)
      const hasVersion = /^v\d+$/.test(parts[uploadIndex + 1]);
      const startIndex = uploadIndex + (hasVersion ? 2 : 1);
      let publicIdParts = parts.slice(startIndex);
      let publicIdWithExt = publicIdParts.join('/');
      const lastDotIndex = publicIdWithExt.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        return publicIdWithExt.substring(0, lastDotIndex);
      }
      return publicIdWithExt;
    }
    // Fallback
    const filename = parts.pop();
    return filename.split('.')[0];
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    return null;
  }
};

// @route   DELETE api/gallery/:id
// @desc    Delete gallery photo and remove file from disk/Cloudinary
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ msg: 'Photo not found' });
    }

    // Check if it's a local upload or Cloudinary upload
    if (photo.imageUrl.startsWith('/uploads/')) {
      // Resolve absolute path to remove from disk
      const filename = photo.imageUrl.replace('/uploads/', '');
      const filePath = path.join(__dirname, '../uploads', filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting image file from disk:', err);
        }
      });
    } else {
      // Delete from Cloudinary
      const publicId = getPublicIdFromUrl(photo.imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryErr) {
          console.error('Error deleting image from Cloudinary:', cloudinaryErr);
        }
      }
    }

    await photo.deleteOne();
    res.json({ msg: 'Photo deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
