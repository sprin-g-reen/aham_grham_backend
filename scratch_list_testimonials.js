import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Testimonial from './src/models/Testimonial.js';

dotenv.config();

const listTestimonials = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aham-grham');
    console.log('Connected to DB');
    
    const testimonials = await Testimonial.find({});
    console.log('Testimonials:', JSON.stringify(testimonials, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listTestimonials();
