// backend/controllers/uploadController.js
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import fs from 'fs';

// @desc    Upload single file
// @route   POST /api/upload
// @access  Private
export const uploadFile = async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log('📁 File present:', !!req.file);
    console.log('📂 Request body:', req.body);

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    console.log('📁 File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    const folder = req.body.folder || 'portfolio';
    
    // Check if file exists
    if (!fs.existsSync(req.file.path)) {
      throw new Error('Uploaded file not found on server');
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, folder);

    console.log('✅ Upload completed successfully');

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Clean up temp file on error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Cleaned up temp file after error');
      } catch (unlinkError) {
        console.error('⚠️ Failed to delete temp file:', unlinkError.message);
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
    console.log('📤 Multiple upload request received');
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No files uploaded' 
      });
    }

    console.log(`📁 Uploading ${req.files.length} files`);

    const folder = req.body.folder || 'portfolio';
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.path, folder)
    );

    const results = await Promise.all(uploadPromises);

    console.log('✅ All files uploaded successfully');

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('❌ Multiple upload error:', error.message);
    
    // Clean up all temp files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (err) {
            console.error('⚠️ Failed to delete temp file:', err.message);
          }
        }
      });
    }
    
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

    console.log('🗑️ Delete request for:', publicId);

    if (!publicId) {
      return res.status(400).json({ 
        success: false,
        message: 'Public ID is required' 
      });
    }

    // Decode URL-encoded publicId
    const decodedPublicId = decodeURIComponent(publicId);
    console.log('🔓 Decoded publicId:', decodedPublicId);
    
    await deleteFromCloudinary(decodedPublicId);

    res.json({ 
      success: true,
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Delete error:', error.message);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};