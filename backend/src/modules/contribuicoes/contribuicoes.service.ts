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
import type { ContribuicaoUnificada } from '../../../shared-types/api.types';
import { dadosProfissionaisService } from '../dados-profissionais/dados-profissionais.service';
import { oportunidadesTrabalhoService } from '../oportunidades-trabalho/oportunidades-trabalho.service';

// Helper para padronizar tags no retorno
function formatTagsForResponse(contribuicao: any) {
  if (!contribuicao.tags) {
    return { ...contribuicao, tags: [] };
  }

  try {
    const tags = typeof contribuicao.tags === 'string' 
      ? JSON.parse(contribuicao.tags) 
      : contribuicao.tags;
    
    return { 
      ...contribuicao, 
      tags: Array.isArray(tags) ? tags : [] 
    };
  } catch (error) {
    console.error('Erro ao fazer parse das tags:', error);
    return { ...contribuicao, tags: [] };
  }
}

// Helper para formatar múltiplas contribuições
function formatMultipleContribuicoes(contribuicoes: any[]) {
  return contribuicoes.map(formatTagsForResponse);
}

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

    return formatTagsForResponse(contribuicao);
  },

  async getContribuicoesByUser(userId: string) {
    const contribuicoes = await prisma.contribuicao.findMany({
      where: { 
        userId,
        ativo: true
      },
      include: {
        tipoContribuicao: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return formatMultipleContribuicoes(contribuicoes);
  },

  async getContribuicoesByUserAndTipo(userId: string, tipoId: string) {
    const contribuicoes = await prisma.contribuicao.findMany({
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

    return formatMultipleContribuicoes(contribuicoes);
  },

  async getContribuicaoById(id: string, userId?: string) {
    const where: any = { id, ativo: true };
    if (userId) {
      where.userId = userId;
    }

    const contribuicao = await prisma.contribuicao.findFirst({
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

    return contribuicao ? formatTagsForResponse(contribuicao) : null;
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

    const updatedContribuicao = await prisma.contribuicao.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : undefined
      },
      include: {
        tipoContribuicao: true
      }
    });

    return formatTagsForResponse(updatedContribuicao);
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

    const contribuicoes = await prisma.contribuicao.findMany({
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

    return formatMultipleContribuicoes(contribuicoes);
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

  // ===== CONTRIBUIÇÕES UNIFICADAS =====

  // Buscar todas as contribuições (normais + dados profissionais) de um usuário
  async getContribuicoesUnificadas(userId: string): Promise<ContribuicaoUnificada[]> {
    try {
      // Buscar contribuições normais
      const contribuicoesNormais = await this.getContribuicoesByUser(userId);
      
      // Buscar dados específicos por categoria
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { categoria: true }
      });

      let dadosProfissionais: any[] = [];
      let oportunidadesTrabalho: any[] = [];
      
      if (user?.categoria === 'IMIGRANTE') {
        dadosProfissionais = await dadosProfissionaisService.getByUser(userId);
      } else if (user?.categoria === 'EMPRESA') {
        oportunidadesTrabalho = await oportunidadesTrabalhoService.getByEmpresa(userId);
      }

      // Converter contribuições normais para formato unificado
      const contribuicoesUnificadas: ContribuicaoUnificada[] = contribuicoesNormais.map(contrib => ({
        id: contrib.id,
        tipo: 'contribuicao_normal' as const,
        titulo: contrib.tipoContribuicao?.titulo || 'Contribuição',
        descricao: contrib.descricao,
        tags: contrib.tags || [],
        createdAt: contrib.createdAt,
        updatedAt: contrib.updatedAt,
        userId: contrib.userId,
        tipoContribuicao: contrib.tipoContribuicao,
        user: contrib.user
      }));

      // Converter dados profissionais para formato unificado
      const dadosProfissionaisUnificados: ContribuicaoUnificada[] = dadosProfissionais.map(dado => ({
        id: dado.id,
        tipo: dado.tipo,
        titulo: dado.titulo,
        descricao: this.generateDescricaoFromDados(dado.tipo, dado.dados),
        tags: this.generateTagsFromDados(dado.tipo, dado.dados),
        createdAt: dado.createdAt,
        updatedAt: dado.updatedAt,
        userId: dado.userId,
        dadosEstruturados: dado.dados,
        user: dado.user
      }));

      // Converter oportunidades de trabalho para formato unificado
      const oportunidadesUnificadas: ContribuicaoUnificada[] = oportunidadesTrabalho.map(oportunidade => ({
        id: oportunidade.id,
        tipo: 'oportunidade_trabalho' as const,
        titulo: oportunidade.titulo,
        descricao: this.generateDescricaoFromOportunidade(oportunidade),
        tags: this.generateTagsFromOportunidade(oportunidade),
        createdAt: oportunidade.createdAt,
        updatedAt: oportunidade.updatedAt,
        userId: oportunidade.userId,
        dadosEstruturados: oportunidade,
        user: oportunidade.user
      }));

      // Unificar e ordenar por data de criação (mais recentes primeiro)
      const todasContribuicoes = [...contribuicoesUnificadas, ...dadosProfissionaisUnificados, ...oportunidadesUnificadas];
      todasContribuicoes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return todasContribuicoes;

    } catch (error) {
      console.error('Erro ao buscar contribuições unificadas:', error);
      throw new Error('Não foi possível buscar contribuições unificadas');
    }
  },

  // Helper para gerar descrição textual dos dados estruturados
  generateDescricaoFromDados(tipo: string, dados: any): string {
    switch (tipo) {
      case 'experiencia':
        return `Experiência como ${dados.cargo} na ${dados.empresa} por ${dados.tempoNoCargo}`;
      case 'formacao':
        const formacao = `${dados.curso || dados.nivelEscolaridade}`;
        const instituicao = dados.instituicao ? ` na ${dados.instituicao}` : '';
        const dataTermino = dados.dataTermino ? ` (concluído em ${dados.dataTermino})` : '';
        return `${formacao}${instituicao}${dataTermino}`;
      case 'idioma':
        return `Idioma ${dados.idioma} com nível ${dados.nivel}`;
      default:
        return 'Dado profissional';
    }
  },

  // Helper para gerar tags dos dados estruturados
  generateTagsFromDados(tipo: string, dados: any): string[] {
    const tags: string[] = [tipo];
    
    switch (tipo) {
      case 'experiencia':
        tags.push(dados.cargo, dados.empresa, dados.tempoNoCargo);
        break;
      case 'formacao':
        tags.push(dados.nivelEscolaridade);
        if (dados.curso) tags.push(dados.curso);
        if (dados.instituicao) tags.push(dados.instituicao);
        break;
      case 'idioma':
        tags.push(dados.idioma, dados.nivel);
        break;
    }
    
    return tags.filter(tag => tag && tag.trim() !== '');
  },

  // Helper para gerar descrição de oportunidades de trabalho
  generateDescricaoFromOportunidade(oportunidade: any): string {
    const criterios = [];
    
    if (oportunidade.genero && oportunidade.genero !== 'INDIFERENTE') {
      criterios.push(`Género: ${oportunidade.genero}`);
    }
    if (oportunidade.idade) {
      criterios.push(`Idade: ${oportunidade.idade}`);
    }
    if (oportunidade.municipioResidencia) {
      criterios.push(`Local: ${oportunidade.municipioResidencia}`);
    }
    if (oportunidade.nivelEscolaridade && oportunidade.nivelEscolaridade !== 'Indiferente') {
      criterios.push(`Escolaridade: ${oportunidade.nivelEscolaridade}`);
    }

    const descricaoBase = oportunidade.descricaoCargo || `Oportunidade para ${oportunidade.nomeCargo}`;
    const criteriosTexto = criterios.length > 0 ? ` | ${criterios.join(' • ')}` : '';
    
    return `${descricaoBase}${criteriosTexto}`;
  },

  // Helper para gerar tags de oportunidades de trabalho
  generateTagsFromOportunidade(oportunidade: any): string[] {
    const tags: string[] = ['oportunidade_trabalho', oportunidade.nomeCargo];
    
    if (oportunidade.nomeProfissao) tags.push(oportunidade.nomeProfissao);
    if (oportunidade.municipioResidencia) tags.push(oportunidade.municipioResidencia);
    if (oportunidade.nivelEscolaridade && oportunidade.nivelEscolaridade !== 'Indiferente') {
      tags.push(oportunidade.nivelEscolaridade);
    }
    
    // Adicionar habilidades se existirem
    if (oportunidade.habilidades && oportunidade.habilidades.length > 0) {
      tags.push(...oportunidade.habilidades.slice(0, 3)); // Primeiras 3 habilidades
    }
    
    return tags.filter(tag => tag && tag.trim() !== '');
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
    // Validar que tags é um array e filtrar tags válidas
    if (!Array.isArray(tags)) {
      console.error('incrementTagUsage: tags não é um array:', typeof tags, tags);
      return;
    }

    const validTags = tags.filter(tag => 
      typeof tag === 'string' && 
      tag.trim().length > 0 && 
      tag.trim().length <= 50 &&
      tag.trim() !== ',' &&
      tag.trim() !== '"' &&
      tag.trim() !== '[' &&
      tag.trim() !== ']'
    );

    for (const tagName of validTags) {
      const cleanTag = tagName.trim();
      await prisma.tagSistema.upsert({
        where: { nome: cleanTag },
        update: { 
          usos: { increment: 1 }
        },
        create: {
          nome: cleanTag,
          usos: 1
        }
      });
    }
  },

  async decrementTagUsage(tags: string[]) {
    // Validar que tags é um array e filtrar tags válidas
    if (!Array.isArray(tags)) {
      console.error('decrementTagUsage: tags não é um array:', typeof tags, tags);
      return;
    }

    const validTags = tags.filter(tag => 
      typeof tag === 'string' && 
      tag.trim().length > 0 && 
      tag.trim().length <= 50
    );

    for (const tagName of validTags) {
      const cleanTag = tagName.trim();
      const tag = await prisma.tagSistema.findUnique({
        where: { nome: cleanTag }
      });
      
      if (tag && tag.usos > 0) {
        await prisma.tagSistema.update({
          where: { nome: cleanTag },
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
