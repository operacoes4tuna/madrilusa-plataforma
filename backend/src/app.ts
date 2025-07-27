import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from '@/shared/middleware/cors';
import { errorHandler } from '@/shared/middleware/errorHandler';

// Import routes
import { userRoutes } from '@/modules/users/user.routes';
import { authRoutes } from '@/modules/auth/auth.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Madrilusa Backend API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    path: req.originalUrl
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app; 