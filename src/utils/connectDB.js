import mongoose from 'mongoose';
import { MONGODB_URI, NODE_ENV } from '../config/config.js';

if (NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    setTimeout(() => {
      console.log('Trying to reconnect to MongoDB...');
      connectDB();
    }, 5000);
  }
};

export { connectDB };
