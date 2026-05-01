import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const promoteAll = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not found in .env");
    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.updateMany({}, { $set: { isAdmin: true } });
    console.log(`Successfully promoted ${result.modifiedCount} users to Admin.`);
    process.exit();
  } catch (error) {
    console.error('Promotion failed:', error);
    process.exit(1);
  }
};

promoteAll();
