import { Router } from 'express';
import { oportunidadesTrabalhoController } from './oportunidades-trabalho.controller';

const router = Router();

// ===== ROTAS PARA EMPRESAS =====

// CRUD básico de oportunidades
router.post('/empresa/:userId', oportunidadesTrabalhoController.createOportunidade);
router.get('/empresa/:userId', oportunidadesTrabalhoController.getMinhasOportunidades);
router.get('/oportunidade/:id', oportunidadesTrabalhoController.getOportunidadeById);
router.put('/oportunidade/:id', oportunidadesTrabalhoController.updateOportunidade);
router.delete('/oportunidade/:id', oportunidadesTrabalhoController.deleteOportunidade);

// Ações específicas
router.put('/oportunidade/:id/status', oportunidadesTrabalhoController.toggleStatus);
router.post('/oportunidade/:id/duplicate', oportunidadesTrabalhoController.duplicateOportunidade);

// Estatísticas da empresa
router.get('/empresa/:userId/stats', oportunidadesTrabalhoController.getStatsEmpresa);

// ===== ROTAS ADMINISTRATIVAS =====

// Buscar todas para admin
router.get('/admin/all', oportunidadesTrabalhoController.getAllForAdmin);

// Estatísticas gerais para admin
router.get('/admin/stats', oportunidadesTrabalhoController.getStatsForAdmin);

export { router as oportunidadesTrabalhoRoutes };
