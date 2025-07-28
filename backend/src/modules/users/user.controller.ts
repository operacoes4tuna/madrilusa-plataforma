import { Request, Response } from 'express';
import { userService } from './user.service';
import type { UpdateUserRequest } from '../../../shared-types/api.types';

export const userController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'Usuário não encontrado' 
        });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateUserRequest = req.body;

      const updatedUser = await userService.updateUser(id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ 
          success: false, 
          error: 'Usuário não encontrado' 
        });
      }

      res.json({ success: true, data: updatedUser });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      if (error instanceof Error && error.message.includes('email')) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email já está em uso' 
        });
      }

      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const deleted = await userService.deleteUser(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          error: 'Usuário não encontrado' 
        });
      }

      res.json({ success: true, message: 'Usuário removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  },

  async uploadUserPhoto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum arquivo foi enviado'
        });
      }

      // Construir URL da foto
      const fotoUrl = `/uploads/${req.file.filename}`;
      
      // Atualizar usuário com a nova foto
      const updatedUser = await userService.updateUser(id, { foto: fotoUrl });
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: updatedUser,
        message: 'Foto enviada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}; 