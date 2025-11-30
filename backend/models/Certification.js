// backend/models/Certification.js
import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  date: Date,
  credentialId: String,
  credentialUrl: String,
  image: {
    url: String,
    publicId: String,
  },
  order: Number,
}, { timestamps: true });

export default mongoose.model('Certification', certificationSchema);