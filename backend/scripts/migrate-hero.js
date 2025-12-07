// backend/scripts/migrate-hero.js
// Run this once to migrate your database: node scripts/migrate-hero.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const migrateHero = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const Hero = mongoose.model('Hero', new mongoose.Schema({}, { strict: false }));
    
    const hero = await Hero.findOne();
    
    if (!hero) {
      console.log('❌ No hero document found');
      process.exit(1);
    }

    console.log('📋 Current hero data:', {
      id: hero._id,
      title: hero.title,
      subtitle: hero.subtitle,
      subtitles: hero.subtitles,
    });

    // Migration logic
    if (hero.subtitle && (!hero.subtitles || hero.subtitles.length === 0)) {
      console.log('🔄 Migrating subtitle to subtitles array...');
      hero.subtitles = [hero.subtitle];
    } else if (hero.subtitle && hero.subtitles && hero.subtitles.length > 0) {
      console.log('⚠️ Both subtitle and subtitles exist. Keeping subtitles array.');
    } else if (!hero.subtitles || hero.subtitles.length === 0) {
      console.log('⚠️ No subtitles found. Adding default...');
      hero.subtitles = ['Full Stack Developer'];
    }

    // Remove old subtitle field
    console.log('🗑️ Removing old subtitle field...');
    await Hero.updateOne(
      { _id: hero._id },
      { 
        $set: { subtitles: hero.subtitles },
        $unset: { subtitle: "" }
      }
    );

    const updatedHero = await Hero.findOne();
    console.log('✅ Migration complete! New data:', {
      id: updatedHero._id,
      title: updatedHero.title,
      subtitle: updatedHero.subtitle,
      subtitles: updatedHero.subtitles,
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateHero();