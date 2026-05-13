import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const eventSchema = mongoose.Schema({
  category: { type: String }
});

const Event = mongoose.model('Event', eventSchema);

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Update 'Main Event' -> 'Regularly Happening'
    const res1 = await Event.updateMany(
      { category: 'Main Event' },
      { category: 'Regularly Happening' }
    );
    console.log(`Updated ${res1.modifiedCount} 'Main Event' items to 'Regularly Happening'`);

    // 2. Update 'Workshop' -> 'Regular events'
    const res2 = await Event.updateMany(
      { category: 'Workshop' },
      { category: 'Regular events' }
    );
    console.log(`Updated ${res2.modifiedCount} 'Workshop' items to 'Regular events'`);

    console.log('✅ Migration complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
