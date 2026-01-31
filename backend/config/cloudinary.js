// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Verify required environment variables
const requiredEnvVars = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

console.log('🔍 Checking Cloudinary configuration...');

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing Cloudinary environment variables:', missingVars.join(', '));
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

console.log('✅ Cloudinary configuration loaded');
console.log('📦 Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('🔑 API Key:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test connection
cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary connection successful'))
  .catch((error) => console.error('❌ Cloudinary connection failed:', error.message));

export default cloudinary;