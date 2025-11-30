// backend/routes/certificationRoutes.js
import express from 'express';
import {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/certificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCertifications)
  .post(protect, createCertification);

router.route('/:id')
  .get(getCertificationById)
  .put(protect, updateCertification)
  .delete(protect, deleteCertification);

export default router;