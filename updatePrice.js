import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const updateProductPrice = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI is missing in .env');
      process.exit(1);
    }

    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully!');

    const productName = 'natural shampoo powder';
    console.log(`🔍 Searching for product: "${productName}"...`);
    
    // Search case-insensitively
    const product = await Product.findOne({ name: { $regex: new RegExp(`^${productName}$`, 'i') } });
    
    if (!product) {
      console.warn(`⚠️ Product "${productName}" not found. Listing all products in DB to locate:`);
      const allProducts = await Product.find({}, 'name price');
      allProducts.forEach(p => console.log(`- "${p.name}": ₹${p.price}`));
      mongoose.connection.close();
      process.exit(0);
    }

    console.log(`📦 Found: ${product.name} (Current Price: ₹${product.price})`);
    
    // Change price to 150
    product.price = 150;
    await product.save();
    
    console.log(`🎉 Success! Updated price of "${product.name}" to: ₹${product.price}`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database update error:', error);
    process.exit(1);
  }
};

updateProductPrice();
