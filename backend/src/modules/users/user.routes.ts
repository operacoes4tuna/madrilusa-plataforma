import { Router } from 'express';
import { userController } from './user.controller';

export const userRoutes = Router();

// GET /api/users - Listar todos os usuários
userRoutes.get('/', userController.findAll.bind(userController));

// GET /api/users/:id - Buscar usuário por ID
userRoutes.get('/:id', userController.findById.bind(userController));

// POST /api/users - Criar novo usuário
userRoutes.post('/', userController.create.bind(userController));

// PUT /api/users/:id - Atualizar usuário
userRoutes.put('/:id', userController.update.bind(userController));

// DELETE /api/users/:id - Deletar usuário
userRoutes.delete('/:id', userController.delete.bind(userController)); 