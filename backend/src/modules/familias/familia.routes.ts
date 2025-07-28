import { Router } from 'express';
import { FamiliaController } from './familia.controller';

const router = Router();
const familiaController = new FamiliaController();

// Rotas do perfil de família
// POST /api/familias/perfil - Criar perfil
router.post('/perfil', (req, res) => familiaController.createPerfil(req, res));

// GET /api/familias/perfil/:userId - Buscar perfil por userId
router.get('/perfil/:userId', (req, res) => familiaController.getPerfilByUserId(req, res));

// PUT /api/familias/perfil/:userId - Atualizar perfil
router.put('/perfil/:userId', (req, res) => familiaController.updatePerfil(req, res));

// DELETE /api/familias/perfil/:userId - Deletar perfil
router.delete('/perfil/:userId', (req, res) => familiaController.deletePerfil(req, res));

// GET /api/familias/list - Listar todos os perfis (admin)
router.get('/list', (req, res) => familiaController.listPerfis(req, res));

// GET /api/familias/has-perfil/:userId - Verificar se usuário tem perfil
router.get('/has-perfil/:userId', (req, res) => familiaController.hasPerfilByUserId(req, res));

export default router; 