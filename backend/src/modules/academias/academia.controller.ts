import { Request, Response } from 'express';
import { AcademiaService } from './academia.service';
import { 
  CreatePerfilAcademiaRequest, 
  UpdatePerfilAcademiaRequest
} from './academia.types';

const academiaService = new AcademiaService();

export class AcademiaController {
  // POST /api/academias/perfil - Criar perfil de academia
  async createPerfil(req: Request, res: Response) {
    try {
      const data: CreatePerfilAcademiaRequest = req.body;

      // Validações básicas
      if (!data.userId) {
        return res.status(400).json({
          success: false,
          error: 'Campo obrigatório: userId'
        });
      }

      if (!data.nomeAcademia || data.nomeAcademia.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Campo obrigatório: nomeAcademia'
        });
      }

      // Validar campos específicos
      const validationErrors = this.validateAcademiaData(data);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: validationErrors.join(', ')
        });
      }

      const perfil = await academiaService.createPerfil(data);

      res.status(201).json({
        success: true,
        data: perfil,
        message: 'Perfil de academia criado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao criar perfil de academia:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao criar perfil de academia'
      });
    }
  }

  // GET /api/academias/perfil/:userId - Buscar perfil por userId
  async getPerfilByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const perfil = await academiaService.getPerfilByUserId(userId);

      if (!perfil) {
        return res.status(404).json({
          success: false,
          error: 'Perfil de academia não encontrado'
        });
      }

      res.json({
        success: true,
        data: perfil
      });

    } catch (error: any) {
      console.error('Erro ao buscar perfil de academia:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar perfil de academia'
      });
    }
  }

  // PUT /api/academias/perfil/:userId - Atualizar perfil
  async updatePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data: UpdatePerfilAcademiaRequest = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      // Validar campos específicos se fornecidos
      const validationErrors = this.validateAcademiaData(data);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: validationErrors.join(', ')
        });
      }

      const perfil = await academiaService.updatePerfil(userId, data);

      res.json({
        success: true,
        data: perfil,
        message: 'Perfil de academia atualizado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao atualizar perfil de academia:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar perfil de academia'
      });
    }
  }

  // DELETE /api/academias/perfil/:userId - Deletar perfil
  async deletePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      await academiaService.deletePerfil(userId);

      res.json({
        success: true,
        message: 'Perfil de academia deletado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao deletar perfil de academia:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao deletar perfil de academia'
      });
    }
  }

  // GET /api/academias/list - Listar todos os perfis (admin)
  async listPerfis(req: Request, res: Response) {
    try {
      const perfis = await academiaService.listPerfis();

      res.json({
        success: true,
        data: perfis,
        count: perfis.length
      });

    } catch (error: any) {
      console.error('Erro ao listar perfis de academias:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar perfis de academias'
      });
    }
  }

  // GET /api/academias/has-perfil/:userId - Verificar se usuário tem perfil
  async hasPerfilByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const hasPerfil = await academiaService.hasPerfilByUserId(userId);

      res.json({
        success: true,
        data: { hasPerfil }
      });

    } catch (error: any) {
      console.error('Erro ao verificar perfil de academia:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao verificar perfil de academia'
      });
    }
  }

  // Validações específicas para academia
  private validateAcademiaData(data: any): string[] {
    const errors: string[] = [];

    // Nome da academia deve ter pelo menos 2 caracteres se fornecido
    if (data.nomeAcademia && data.nomeAcademia.trim().length < 2) {
      errors.push('Nome da academia deve ter pelo menos 2 caracteres');
    }

    // Pessoa de contacto, se fornecida, deve ter pelo menos 2 caracteres
    if (data.pessoaContacto && data.pessoaContacto.trim().length < 2) {
      errors.push('Pessoa de contacto deve ter pelo menos 2 caracteres');
    }

    // Email institucional deve ter formato válido se fornecido
    if (data.emailInstitucional && data.emailInstitucional.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.emailInstitucional.trim())) {
        errors.push('Email institucional deve ter formato válido');
      }
    }

    // Website deve ser uma URL válida se fornecido
    if (data.website && data.website.trim().length > 0) {
      try {
        new URL(data.website.trim());
      } catch {
        errors.push('Website deve ser uma URL válida (ex: https://exemplo.com)');
      }
    }

    // Observações não podem ser excessivamente longas
    if (data.observacoes && data.observacoes.length > 1000) {
      errors.push('Observações não podem exceder 1000 caracteres');
    }

    // Oferta formativa não pode ser excessivamente longa
    if (data.ofertaFormativa && data.ofertaFormativa.length > 1000) {
      errors.push('Oferta formativa não pode exceder 1000 caracteres');
    }

    return errors;
  }
} 