import { Router } from 'express';
import { AIController } from './ai.controller';
import { aiMiddleware } from '../../shared/middleware/aiSecurity';

const router = Router();
const aiController = new AIController();

// Aplicar middleware de segurança em todas as rotas de IA
router.use(aiMiddleware);

// Rotas principais de IA
router.post('/enhance-text', aiController.enhanceText);
router.post('/suggest-tags', aiController.suggestTags);

// Rotas de monitoramento
router.get('/health', aiController.healthCheck);
router.get('/metrics', aiController.getMetrics);

export default router;
