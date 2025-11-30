// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// ES module fixes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/upload', uploadRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});