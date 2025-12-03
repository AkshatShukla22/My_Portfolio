// backend/models/Contact.js
import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['github', 'linkedin', 'twitter', 'leetcode', 'geeksforgeeks', 'instagram', 'facebook', 'youtube', 'medium', 'dev', 'stackoverflow', 'codepen', 'dribbble', 'behance']
  },
  url: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const phoneNumberSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  showWhatsApp: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
});

const emailSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
});

const contactSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Get In Touch'
    },
    subtitle: {
      type: String,
      default: "Have a project in mind? Let's discuss how I can help you."
    },
    location: {
      city: String,
      country: String,
      icon: {
        type: String,
        default: 'fa-location-dot'
      }
    },
    emails: [emailSchema],
    phoneNumbers: [phoneNumberSchema],
    socialLinks: [socialLinkSchema],
    formEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure only one primary email
contactSchema.pre('save', function(next) {
  if (this.emails && this.emails.length > 0) {
    const primaryEmails = this.emails.filter(e => e.isPrimary);
    if (primaryEmails.length > 1) {
      this.emails.forEach((e, index) => {
        if (index > 0) e.isPrimary = false;
      });
    }
  }
  
  if (this.phoneNumbers && this.phoneNumbers.length > 0) {
    const primaryPhones = this.phoneNumbers.filter(p => p.isPrimary);
    if (primaryPhones.length > 1) {
      this.phoneNumbers.forEach((p, index) => {
        if (index > 0) p.isPrimary = false;
      });
    }
  }
  
  next();
});

export default mongoose.model('Contact', contactSchema);