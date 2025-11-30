// backend/routes/journeyRoutes.js
import express from 'express';
import {
  getJourney,
  updateJourney,
  addJourneyStep,
  updateJourneyStep,
  deleteJourneyStep,
} from '../controllers/journeyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getJourney)
  .put(protect, updateJourney);

router.route('/steps')
  .post(protect, addJourneyStep);

router.route('/steps/:stepId')
  .put(protect, updateJourneyStep)
  .delete(protect, deleteJourneyStep);

export default router;