import { Router } from 'express';
import { adminController } from './admin.controller';

const router = Router();

// ✨ ADMIN ROUTES - Endpoints para interface de administração

// ✨ Dashboard Admin
router.get('/stats', adminController.getStats);

// ✨ Gestão de Usuários - Listagem
router.get('/users', adminController.getAllUsers);
router.get('/users/filtered', adminController.getUsersFiltered);
router.get('/users/category/:categoria', adminController.getUsersByCategory);

// ✨ Gestão de Usuários - CRUD individual
router.get('/user/:id/complete', adminController.getUserComplete);
router.put('/user/:id', adminController.updateUser);
router.delete('/user/:id', adminController.deleteUser);

export default router; 