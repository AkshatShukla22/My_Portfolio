// backend/index.js
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
import experienceRoutes from './routes/experienceRoutes.js'; 
import blogRoutes from './routes/blogRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.set('trust proxy', 1);

// CORS - Allow all origins
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check (no DB)
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Portfolio Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// DB health check
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ 
      success: true, 
      status: 'healthy',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Connect to DB before API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;