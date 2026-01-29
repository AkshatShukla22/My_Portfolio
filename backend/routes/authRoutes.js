import express from 'express';
import { verifyPassword, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Password verification
router.post('/verify', 
  validate([
    body('password').notEmpty().withMessage('Password is required')
  ]),
  verifyPassword
);

// Change password (protected route)
router.put('/change-password', 
  protect,
  validate([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ]),
  changePassword
);

export default router;