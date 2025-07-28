import { Request, Response } from 'express';
import { MunicipioService } from './municipio.service';
import { 
  CreatePerfilMunicipioRequest, 
  UpdatePerfilMunicipioRequest
} from './municipio.types';

const municipioService = new MunicipioService();

export class MunicipioController {
  // POST /api/municipios/perfil - Criar perfil de município
  async createPerfil(req: Request, res: Response) {
    try {
      const data: CreatePerfilMunicipioRequest = req.body;

      // Validações básicas - todos os campos são opcionais para município
      if (!data.userId) {
        return res.status(400).json({
          success: false,
          error: 'Campo obrigatório: userId'
        });
      }

      // Validar campos específicos
      const validationErrors = this.validateMunicipioData(data);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: validationErrors.join(', ')
        });
      }

      const perfil = await municipioService.createPerfil(data);

      res.status(201).json({
        success: true,
        data: perfil,
        message: 'Perfil de município criado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao criar perfil de município:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao criar perfil de município'
      });
    }
  }

  // GET /api/municipios/perfil/:userId - Buscar perfil por userId
  async getPerfilByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const perfil = await municipioService.getPerfilByUserId(userId);

      if (!perfil) {
        return res.status(404).json({
          success: false,
          error: 'Perfil de município não encontrado'
        });
      }

      res.json({
        success: true,
        data: perfil
      });

    } catch (error: any) {
      console.error('Erro ao buscar perfil de município:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar perfil de município'
      });
    }
  }

  // PUT /api/municipios/perfil/:userId - Atualizar perfil
  async updatePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data: UpdatePerfilMunicipioRequest = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      // Validar campos específicos se fornecidos
      const validationErrors = this.validateMunicipioData(data);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: validationErrors.join(', ')
        });
      }

      const perfil = await municipioService.updatePerfil(userId, data);

      res.json({
        success: true,
        data: perfil,
        message: 'Perfil de município atualizado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao atualizar perfil de município:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar perfil de município'
      });
    }
  }

  // DELETE /api/municipios/perfil/:userId - Deletar perfil
  async deletePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      await municipioService.deletePerfil(userId);

      res.json({
        success: true,
        message: 'Perfil de município deletado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao deletar perfil de município:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao deletar perfil de município'
      });
    }
  }

  // GET /api/municipios/list - Listar todos os perfis (admin)
  async listPerfis(req: Request, res: Response) {
    try {
      const perfis = await municipioService.listPerfis();

      res.json({
        success: true,
        data: perfis,
        count: perfis.length
      });

    } catch (error: any) {
      console.error('Erro ao listar perfis de municípios:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar perfis de municípios'
      });
    }
  }

  // GET /api/municipios/has-perfil/:userId - Verificar se usuário tem perfil
  async hasPerfilByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const hasPerfil = await municipioService.hasPerfilByUserId(userId);

      res.json({
        success: true,
        data: { hasPerfil }
      });

    } catch (error: any) {
      console.error('Erro ao verificar perfil de município:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao verificar perfil de município'
      });
    }
  }

  // Validações específicas para município
  private validateMunicipioData(data: any): string[] {
    const errors: string[] = [];

    // Nome do município, se fornecido, deve ter pelo menos 2 caracteres
    if (data.nomeMunicipio && data.nomeMunicipio.trim().length < 2) {
      errors.push('Nome do município deve ter pelo menos 2 caracteres');
    }

    // Pessoa de contacto, se fornecida, deve ter pelo menos 2 caracteres
    if (data.pessoaContacto && data.pessoaContacto.trim().length < 2) {
      errors.push('Pessoa de contacto deve ter pelo menos 2 caracteres');
    }

    // Função/Cargo, se fornecido, deve ter pelo menos 2 caracteres
    if (data.funcaoCargo && data.funcaoCargo.trim().length < 2) {
      errors.push('Função/Cargo deve ter pelo menos 2 caracteres');
    }

    // Observações não podem ser excessivamente longas
    if (data.observacoes && data.observacoes.length > 1000) {
      errors.push('Observações não podem exceder 1000 caracteres');
    }

    // Projetos de apoio não podem ser excessivamente longos
    if (data.projetosApoio && data.projetosApoio.length > 500) {
      errors.push('Projetos de apoio não podem exceder 500 caracteres');
    }

    return errors;
  }
} 