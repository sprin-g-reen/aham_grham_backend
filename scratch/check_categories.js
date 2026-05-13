import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const eventSchema = mongoose.Schema({
  category: { type: String }
});

const Event = mongoose.model('Event', eventSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const categories = await Event.distinct('category');
    console.log('Current categories in DB:', categories);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

check();
