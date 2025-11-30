// backend/routes/themeRoutes.js
import express from 'express';
import { getTheme, updateTheme, resetTheme } from '../controllers/themeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTheme)
  .put(protect, updateTheme);

router.post('/reset', protect, resetTheme);

export default router;