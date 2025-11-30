// backend/models/Journey.js
import mongoose from 'mongoose';

const journeyStepSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
  },
  year: String,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: String,
  image: {
    url: String,
    publicId: String,
  },
  position: {
    type: Number, // Percentage along the road (0-100)
    required: true,
  }
});

const journeySchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'My Journey',
  },
  subtitle: String,
  steps: [journeyStepSchema],
  bikeAnimation: {
    speed: {
      type: Number,
      default: 1,
    },
    bikeImage: {
      url: String,
      publicId: String,
    }
  }
}, { timestamps: true });

export default mongoose.model('Journey', journeySchema);