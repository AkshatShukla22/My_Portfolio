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
        subtitles: ['Full Stack Developer'],
        description: 'Crafting digital experiences',
      });
    } else {
      // MIGRATION: Convert old subtitle to subtitles array if needed
      if (hero.subtitle && (!hero.subtitles || hero.subtitles.length === 0)) {
        console.log('🔄 Migrating old subtitle to subtitles array');
        hero.subtitles = [hero.subtitle];
        hero.subtitle = undefined;
        await hero.save();
      }
    }

    console.log('✅ Sending hero data:', {
      id: hero._id,
      title: hero.title,
      subtitles: hero.subtitles,
      hasResume: !!hero.resume?.googleDriveLink
    });

    res.json({
      success: true,
      data: hero,
    });
  } catch (error) {
    console.error('❌ Get hero error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
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

      // Update all fields
      hero.title = req.body.title || hero.title;
      hero.subtitles = req.body.subtitles || hero.subtitles;
      hero.description = req.body.description;
      hero.ctaText = req.body.ctaText;
      hero.ctaLink = req.body.ctaLink;
      hero.profileImage = req.body.profileImage || hero.profileImage;
      hero.backgroundImage = req.body.backgroundImage || hero.backgroundImage;
      hero.resume = req.body.resume || hero.resume;
      hero.model3D = req.body.model3D || hero.model3D;
      hero.animations = req.body.animations || hero.animations;
      
      // Remove old subtitle field if it exists
      hero.subtitle = undefined;
    }

    await hero.save();
    
    console.log('✅ Hero updated successfully:', {
      id: hero._id,
      title: hero.title,
      subtitles: hero.subtitles,
      hasResume: !!hero.resume?.googleDriveLink
    });
    
    res.json({
      success: true,
      data: hero,
    });
  } catch (error) {
    console.error('❌ Update hero error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};