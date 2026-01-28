// backend/models/Hero.js
import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
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
  resume: {
    googleDriveLink: String,
    downloadLink: String,
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
  strict: false
});

export default mongoose.model('Hero', heroSchema);