// backend/controllers/blogController.js
import Blog from '../models/Blog.js';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// Helper to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, published } = req.query;
    
    const query = published !== undefined ? { published: published === 'true' } : {};
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  try {
    const { title } = req.body;
    
    // Generate slug
    let slug = generateSlug(title);
    
    // Check if slug exists, make it unique
    let slugExists = await Blog.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(title)}-${counter}`;
      slugExists = await Blog.findOne({ slug });
      counter++;
    }

    const blog = await Blog.create({
      ...req.body,
      slug,
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    // Update slug if title changed
    if (req.body.title && req.body.title !== blog.title) {
      let slug = generateSlug(req.body.title);
      let slugExists = await Blog.findOne({ slug, _id: { $ne: blog._id } });
      let counter = 1;
      while (slugExists) {
        slug = `${generateSlug(req.body.title)}-${counter}`;
        slugExists = await Blog.findOne({ slug, _id: { $ne: blog._id } });
        counter++;
      }
      req.body.slug = slug;
    }

    // Handle image deletion if new image uploaded
    if (req.body.featuredImage && blog.featuredImage?.publicId) {
      await deleteFromCloudinary(blog.featuredImage.publicId);
    }

    Object.assign(blog, req.body);
    await blog.save();

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    // Delete featured image from Cloudinary
    if (blog.featuredImage?.publicId) {
      await deleteFromCloudinary(blog.featuredImage.publicId);
    }

    await blog.deleteOne();
    res.json({ 
      success: true,
      message: 'Blog deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};