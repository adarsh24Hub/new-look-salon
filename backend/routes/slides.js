const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Slide = require('../models/Slide');
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage Configuration for Slides
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'new-look-salon-slides',
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

// @route   GET api/slides
// @desc    Get all active slides (Seeds default ones if empty)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const query = {};

    // Public view only gets active slides
    if (all !== 'true') {
      query.isActive = true;
    }

    let slides = await Slide.find(query).sort({ order: 1, createdAt: -1 });

    // Auto-seed if database is empty (only when requesting for homepage/public view, or admin has empty screen)
    if (slides.length === 0 && all !== 'true') {
      console.log('Seeding default slides...');
      const defaultSlides = [
        {
          title: "Meet Our Founder - Saddam Hussain",
          description: "With over 10 years of professional expertise, Saddam Hussain has been crafting premium styles and luxury makeovers. Known for precise haircuts, advanced treatments, and unmatched customer care, he leads our elite team.",
          imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop",
          category: "owner",
          isActive: true,
          order: 0
        },
        {
          title: "Certified Luxury & Aesthetics",
          description: "Recognized as Naini's premium unisex salon. We hold official certifications from L'Oréal Professionnel and international styling academies, guaranteeing top-notch beauty and grooming standards.",
          imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
          category: "certificate",
          isActive: true,
          order: 1
        },
        {
          title: "Exclusive Seasonal Offers",
          description: "Unlock up to 25% discount on combo services and wedding makeovers. Explore active deals or consult with our experts for custom styling packages designed for your special day.",
          imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
          category: "offer",
          isActive: true,
          order: 2
        }
      ];

      slides = await Slide.insertMany(defaultSlides);
    }

    res.json(slides);
  } catch (err) {
    console.error('Error getting slides:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/slides
// @desc    Create a new slide (Admin only)
// @access  Private
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const { title, description, category, isActive, order } = req.body;

    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload an image file' });
    }

    const imageUrl = req.file.path;

    const newSlide = new Slide({
      title,
      description: description || '',
      imageUrl,
      category: category || 'owner',
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
      order: order ? parseInt(order) : 0
    });

    const slide = await newSlide.save();
    res.json(slide);
  } catch (err) {
    console.error('Error creating slide:', err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/slides/:id
// @desc    Update an existing slide (Admin only)
// @access  Private
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
  try {
    const { title, description, category, isActive, order } = req.body;

    let slide = await Slide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ msg: 'Slide not found' });
    }

    // Update text fields
    if (title) slide.title = title;
    if (description !== undefined) slide.description = description;
    if (category) slide.category = category;
    if (isActive !== undefined) {
      slide.isActive = (isActive === 'true' || isActive === true);
    }
    if (order !== undefined) slide.order = parseInt(order);

    // If new image file is uploaded, update image
    if (req.file) {
      // Delete old image from Cloudinary if it is a Cloudinary url
      if (slide.imageUrl && !slide.imageUrl.startsWith('https://images.unsplash.com')) {
        const publicId = getPublicIdFromUrl(slide.imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryErr) {
            console.error('Error deleting old slide image from Cloudinary:', cloudinaryErr);
          }
        }
      }
      slide.imageUrl = req.file.path;
    }

    const updatedSlide = await slide.save();
    res.json(updatedSlide);
  } catch (err) {
    console.error('Error updating slide:', err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/slides/:id
// @desc    Delete a slide (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ msg: 'Slide not found' });
    }

    // Delete image from Cloudinary if it is a Cloudinary url
    if (slide.imageUrl && !slide.imageUrl.startsWith('https://images.unsplash.com')) {
      const publicId = getPublicIdFromUrl(slide.imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryErr) {
          console.error('Error deleting slide image on deletion:', cloudinaryErr);
        }
      }
    }

    await slide.deleteOne();
    res.json({ msg: 'Slide deleted successfully' });
  } catch (err) {
    console.error('Error deleting slide:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
