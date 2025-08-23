import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/database.js'; // Add this import

// Import routes
import authRoutes from './routes/auth.js';
import youtubeRoute from './routes/youtube.js';
import uploadRoute from './routes/upload.js';
import summarizeRoutes from './routes/summarize.js';
import pdfSummaryRoute from './routes/pdfSummary.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', youtubeRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/summarize', summarizeRoutes);
app.use('/api/pdf-summary', pdfSummaryRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'MongoDB connected',
    services: ['auth', 'upload', 'summarize', 'pdf-summary', 'youtube-transcript']
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  // JWT error
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: MongoDB`);
  console.log(`🔗 Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});
