// backend/models/Skill.js
import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    url: String,
    publicId: String,
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'tools', 'other'],
    default: 'other',
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
  },
  order: Number,
  displayInMarquee: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);