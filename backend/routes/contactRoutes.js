// backend/routes/contactRoutes.js
import express from 'express';
import {
  getContact,
  updateContact,
  submitContactForm,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  addEmail,
  updateEmail,
  deleteEmail,
  addPhone,
  updatePhone,
  deletePhone
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getContact);
router.post('/submit', submitContactForm); // New route for form submission

// Protected routes
router.put('/', protect, updateContact);

// Social links
router.post('/social', protect, addSocialLink);
router.put('/social/:id', protect, updateSocialLink);
router.delete('/social/:id', protect, deleteSocialLink);

// Emails
router.post('/email', protect, addEmail);
router.put('/email/:id', protect, updateEmail);
router.delete('/email/:id', protect, deleteEmail);

// Phone numbers
router.post('/phone', protect, addPhone);
router.put('/phone/:id', protect, updatePhone);
router.delete('/phone/:id', protect, deletePhone);

export default router;