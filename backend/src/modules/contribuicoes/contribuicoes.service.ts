import { prisma } from '../../shared/database';
import { 
  ContribuicaoCreateData, 
  ContribuicaoUpdateData,
  ContribuicaoFilters,
  TipoContribuicaoCreateData,
  TipoContribuicaoUpdateData,
  TagSistemaCreateData,
  TagSistemaUpdateData
} from './contribuicoes.types';

export const contribuicoesService = {
  // ===== CONTRIBUIÇÕES DOS USUÁRIOS =====
  
  async createContribuicao(data: ContribuicaoCreateData) {
    // Verificar se o tipo de contribuição existe e está ativo
    const tipoContribuicao = await prisma.tipoContribuicao.findFirst({
      where: { 
        id: data.tipoContribuicaoId,
        ativo: true
      }
    });

    if (!tipoContribuicao) {
      throw new Error('Tipo de contribuição não encontrado ou inativo');
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Criar contribuição
    const contribuicao = await prisma.contribuicao.create({
      data: {
        userId: data.userId,
        tipoContribuicaoId: data.tipoContribuicaoId,
        descricao: data.descricao,
        tags: data.tags ? JSON.stringify(data.tags) : null
      },
      include: {
        tipoContribuicao: true,
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            categoria: true
          }
        }
      }
    });

    // Incrementar uso das tags
    if (data.tags && data.tags.length > 0) {
      await this.incrementTagUsage(data.tags);
    }

    return contribuicao;
  },

  async getContribuicoesByUser(userId: string) {
    return await prisma.contribuicao.findMany({
      where: { 
        userId,
        ativo: true
      },
      include: {
        tipoContribuicao: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getContribuicoesByUserAndTipo(userId: string, tipoId: string) {
    return await prisma.contribuicao.findMany({
      where: { 
        userId,
        tipoContribuicaoId: tipoId,
        ativo: true
      },
      include: {
        tipoContribuicao: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getContribuicaoById(id: string, userId?: string) {
    const where: any = { id, ativo: true };
    if (userId) {
      where.userId = userId;
    }

    return await prisma.contribuicao.findFirst({
      where,
      include: {
        tipoContribuicao: true,
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            categoria: true
          }
        }
      }
    });
  },

  async updateContribuicao(id: string, userId: string, data: ContribuicaoUpdateData) {
    // Verificar se a contribuição pertence ao usuário
    const existing = await prisma.contribuicao.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new Error('Contribuição não encontrada ou não pertence ao usuário');
    }

    // Atualizar tags usage se mudaram
    const oldTags = existing.tags ? JSON.parse(existing.tags) : [];
    const newTags = data.tags || [];
    
    if (JSON.stringify(oldTags) !== JSON.stringify(newTags)) {
      await this.decrementTagUsage(oldTags);
      await this.incrementTagUsage(newTags);
    }

    return await prisma.contribuicao.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : undefined
      },
      include: {
        tipoContribuicao: true
      }
    });
  },

  async deleteContribuicao(id: string, userId: string) {
    const existing = await prisma.contribuicao.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new Error('Contribuição não encontrada ou não pertence ao usuário');
    }

    // Decrementar uso das tags
    if (existing.tags) {
      const tags = JSON.parse(existing.tags);
      await this.decrementTagUsage(tags);
    }

    return await prisma.contribuicao.delete({
      where: { id }
    });
  },

  async getContribuicoesPublicas(filters: ContribuicaoFilters = {}) {
    const where: any = { ativo: true };

    if (filters.categoria) {
      where.user = { categoria: filters.categoria };
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        contains: filters.tags[0] // Busca simples por enquanto
      };
    }

    return await prisma.contribuicao.findMany({
      where,
      include: {
        tipoContribuicao: true,
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            categoria: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limitar resultados
    });
  },

  // ===== TIPOS DE CONTRIBUIÇÃO (ADMIN) =====

  async createTipoContribuicao(data: TipoContribuicaoCreateData) {
    return await prisma.tipoContribuicao.create({
      data: {
        ...data,
        tagsModelo: data.tagsModelo ? JSON.stringify(data.tagsModelo) : null
      }
    });
  },

  async getTiposContribuicao(categoria?: string) {
    const where: any = { ativo: true };
    if (categoria) {
      where.categoria = categoria;
    }

    return await prisma.tipoContribuicao.findMany({
      where,
      orderBy: { titulo: 'asc' }
    });
  },

  async getTipoContribuicaoById(id: string) {
    return await prisma.tipoContribuicao.findUnique({
      where: { id }
    });
  },

  async updateTipoContribuicao(id: string, data: TipoContribuicaoUpdateData) {
    return await prisma.tipoContribuicao.update({
      where: { id },
      data: {
        ...data,
        tagsModelo: data.tagsModelo ? JSON.stringify(data.tagsModelo) : undefined
      }
    });
  },

  async deleteTipoContribuicao(id: string) {
    // Verificar se há contribuições usando este tipo
    const count = await prisma.contribuicao.count({
      where: { tipoContribuicaoId: id }
    });

    if (count > 0) {
      throw new Error('Não é possível remover tipo de contribuição que está sendo usado');
    }

    return await prisma.tipoContribuicao.delete({
      where: { id }
    });
  },

  // ===== TAGS DO SISTEMA =====

  async createTagSistema(data: TagSistemaCreateData) {
    return await prisma.tagSistema.create({
      data
    });
  },

  async getTagsSistema() {
    return await prisma.tagSistema.findMany({
      orderBy: [
        { usos: 'desc' },
        { nome: 'asc' }
      ]
    });
  },

  async updateTagSistema(id: string, data: TagSistemaUpdateData) {
    return await prisma.tagSistema.update({
      where: { id },
      data
    });
  },

  async deleteTagSistema(id: string) {
    return await prisma.tagSistema.delete({
      where: { id }
    });
  },

  // ===== HELPERS PARA TAGS =====

  async incrementTagUsage(tags: string[]) {
    for (const tagName of tags) {
      await prisma.tagSistema.upsert({
        where: { nome: tagName },
        update: { 
          usos: { increment: 1 }
        },
        create: {
          nome: tagName,
          usos: 1
        }
      });
    }
  },

  async decrementTagUsage(tags: string[]) {
    for (const tagName of tags) {
      const tag = await prisma.tagSistema.findUnique({
        where: { nome: tagName }
      });
      
      if (tag && tag.usos > 0) {
        await prisma.tagSistema.update({
          where: { nome: tagName },
          data: { usos: { decrement: 1 } }
        });
      }
    }
  },

  // ===== HELPERS GERAIS =====

  async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nomeCompleto: true,
        categoria: true,
        email: true
      }
    });
  },

  // ===== MÉTODOS ADMIN PARA MODERAÇÃO =====

  async getContribuicoesByTipo(tipoId: string) {
    return await prisma.contribuicao.findMany({
      where: { tipoContribuicaoId: tipoId },
      include: {
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
            categoria: true,
            telemovel: true,
            createdAt: true
          }
        },
        tipoContribuicao: true
      },
      orderBy: [
        { ativo: 'desc' }, // Ativas primeiro
        { createdAt: 'desc' }
      ]
    });
  },

  async updateContribuicaoStatus(contribuicaoId: string, ativo: boolean) {
    return await prisma.contribuicao.update({
      where: { id: contribuicaoId },
      data: { ativo },
      include: {
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true
          }
        }
      }
    });
  },

  async deleteContribuicaoAdmin(contribuicaoId: string) {
    // Buscar contribuição para decrementar tags
    const contribuicao = await prisma.contribuicao.findUnique({
      where: { id: contribuicaoId }
    });

    if (contribuicao && contribuicao.tags) {
      const tags = JSON.parse(contribuicao.tags);
      await this.decrementTagUsage(tags);
    }

    // Excluir contribuição
    return await prisma.contribuicao.delete({
      where: { id: contribuicaoId }
    });
  }
};
