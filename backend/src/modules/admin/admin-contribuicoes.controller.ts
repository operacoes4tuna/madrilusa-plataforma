import { Request, Response } from 'express';
import { contribuicoesService } from '../contribuicoes/contribuicoes.service';
import { 
  CreateTipoContribuicaoRequest,
  UpdateTipoContribuicaoRequest,
  CreateTagSistemaRequest,
  UpdateTagSistemaRequest
} from '../../../shared-types/api.types';

export const adminContribuicoesController = {
  // ===== GESTÃO DE TIPOS DE CONTRIBUIÇÃO =====

  async getAllTiposContribuicao(req: Request, res: Response) {
    try {
      const tipos = await contribuicoesService.getTiposContribuicao();

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

  async createTipoContribuicao(req: Request, res: Response) {
    try {
      const data: CreateTipoContribuicaoRequest = req.body;

      // Validações básicas
      if (!data.titulo || !data.categoria) {
        return res.status(400).json({
          success: false,
          error: 'Título e categoria são obrigatórios'
        });
      }

      // Verificar se já existe tipo com mesmo título e categoria
      const existing = await contribuicoesService.getTiposContribuicao(data.categoria);
      const duplicate = existing.find(tipo => 
        tipo.titulo.toLowerCase() === data.titulo.toLowerCase()
      );

      if (duplicate) {
        return res.status(400).json({
          success: false,
          error: 'Já existe um tipo de contribuição com este título para esta categoria'
        });
      }

      const tipo = await contribuicoesService.createTipoContribuicao({
        titulo: data.titulo,
        categoria: data.categoria,
        contextoIA: data.contextoIA,
        textoModelo: data.textoModelo,
        tagsModelo: data.tagsModelo,
        perguntasModelo: data.perguntasModelo
      });

      res.status(201).json({
        success: true,
        data: tipo,
        message: 'Tipo de contribuição criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar tipo de contribuição:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async updateTipoContribuicao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateTipoContribuicaoRequest = req.body;

      // Verificar se o tipo existe
      const existing = await contribuicoesService.getTipoContribuicaoById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de contribuição não encontrado'
        });
      }

      // Verificar duplicatas se título ou categoria mudaram
      if (data.titulo || data.categoria) {
        const categoria = data.categoria || existing.categoria;
        const titulo = data.titulo || existing.titulo;
        
        const tipos = await contribuicoesService.getTiposContribuicao(categoria);
        const duplicate = tipos.find(tipo => 
          tipo.id !== id && 
          tipo.titulo.toLowerCase() === titulo.toLowerCase()
        );

        if (duplicate) {
          return res.status(400).json({
            success: false,
            error: 'Já existe um tipo de contribuição com este título para esta categoria'
          });
        }
      }

      const tipo = await contribuicoesService.updateTipoContribuicao(id, data);

      res.json({
        success: true,
        data: tipo,
        message: 'Tipo de contribuição atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar tipo de contribuição:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async deleteTipoContribuicao(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se o tipo existe
      const existing = await contribuicoesService.getTipoContribuicaoById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de contribuição não encontrado'
        });
      }

      await contribuicoesService.deleteTipoContribuicao(id);

      res.json({
        success: true,
        message: 'Tipo de contribuição removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover tipo de contribuição:', error);
      
      if (error instanceof Error && error.message.includes('sendo usado')) {
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

  // ===== GESTÃO DE TAGS =====

  async getAllTags(req: Request, res: Response) {
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

  async createTag(req: Request, res: Response) {
    try {
      const data: CreateTagSistemaRequest = req.body;

      // Validações básicas
      if (!data.nome) {
        return res.status(400).json({
          success: false,
          error: 'Nome da tag é obrigatório'
        });
      }

      // Normalizar nome da tag
      const nomeNormalizado = data.nome.trim();
      
      if (nomeNormalizado.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Nome da tag deve ter pelo menos 2 caracteres'
        });
      }

      const tag = await contribuicoesService.createTagSistema({
        nome: nomeNormalizado,
        cor: data.cor,
        categoria: data.categoria
      });

      res.status(201).json({
        success: true,
        data: tag,
        message: 'Tag criada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      
      // Erro de unique constraint
      if (error instanceof Error && error.message.includes('unique')) {
        return res.status(400).json({
          success: false,
          error: 'Já existe uma tag com este nome'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async updateTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateTagSistemaRequest = req.body;

      // Verificar se a tag existe
      const existing = await contribuicoesService.getTagsSistema();
      const tag = existing.find(t => t.id === id);
      
      if (!tag) {
        return res.status(404).json({
          success: false,
          error: 'Tag não encontrada'
        });
      }

      // Normalizar nome se fornecido
      if (data.nome) {
        data.nome = data.nome.trim();
        if (data.nome.length < 2) {
          return res.status(400).json({
            success: false,
            error: 'Nome da tag deve ter pelo menos 2 caracteres'
          });
        }
      }

      const updatedTag = await contribuicoesService.updateTagSistema(id, data);

      res.json({
        success: true,
        data: updatedTag,
        message: 'Tag atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar tag:', error);
      
      if (error instanceof Error && error.message.includes('unique')) {
        return res.status(400).json({
          success: false,
          error: 'Já existe uma tag com este nome'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  async deleteTag(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se a tag existe
      const existing = await contribuicoesService.getTagsSistema();
      const tag = existing.find(t => t.id === id);
      
      if (!tag) {
        return res.status(404).json({
          success: false,
          error: 'Tag não encontrada'
        });
      }

      // Avisar se a tag está sendo usada
      if (tag.usos > 0) {
        return res.status(400).json({
          success: false,
          error: `Esta tag está sendo usada em ${tag.usos} contribuição(ões). Remova das contribuições primeiro.`
        });
      }

      await contribuicoesService.deleteTagSistema(id);

      res.json({
        success: true,
        message: 'Tag removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover tag:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // ===== ESTATÍSTICAS =====

  async getContribuicoesStats(req: Request, res: Response) {
    try {
      // Buscar estatísticas básicas
      const [tipos, tags, contribuicoes] = await Promise.all([
        contribuicoesService.getTiposContribuicao(),
        contribuicoesService.getTagsSistema(),
        contribuicoesService.getContribuicoesPublicas()
      ]);

      // Calcular estatísticas por categoria
      const statsPorCategoria: Record<string, any> = {};
      
      tipos.forEach(tipo => {
        if (!statsPorCategoria[tipo.categoria]) {
          statsPorCategoria[tipo.categoria] = {
            categoria: tipo.categoria,
            tiposDisponiveis: 0,
            contribuicoes: 0
          };
        }
        statsPorCategoria[tipo.categoria].tiposDisponiveis++;
      });

      contribuicoes.forEach(contrib => {
        const categoria = contrib.user?.categoria;
        if (categoria && statsPorCategoria[categoria]) {
          statsPorCategoria[categoria].contribuicoes++;
        }
      });

      const stats = {
        resumo: {
          totalTipos: tipos.length,
          totalTags: tags.length,
          totalContribuicoes: contribuicoes.length,
          tagsComUso: tags.filter(t => t.usos > 0).length
        },
        porCategoria: Object.values(statsPorCategoria),
        tagsPopulares: tags
          .filter(t => t.usos > 0)
          .sort((a, b) => b.usos - a.usos)
          .slice(0, 10)
      };

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

  async getAllContribuicoes(req: Request, res: Response) {
    try {
      const contribuicoes = await contribuicoesService.getContribuicoesPublicas();

      res.json({
        success: true,
        data: contribuicoes,
        message: 'Todas as contribuições obtidas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar todas as contribuições:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
};
