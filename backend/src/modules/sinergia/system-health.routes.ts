// Rotas para Monitoramento de Saúde do Sistema SinergIA
// Endpoints administrativos para verificar conectividade e sincronização

import { Router } from 'express';
import { SystemHealthController } from './system-health.controller';
// import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const systemHealthController = new SystemHealthController();

// Middleware de autenticação para todos os endpoints (temporariamente desabilitado)
// router.use(authMiddleware);

// Rotas de saúde do sistema
router.get('/health', systemHealthController.getSystemHealth);
router.get('/health/stats', systemHealthController.getHealthStats);

// Rotas de sincronização
router.post('/sync/force', systemHealthController.forceSynchronization);
router.post('/sync/test', systemHealthController.testSynchronization);

// Rotas de conectividade
router.get('/connectivity', systemHealthController.testConnectivity);

// Rotas de cache
router.post('/cache/clear', systemHealthController.clearCache);

// Rotas de eventos
router.get('/events/status', systemHealthController.getEventsStatus);

export default router;
