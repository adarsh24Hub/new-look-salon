const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');
const Service = require('../models/Service');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'new-look-salon-services',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

const DEFAULT_SERVICES = [
  { 
    name: 'Classic Haircut', 
    price: '₹60', 
    desc: 'Professional hair cutting tailored to your style preferences.',
    category: 'hair',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Haircut + Styling + Beard Combo', 
    price: '₹100', 
    desc: 'Full styling grooming package: haircut, blow-dry styling, and precise beard styling.',
    category: 'hair',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Hair Wash & Conditioner', 
    price: '₹100', 
    desc: 'Premium nourishing shampoo wash and deep conditioning.',
    category: 'hair',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Nourishing Hair Spa', 
    price: '₹500+', 
    desc: 'Moisturizes dry scalp, strengthens roots, repairs damage, and removes dandruff.',
    category: 'spa',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Nourishing Face Clean-Up', 
    price: '₹299+', 
    desc: 'Cleanses skin pores, removes impurities, and rejuvenates skin cells. O3+ option available.',
    category: 'facial',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Hydrating Face De-Tan', 
    price: '₹400+', 
    desc: 'Removes tan, brightens the face, and clears spots. Using Sara/O3+.',
    category: 'facial',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Premium Herbal/O3+ Facial', 
    price: '₹600+', 
    desc: 'Deluxe multi-step massage and mask for glowing skin, tailored to skin type.',
    category: 'facial',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Manicure + Pedicure Combo', 
    price: '₹250', 
    desc: 'Refreshing hand & feet soak, scrubbing, nail shaping, and relaxing massage.',
    category: 'spa',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Stress-Relief Head Massage', 
    price: '₹99 - ₹349', 
    desc: 'Soothing head massage using premium ayurvedic/almond oils to relieve tension.',
    category: 'spa',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Hair Colour (Global / Highlight)', 
    price: '₹150+', 
    desc: 'Premium ammonia-free coloring and creative style highlights.',
    category: 'hair',
    gender: 'men',
    imageUrl: 'https://images.unsplash.com/photo-1605497746444-ac9dbd324ce8?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Precision Ladies Hair Cut', 
    price: '₹199', 
    desc: 'Stylized haircuts like layer, bob, feather, etc. done by master stylists.',
    category: 'hair',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Ladies Split Ends Trim', 
    price: '₹149', 
    desc: 'Removes damaged split ends while retaining length.',
    category: 'hair',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Blowdry & Hair Setting', 
    price: '₹249', 
    desc: 'Professional dryer hair styling for parties and events.',
    category: 'hair',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Eyebrow Threading & Face Thread', 
    price: '₹30 - ₹150', 
    desc: 'Precise shaping of eyebrows, upper lips, chin, forehead, or full face threading.',
    category: 'waxing',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'O3+ Skin Whitening Facial', 
    price: '₹1899', 
    desc: 'Premium whitening facial treatment for brilliant glowing skin. Aroma & Lotus also available.',
    category: 'facial',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Normal Honey Wax (Full Body)', 
    price: '₹1999', 
    desc: 'Complete full body waxing using organic honey wax. Half hand/leg starts at ₹199.',
    category: 'waxing',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Rica Premium Wax (Full Body)', 
    price: '₹2999', 
    desc: 'Less painful, standard-setting Italian Rica wax. Gentle on sensitive skin. Half hand/leg ₹349.',
    category: 'waxing',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Chocolate Luxury Wax (Full Body)', 
    price: '₹2499', 
    desc: 'Nourishing chocolate wax for rich skin hydration and tan removal.',
    category: 'waxing',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Luxury Manicure / Pedicure', 
    price: '₹399 - ₹999', 
    desc: 'Deluxe bubble soak, cleaning, VLCC scrub, mask, and deep massage.',
    category: 'spa',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Smoothening & Rebonding Treatment', 
    price: '₹4499', 
    desc: 'Get perfectly straight, silky, frizz-free hair. Botox & Keratin starting at ₹2999.',
    category: 'hair',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Bridal Make-Up (HD & Airbrush)', 
    price: '₹10000 - ₹18000', 
    desc: 'Ultimate luxury bridal makeover, styling, hairstyling, and dress draping. Engagement options also available.',
    category: 'makeup',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Engagement & Party Makeover', 
    price: '₹2000 - ₹6500', 
    desc: 'Stunning reception, party, or side makeup, tailored to your outfit.',
    category: 'makeup',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop'
  },
  { 
    name: 'Pre-Bridal Luxury Package', 
    price: '₹5000 / ₹12000', 
    desc: 'Complete bridal pampering including Facials, Bleach & D-Tan, Spa, Polishing, and Waxing.',
    category: 'makeup',
    gender: 'women',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop'
  }
];

// @route   GET api/services
// @desc    Get all services (Seeds default list if empty)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let services = await Service.find().sort({ createdAt: -1 });
    
    // Auto-seed if database is empty
    if (services.length === 0) {
      console.log('Seeding default services list...');
      await Service.insertMany(DEFAULT_SERVICES);
      services = await Service.find().sort({ createdAt: -1 });
    }
    
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/services
// @desc    Create a new service
// @access  Private (Admin Only)
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const { name, price, desc, category, gender } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ msg: 'Please provide name, price, and category' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload an image for the service' });
    }

    const newService = new Service({
      name,
      price,
      desc,
      category,
      gender: gender || 'both',
      imageUrl: req.file.path // Cloudinary URL
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/services/:id
// @desc    Update a service details
// @access  Private (Admin Only)
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
  try {
    const { name, price, desc, category, gender } = req.body;
    
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    // Prepare update object
    const updateData = {
      name: name || service.name,
      price: price || service.price,
      desc: desc !== undefined ? desc : service.desc,
      category: category || service.category,
      gender: gender || service.gender
    };

    if (req.file) {
      updateData.imageUrl = req.file.path; // New Cloudinary URL
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    await service.deleteOne();
    res.json({ msg: 'Service deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
