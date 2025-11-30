// backend/routes/blogRoutes.js
import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:slug')
  .get(getBlogBySlug);

router.route('/id/:id')
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

export default router;