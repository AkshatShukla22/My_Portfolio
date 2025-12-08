// backend/controllers/experienceController.js
import Experience from '../models/Experience.js';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1, order: 1 });
    res.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ 
        success: false,
        message: 'Experience not found' 
      });
    }

    res.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create experience
// @route   POST /api/experiences
// @access  Private
export const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ 
        success: false,
        message: 'Experience not found' 
      });
    }

    // Handle logo deletion if new logo uploaded
    if (req.body.companyLogo && experience.companyLogo?.publicId) {
      await deleteFromCloudinary(experience.companyLogo.publicId);
    }

    Object.assign(experience, req.body);
    await experience.save();

    res.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ 
        success: false,
        message: 'Experience not found' 
      });
    }

    // Delete logo from Cloudinary
    if (experience.companyLogo?.publicId) {
      await deleteFromCloudinary(experience.companyLogo.publicId);
    }

    await experience.deleteOne();
    res.json({ 
      success: true,
      message: 'Experience deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};