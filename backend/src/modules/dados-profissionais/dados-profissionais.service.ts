import { prisma } from '../../shared/database';
import type {
  DadoProfissionalCreateData,
  DadoProfissionalUpdateData,
  DadosProfissionaisFilters,
  ValidationResult,
  TipoDadoProfissional,
  DadosProfissionaisUnion,
  DadosExperiencia,
  DadosFormacao,
  DadosIdioma
} from './dados-profissionais.types';

// Função helper para formatar dados com parsing de JSON
function formatDadoProfissional(dado: any) {
  return {
    ...dado,
    dados: typeof dado.dados === 'string' ? JSON.parse(dado.dados) : dado.dados
  };
}

// Função helper para gerar título automático
function generateTituloAutomatico(tipo: TipoDadoProfissional, dados: DadosProfissionaisUnion): string {
  switch (tipo) {
    case 'experiencia':
      const exp = dados as DadosExperiencia;
      return `${exp.cargo} na ${exp.empresa}`;
    case 'formacao':
      const form = dados as DadosFormacao;
      return `${form.curso || form.nivelEscolaridade}${form.instituicao ? ` - ${form.instituicao}` : ''}`;
    case 'idioma':
      const idioma = dados as DadosIdioma;
      return `${idioma.idioma} (${idioma.nivel})`;
    default:
      return 'Dado profissional';
  }
}

// Função de validação por tipo
function validateDadosByTipo(tipo: TipoDadoProfissional, dados: any): ValidationResult {
  const errors: string[] = [];

  switch (tipo) {
    case 'experiencia':
      if (!dados.cargo || dados.cargo.trim() === '') {
        errors.push('Cargo é obrigatório');
      }
      if (!dados.empresa || dados.empresa.trim() === '') {
        errors.push('Empresa é obrigatória');
      }
      if (!dados.tempoNoCargo || dados.tempoNoCargo.trim() === '') {
        errors.push('Tempo no cargo é obrigatório');
      }
      break;

    case 'formacao':
      if (!dados.nivelEscolaridade || dados.nivelEscolaridade.trim() === '') {
        errors.push('Nível de escolaridade é obrigatório');
      }
      break;

    case 'idioma':
      if (!dados.idioma || dados.idioma.trim() === '') {
        errors.push('Idioma é obrigatório');
      }
      if (!dados.nivel || dados.nivel.trim() === '') {
        errors.push('Nível é obrigatório');
      }
      break;

    default:
      errors.push('Tipo de dado não reconhecido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export const dadosProfissionaisService = {
  // Criar novo dado profissional
  async create(data: DadoProfissionalCreateData) {
    // Validar dados
    const validation = validateDadosByTipo(data.tipo, data.dados);
    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
    }

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se é imigrante
    if (user.categoria !== 'IMIGRANTE') {
      throw new Error('Apenas imigrantes podem ter dados profissionais estruturados');
    }

    // Gerar título automático
    const titulo = generateTituloAutomatico(data.tipo, data.dados);

    // Determinar ordem se não especificada
    let ordem = data.ordem;
    if (ordem === undefined) {
      const lastOrder = await prisma.dadosProfissionaisImigrante.findFirst({
        where: { 
          userId: data.userId,
          tipo: data.tipo 
        },
        orderBy: { ordem: 'desc' }
      });
      ordem = (lastOrder?.ordem || 0) + 1;
    }

    // Criar dado profissional
    const dadoProfissional = await prisma.dadosProfissionaisImigrante.create({
      data: {
        userId: data.userId,
        tipo: data.tipo,
        dados: JSON.stringify(data.dados),
        titulo,
        ordem
      },
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

    return formatDadoProfissional(dadoProfissional);
  },

  // Buscar todos os dados de um usuário
  async getByUser(userId: string, filters?: DadosProfissionaisFilters) {
    const where: any = {
      userId,
      ativo: filters?.ativo !== undefined ? filters.ativo : true
    };

    if (filters?.tipo) {
      where.tipo = filters.tipo;
    }

    const dados = await prisma.dadosProfissionaisImigrante.findMany({
      where,
      orderBy: [
        { tipo: 'asc' },
        { ordem: 'asc' },
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

    return dados.map(formatDadoProfissional);
  },

  // Buscar por ID
  async getById(id: string) {
    const dado = await prisma.dadosProfissionaisImigrante.findUnique({
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

    if (!dado) {
      throw new Error('Dado profissional não encontrado');
    }

    return formatDadoProfissional(dado);
  },

  // Atualizar dado profissional
  async update(id: string, userId: string, data: DadoProfissionalUpdateData) {
    // Verificar se existe e pertence ao usuário
    const existingDado = await prisma.dadosProfissionaisImigrante.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingDado) {
      throw new Error('Dado profissional não encontrado ou não pertence ao usuário');
    }

    const updateData: any = {};

    // Se há novos dados, validar e atualizar
    if (data.dados) {
      const validation = validateDadosByTipo(existingDado.tipo as TipoDadoProfissional, data.dados);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      updateData.dados = JSON.stringify(data.dados);
      
      // Regenerar título se dados mudaram
      if (!data.titulo) {
        updateData.titulo = generateTituloAutomatico(existingDado.tipo as TipoDadoProfissional, data.dados);
      }
    }

    // Atualizar outros campos
    if (data.titulo !== undefined) {
      updateData.titulo = data.titulo;
    }
    if (data.ordem !== undefined) {
      updateData.ordem = data.ordem;
    }
    if (data.ativo !== undefined) {
      updateData.ativo = data.ativo;
    }

    const dadoAtualizado = await prisma.dadosProfissionaisImigrante.update({
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

    return formatDadoProfissional(dadoAtualizado);
  },

  // Deletar dado profissional
  async delete(id: string, userId: string) {
    // Verificar se existe e pertence ao usuário
    const existingDado = await prisma.dadosProfissionaisImigrante.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingDado) {
      throw new Error('Dado profissional não encontrado ou não pertence ao usuário');
    }

    await prisma.dadosProfissionaisImigrante.delete({
      where: { id }
    });

    return { success: true };
  },

  // Buscar por tipo específico
  async getExperiencias(userId: string) {
    return this.getByUser(userId, { tipo: 'experiencia' });
  },

  async getFormacoes(userId: string) {
    return this.getByUser(userId, { tipo: 'formacao' });
  },

  async getIdiomas(userId: string) {
    return this.getByUser(userId, { tipo: 'idioma' });
  },

  // Reordenar dados
  async reorderDados(userId: string, tipo: TipoDadoProfissional, newOrder: string[]) {
    const promises = newOrder.map((id, index) =>
      prisma.dadosProfissionaisImigrante.updateMany({
        where: { 
          id,
          userId,
          tipo 
        },
        data: { ordem: index + 1 }
      })
    );

    await Promise.all(promises);
    return { success: true };
  },

  // Para uso administrativo - buscar todos os dados
  async getAllForAdmin(filters?: DadosProfissionaisFilters & { limit?: number; offset?: number }) {
    const where: any = {};
    
    if (filters?.tipo) where.tipo = filters.tipo;
    if (filters?.ativo !== undefined) where.ativo = filters.ativo;
    if (filters?.userId) where.userId = filters.userId;

    const dados = await prisma.dadosProfissionaisImigrante.findMany({
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

    const total = await prisma.dadosProfissionaisImigrante.count({ where });

    return {
      dados: dados.map(formatDadoProfissional),
      total,
      hasMore: (filters?.offset || 0) + dados.length < total
    };
  },

  // Estatísticas para admin
  async getStats() {
    const [totalDados, totalExperiencias, totalFormacoes, totalIdiomas, totalUsuarios] = await Promise.all([
      prisma.dadosProfissionaisImigrante.count({ where: { ativo: true } }),
      prisma.dadosProfissionaisImigrante.count({ where: { tipo: 'experiencia', ativo: true } }),
      prisma.dadosProfissionaisImigrante.count({ where: { tipo: 'formacao', ativo: true } }),
      prisma.dadosProfissionaisImigrante.count({ where: { tipo: 'idioma', ativo: true } }),
      prisma.dadosProfissionaisImigrante.groupBy({
        by: ['userId'],
        where: { ativo: true },
        _count: true
      })
    ]);

    return {
      totalDados,
      totalExperiencias,
      totalFormacoes,
      totalIdiomas,
      totalUsuariosComDados: totalUsuarios.length
    };
  }
};
