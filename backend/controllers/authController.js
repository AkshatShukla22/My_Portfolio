import bcrypt from 'bcryptjs';

// @desc    Verify admin password
// @route   POST /api/auth/verify
// @access  Public
export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Get the admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return res.status(500).json({ 
        success: false,
        message: 'Admin password not configured' 
      });
    }

    // Compare the provided password with stored hash
    const isMatch = await bcrypt.compare(password, adminPassword);

    if (isMatch) {
      // Generate a simple session token (you can use any random string)
      const sessionToken = Buffer.from(`admin:${Date.now()}`).toString('base64');
      
      res.json({
        success: true,
        message: 'Authentication successful',
        token: sessionToken
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Invalid password' 
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Change admin password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return res.status(500).json({ 
        success: false,
        message: 'Admin password not configured' 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, adminPassword);

    if (isMatch) {
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      res.json({
        success: true,
        message: 'Password updated successfully. Please update ADMIN_PASSWORD in your .env file with this hash:',
        newPasswordHash: hashedPassword
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};