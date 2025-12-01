import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123456', 
    });

    console.log('Admin created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();