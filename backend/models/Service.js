// backend/models/Service.js
import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Basic', 'Standard', 'Premium']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  deliveryTime: {
    type: String,
    default: '7 days'
  },
  revisions: {
    type: String,
    default: 'Unlimited'
  }
});

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a service title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a service description']
    },
    icon: {
      type: String,
      required: [true, 'Please add an icon'],
      default: 'fa-gears'
    },
    features: [{
      type: String,
      trim: true
    }],
    // Simple pricing (when no packages)
    price: {
      type: String,
      default: ''
    },
    // Package-based pricing (optional, like a gig)
    hasPackages: {
      type: Boolean,
      default: false
    },
    packages: [packageSchema],
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    showInFooter: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-increment order on create
serviceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Service').countDocuments();
    this.order = count;
  }
  next();
});

// Re-order remaining services after delete
serviceSchema.post('deleteOne', { document: true, query: false }, async function() {
  const Service = mongoose.model('Service');
  const services = await Service.find().sort({ order: 1 });
  
  for (let i = 0; i < services.length; i++) {
    if (services[i].order !== i) {
      services[i].order = i;
      await services[i].save();
    }
  }
});

// Create index for ordering
serviceSchema.index({ order: 1 });

export default mongoose.model('Service', serviceSchema);