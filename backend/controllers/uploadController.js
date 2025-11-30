// backend/controllers/uploadController.js
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

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

    const folder = req.body.folder || 'portfolio';
    const result = await uploadToCloudinary(req.file.path, folder);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
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
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};