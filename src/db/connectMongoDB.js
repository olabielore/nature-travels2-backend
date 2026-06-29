import mongoose from 'mongoose';
import { Story } from '../models/story.js';
import { User } from '../models/user.js';
import { Category } from '../models/category.js';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
    await Promise.all([
      Story.syncIndexes(),
      User.syncIndexes(),
      Category.syncIndexes(),
    ]);
    console.log('Indexes synced successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
