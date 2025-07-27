import { Router } from 'express';
import { authController } from './auth.controller';

export const authRoutes = Router();

// POST /api/auth/register - Registrar novo usuário
authRoutes.post('/register', authController.register.bind(authController));

// POST /api/auth/login - Login de usuário
authRoutes.post('/login', authController.login.bind(authController)); 