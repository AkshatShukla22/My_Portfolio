// backend/models/Timeline.js
import mongoose from 'mongoose';

const timelineItemSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  description: String,
  icon: String,
  order: {
    type: Number,
    required: true,
  }
});

const timelineSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Tech Journey Timeline',
  },
  items: [timelineItemSchema],
}, { timestamps: true });

export default mongoose.model('Timeline', timelineSchema);