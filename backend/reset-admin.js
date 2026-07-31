const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://NewLook:241997@cluster0.zqwjgws.mongodb.net/new-look-salon?appName=Cluster0';

async function run() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    // Delete all users
    const deleteRes = await User.deleteMany({});
    console.log(`Cleared ${deleteRes.deletedCount} existing admin account(s).`);

    // Pre-create the default admin user requested by client
    const seedAdmin = new User({
      username: 'NewLook',
      password: '241997'
    });
    await seedAdmin.save();
    console.log('Successfully seeded production admin user - Username: NewLook, Password: 241997');

    console.log('Success! The database has been reset and default admin credentials have been seeded.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting database:', err);
    process.exit(1);
  }
}

run();
