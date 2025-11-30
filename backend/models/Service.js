// backend/models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: String,
  features: [String],
  order: Number,
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);