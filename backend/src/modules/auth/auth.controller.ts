import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../../../shared-types/api.types';
import { RegisterRequest, LoginRequest } from './auth.types';

export class AuthController {
  
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: RegisterRequest = req.body;
      
      // Validação básica
      if (!userData.nomeCompleto || !userData.email || !userData.senha) {
        return res.status(400).json({
          success: false,
          error: 'Nome completo, email e senha são obrigatórios'
        });
      }

      // Validação de email básica
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return res.status(400).json({
          success: false,
          error: 'Email inválido'
        });
      }

      const user = await authService.register(userData);
      
      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'Usuário registrado com sucesso'
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginRequest = req.body;
      
      // Validação básica
      if (!loginData.email || !loginData.senha) {
        return res.status(400).json({
          success: false,
          error: 'Email e senha são obrigatórios'
        });
      }

      const user = await authService.login(loginData);
      
      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'Login realizado com sucesso'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController(); 