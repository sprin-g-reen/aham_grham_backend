import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const deleteProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const result = await mongoose.connection.db.collection('products').deleteMany({
            name: { $regex: /sacred cork mat/i }
        });
        
        console.log(`Deleted ${result.deletedCount} products named "sacred cork mat"`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

deleteProduct();
