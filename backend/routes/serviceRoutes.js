// backend/routes/serviceRoutes.js
import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  reorderServices
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:id', getService);

// Protected routes
router.post('/', protect, createService);
router.put('/reorder', protect, reorderServices);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;