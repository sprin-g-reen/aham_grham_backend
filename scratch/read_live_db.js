import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const customerSchema = new mongoose.Schema({}, { strict: false });
const Customer = mongoose.model('Customer', customerSchema, 'customers');

async function run() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully!');
    
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    console.log(`\n📊 Found ${customers.length} customer records in database:\n`);
    
    customers.forEach((c, idx) => {
      console.log(`[Order #${idx + 1}]`);
      console.log(`   Name:       ${c.get('name')}`);
      console.log(`   Email:      ${c.get('email')}`);
      console.log(`   Product:    ${c.get('productName')}`);
      console.log(`   Price:      ₹${c.get('price')}`);
      console.log(`   Status:     ${c.get('paymentStatus')}`);
      console.log(`   OrderID:    ${c.get('razorpayOrderId')}`);
      console.log(`   PaymentID:  ${c.get('razorpayPaymentId')}`);
      console.log(`   CreatedAt:  ${c.get('createdAt')}`);
      console.log('--------------------------------------------------');
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Database Connection Error:', err);
  }
}

run();
