import { Request, Response } from 'express';
import { oportunidadesTrabalhoService } from './oportunidades-trabalho.service';
import type {
  CreateOportunidadeTrabalhoRequest,
  UpdateOportunidadeTrabalhoRequest
} from '../../../shared-types/api.types';

export const oportunidadesTrabalhoController = {
  // Criar nova oportunidade
  async createOportunidade(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data: CreateOportunidadeTrabalhoRequest = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID da empresa é obrigatório'
        });
      }

      if (!data.nomeCargo) {
        return res.status(400).json({
          success: false,
          error: 'Nome do cargo é obrigatório'
        });
      }

      const oportunidade = await oportunidadesTrabalhoService.create({
        userId,
        ...data
      });

      res.status(201).json({
        success: true,
        data: oportunidade,
        message: 'Oportunidade de trabalho criada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
      
      if (error instanceof Error) {
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

  // Buscar oportunidades da empresa
  async getMinhasOportunidades(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { ativo, genero, municipio, transporte, portugues, escolaridade } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID da empresa é obrigatório'
        });
      }

      const filters: any = {};
      if (ativo !== undefined) filters.ativo = ativo === 'true';
      if (genero) filters.genero = genero;
      if (municipio) filters.municipio = municipio as string;
      if (transporte) filters.transporteProprio = transporte;
      if (portugues) filters.fluenciaPortugues = portugues;
      if (escolaridade) filters.nivelEscolaridade = escolaridade;

      const oportunidades = await oportunidadesTrabalhoService.getByEmpresa(userId, filters);

      res.json({
        success: true,
        data: oportunidades,
        message: `${oportunidades.length} oportunidades encontradas`
      });
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Buscar oportunidade por ID
  async getOportunidadeById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID da oportunidade é obrigatório'
        });
      }

      const oportunidade = await oportunidadesTrabalhoService.getById(id);

      res.json({
        success: true,
        data: oportunidade
      });
    } catch (error) {
      console.error('Erro ao buscar oportunidade:', error);
      
      if (error instanceof Error) {
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

  // Atualizar oportunidade
  async updateOportunidade(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.body.userId || req.params.userId;
      const data: UpdateOportunidadeTrabalhoRequest = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID da oportunidade é obrigatório'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID da empresa é obrigatório'
        });
      }

      const oportunidadeAtualizada = await oportunidadesTrabalhoService.update(id, userId, data);

      res.json({
        success: true,
        data: oportunidadeAtualizada,
        message: 'Oportunidade atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar oportunidade:', error);
      
      if (error instanceof Error) {
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

  // Deletar oportunidade
  async deleteOportunidade(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.body.userId || req.params.userId;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID da oportunidade é obrigatório'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID da empresa é obrigatório'
        });
      }

      await oportunidadesTrabalhoService.delete(id, userId);

      res.json({
        success: true,
        message: 'Oportunidade eliminada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar oportunidade:', error);
      
      if (error instanceof Error) {
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

  // Alternar status ativo/inativo
  async toggleStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId, ativo } = req.body;

      if (!id || !userId || ativo === undefined) {
        return res.status(400).json({
          success: false,
          error: 'ID da oportunidade, ID da empresa e status são obrigatórios'
        });
      }

      const oportunidadeAtualizada = await oportunidadesTrabalhoService.toggleStatus(id, userId, ativo);

      res.json({
        success: true,
        data: oportunidadeAtualizada,
        message: `Oportunidade ${ativo ? 'ativada' : 'inativada'} com sucesso`
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      
      if (error instanceof Error) {
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

  // Duplicar oportunidade
  async duplicateOportunidade(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!id || !userId) {
        return res.status(400).json({
          success: false,
          error: 'ID da oportunidade e ID da empresa são obrigatórios'
        });
      }

      const oportunidadeDuplicada = await oportunidadesTrabalhoService.duplicate(id, userId);

      res.status(201).json({
        success: true,
        data: oportunidadeDuplicada,
        message: 'Oportunidade duplicada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao duplicar oportunidade:', error);
      
      if (error instanceof Error) {
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

  // Estatísticas da empresa
  async getStatsEmpresa(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID da empresa é obrigatório'
        });
      }

      const stats = await oportunidadesTrabalhoService.getStatsEmpresa(userId);

      res.json({
        success: true,
        data: stats,
        message: 'Estatísticas obtidas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Endpoints administrativos
  async getAllForAdmin(req: Request, res: Response) {
    try {
      const { ativo, genero, municipio, transporte, portugues, escolaridade, limit, offset } = req.query;

      const filters: any = {};
      if (ativo !== undefined) filters.ativo = ativo === 'true';
      if (genero) filters.genero = genero;
      if (municipio) filters.municipio = municipio as string;
      if (transporte) filters.transporteProprio = transporte;
      if (portugues) filters.fluenciaPortugues = portugues;
      if (escolaridade) filters.nivelEscolaridade = escolaridade;
      if (limit) filters.limit = parseInt(limit as string);
      if (offset) filters.offset = parseInt(offset as string);

      const result = await oportunidadesTrabalhoService.getAllForAdmin(filters);

      res.json({
        success: true,
        data: result.oportunidades,
        total: result.total,
        hasMore: result.hasMore,
        message: `${result.oportunidades.length} oportunidades encontradas`
      });
    } catch (error) {
      console.error('Erro ao buscar oportunidades para admin:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async getStatsForAdmin(req: Request, res: Response) {
    try {
      const stats = await oportunidadesTrabalhoService.getStatsGeral();

      res.json({
        success: true,
        data: stats,
        message: 'Estatísticas gerais obtidas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas gerais:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
};
