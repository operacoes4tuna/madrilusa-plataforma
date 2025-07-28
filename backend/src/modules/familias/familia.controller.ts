import { Request, Response } from 'express';
import { FamiliaService } from './familia.service';
import { 
  CreatePerfilFamiliaRequest, 
  UpdatePerfilFamiliaRequest
} from './familia.types';

const familiaService = new FamiliaService();

export class FamiliaController {
  // POST /api/familias/perfil - Criar perfil de família
  async createPerfil(req: Request, res: Response) {
    try {
      const data: CreatePerfilFamiliaRequest = req.body;

      // Validações básicas
      if (!data.userId) {
        return res.status(400).json({
          success: false,
          error: 'Campo obrigatório: userId'
        });
      }

      if (!data.moradaCompleta || data.moradaCompleta.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Campo obrigatório: moradaCompleta'
        });
      }

      // Validar campos específicos
      const validationErrors = this.validateFamiliaData(data);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: validationErrors.join(', ')
        });
      }

      const perfil = await familiaService.createPerfil(data);

      res.status(201).json({
        success: true,
        data: perfil,
        message: 'Perfil de família criado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao criar perfil de família:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao criar perfil de família'
      });
    }
  }

  // GET /api/familias/perfil/:userId - Buscar perfil por userId
  async getPerfilByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const perfil = await familiaService.getPerfilByUserId(userId);

      if (!perfil) {
        return res.status(404).json({
          success: false,
          error: 'Perfil de família não encontrado'
        });
      }

      res.json({
        success: true,
        data: perfil
      });

    } catch (error: any) {
      console.error('Erro ao buscar perfil de família:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar perfil de família'
      });
    }
  }

  // PUT /api/familias/perfil/:userId - Atualizar perfil
  async updatePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data: UpdatePerfilFamiliaRequest = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      // Validar campos específicos se fornecidos
      const validationErrors = this.validateFamiliaData(data);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: validationErrors.join(', ')
        });
      }

      const perfil = await familiaService.updatePerfil(userId, data);

      res.json({
        success: true,
        data: perfil,
        message: 'Perfil de família atualizado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao atualizar perfil de família:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar perfil de família'
      });
    }
  }

  // DELETE /api/familias/perfil/:userId - Deletar perfil
  async deletePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      await familiaService.deletePerfil(userId);

      res.json({
        success: true,
        message: 'Perfil de família deletado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao deletar perfil de família:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao deletar perfil de família'
      });
    }
  }

  // GET /api/familias/list - Listar todos os perfis (admin)
  async listPerfis(req: Request, res: Response) {
    try {
      const perfis = await familiaService.listPerfis();

      res.json({
        success: true,
        data: perfis,
        count: perfis.length
      });

    } catch (error: any) {
      console.error('Erro ao listar perfis de famílias:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar perfis de famílias'
      });
    }
  }

  // GET /api/familias/has-perfil/:userId - Verificar se usuário tem perfil
  async hasPerfilByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const hasPerfil = await familiaService.hasPerfilByUserId(userId);

      res.json({
        success: true,
        data: { hasPerfil }
      });

    } catch (error: any) {
      console.error('Erro ao verificar perfil de família:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao verificar perfil de família'
      });
    }
  }

  // Validações específicas para família
  private validateFamiliaData(data: any): string[] {
    const errors: string[] = [];

    // Morada completa deve ter pelo menos 10 caracteres se fornecida
    if (data.moradaCompleta && data.moradaCompleta.trim().length < 10) {
      errors.push('Morada completa deve ter pelo menos 10 caracteres');
    }

    // Quantidade de pessoas deve ter formato razoável se fornecida
    if (data.quantidadePessoas && data.quantidadePessoas.trim().length > 0) {
      if (data.quantidadePessoas.trim().length < 3) {
        errors.push('Quantidade de pessoas deve ter pelo menos 3 caracteres');
      }
      if (data.quantidadePessoas.length > 100) {
        errors.push('Quantidade de pessoas não pode exceder 100 caracteres');
      }
    }

    // Tipos de acolhimento não podem ser excessivamente longos
    if (data.tiposAcolhimento && data.tiposAcolhimento.length > 500) {
      errors.push('Tipos de acolhimento não podem exceder 500 caracteres');
    }

    // Duração do acolhimento não pode ser excessivamente longa
    if (data.duracaoAcolhimento && data.duracaoAcolhimento.length > 300) {
      errors.push('Duração do acolhimento não pode exceder 300 caracteres');
    }

    // Observações não podem ser excessivamente longas
    if (data.observacoes && data.observacoes.length > 1000) {
      errors.push('Observações não podem exceder 1000 caracteres');
    }

    return errors;
  }
} 