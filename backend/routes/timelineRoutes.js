// backend/routes/timelineRoutes.js
import express from 'express';
import {
  getTimeline,
  updateTimeline,
  addTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from '../controllers/timelineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTimeline)
  .put(protect, updateTimeline);

router.route('/items')
  .post(protect, addTimelineItem);

router.route('/items/:itemId')
  .put(protect, updateTimelineItem)
  .delete(protect, deleteTimelineItem);

export default router;