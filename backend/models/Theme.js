// backend/models/Theme.js
import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  primaryColor: {
    type: String,
    default: '#6366f1',
  },
  secondaryColor: {
    type: String,
    default: '#8b5cf6',
  },
  accentColor: {
    type: String,
    default: '#ec4899',
  },
  backgroundColor: {
    type: String,
    default: '#0f172a',
  },
  textColor: {
    type: String,
    default: '#f1f5f9',
  },
  fontFamily: {
    type: String,
    default: "'Inter', sans-serif",
  },
  borderRadius: {
    type: String,
    default: '12px',
  },
  transitionSpeed: {
    type: String,
    default: '0.3s',
  }
}, { timestamps: true });

export default mongoose.model('Theme', themeSchema);