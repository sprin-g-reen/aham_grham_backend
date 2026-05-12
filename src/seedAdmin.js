import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const email = 'admin123@gmail.com';
    const password = 'Admin@123';
    
    const adminExists = await Admin.findOne({ email });
    if (!adminExists) {
      await Admin.create({
        name: 'Admin',
        email,
        password,
      });
      console.log('✅ Default admin created');
    } else {
      console.log('ℹ️ Admin already exists');
    }
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
