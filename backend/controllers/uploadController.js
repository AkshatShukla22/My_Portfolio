// backend/controllers/uploadController.js
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import fs from 'fs';

// @desc    Upload single file
// @route   POST /api/upload
// @access  Private
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    console.log('📁 File received:', req.file.originalname);
    console.log('📂 Upload folder:', req.body.folder || 'portfolio');

    const folder = req.body.folder || 'portfolio';
    
    // Upload to Cloudinary with unique filename
    const timestamp = Date.now();
    const result = await uploadToCloudinary(req.file.path, folder);

    console.log('✅ Cloudinary upload success:', result);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    
    // Clean up temp file on error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete temp file:', unlinkError);
      }
    }

    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to upload file'
    });
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No files uploaded' 
      });
    }

    const folder = req.body.folder || 'portfolio';
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.path, folder)
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('❌ Multiple upload error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete file from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private
export const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ 
        success: false,
        message: 'Public ID is required' 
      });
    }

    // Decode URL-encoded publicId
    const decodedPublicId = decodeURIComponent(publicId);
    await deleteFromCloudinary(decodedPublicId);

    res.json({ 
      success: true,
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};