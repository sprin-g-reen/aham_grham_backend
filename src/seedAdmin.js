import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const checkAndFixAdmins = async () => {
  try {
    const password = 'Admin@123';
    
    const emailsToSync = [
      'admin123@gmail.com',
      'admin@123gmail.com',
      'admin@ahamgrham.com'
    ];

    for (const email of emailsToSync) {
      let admin = await Admin.findOne({ email });
      if (!admin) {
        await Admin.create({
          name: 'Admin',
          email,
          password,
        });
        console.log(`✅ Created ${email}`);
      } else {
        admin.password = password;
        await admin.save();
        console.log(`✅ Updated ${email} password to Admin@123`);
      }
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkAndFixAdmins();
