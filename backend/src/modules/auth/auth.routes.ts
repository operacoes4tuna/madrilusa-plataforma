import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

// POST /api/auth/register - Registrar novo usuário
router.post('/register', authController.register);

// POST /api/auth/login - Login de usuário
router.post('/login', authController.login);

export default router; 