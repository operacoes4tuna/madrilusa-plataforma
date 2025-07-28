import { Router } from 'express';
import { MunicipioController } from './municipio.controller';

const router = Router();
const municipioController = new MunicipioController();

// Rotas do perfil de município
// POST /api/municipios/perfil - Criar perfil
router.post('/perfil', (req, res) => municipioController.createPerfil(req, res));

// GET /api/municipios/perfil/:userId - Buscar perfil por userId
router.get('/perfil/:userId', (req, res) => municipioController.getPerfilByUserId(req, res));

// PUT /api/municipios/perfil/:userId - Atualizar perfil
router.put('/perfil/:userId', (req, res) => municipioController.updatePerfil(req, res));

// DELETE /api/municipios/perfil/:userId - Deletar perfil
router.delete('/perfil/:userId', (req, res) => municipioController.deletePerfil(req, res));

// GET /api/municipios/list - Listar todos os perfis (admin)
router.get('/list', (req, res) => municipioController.listPerfis(req, res));

// GET /api/municipios/has-perfil/:userId - Verificar se usuário tem perfil
router.get('/has-perfil/:userId', (req, res) => municipioController.hasPerfilByUserId(req, res));

export default router; 