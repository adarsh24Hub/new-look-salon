const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/new-look-salon';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully to:', MONGO_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/reels', require('./routes/reels'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/slides', require('./routes/slides'));

// Simple Base route for health checks
app.get('/', (req, res) => {
  res.send('New Look Unisex Salon API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    msg: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
