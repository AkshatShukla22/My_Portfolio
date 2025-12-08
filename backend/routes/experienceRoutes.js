// backend/routes/experienceRoutes.js
import express from 'express';
import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getExperiences)
  .post(protect, createExperience);

router.route('/:id')
  .get(getExperienceById)
  .put(protect, updateExperience)
  .delete(protect, deleteExperience);

export default router;