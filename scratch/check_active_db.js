import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully!');
    console.log('📂 Active Database Name:', mongoose.connection.name);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📊 Collections and Document Counts:');
    
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`   - ${coll.name}: ${count} documents`);
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

run();
