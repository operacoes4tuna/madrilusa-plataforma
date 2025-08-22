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
import municipioRoutes from './modules/municipios/municipio.routes';
import academiaRoutes from './modules/academias/academia.routes';
import familiaRoutes from './modules/familias/familia.routes';
import adminRoutes from './modules/admin/admin.routes'; // ✨ NOVO: Rotas admin
import contribuicoesRoutes from './modules/contribuicoes/contribuicoes.routes'; // ✨ SISTEMA CONTRIBUIÇÕES
import aiRoutes from './modules/ai/ai.routes'; // 🤖 IA: Rotas de inteligência artificial

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
app.use('/api/municipios', municipioRoutes); // ✨ FASE 3: Rotas de municípios
app.use('/api/academias', academiaRoutes); // ✨ FASE 4: Rotas de academias
app.use('/api/familias', familiaRoutes); // ✨ FASE 5: Rotas de famílias
app.use('/api/admin', adminRoutes); // ✨ ADMIN: Rotas de administração
app.use('/api/contribuicoes', contribuicoesRoutes); // ✨ SISTEMA CONTRIBUIÇÕES: Rotas de contribuições
app.use('/api/ai', aiRoutes); // 🤖 IA: Rotas de inteligência artificial

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware (deve ser o último)
app.use(errorHandler);

export default app; 