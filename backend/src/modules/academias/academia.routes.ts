import { Router } from 'express';
import { AcademiaController } from './academia.controller';

const router = Router();
const academiaController = new AcademiaController();

// Rotas do perfil de academia
// POST /api/academias/perfil - Criar perfil
router.post('/perfil', (req, res) => academiaController.createPerfil(req, res));

// GET /api/academias/perfil/:userId - Buscar perfil por userId
router.get('/perfil/:userId', (req, res) => academiaController.getPerfilByUserId(req, res));

// PUT /api/academias/perfil/:userId - Atualizar perfil
router.put('/perfil/:userId', (req, res) => academiaController.updatePerfil(req, res));

// DELETE /api/academias/perfil/:userId - Deletar perfil
router.delete('/perfil/:userId', (req, res) => academiaController.deletePerfil(req, res));

// GET /api/academias/list - Listar todos os perfis (admin)
router.get('/list', (req, res) => academiaController.listPerfis(req, res));

// GET /api/academias/has-perfil/:userId - Verificar se usuário tem perfil
router.get('/has-perfil/:userId', (req, res) => academiaController.hasPerfilByUserId(req, res));

export default router; 