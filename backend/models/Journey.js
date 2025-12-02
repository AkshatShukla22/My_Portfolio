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
  icon: {
    type: String,
    default: 'fas fa-graduation-cap', // Font Awesome icon class
  },
  image: {
    url: String,
    publicId: String,
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  position: {
    type: Number, // Auto-calculated, but can be overridden
    min: 0,
    max: 100,
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
    icon: {
      type: String,
      default: 'fas fa-bicycle', // Font Awesome icon class
    },
    bikeImage: {
      url: String,
      publicId: String,
    }
  },
  autoPosition: {
    type: Boolean,
    default: true, // Auto-distribute steps evenly
  }
}, { timestamps: true });

// Pre-save hook to auto-calculate positions if enabled
journeySchema.pre('save', function(next) {
  if (this.autoPosition && this.steps.length > 0) {
    const sortedSteps = this.steps.sort((a, b) => a.order - b.order);
    
    sortedSteps.forEach((step, index) => {
      if (sortedSteps.length === 1) {
        step.position = 50; // Center single item
      } else {
        // Distribute evenly with padding
        const padding = 5; // 5% padding from edges
        const availableSpace = 100 - (2 * padding);
        step.position = padding + (availableSpace / (sortedSteps.length - 1)) * index;
      }
    });
  }
  next();
});

export default mongoose.model('Journey', journeySchema);