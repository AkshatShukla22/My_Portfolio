// backend/controllers/certificationController.js
import Certification from '../models/Certification.js';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
export const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ order: 1, date: -1 });
    res.json({
      success: true,
      data: certifications,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single certification
// @route   GET /api/certifications/:id
// @access  Public
export const getCertificationById = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    
    if (!certification) {
      return res.status(404).json({ 
        success: false,
        message: 'Certification not found' 
      });
    }

    res.json({
      success: true,
      data: certification,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create certification
// @route   POST /api/certifications
// @access  Private
export const createCertification = async (req, res) => {
  try {
    const certification = await Certification.create(req.body);
    res.status(201).json({
      success: true,
      data: certification,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private
export const updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({ 
        success: false,
        message: 'Certification not found' 
      });
    }

    // Handle image deletion if new image uploaded
    if (req.body.image && certification.image?.publicId) {
      await deleteFromCloudinary(certification.image.publicId);
    }

    Object.assign(certification, req.body);
    await certification.save();

    res.json({
      success: true,
      data: certification,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private
export const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({ 
        success: false,
        message: 'Certification not found' 
      });
    }

    // Delete image from Cloudinary
    if (certification.image?.publicId) {
      await deleteFromCloudinary(certification.image.publicId);
    }

    await certification.deleteOne();
    res.json({ 
      success: true,
      message: 'Certification deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};