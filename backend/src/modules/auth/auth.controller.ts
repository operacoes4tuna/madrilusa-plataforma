import { Request, Response } from 'express';
import { authService } from './auth.service';
import type { RegisterRequest, LoginRequest } from '../../../shared-types/api.types';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const data: RegisterRequest = req.body;

      // Validação básica
      if (!data.nomeCompleto || !data.email || !data.senha) {
        return res.status(400).json({
          success: false,
          error: 'Nome completo, email e senha são obrigatórios'
        });
      }

      const user = await authService.register(data);

      res.status(201).json({
        success: true,
        data: user,
        message: 'Usuário registrado com sucesso'
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      
      if (error instanceof Error && error.message.includes('já está em uso')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const data: LoginRequest = req.body;

      // Validação básica
      if (!data.email || !data.senha) {
        return res.status(400).json({
          success: false,
          error: 'Email e senha são obrigatórios'
        });
      }

      const user = await authService.login(data);

      res.json({
        success: true,
        data: user,
        message: 'Login realizado com sucesso'
      });
    } catch (error) {
      console.error('Erro no login:', error);
      
      if (error instanceof Error && error.message.includes('Credenciais inválidas')) {
        return res.status(401).json({
          success: false,
          error: 'Email ou senha incorretos'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}; 