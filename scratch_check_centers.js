import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Center from './src/models/Center.js';

dotenv.config();

async function checkCenters() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const centers = await Center.find();
    console.log(`Found ${centers.length} centers:`);
    centers.forEach(c => {
      console.log(`- ${c.name}: mapIframe length = ${c.mapIframe ? c.mapIframe.length : 0}`);
      if (c.mapIframe) {
        console.log(`  mapIframe content: ${c.mapIframe.substring(0, 50)}...`);
      }
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkCenters();
