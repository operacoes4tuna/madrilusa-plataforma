import { Router } from 'express';
import { adminController } from './admin.controller';
import { adminContribuicoesController } from './admin-contribuicoes.controller';

const router = Router();

// ✨ ADMIN ROUTES - Endpoints para interface de administração

// ✨ Dashboard Admin
router.get('/stats', adminController.getStats);

// ✨ Gestão de Usuários - Listagem
router.get('/users', adminController.getAllUsers);
router.get('/users/filtered', adminController.getUsersFiltered);
router.get('/users/category/:categoria', adminController.getUsersByCategory);

// ✨ Gestão de Usuários - CRUD individual
router.get('/user/:id/complete', adminController.getUserComplete);
router.put('/user/:id', adminController.updateUser);
router.delete('/user/:id', adminController.deleteUser);

// ✨ SISTEMA CONTRIBUIÇÕES - Gestão de Tipos
router.get('/tipos-contribuicao', adminContribuicoesController.getAllTiposContribuicao);
router.post('/tipos-contribuicao', adminContribuicoesController.createTipoContribuicao);
router.put('/tipos-contribuicao/:id', adminContribuicoesController.updateTipoContribuicao);
router.delete('/tipos-contribuicao/:id', adminContribuicoesController.deleteTipoContribuicao);

// ✨ SISTEMA CONTRIBUIÇÕES - Gestão de Tags
router.get('/tags', adminContribuicoesController.getAllTags);
router.post('/tags', adminContribuicoesController.createTag);
router.put('/tags/:id', adminContribuicoesController.updateTag);
router.delete('/tags/:id', adminContribuicoesController.deleteTag);

// ✨ SISTEMA CONTRIBUIÇÕES - Relatórios
router.get('/contribuicoes/stats', adminContribuicoesController.getContribuicoesStats);
router.get('/contribuicoes/todas', adminContribuicoesController.getAllContribuicoes);

// ✨ SISTEMA CONTRIBUIÇÕES - Moderação
router.get('/tipos-contribuicao/:tipoId/contribuicoes', adminContribuicoesController.getContribuicoesPorTipo);
router.put('/contribuicao/:contribuicaoId/status', adminContribuicoesController.toggleContribuicaoStatus);
router.delete('/contribuicao/:contribuicaoId', adminContribuicoesController.deleteContribuicaoAdmin);

// ✨ NOTIFICAÇÕES - Receber solicitações de contato do SinergIA
router.post('/notifications', adminController.createNotification);

export default router; 