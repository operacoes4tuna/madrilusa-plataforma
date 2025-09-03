import { Request, Response } from 'express';
import { contribuicoesService } from './contribuicoes.service';
import { 
  CreateContribuicaoRequest,
  UpdateContribuicaoRequest,
  CreateTipoContribuicaoRequest,
  UpdateTipoContribuicaoRequest,
  CreateTagSistemaRequest,
  UpdateTagSistemaRequest
} from '../../../shared-types/api.types';

export const contribuicoesController = {
  // ===== CONTRIBUIÇÕES DOS USUÁRIOS =====

  async createContribuicao(req: Request, res: Response) {
    try {
      const data: CreateContribuicaoRequest = req.body;
      const userId = req.params.userId || req.body.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      if (!data.tipoContribuicaoId || !data.descricao) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de contribuição e descrição são obrigatórios'
        });
      }

      const contribuicao = await contribuicoesService.createContribuicao({
        userId,
        tipoContribuicaoId: data.tipoContribuicaoId,
        descricao: data.descricao,
        tags: data.tags
      });

      res.status(201).json({
        success: true,
        data: contribuicao,
        message: 'Contribuição criada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar contribuição:', error);
      
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

  async getMinhasContribuicoes(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const contribuicoes = await contribuicoesService.getContribuicoesByUser(userId);

      res.json({
        success: true,
        data: contribuicoes,
        message: 'Contribuições obtidas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar contribuições:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async getContribuicaoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.query.userId as string;

      const contribuicao = await contribuicoesService.getContribuicaoById(id, userId);

      if (!contribuicao) {
        return res.status(404).json({
          success: false,
          error: 'Contribuição não encontrada'
        });
      }

      res.json({
        success: true,
        data: contribuicao,
        message: 'Contribuição obtida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar contribuição:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async updateContribuicao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.body.userId || req.params.userId;
      const data: UpdateContribuicaoRequest = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const contribuicao = await contribuicoesService.updateContribuicao(id, userId, data);

      res.json({
        success: true,
        data: contribuicao,
        message: 'Contribuição atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar contribuição:', error);
      
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

  async deleteContribuicao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.body.userId || req.query.userId as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      await contribuicoesService.deleteContribuicao(id, userId);

      res.json({
        success: true,
        message: 'Contribuição removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover contribuição:', error);
      
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

  async getContribuicoesPublicas(req: Request, res: Response) {
    try {
      const filters = {
        categoria: req.query.categoria as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined
      };

      const contribuicoes = await contribuicoesService.getContribuicoesPublicas(filters);

      res.json({
        success: true,
        data: contribuicoes,
        message: 'Contribuições públicas obtidas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar contribuições públicas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Buscar todas as contribuições unificadas (normais + dados profissionais)
  async getTodasContribuicoes(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const contribuicoesUnificadas = await contribuicoesService.getContribuicoesUnificadas(userId);

      res.json({
        success: true,
        data: contribuicoesUnificadas,
        message: `${contribuicoesUnificadas.length} contribuições encontradas`
      });
    } catch (error) {
      console.error('Erro ao buscar contribuições unificadas:', error);
      
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

  // ===== TIPOS DE CONTRIBUIÇÃO =====

  async getTiposDisponiveis(req: Request, res: Response) {
    try {
      const categoria = req.query.categoria as string;
      const tipos = await contribuicoesService.getTiposContribuicao(categoria);

      res.json({
        success: true,
        data: tipos,
        message: 'Tipos de contribuição obtidos com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar tipos de contribuição:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // ===== TAGS =====

  async getTags(req: Request, res: Response) {
    try {
      const tags = await contribuicoesService.getTagsSistema();

      res.json({
        success: true,
        data: tags,
        message: 'Tags obtidas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // ===== HELPERS PARA USUÁRIOS =====

  async getTiposParaUsuario(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      // Buscar categoria do usuário
      const user = await contribuicoesService.getUserById?.(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      // Buscar tipos disponíveis para a categoria do usuário
      const tipos = await contribuicoesService.getTiposContribuicao(user.categoria);

      res.json({
        success: true,
        data: tipos,
        message: 'Tipos disponíveis obtidos com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar tipos para usuário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async getContribuicoesPorTipo(req: Request, res: Response) {
    try {
      const { userId, tipoId } = req.params;

      // Validar usuário
      const user = await contribuicoesService.getUserById?.(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      // Validar tipo de contribuição
      const tipo = await contribuicoesService.getTipoContribuicaoById(tipoId);
      if (!tipo) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de contribuição não encontrado'
        });
      }

      // Verificar se o tipo pertence à categoria do usuário
      if (tipo.categoria !== user.categoria) {
        return res.status(403).json({
          success: false,
          error: 'Tipo de contribuição não disponível para sua categoria'
        });
      }

      // Buscar contribuições específicas deste tipo
      const contribuicoes = await contribuicoesService.getContribuicoesByUserAndTipo(userId, tipoId);

      res.json({
        success: true,
        data: {
          tipo,
          contribuicoes
        },
        message: 'Contribuições por tipo obtidas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar contribuições por tipo:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async getTipoDetalhes(req: Request, res: Response) {
    try {
      const { tipoId } = req.params;

      const tipo = await contribuicoesService.getTipoContribuicaoById(tipoId);
      if (!tipo) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de contribuição não encontrado'
        });
      }

      res.json({
        success: true,
        data: tipo,
        message: 'Detalhes do tipo obtidos com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes do tipo:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async getContribuicoesComTipo(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const contribuicoes = await contribuicoesService.getContribuicoesByUser(userId);

      // Adicionar informações do tipo para cada contribuição
      const contribuicoesFormatadas = contribuicoes.map(contrib => ({
        ...contrib,
        tags: contrib.tags ? JSON.parse(contrib.tags) : [],
        tagsModelo: contrib.tipoContribuicao?.tagsModelo 
          ? JSON.parse(contrib.tipoContribuicao.tagsModelo) 
          : []
      }));

      res.json({
        success: true,
        data: contribuicoesFormatadas,
        message: 'Contribuições obtidas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar contribuições formatadas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
};
