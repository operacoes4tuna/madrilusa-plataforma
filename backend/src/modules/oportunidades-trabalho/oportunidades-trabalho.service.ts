import { prisma } from '../../shared/database';
import type {
  OportunidadeCreateData,
  OportunidadeUpdateData,
  OportunidadeFilters,
  OportunidadeStats,
  ValidationResult,
  GeneroOportunidade,
  OpcaoBinariaOportunidade,
  NivelEscolaridadeOportunidade,
  IdiomaOportunidade
} from './oportunidades-trabalho.types';

// Função helper para formatar oportunidade com parsing de JSON
function formatOportunidade(oportunidade: any) {
  return {
    ...oportunidade,
    denominacoes: oportunidade.denominacoes ? JSON.parse(oportunidade.denominacoes) : [],
    experienciasAceitas: oportunidade.experienciasAceitas ? JSON.parse(oportunidade.experienciasAceitas) : [],
    areasFormacao: oportunidade.areasFormacao ? JSON.parse(oportunidade.areasFormacao) : [],
    idiomasPreferenciais: oportunidade.idiomasPreferenciais ? JSON.parse(oportunidade.idiomasPreferenciais) : [],
    habilidades: oportunidade.habilidades ? JSON.parse(oportunidade.habilidades) : [],
    caracteristicas: oportunidade.caracteristicas ? JSON.parse(oportunidade.caracteristicas) : []
  };
}

// Função de validação completa
function validateOportunidadeData(data: OportunidadeCreateData): ValidationResult {
  const errors: string[] = [];

  // Validações obrigatórias
  if (!data.titulo || data.titulo.trim() === '') {
    errors.push('Título é obrigatório');
  }
  if (!data.nomeCargo || data.nomeCargo.trim() === '') {
    errors.push('Nome do cargo é obrigatório');
  }

  // Validações de arrays
  if (data.denominacoes && data.denominacoes.some(d => !d || d.trim() === '')) {
    errors.push('Denominações não podem estar vazias');
  }
  if (data.experienciasAceitas && data.experienciasAceitas.some(e => !e || e.trim() === '')) {
    errors.push('Experiências aceitas não podem estar vazias');
  }
  if (data.areasFormacao && data.areasFormacao.some(a => !a || a.trim() === '')) {
    errors.push('Áreas de formação não podem estar vazias');
  }
  if (data.habilidades && data.habilidades.some(h => !h || h.trim() === '')) {
    errors.push('Habilidades não podem estar vazias');
  }
  if (data.caracteristicas && data.caracteristicas.some(c => !c || c.trim() === '')) {
    errors.push('Características não podem estar vazias');
  }

  // Validação de idiomas
  if (data.idiomasPreferenciais && data.idiomasPreferenciais.some(i => !i.idioma || i.idioma.trim() === '')) {
    errors.push('Idiomas devem ter nome preenchido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Função para gerar título automático se não fornecido
function generateTitulo(nomeCargo: string, nomeProfissao?: string): string {
  if (nomeProfissao && nomeProfissao !== nomeCargo) {
    return `${nomeCargo} (${nomeProfissao})`;
  }
  return nomeCargo;
}

export const oportunidadesTrabalhoService = {
  // Criar nova oportunidade
  async create(data: OportunidadeCreateData) {
    // Validar dados
    const validation = validateOportunidadeData(data);
    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
    }

    // Verificar se usuário existe e é empresa
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.categoria !== 'EMPRESA') {
      throw new Error('Apenas empresas podem criar oportunidades de trabalho');
    }

    // Gerar título se não fornecido
    const titulo = data.titulo || generateTitulo(data.nomeCargo, data.nomeProfissao);

    // Preparar dados para inserção
    const insertData: any = {
      userId: data.userId,
      titulo,
      nomeCargo: data.nomeCargo,
      nomeProfissao: data.nomeProfissao || null,
      descricaoCargo: data.descricaoCargo || null,
      genero: data.genero || null,
      idade: data.idade || null,
      municipioResidencia: data.municipioResidencia || null,
      transporteProprio: data.transporteProprio || null,
      fluenciaPortugues: data.fluenciaPortugues || null,
      nivelEscolaridade: data.nivelEscolaridade || null,
      
      // Converter arrays para JSON strings
      denominacoes: data.denominacoes ? JSON.stringify(data.denominacoes) : null,
      experienciasAceitas: data.experienciasAceitas ? JSON.stringify(data.experienciasAceitas) : null,
      areasFormacao: data.areasFormacao ? JSON.stringify(data.areasFormacao) : null,
      idiomasPreferenciais: data.idiomasPreferenciais ? JSON.stringify(data.idiomasPreferenciais) : null,
      habilidades: data.habilidades ? JSON.stringify(data.habilidades) : null,
      caracteristicas: data.caracteristicas ? JSON.stringify(data.caracteristicas) : null
    };

    // Criar oportunidade
    const oportunidade = await prisma.oportunidadeTrabalho.create({
      data: insertData,
      include: {
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            categoria: true
          }
        }
      }
    });

    return formatOportunidade(oportunidade);
  },

  // Buscar oportunidades de uma empresa
  async getByEmpresa(userId: string, filters?: OportunidadeFilters) {
    const where: any = {
      userId,
      ativo: filters?.ativo !== undefined ? filters.ativo : true
    };

    // Aplicar filtros adicionais
    if (filters?.genero) where.genero = filters.genero;
    if (filters?.municipio) where.municipioResidencia = { contains: filters.municipio };
    if (filters?.transporteProprio) where.transporteProprio = filters.transporteProprio;
    if (filters?.fluenciaPortugues) where.fluenciaPortugues = filters.fluenciaPortugues;
    if (filters?.nivelEscolaridade) where.nivelEscolaridade = filters.nivelEscolaridade;

    const oportunidades = await prisma.oportunidadeTrabalho.findMany({
      where,
      orderBy: [
        { ativo: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            categoria: true
          }
        }
      }
    });

    return oportunidades.map(formatOportunidade);
  },

  // Buscar oportunidade por ID
  async getById(id: string) {
    const oportunidade = await prisma.oportunidadeTrabalho.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            categoria: true
          }
        }
      }
    });

    if (!oportunidade) {
      throw new Error('Oportunidade não encontrada');
    }

    return formatOportunidade(oportunidade);
  },

  // Atualizar oportunidade
  async update(id: string, userId: string, data: OportunidadeUpdateData) {
    // Verificar se existe e pertence ao usuário
    const existingOportunidade = await prisma.oportunidadeTrabalho.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingOportunidade) {
      throw new Error('Oportunidade não encontrada ou não pertence à empresa');
    }

    // Preparar dados de atualização
    const updateData: any = {};

    // Campos simples
    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.ativo !== undefined) updateData.ativo = data.ativo;
    if (data.nomeCargo !== undefined) updateData.nomeCargo = data.nomeCargo;
    if (data.nomeProfissao !== undefined) updateData.nomeProfissao = data.nomeProfissao;
    if (data.descricaoCargo !== undefined) updateData.descricaoCargo = data.descricaoCargo;
    if (data.genero !== undefined) updateData.genero = data.genero;
    if (data.idade !== undefined) updateData.idade = data.idade;
    if (data.municipioResidencia !== undefined) updateData.municipioResidencia = data.municipioResidencia;
    if (data.transporteProprio !== undefined) updateData.transporteProprio = data.transporteProprio;
    if (data.fluenciaPortugues !== undefined) updateData.fluenciaPortugues = data.fluenciaPortugues;
    if (data.nivelEscolaridade !== undefined) updateData.nivelEscolaridade = data.nivelEscolaridade;

    // Arrays (converter para JSON)
    if (data.denominacoes !== undefined) {
      updateData.denominacoes = data.denominacoes ? JSON.stringify(data.denominacoes) : null;
    }
    if (data.experienciasAceitas !== undefined) {
      updateData.experienciasAceitas = data.experienciasAceitas ? JSON.stringify(data.experienciasAceitas) : null;
    }
    if (data.areasFormacao !== undefined) {
      updateData.areasFormacao = data.areasFormacao ? JSON.stringify(data.areasFormacao) : null;
    }
    if (data.idiomasPreferenciais !== undefined) {
      updateData.idiomasPreferenciais = data.idiomasPreferenciais ? JSON.stringify(data.idiomasPreferenciais) : null;
    }
    if (data.habilidades !== undefined) {
      updateData.habilidades = data.habilidades ? JSON.stringify(data.habilidades) : null;
    }
    if (data.caracteristicas !== undefined) {
      updateData.caracteristicas = data.caracteristicas ? JSON.stringify(data.caracteristicas) : null;
    }

    const oportunidadeAtualizada = await prisma.oportunidadeTrabalho.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            categoria: true
          }
        }
      }
    });

    return formatOportunidade(oportunidadeAtualizada);
  },

  // Deletar oportunidade
  async delete(id: string, userId: string) {
    // Verificar se existe e pertence ao usuário
    const existingOportunidade = await prisma.oportunidadeTrabalho.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingOportunidade) {
      throw new Error('Oportunidade não encontrada ou não pertence à empresa');
    }

    await prisma.oportunidadeTrabalho.delete({
      where: { id }
    });

    return { success: true };
  },

  // Alternar status ativo/inativo
  async toggleStatus(id: string, userId: string, ativo: boolean) {
    return this.update(id, userId, { ativo });
  },

  // Duplicar oportunidade
  async duplicate(id: string, userId: string) {
    const original = await this.getById(id);
    
    if (original.userId !== userId) {
      throw new Error('Não é possível duplicar oportunidade de outra empresa');
    }

    // Criar cópia com título modificado
    const copyData: OportunidadeCreateData = {
      userId,
      titulo: `${original.titulo} (Cópia)`,
      nomeCargo: original.nomeCargo,
      nomeProfissao: original.nomeProfissao,
      descricaoCargo: original.descricaoCargo,
      genero: original.genero,
      idade: original.idade,
      municipioResidencia: original.municipioResidencia,
      transporteProprio: original.transporteProprio,
      fluenciaPortugues: original.fluenciaPortugues,
      nivelEscolaridade: original.nivelEscolaridade,
      denominacoes: original.denominacoes,
      experienciasAceitas: original.experienciasAceitas,
      areasFormacao: original.areasFormacao,
      idiomasPreferenciais: original.idiomasPreferenciais,
      habilidades: original.habilidades,
      caracteristicas: original.caracteristicas
    };

    return this.create(copyData);
  },

  // Incrementar visualizações
  async incrementVisualizacoes(id: string) {
    await prisma.oportunidadeTrabalho.update({
      where: { id },
      data: {
        visualizacoes: { increment: 1 }
      }
    });
  },

  // Estatísticas para empresa
  async getStatsEmpresa(userId: string) {
    const [total, ativas, inativas, totalVisualizacoes] = await Promise.all([
      prisma.oportunidadeTrabalho.count({ where: { userId } }),
      prisma.oportunidadeTrabalho.count({ where: { userId, ativo: true } }),
      prisma.oportunidadeTrabalho.count({ where: { userId, ativo: false } }),
      prisma.oportunidadeTrabalho.aggregate({
        where: { userId },
        _sum: { visualizacoes: true }
      })
    ]);

    return {
      totalOportunidades: total,
      oportunidadesAtivas: ativas,
      oportunidadesInativas: inativas,
      totalVisualizacoes: totalVisualizacoes._sum.visualizacoes || 0,
      mediaVisualizacoesPorOportunidade: total > 0 ? Math.round((totalVisualizacoes._sum.visualizacoes || 0) / total) : 0
    };
  },

  // Para uso administrativo - buscar todas as oportunidades
  async getAllForAdmin(filters?: OportunidadeFilters & { limit?: number; offset?: number }) {
    const where: any = {};
    
    if (filters?.ativo !== undefined) where.ativo = filters.ativo;
    if (filters?.genero) where.genero = filters.genero;
    if (filters?.municipio) where.municipioResidencia = { contains: filters.municipio };
    if (filters?.transporteProprio) where.transporteProprio = filters.transporteProprio;
    if (filters?.fluenciaPortugues) where.fluenciaPortugues = filters.fluenciaPortugues;
    if (filters?.nivelEscolaridade) where.nivelEscolaridade = filters.nivelEscolaridade;

    const oportunidades = await prisma.oportunidadeTrabalho.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
      include: {
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
            categoria: true
          }
        }
      }
    });

    const total = await prisma.oportunidadeTrabalho.count({ where });

    return {
      oportunidades: oportunidades.map(formatOportunidade),
      total,
      hasMore: (filters?.offset || 0) + oportunidades.length < total
    };
  },

  // Estatísticas gerais para admin
  async getStatsGeral(): Promise<OportunidadeStats> {
    const [total, ativas, inativas, totalVisualizacoes, empresasComOportunidades] = await Promise.all([
      prisma.oportunidadeTrabalho.count(),
      prisma.oportunidadeTrabalho.count({ where: { ativo: true } }),
      prisma.oportunidadeTrabalho.count({ where: { ativo: false } }),
      prisma.oportunidadeTrabalho.aggregate({ _sum: { visualizacoes: true } }),
      prisma.oportunidadeTrabalho.groupBy({
        by: ['userId'],
        _count: true
      })
    ]);

    return {
      totalOportunidades: total,
      oportunidadesAtivas: ativas,
      oportunidadesInativas: inativas,
      totalVisualizacoes: totalVisualizacoes._sum.visualizacoes || 0,
      mediaVisualizacoesPorOportunidade: total > 0 ? Math.round((totalVisualizacoes._sum.visualizacoes || 0) / total) : 0,
      totalEmpresas: empresasComOportunidades.length
    };
  }
};
