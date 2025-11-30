// backend/controllers/skillController.js
import Skill from '../models/Skill.js';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ 
        success: false,
        message: 'Skill not found' 
      });
    }

    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ 
        success: false,
        message: 'Skill not found' 
      });
    }

    // Handle logo deletion if new logo uploaded
    if (req.body.logo && skill.logo?.publicId) {
      await deleteFromCloudinary(skill.logo.publicId);
    }

    Object.assign(skill, req.body);
    await skill.save();

    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ 
        success: false,
        message: 'Skill not found' 
      });
    }

    // Delete logo from Cloudinary
    if (skill.logo?.publicId) {
      await deleteFromCloudinary(skill.logo.publicId);
    }

    await skill.deleteOne();
    res.json({ 
      success: true,
      message: 'Skill deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Reorder skills
// @route   PUT /api/skills/reorder
// @access  Private
export const reorderSkills = async (req, res) => {
  try {
    const { skills } = req.body; // Array of { id, order }

    const updatePromises = skills.map(({ id, order }) =>
      Skill.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updatePromises);

    res.json({ 
      success: true,
      message: 'Skills reordered successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};