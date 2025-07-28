import { Router } from 'express';
import { ImigranteController } from './imigrante.controller';

const router = Router();
const imigranteController = new ImigranteController();

// Rotas do perfil de imigrante
// POST /api/imigrantes/perfil - Criar perfil
router.post('/perfil', (req, res) => imigranteController.createPerfil(req, res));

// GET /api/imigrantes/perfil/:userId - Buscar perfil por userId
router.get('/perfil/:userId', (req, res) => imigranteController.getPerfilByUserId(req, res));

// PUT /api/imigrantes/perfil/:userId - Atualizar perfil
router.put('/perfil/:userId', (req, res) => imigranteController.updatePerfil(req, res));

// DELETE /api/imigrantes/perfil/:userId - Deletar perfil
router.delete('/perfil/:userId', (req, res) => imigranteController.deletePerfil(req, res));

// GET /api/imigrantes/perfis - Listar todos os perfis (admin)
router.get('/perfis', (req, res) => imigranteController.listPerfis(req, res));

// GET /api/imigrantes/has-perfil/:userId - Verificar se usuário tem perfil
router.get('/has-perfil/:userId', (req, res) => imigranteController.hasPerfilImigrante(req, res));

// GET /api/imigrantes/nacionalidades - Listar nacionalidades disponíveis
router.get('/nacionalidades', (req, res) => imigranteController.getNacionalidades(req, res));

export default router; 