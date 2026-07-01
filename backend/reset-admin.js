const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://new_look:Newlook@codingmood.9i1wuas.mongodb.net/new-look-salon?appName=CodingMood';

async function run() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    // Delete all users
    const deleteRes = await User.deleteMany({});
    console.log(`Cleared ${deleteRes.deletedCount} existing admin account(s).`);

    console.log('Success! The database has been reset. You can now visit your website, click "First-Time User? Setup Admin", and create a fresh admin account.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting database:', err);
    process.exit(1);
  }
}

run();
