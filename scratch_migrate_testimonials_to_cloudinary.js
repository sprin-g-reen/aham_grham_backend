import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), '.env') });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const testimonialSchema = new mongoose.Schema({
  name: String,
  testimonialId: String,
  role: String,
  content: String,
  rating: Number,
  image: String
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

async function migrateTestimonials() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const testimonials = await Testimonial.find({
      image: { $regex: /^\/uploads\// }
    });

    console.log(`🔍 Found ${testimonials.length} testimonials with local images to migrate.`);

    for (const t of testimonials) {
      // t.image is like '/uploads/image-123.jpg'
      const localPath = path.join(process.cwd(), t.image.startsWith('/') ? t.image.substring(1) : t.image);
      
      if (fs.existsSync(localPath)) {
        console.log(`⬆️ Uploading ${t.image} for ${t.name}...`);
        
        try {
          const result = await cloudinary.uploader.upload(localPath);
          console.log(`✅ Uploaded: ${result.secure_url}`);
          
          t.image = result.secure_url;
          await t.save();
          console.log(`💾 Updated DB entry for ${t.name}`);
        } catch (uploadError) {
          console.error(`❌ Failed to upload ${t.image}:`, uploadError.message);
        }
      } else {
        console.warn(`⚠️ File not found: ${localPath}`);
      }
    }

    console.log('🏁 Migration complete.');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateTestimonials();
