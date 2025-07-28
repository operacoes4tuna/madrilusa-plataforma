import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

// ✅ Rotas existentes (mantidas para compatibilidade)
// POST /api/auth/register - Registrar novo usuário (método simples)
router.post('/register', authController.register);

// POST /api/auth/login - Login de usuário
router.post('/login', authController.login);

// ✨ NOVAS ROTAS: Registro em 2 etapas
// POST /api/auth/register-basic - Etapa 1: dados básicos + categoria
router.post('/register-basic', authController.registerBasic);

// GET /api/auth/can-complete/:userId/:categoria - Verificar se pode completar registro
router.get('/can-complete/:userId/:categoria', authController.canCompleteRegistration);

// ✨ NOVAS ROTAS: Gestão de usuários
// GET /api/auth/user/:userId - Buscar usuário por ID
router.get('/user/:userId', authController.getUserById);

// GET /api/auth/users/categoria/:categoria - Listar usuários por categoria
router.get('/users/categoria/:categoria', authController.getUsersByCategory);

export default router; 