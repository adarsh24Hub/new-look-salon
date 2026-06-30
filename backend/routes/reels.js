const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');
const auth = require('../middleware/auth');

// Helper to convert regular Insta/FB links to Embed URLs
function getEmbedUrl(url) {
  let embedUrl = url;
  let platform = 'other';

  // Instagram
  if (url.includes('instagram.com')) {
    platform = 'instagram';
    // Match /reel/CODE or /p/CODE
    const match = url.match(/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const code = match[1];
      embedUrl = `https://www.instagram.com/reel/${code}/embed/captioned/`;
    } else {
      // Fallback
      embedUrl = url.endsWith('/') ? `${url}embed/` : `${url}/embed/`;
    }
  } 
  // Facebook
  else if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com')) {
    platform = 'facebook';
    // FB uses the video plugin player. We URL-encode the source URL
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=380&t=0`;
  }

  return { embedUrl, platform };
}

// @route   GET api/reels
// @desc    Get all reels (optional gender filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { gender } = req.query;
    const query = {};
    if (gender) {
      query.gender = { $in: [gender, 'both'] };
    }
    const reels = await Reel.find(query).sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/reels
// @desc    Add a new reel URL
// @access  Private (Admin Only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, url, gender } = req.body;
    if (!url) {
      return res.status(400).json({ msg: 'Please provide a video/reel URL' });
    }

    const { embedUrl, platform } = getEmbedUrl(url);

    const newReel = new Reel({
      title: title || 'Salon Reel',
      url,
      embedUrl,
      platform,
      gender: gender || 'both'
    });

    const reel = await newReel.save();
    res.json(reel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/reels/:id
// @desc    Delete a reel
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ msg: 'Reel not found' });
    }

    await reel.deleteOne();
    res.json({ msg: 'Reel deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
