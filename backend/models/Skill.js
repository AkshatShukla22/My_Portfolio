// backend/models/Skill.js
import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'frontend',
      'backend',
      'mobile',
      'database',
      'devops',
      'programming',
      'framework',
      'tools',
      'design',
      'testing',
      'ai-ml',
      'data-science',
      'blockchain',
      'cybersecurity',
      'game-dev',
      'embedded',
      'version-control',
      'soft-skills',
      'languages',
      'other'
    ],
    default: 'other'
  },
  logo: {
    url: String,
    publicId: String
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  displayInMarquee: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  fontAwesomeIcon: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Auto-increment order for new skills
skillSchema.pre('save', async function(next) {
  if (this.isNew && this.order === 0) {
    const maxOrderSkill = await this.constructor.findOne().sort('-order');
    this.order = maxOrderSkill ? maxOrderSkill.order + 1 : 1;
  }
  next();
});

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;