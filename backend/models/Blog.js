// backend/models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: String,
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    url: String,
    publicId: String,
  },
  tags: [String],
  published: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);