// backend/utils/cloudinaryUpload.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (filePath, folder = 'portfolio') => {
  try {
    console.log('⬆️ Starting Cloudinary upload...');
    console.log('📁 File path:', filePath);
    console.log('📂 Target folder:', folder);
    
    // Check if file exists before uploading
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileStats = fs.statSync(filePath);
    console.log('📊 File size:', fileStats.size, 'bytes');

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      use_filename: false, // Don't use original filename
      unique_filename: true,
      overwrite: false, // Don't overwrite existing files
    });

    console.log('✅ Cloudinary upload successful');
    console.log('🔗 Secure URL:', result.secure_url);
    console.log('🆔 Public ID:', result.public_id);

    // Delete local file after successful upload
    try {
      fs.unlinkSync(filePath);
      console.log('🗑️ Temp file deleted:', filePath);
    } catch (unlinkError) {
      console.error('⚠️ Could not delete temp file:', unlinkError.message);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error.message);
    console.error('Error details:', error);
    
    // Try to delete local file even if upload fails
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('🗑️ Temp file deleted after error');
      } catch (unlinkError) {
        console.error('⚠️ Failed to delete temp file:', unlinkError.message);
      }
    }
    
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.log('⚠️ No publicId provided for deletion');
      return;
    }

    console.log('🗑️ Deleting from Cloudinary:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('✅ Cloudinary delete result:', result);
    
    if (result.result !== 'ok' && result.result !== 'not found') {
      console.warn('⚠️ Unexpected delete result:', result);
    }
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error.message);
    // Don't throw error for deletion failures
  }
};