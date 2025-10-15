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
import sinergiaRoutes from './modules/sinergia/sinergia.routes';
import sinergiaV2Routes from './modules/sinergia/sinergia-v2.routes'; // ✨ SINERGIA V2 // 🧠 SINERGIA: Rotas de matching IA
import configuracaoSinergiaRoutes from './modules/sinergia/configuracao-sinergia.routes'; // 🎛️ CONFIG SINERGIA: Rotas de configuração parametrizável
import systemHealthRoutes from './modules/sinergia/system-health.routes'; // 🔧 SYSTEM HEALTH: Rotas de monitoramento
import { dadosProfissionaisRoutes } from './modules/dados-profissionais/dados-profissionais.routes'; // ✨ DADOS PROFISSIONAIS: Rotas para dados estruturados
import { oportunidadesTrabalhoRoutes } from './modules/oportunidades-trabalho/oportunidades-trabalho.routes'; // ✨ OPORTUNIDADES: Rotas para oportunidades de trabalho

const app = express();

// Middlewares globais
app.use(corsMiddleware);
app.use(express.json());

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir arquivos de áudio (play)
app.use('/api/play', express.static(path.join(__dirname, '../play')));

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
app.use('/api/dados-profissionais', dadosProfissionaisRoutes); // ✨ DADOS PROFISSIONAIS: Rotas para dados estruturados
app.use('/api/oportunidades-trabalho', oportunidadesTrabalhoRoutes); // ✨ OPORTUNIDADES: Rotas para oportunidades de trabalho
app.use('/api/ai', aiRoutes); // 🤖 IA: Rotas de inteligência artificial
app.use('/api/sinergia', sinergiaRoutes); // 🧠 SINERGIA: Rotas de matching IA (V1)
app.use('/api/sinergia-v2', sinergiaV2Routes); // 🧠 SINERGIA V2: Matching rigoroso Empresa ↔ Imigrante
app.use('/api/sinergia-config', configuracaoSinergiaRoutes); // 🎛️ CONFIG SINERGIA: Configuração parametrizável do matching
app.use('/api/system', systemHealthRoutes); // 🔧 SYSTEM HEALTH: Monitoramento de saúde e sincronização

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware (deve ser o último)
app.use(errorHandler);

export default app; 