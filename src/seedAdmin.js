import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const forceUpdateAdmin = async () => {
  try {
    const email = 'admin123@gmail.com';
    const password = 'Admin@123';
    
    let admin = await Admin.findOne({ email });
    
    if (!admin) {
      admin = await Admin.create({
        name: 'Admin',
        email,
        password,
      });
      console.log('✅ Default admin created');
    } else {
      admin.password = password;
      await admin.save();
      console.log('✅ Admin password force-updated to Admin@123');
    }
    process.exit();
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    process.exit(1);
  }
};

forceUpdateAdmin();
