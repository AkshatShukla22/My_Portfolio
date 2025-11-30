// backend/controllers/themeController.js
import Theme from '../models/Theme.js';

// @desc    Get theme
// @route   GET /api/theme
// @access  Public
export const getTheme = async (req, res) => {
  try {
    let theme = await Theme.findOne();
    
    if (!theme) {
      theme = await Theme.create({});
    }

    res.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update theme
// @route   PUT /api/theme
// @access  Private
export const updateTheme = async (req, res) => {
  try {
    let theme = await Theme.findOne();

    if (!theme) {
      theme = new Theme(req.body);
    } else {
      Object.assign(theme, req.body);
    }

    await theme.save();
    res.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Reset theme to default
// @route   POST /api/theme/reset
// @access  Private
export const resetTheme = async (req, res) => {
  try {
    let theme = await Theme.findOne();

    if (!theme) {
      theme = await Theme.create({});
    } else {
      theme.set({
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        accentColor: '#ec4899',
        backgroundColor: '#0f172a',
        textColor: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
        borderRadius: '12px',
        transitionSpeed: '0.3s',
      });
      await theme.save();
    }

    res.json({
      success: true,
      message: 'Theme reset to default',
      data: theme,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};