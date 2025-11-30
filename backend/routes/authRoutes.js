// backend/routes/authRoutes.js
import express from 'express';
import { register, login, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, registerValidation, loginValidation } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.put('/change-password', protect, changePassword);

export default router;