// backend/routes/heroRoutes.js
import express from 'express';
import { getHero, updateHero } from '../controllers/heroController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getHero)
  .put(protect, updateHero);

export default router;