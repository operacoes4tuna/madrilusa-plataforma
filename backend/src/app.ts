import express from 'express';
import path from 'path';
import cors from 'cors';
import { corsMiddleware } from './shared/middleware/cors';
import { errorHandler } from './shared/middleware/errorHandler';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import imigranteRoutes from './modules/imigrantes/imigrante.routes';
import empresaRoutes from './modules/empresas/empresa.routes';

const app = express();

// Middlewares globais
app.use(corsMiddleware);
app.use(express.json());

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/imigrantes', imigranteRoutes); // ✨ NOVO: Rotas de imigrantes
app.use('/api/empresas', empresaRoutes); // ✨ FASE 2: Rotas de empresas

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware (deve ser o último)
app.use(errorHandler);

export default app; 