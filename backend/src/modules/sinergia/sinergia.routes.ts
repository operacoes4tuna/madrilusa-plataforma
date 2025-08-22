import { Router } from 'express';
import { SinergiaController } from './sinergia.controller';
import { sinergiaMiddleware } from '../../shared/middleware/aiSecurity';

const router = Router();
const sinergiaController = new SinergiaController();

// Aplicar middleware específico para SinergIA (rate limiting mais restritivo)
router.use(sinergiaMiddleware);

// Rotas principais
router.post('/analyze/:userId', sinergiaController.analyzeUserSynergy);
router.get('/check-eligibility/:userId', sinergiaController.checkUserEligibility);
router.get('/entity-details/:contributionId', sinergiaController.getEntityDetails);
router.post('/request-contact', sinergiaController.requestContact);

// Rota de debug/stats (sem rate limiting)
router.get('/stats', sinergiaController.getSystemStats);

// Rota de teste para desenvolvimento (sem rate limiting)
if (process.env.NODE_ENV === 'development') {
  const { aiMiddleware } = require('../../shared/middleware/aiSecurity');
  router.post('/test-analyze/:userId', aiMiddleware, sinergiaController.analyzeUserSynergy);
}

export default router;
