import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const clearOrders = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not found");
    await mongoose.connect(process.env.MONGO_URI);
    const result = await mongoose.connection.db.collection('orders').deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} orders.`);
    process.exit();
  } catch (error) {
    console.error('Failed to clear orders:', error);
    process.exit(1);
  }
};

clearOrders();
