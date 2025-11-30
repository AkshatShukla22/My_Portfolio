// backend/controllers/journeyController.js
import Journey from '../models/Journey.js';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get journey data
// @route   GET /api/journey
// @access  Public
export const getJourney = async (req, res) => {
  try {
    let journey = await Journey.findOne();
    
    if (!journey) {
      journey = await Journey.create({
        title: 'My Journey',
        steps: [],
      });
    }

    res.json({
      success: true,
      data: journey,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update journey
// @route   PUT /api/journey
// @access  Private
export const updateJourney = async (req, res) => {
  try {
    let journey = await Journey.findOne();

    if (!journey) {
      journey = new Journey(req.body);
    } else {
      // Handle image deletions
      if (req.body.bikeAnimation?.bikeImage && journey.bikeAnimation?.bikeImage?.publicId) {
        await deleteFromCloudinary(journey.bikeAnimation.bikeImage.publicId);
      }

      // Handle step image deletions
      if (req.body.steps) {
        for (const oldStep of journey.steps) {
          const stillExists = req.body.steps.find(s => s._id?.toString() === oldStep._id?.toString());
          if (!stillExists && oldStep.image?.publicId) {
            await deleteFromCloudinary(oldStep.image.publicId);
          }
        }
      }

      Object.assign(journey, req.body);
    }

    await journey.save();
    res.json({
      success: true,
      data: journey,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Add journey step
// @route   POST /api/journey/steps
// @access  Private
export const addJourneyStep = async (req, res) => {
  try {
    const journey = await Journey.findOne();

    if (!journey) {
      return res.status(404).json({ 
        success: false,
        message: 'Journey not found' 
      });
    }

    journey.steps.push(req.body);
    await journey.save();

    res.status(201).json({
      success: true,
      data: journey,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update journey step
// @route   PUT /api/journey/steps/:stepId
// @access  Private
export const updateJourneyStep = async (req, res) => {
  try {
    const journey = await Journey.findOne();

    if (!journey) {
      return res.status(404).json({ 
        success: false,
        message: 'Journey not found' 
      });
    }

    const step = journey.steps.id(req.params.stepId);

    if (!step) {
      return res.status(404).json({ 
        success: false,
        message: 'Step not found' 
      });
    }

    // Handle image deletion if new image uploaded
    if (req.body.image && step.image?.publicId) {
      await deleteFromCloudinary(step.image.publicId);
    }

    Object.assign(step, req.body);
    await journey.save();

    res.json({
      success: true,
      data: journey,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete journey step
// @route   DELETE /api/journey/steps/:stepId
// @access  Private
export const deleteJourneyStep = async (req, res) => {
  try {
    const journey = await Journey.findOne();

    if (!journey) {
      return res.status(404).json({ 
        success: false,
        message: 'Journey not found' 
      });
    }

    const step = journey.steps.id(req.params.stepId);

    if (!step) {
      return res.status(404).json({ 
        success: false,
        message: 'Step not found' 
      });
    }

    // Delete image from Cloudinary
    if (step.image?.publicId) {
      await deleteFromCloudinary(step.image.publicId);
    }

    step.deleteOne();
    await journey.save();

    res.json({ 
      success: true,
      message: 'Step deleted successfully',
      data: journey,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};