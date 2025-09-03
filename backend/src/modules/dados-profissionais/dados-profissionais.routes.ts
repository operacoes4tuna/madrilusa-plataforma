import { Router } from 'express';
import { dadosProfissionaisController } from './dados-profissionais.controller';

const router = Router();

// ===== ROTAS PARA USUÁRIOS =====

// CRUD geral
router.post('/user/:userId', dadosProfissionaisController.createDado);
router.get('/user/:userId', dadosProfissionaisController.getMeusDados);
router.get('/dado/:id', dadosProfissionaisController.getDadoById);
router.put('/dado/:id', dadosProfissionaisController.updateDado);
router.delete('/dado/:id', dadosProfissionaisController.deleteDado);

// Por tipo específico
router.get('/user/:userId/experiencias', dadosProfissionaisController.getExperiencias);
router.get('/user/:userId/formacoes', dadosProfissionaisController.getFormacoes);
router.get('/user/:userId/idiomas', dadosProfissionaisController.getIdiomas);

// Reordenar
router.put('/user/:userId/reorder/:tipo', dadosProfissionaisController.reorderDados);

// ===== ROTAS ADMINISTRATIVAS =====

// Buscar todos para admin
router.get('/admin/all', dadosProfissionaisController.getAllForAdmin);

// Estatísticas para admin
router.get('/admin/stats', dadosProfissionaisController.getStatsForAdmin);

export { router as dadosProfissionaisRoutes };
