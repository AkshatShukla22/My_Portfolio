// backend/utils/cloudinaryUpload.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (filePath, folder = 'portfolio') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Delete local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
  }
};