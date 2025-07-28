import { Router } from 'express';
import { EmpresaController } from './empresa.controller';

const router = Router();
const empresaController = new EmpresaController();

// Rotas do perfil de empresa
// POST /api/empresas/perfil - Criar perfil
router.post('/perfil', (req, res) => empresaController.createPerfil(req, res));

// GET /api/empresas/perfil/:userId - Buscar perfil por userId
router.get('/perfil/:userId', (req, res) => empresaController.getPerfilByUserId(req, res));

// PUT /api/empresas/perfil/:userId - Atualizar perfil
router.put('/perfil/:userId', (req, res) => empresaController.updatePerfil(req, res));

// DELETE /api/empresas/perfil/:userId - Deletar perfil
router.delete('/perfil/:userId', (req, res) => empresaController.deletePerfil(req, res));

// GET /api/empresas/list - Listar todos os perfis (admin)
router.get('/list', (req, res) => empresaController.listPerfis(req, res));

// GET /api/empresas/has-perfil/:userId - Verificar se usuário tem perfil
router.get('/has-perfil/:userId', (req, res) => empresaController.hasPerfilByUserId(req, res));

export default router; 