// backend/utils/cloudinaryUpload.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (filePath, folder = 'portfolio') => {
  try {
    console.log('⬆️ Uploading to Cloudinary...');
    console.log('📁 File path:', filePath);
    console.log('📂 Folder:', folder);

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true, // IMPORTANT: This ensures unique filenames
    });

    console.log('✅ Cloudinary upload successful');
    console.log('🔗 URL:', result.secure_url);
    console.log('🆔 Public ID:', result.public_id);

    // Delete local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Temp file deleted');
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error);
    
    // Delete local file if upload fails
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.error('Failed to delete temp file:', unlinkError);
      }
    }
    
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    console.log('🗑️ Deleting from Cloudinary:', publicId);
    await cloudinary.uploader.destroy(publicId);
    console.log('✅ Cloudinary delete successful');
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error);
    // Don't throw error, just log it
  }
};