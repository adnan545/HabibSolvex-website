const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // Set mongoose connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    console.log('🔌 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Using Database: ${conn.connection.name}`);
    console.log(`📊 Connection State: ${mongoose.connection.readyState}`);
    console.log('ℹ️  No default admin created. All users register as regular users.');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('💡 Make sure MongoDB is running and the connection string is correct.');
    console.log(`📝 Connection String: ${process.env.MONGODB_URI}`);
    process.exit(1);
  }
};

module.exports = connectDB;