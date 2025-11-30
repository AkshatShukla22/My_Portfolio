// backend/routes/skillRoutes.js
import express from 'express';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSkills)
  .post(protect, createSkill);

router.put('/reorder', protect, reorderSkills);

router.route('/:id')
  .get(getSkillById)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

export default router;