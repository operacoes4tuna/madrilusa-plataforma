import { Router } from 'express';
import { SinergiaV2Controller } from './sinergia-v2.controller';
import { sinergiaMiddleware } from '../../shared/middleware/aiSecurity';

const router = Router();
const sinergiaV2Controller = new SinergiaV2Controller();

// Aplicar middleware de segurança em todas as rotas
router.use(sinergiaMiddleware);

// Rotas principais do SinergIA V2

/**
 * Health check do sistema V2
 */
router.get('/health', sinergiaV2Controller.healthCheck);

/**
 * Estatísticas gerais do sistema
 */
router.get('/stats', sinergiaV2Controller.getSystemStats);

/**
 * Métricas de custo em tempo real
 */
router.get('/metrics/cost', sinergiaV2Controller.getCostMetrics);

/**
 * Métricas de performance
 */
router.get('/metrics/performance', sinergiaV2Controller.getPerformanceMetrics);

/**
 * Analisar matches para uma oportunidade específica
 * POST /api/sinergia-v2/opportunity/:oportunidadeId/matches
 * 
 * Body: {
 *   minScore?: number,
 *   maxResults?: number,
 *   includeBreakdown?: boolean,
 *   useAI?: boolean,
 *   cacheResults?: boolean
 * }
 */
router.post('/opportunity/:oportunidadeId/matches', sinergiaV2Controller.analyzeOpportunityMatches);

/**
 * Analisar oportunidades para um imigrante específico
 * POST /api/sinergia-v2/imigrante/:imigranteId/opportunities
 * 
 * Body: {
 *   minScore?: number,
 *   maxResults?: number,
 *   includeBreakdown?: boolean,
 *   useAI?: boolean,
 *   cacheResults?: boolean
 * }
 */
router.post('/imigrante/:imigranteId/opportunities', sinergiaV2Controller.analyzeImigranteOpportunities);

/**
 * Obter detalhes de um match específico
 * GET /api/sinergia-v2/match/:oportunidadeId/:imigranteId
 */
router.get('/match/:oportunidadeId/:imigranteId', sinergiaV2Controller.getMatchDetails);

/**
 * Submeter feedback sobre um match
 * POST /api/sinergia-v2/feedback
 */
router.post('/feedback', sinergiaV2Controller.submitFeedback);

/**
 * Estatísticas de feedback
 * GET /api/sinergia-v2/feedback/stats
 */
router.get('/feedback/stats', sinergiaV2Controller.getFeedbackStats);

/**
 * Recomendações de tuning do algoritmo
 * GET /api/sinergia-v2/tuning/recommendations
 */
router.get('/tuning/recommendations', sinergiaV2Controller.getTuningRecommendations);

export default router;
