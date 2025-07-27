import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { ApiResponse } from '../../../../shared-types/api.types';
import { CreateUserRequest, UpdateUserRequest } from './user.types';

export class UserController {
  
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserRequest = req.body;
      
      // Validação básica
      if (!userData.nomeCompleto || !userData.email || !userData.senha) {
        return res.status(400).json({
          success: false,
          error: 'Nome completo, email e senha são obrigatórios'
        });
      }

      const user = await userService.create(userData);
      
      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'Usuário criado com sucesso'
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.findAll();
      
      const response: ApiResponse = {
        success: true,
        data: users
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      const response: ApiResponse = {
        success: true,
        data: user
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userData: UpdateUserRequest = req.body;
      
      const user = await userService.update(id, userData);
      
      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'Usuário atualizado com sucesso'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await userService.delete(id);
      
      const response: ApiResponse = {
        success: true,
        message: 'Usuário deletado com sucesso'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController(); 