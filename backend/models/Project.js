// backend/models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  longDescription: String,
  thumbnail: {
    url: String,
    publicId: String,
  },
  images: [{
    url: String,
    publicId: String,
  }],
  techStack: [String],
  features: [String],
  githubLink: String,
  liveLink: String,
  category: {
    type: String,
    enum: ['web', 'mobile', 'fullstack', 'api', 'other'],
    default: 'web',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: Number,
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);