import { Request, Response } from 'express';
import { authService } from './auth.service';
import type { 
  RegisterRequest, 
  LoginRequest, 
  RegisterBasicRequest 
} from '../../../shared-types/api.types';

export const authController = {
  // ✅ Método existente - Registro simples (mantido para compatibilidade)
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

  // ✨ NOVO: Registro básico - Etapa 1 do fluxo em 2 etapas
  async registerBasic(req: Request, res: Response) {
    try {
      const data: RegisterBasicRequest = req.body;

      // Validação básica
      if (!data.nomeCompleto || !data.email || !data.senha || !data.categoria) {
        return res.status(400).json({
          success: false,
          error: 'Nome completo, email, senha e categoria são obrigatórios'
        });
      }

      // Validar categoria
      if (!authService.isValidCategory(data.categoria)) {
        return res.status(400).json({
          success: false,
          error: 'Categoria inválida. Opções: IMIGRANTE, EMPRESA, MUNICIPIO, ACADEMIA, FAMILIA_ACOLHIMENTO'
        });
      }

      const result = await authService.registerBasic(data);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Etapa 1 do registro concluída. Prossiga com dados específicos da categoria.'
      });
    } catch (error) {
      console.error('Erro no registro básico:', error);
      
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

  // ✨ NOVO: Verificar se pode completar registro
  async canCompleteRegistration(req: Request, res: Response) {
    try {
      const { userId, categoria } = req.params;

      if (!userId || !categoria) {
        return res.status(400).json({
          success: false,
          error: 'UserId e categoria são obrigatórios'
        });
      }

      const canComplete = await authService.canCompleteRegistration(userId, categoria);

      res.json({
        success: true,
        data: { canComplete }
      });
    } catch (error) {
      console.error('Erro ao verificar possibilidade de completar registro:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // ✅ Método existente - Login (mantido)
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
  },

  // ✨ NOVO: Buscar usuário por ID
  async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const user = await authService.getUserById(userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return res.status(404).json({
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

  // ✨ NOVO: Listar usuários por categoria
  async getUsersByCategory(req: Request, res: Response) {
    try {
      const { categoria } = req.params;

      if (!categoria) {
        return res.status(400).json({
          success: false,
          error: 'Categoria é obrigatória'
        });
      }

      const users = await authService.getUsersByCategory(categoria);

      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Erro ao listar usuários por categoria:', error);
      
      if (error instanceof Error && error.message.includes('inválida')) {
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
  }
}; 