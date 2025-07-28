import { Request, Response } from 'express';
import { EmpresaService } from './empresa.service';
import { 
  CreatePerfilEmpresaRequest, 
  UpdatePerfilEmpresaRequest
} from './empresa.types';

const empresaService = new EmpresaService();

export class EmpresaController {
  // POST /api/empresas/perfil - Criar perfil de empresa
  async createPerfil(req: Request, res: Response) {
    try {
      const data: CreatePerfilEmpresaRequest = req.body;

      // Validações básicas
      if (!data.userId || !data.nomeEmpresa) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios: userId, nomeEmpresa'
        });
      }

      // Validar campos específicos
      const validationErrors = this.validateEmpresaData(data);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: validationErrors.join(', ')
        });
      }

      const perfil = await empresaService.createPerfil(data);

      res.status(201).json({
        success: true,
        data: perfil,
        message: 'Perfil de empresa criado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao criar perfil de empresa:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao criar perfil de empresa'
      });
    }
  }

  // GET /api/empresas/perfil/:userId - Buscar perfil por userId
  async getPerfilByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const perfil = await empresaService.getPerfilByUserId(userId);

      if (!perfil) {
        return res.status(404).json({
          success: false,
          error: 'Perfil de empresa não encontrado'
        });
      }

      res.json({
        success: true,
        data: perfil
      });

    } catch (error: any) {
      console.error('Erro ao buscar perfil de empresa:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar perfil de empresa'
      });
    }
  }

  // PUT /api/empresas/perfil/:userId - Atualizar perfil
  async updatePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data: UpdatePerfilEmpresaRequest = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      // Validar campos específicos se fornecidos
      const validationErrors = this.validateEmpresaData(data);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: validationErrors.join(', ')
        });
      }

      const perfil = await empresaService.updatePerfil(userId, data);

      res.json({
        success: true,
        data: perfil,
        message: 'Perfil de empresa atualizado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao atualizar perfil de empresa:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar perfil de empresa'
      });
    }
  }

  // DELETE /api/empresas/perfil/:userId - Deletar perfil
  async deletePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      await empresaService.deletePerfil(userId);

      res.json({
        success: true,
        message: 'Perfil de empresa deletado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao deletar perfil de empresa:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao deletar perfil de empresa'
      });
    }
  }

  // GET /api/empresas/list - Listar todos os perfis (admin)
  async listPerfis(req: Request, res: Response) {
    try {
      const perfis = await empresaService.listPerfis();

      res.json({
        success: true,
        data: perfis,
        count: perfis.length
      });

    } catch (error: any) {
      console.error('Erro ao listar perfis de empresas:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar perfis de empresas'
      });
    }
  }

  // GET /api/empresas/has-perfil/:userId - Verificar se usuário tem perfil
  async hasPerfilByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const hasPerfil = await empresaService.hasPerfilByUserId(userId);

      res.json({
        success: true,
        data: { hasPerfil }
      });

    } catch (error: any) {
      console.error('Erro ao verificar perfil de empresa:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao verificar perfil de empresa'
      });
    }
  }

  // Validações específicas para empresa
  private validateEmpresaData(data: any): string[] {
    const errors: string[] = [];

    // Nome da empresa deve ter pelo menos 2 caracteres
    if (data.nomeEmpresa && data.nomeEmpresa.trim().length < 2) {
      errors.push('Nome da empresa deve ter pelo menos 2 caracteres');
    }

    // Pessoa de contacto, se fornecida, deve ter pelo menos 2 caracteres
    if (data.pessoaContacto && data.pessoaContacto.trim().length < 2) {
      errors.push('Pessoa de contacto deve ter pelo menos 2 caracteres');
    }

    // Observações não podem ser excessivamente longas
    if (data.observacoes && data.observacoes.length > 1000) {
      errors.push('Observações não podem exceder 1000 caracteres');
    }

    return errors;
  }
} 