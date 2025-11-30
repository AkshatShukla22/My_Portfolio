// backend/controllers/timelineController.js
import Timeline from '../models/Timeline.js';

// @desc    Get timeline
// @route   GET /api/timeline
// @access  Public
export const getTimeline = async (req, res) => {
  try {
    let timeline = await Timeline.findOne();
    
    if (!timeline) {
      timeline = await Timeline.create({
        title: 'Tech Journey Timeline',
        items: [],
      });
    }

    res.json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update timeline
// @route   PUT /api/timeline
// @access  Private
export const updateTimeline = async (req, res) => {
  try {
    let timeline = await Timeline.findOne();

    if (!timeline) {
      timeline = new Timeline(req.body);
    } else {
      Object.assign(timeline, req.body);
    }

    await timeline.save();
    res.json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Add timeline item
// @route   POST /api/timeline/items
// @access  Private
export const addTimelineItem = async (req, res) => {
  try {
    const timeline = await Timeline.findOne();

    if (!timeline) {
      return res.status(404).json({ 
        success: false,
        message: 'Timeline not found' 
      });
    }

    timeline.items.push(req.body);
    await timeline.save();

    res.status(201).json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update timeline item
// @route   PUT /api/timeline/items/:itemId
// @access  Private
export const updateTimelineItem = async (req, res) => {
  try {
    const timeline = await Timeline.findOne();

    if (!timeline) {
      return res.status(404).json({ 
        success: false,
        message: 'Timeline not found' 
      });
    }

    const item = timeline.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: 'Timeline item not found' 
      });
    }

    Object.assign(item, req.body);
    await timeline.save();

    res.json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete timeline item
// @route   DELETE /api/timeline/items/:itemId
// @access  Private
export const deleteTimelineItem = async (req, res) => {
  try {
    const timeline = await Timeline.findOne();

    if (!timeline) {
      return res.status(404).json({ 
        success: false,
        message: 'Timeline not found' 
      });
    }

    const item = timeline.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: 'Timeline item not found' 
      });
    }

    item.deleteOne();
    await timeline.save();

    res.json({ 
      success: true,
      message: 'Timeline item deleted successfully',
      data: timeline,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};