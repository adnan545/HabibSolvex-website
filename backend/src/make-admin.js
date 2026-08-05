const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`✅ User "${email}" is now an ADMIN!`);
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Usage: node src/make-admin.js email@example.com');
  process.exit(1);
}

makeAdmin(email);