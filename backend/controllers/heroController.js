// backend/controllers/heroController.js
import Hero from '../models/Hero.js';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get hero content
// @route   GET /api/hero
// @access  Public
export const getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    
    if (!hero) {
      // Create default hero if none exists
      hero = await Hero.create({
        title: 'Welcome to My Portfolio',
        subtitle: 'Full Stack Developer',
        description: 'Crafting digital experiences',
      });
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update hero content
// @route   PUT /api/hero
// @access  Private
export const updateHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();

    if (!hero) {
      hero = new Hero(req.body);
    } else {
      // Handle image deletion if new images are uploaded
      if (req.body.profileImage && hero.profileImage?.publicId) {
        await deleteFromCloudinary(hero.profileImage.publicId);
      }
      if (req.body.backgroundImage && hero.backgroundImage?.publicId) {
        await deleteFromCloudinary(hero.backgroundImage.publicId);
      }

      Object.assign(hero, req.body);
    }

    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};