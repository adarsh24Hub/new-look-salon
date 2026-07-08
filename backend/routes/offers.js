const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Offer = require('../models/Offer');
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage Configuration for Offers
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'new-look-salon-offers',
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

// Helper to extract Cloudinary public ID from URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1) {
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
    const filename = parts.pop();
    return filename.split('.')[0];
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    return null;
  }
};

// @route   GET api/offers
// @desc    Get offers (public gets active ones, filtered by gender; admin can get all)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { gender, all } = req.query;
    const query = {};

    // If not requesting all (public mode), only return active offers
    if (all !== 'true') {
      query.isActive = true;
    }

    // Filter by gender if specified
    if (gender) {
      query.gender = { $in: [gender, 'both'] };
    }

    const offers = await Offer.find(query).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error('Error getting offers:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/offers
// @desc    Create a new offer
// @access  Private (Admin Only)
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const { title, description, discountCode, discountValue, gender, isActive, expiryDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: 'Title and description are required' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path;
    }

    const newOffer = new Offer({
      title,
      description,
      discountCode: discountCode || '',
      discountValue: discountValue || '',
      imageUrl,
      gender: gender || 'both',
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    const offer = await newOffer.save();
    res.json(offer);
  } catch (err) {
    console.error('Error creating offer:', err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/offers/:id
// @desc    Update an existing offer (supports updating fields and replacing image)
// @access  Private (Admin Only)
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
  try {
    const { title, description, discountCode, discountValue, gender, isActive, expiryDate, removeImage } = req.body;

    let offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ msg: 'Offer not found' });
    }

    // Fields to update
    if (title) offer.title = title;
    if (description) offer.description = description;
    if (discountCode !== undefined) offer.discountCode = discountCode;
    if (discountValue !== undefined) offer.discountValue = discountValue;
    if (gender) offer.gender = gender;
    if (isActive !== undefined) {
      offer.isActive = (isActive === 'true' || isActive === true);
    }
    if (expiryDate !== undefined) {
      offer.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }

    // Image file update logic
    if (req.file) {
      // Delete old image if it exists
      if (offer.imageUrl) {
        const publicId = getPublicIdFromUrl(offer.imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryErr) {
            console.error('Error deleting old image from Cloudinary:', cloudinaryErr);
          }
        }
      }
      offer.imageUrl = req.file.path;
    } else if (removeImage === 'true' || removeImage === true) {
      // If client requests to remove the flyer image
      if (offer.imageUrl) {
        const publicId = getPublicIdFromUrl(offer.imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryErr) {
            console.error('Error deleting image from Cloudinary:', cloudinaryErr);
          }
        }
      }
      offer.imageUrl = '';
    }

    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } catch (err) {
    console.error('Error updating offer:', err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/offers/:id
// @desc    Delete an offer
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ msg: 'Offer not found' });
    }

    // Delete image from Cloudinary if it exists
    if (offer.imageUrl) {
      const publicId = getPublicIdFromUrl(offer.imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryErr) {
          console.error('Error deleting image from Cloudinary on deletion:', cloudinaryErr);
        }
      }
    }

    await offer.deleteOne();
    res.json({ msg: 'Offer deleted successfully' });
  } catch (err) {
    console.error('Error deleting offer:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
