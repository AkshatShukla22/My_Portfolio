// backend/models/Hero.js
import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // Remove old subtitle field completely
  subtitles: {
    type: [String],
    default: ['Full Stack Developer'],
    required: true,
  },
  description: String,
  profileImage: {
    url: String,
    publicId: String,
  },
  backgroundImage: {
    url: String,
    publicId: String,
  },
  ctaText: String,
  ctaLink: String,
  model3D: {
    type: {
      type: String,
      enum: ['laptop', 'cube', 'sphere', 'custom'],
      default: 'laptop',
    },
    rotationSpeed: {
      type: Number,
      default: 0.01,
    }
  },
  animations: {
    titleAnimation: {
      type: String,
      default: 'fadeInUp',
    },
    imageAnimation: {
      type: String,
      default: 'fadeIn',
    }
  }
}, { 
  timestamps: true,
  strict: false // Allow extra fields during migration
});

export default mongoose.model('Hero', heroSchema);