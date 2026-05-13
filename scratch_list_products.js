import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const listProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const products = await mongoose.connection.db.collection('products').find({}).toArray();
        console.log('Available products:');
        products.forEach(p => console.log(`- ${p.name}`));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listProducts();
