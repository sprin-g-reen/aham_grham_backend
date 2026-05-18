import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully!');
    
    const admin = mongoose.connection.db.admin();
    const dbsInfo = await admin.listDatabases();
    
    console.log('\n📂 Databases found in your Atlas cluster:');
    for (const db of dbsInfo.databases) {
      console.log(`   - Name: ${db.name} (Size: ${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error listing databases:', err);
  }
}

run();
