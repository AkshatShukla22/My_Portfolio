// backend/routes/uploadRoutes.js
import express from 'express';
import { uploadFile, uploadMultipleFiles, deleteFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFile);
router.post('/multiple', protect, upload.array('files', 10), uploadMultipleFiles);
router.delete('/:publicId', protect, deleteFile);

export default router;