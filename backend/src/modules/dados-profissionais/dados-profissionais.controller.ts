import { Request, Response } from 'express';
import { dadosProfissionaisService } from './dados-profissionais.service';
import type {
  CreateDadoProfissionalRequest,
  UpdateDadoProfissionalRequest
} from '../../../shared-types/api.types';

export const dadosProfissionaisController = {
  // Criar novo dado profissional
  async createDado(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data: CreateDadoProfissionalRequest = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      if (!data.tipo || !data.dados) {
        return res.status(400).json({
          success: false,
          error: 'Tipo e dados são obrigatórios'
        });
      }

      const dadoProfissional = await dadosProfissionaisService.create({
        userId,
        tipo: data.tipo,
        dados: data.dados,
        ordem: data.ordem
      });

      res.status(201).json({
        success: true,
        data: dadoProfissional,
        message: 'Dado profissional criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar dado profissional:', error);
      
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

  // Buscar dados profissionais do usuário
  async getMeusDados(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { tipo, ativo } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const filters: any = {};
      if (tipo) filters.tipo = tipo;
      if (ativo !== undefined) filters.ativo = ativo === 'true';

      const dados = await dadosProfissionaisService.getByUser(userId, filters);

      res.json({
        success: true,
        data: dados,
        message: `${dados.length} dados profissionais encontrados`
      });
    } catch (error) {
      console.error('Erro ao buscar dados profissionais:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Buscar dado profissional por ID
  async getDadoById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID do dado é obrigatório'
        });
      }

      const dado = await dadosProfissionaisService.getById(id);

      res.json({
        success: true,
        data: dado
      });
    } catch (error) {
      console.error('Erro ao buscar dado profissional:', error);
      
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

  // Atualizar dado profissional
  async updateDado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.body.userId || req.params.userId;
      const data: UpdateDadoProfissionalRequest = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID do dado é obrigatório'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const dadoAtualizado = await dadosProfissionaisService.update(id, userId, data);

      res.json({
        success: true,
        data: dadoAtualizado,
        message: 'Dado profissional atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar dado profissional:', error);
      
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

  // Deletar dado profissional
  async deleteDado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.body.userId || req.params.userId;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID do dado é obrigatório'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      await dadosProfissionaisService.delete(id, userId);

      res.json({
        success: true,
        message: 'Dado profissional eliminado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar dado profissional:', error);
      
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

  // Endpoints específicos por tipo
  async getExperiencias(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const experiencias = await dadosProfissionaisService.getExperiencias(userId);

      res.json({
        success: true,
        data: experiencias,
        message: `${experiencias.length} experiências encontradas`
      });
    } catch (error) {
      console.error('Erro ao buscar experiências:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async getFormacoes(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const formacoes = await dadosProfissionaisService.getFormacoes(userId);

      res.json({
        success: true,
        data: formacoes,
        message: `${formacoes.length} formações encontradas`
      });
    } catch (error) {
      console.error('Erro ao buscar formações:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async getIdiomas(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const idiomas = await dadosProfissionaisService.getIdiomas(userId);

      res.json({
        success: true,
        data: idiomas,
        message: `${idiomas.length} idiomas encontrados`
      });
    } catch (error) {
      console.error('Erro ao buscar idiomas:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Reordenar dados
  async reorderDados(req: Request, res: Response) {
    try {
      const { userId, tipo } = req.params;
      const { newOrder } = req.body;

      if (!userId || !tipo) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário e tipo são obrigatórios'
        });
      }

      if (!Array.isArray(newOrder)) {
        return res.status(400).json({
          success: false,
          error: 'Nova ordem deve ser um array de IDs'
        });
      }

      await dadosProfissionaisService.reorderDados(userId, tipo as any, newOrder);

      res.json({
        success: true,
        message: 'Ordem atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao reordenar dados:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Endpoints administrativos
  async getAllForAdmin(req: Request, res: Response) {
    try {
      const { tipo, ativo, userId, limit, offset } = req.query;

      const filters: any = {};
      if (tipo) filters.tipo = tipo;
      if (ativo !== undefined) filters.ativo = ativo === 'true';
      if (userId) filters.userId = userId as string;
      if (limit) filters.limit = parseInt(limit as string);
      if (offset) filters.offset = parseInt(offset as string);

      const result = await dadosProfissionaisService.getAllForAdmin(filters);

      res.json({
        success: true,
        data: result.dados,
        total: result.total,
        hasMore: result.hasMore,
        message: `${result.dados.length} dados profissionais encontrados`
      });
    } catch (error) {
      console.error('Erro ao buscar dados para admin:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async getStatsForAdmin(req: Request, res: Response) {
    try {
      const stats = await dadosProfissionaisService.getStats();

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
  }
};
