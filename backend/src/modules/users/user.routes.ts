import { Router } from 'express';
import { userController } from './user.controller';
import { uploadUserPhoto } from '../../shared/middleware/upload';

const router = Router();

// Rotas de usuários
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Rota para upload de foto
router.post('/:id/upload-photo', uploadUserPhoto, userController.uploadUserPhoto);

export default router; 