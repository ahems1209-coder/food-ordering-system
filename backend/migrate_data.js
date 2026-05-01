import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Food from './models/Food.js';
import Config from './models/Config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const firstAdmin = await User.findOne({ isAdmin: true });
    if (!firstAdmin) {
      console.log("No admin found to assign dishes to.");
      process.exit();
    }

    // Assign foods with no owner
    const foodResult = await Food.updateMany(
      { owner: { $exists: false } }, 
      { $set: { owner: firstAdmin._id } }
    );
    console.log(`Updated ${foodResult.modifiedCount} foods with owner.`);

    // Assign configs with no owner
    const configResult = await Config.updateMany(
      { owner: { $exists: false } }, 
      { $set: { owner: firstAdmin._id } }
    );
    console.log(`Updated ${configResult.modifiedCount} configs with owner.`);

    process.exit();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData();
