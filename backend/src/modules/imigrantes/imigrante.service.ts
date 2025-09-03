import { PrismaClient } from '@prisma/client';
import { 
  CreatePerfilImigranteRequest, 
  UpdatePerfilImigranteRequest, 
  PerfilImigrante,
  USER_CATEGORIES
} from './imigrante.types';

const prisma = new PrismaClient();

export class ImigranteService {
  // Criar perfil de imigrante
  async createPerfil(data: CreatePerfilImigranteRequest): Promise<PerfilImigrante> {
    // Verificar se usuário existe e tem categoria IMIGRANTE
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.categoria !== USER_CATEGORIES.IMIGRANTE) {
      throw new Error('Usuário não é da categoria IMIGRANTE');
    }

    // Verificar se já existe perfil para este usuário
    const existingProfile = await prisma.perfilImigrante.findUnique({
      where: { userId: data.userId }
    });

    if (existingProfile) {
      throw new Error('Perfil de imigrante já existe para este usuário');
    }

    // Criar perfil
    const perfil = await prisma.perfilImigrante.create({
      data: {
        userId: data.userId,
        nacionalidade: data.nacionalidade,
        dataNascimento: new Date(data.dataNascimento),
        // @ts-ignore - Campo atualizado no schema
        objetivos: data.objetivos ? JSON.stringify(data.objetivos) : null,
        objetivoOutros: data.objetivoOutros || null,
        mensagem: data.mensagem || null,
        aceitaNotificacoes: data.aceitaNotificacoes || false,
        
        // ✨ NOVOS CAMPOS - Informações Adicionais
        genero: data.genero || null,
        municipioResidencia: data.municipioResidencia || null,
        transporteProprio: data.transporteProprio || false,
        possibilidadeMudancaMorada: data.possibilidadeMudancaMorada || false,
        fluenciaPortugues: data.fluenciaPortugues || null
      }
    });

    // Deserializar objetivos para o retorno
    return {
      ...perfil,
      // @ts-ignore - Campo atualizado no schema
      objetivos: perfil.objetivos ? JSON.parse(perfil.objetivos) : []
    } as PerfilImigrante;
  }

  // Buscar perfil de imigrante por userId
  async getPerfilByUserId(userId: string): Promise<PerfilImigrante | null> {
    const perfil = await prisma.perfilImigrante.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
            telemovel: true,
            categoria: true
          }
        }
      }
    });

    if (!perfil) return null;

    // Deserializar objetivos
    return {
      ...perfil,
      // @ts-ignore - Campo atualizado no schema
      objetivos: perfil.objetivos ? JSON.parse(perfil.objetivos) : [],
      objetivoOutros: perfil.objetivoOutros || undefined,
      mensagem: perfil.mensagem || undefined
    } as PerfilImigrante;
  }

  // Buscar perfil de imigrante por ID
  async getPerfilById(id: string): Promise<PerfilImigrante | null> {
    const perfil = await prisma.perfilImigrante.findUnique({
      where: { id }
    });

    if (!perfil) return null;

    // Deserializar objetivos
    return {
      ...perfil,
      // @ts-ignore - Campo atualizado no schema
      objetivos: perfil.objetivos ? JSON.parse(perfil.objetivos) : [],
      objetivoOutros: perfil.objetivoOutros || undefined,
      mensagem: perfil.mensagem || undefined
    } as PerfilImigrante;
  }

  // Atualizar perfil de imigrante
  async updatePerfil(userId: string, data: UpdatePerfilImigranteRequest): Promise<PerfilImigrante> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilImigrante.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de imigrante não encontrado');
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.nacionalidade !== undefined) {
      updateData.nacionalidade = data.nacionalidade;
    }
    if (data.dataNascimento !== undefined) {
      updateData.dataNascimento = new Date(data.dataNascimento);
    }
    if (data.objetivos !== undefined) {
      updateData.objetivos = data.objetivos ? JSON.stringify(data.objetivos) : null;
    }
    if (data.objetivoOutros !== undefined) {
      updateData.objetivoOutros = data.objetivoOutros;
    }
    if (data.mensagem !== undefined) {
      updateData.mensagem = data.mensagem;
    }
    if (data.aceitaNotificacoes !== undefined) {
      updateData.aceitaNotificacoes = data.aceitaNotificacoes;
    }
    
    // ✨ NOVOS CAMPOS - Informações Adicionais
    if (data.genero !== undefined) {
      updateData.genero = data.genero;
    }
    if (data.municipioResidencia !== undefined) {
      updateData.municipioResidencia = data.municipioResidencia;
    }
    if (data.transporteProprio !== undefined) {
      updateData.transporteProprio = data.transporteProprio;
    }
    if (data.possibilidadeMudancaMorada !== undefined) {
      updateData.possibilidadeMudancaMorada = data.possibilidadeMudancaMorada;
    }
    if (data.fluenciaPortugues !== undefined) {
      updateData.fluenciaPortugues = data.fluenciaPortugues;
    }

    // Atualizar perfil
    const perfil = await prisma.perfilImigrante.update({
      where: { userId },
      data: updateData
    });

    // Deserializar objetivos para o retorno
    return {
      ...perfil,
      // @ts-ignore - Campo atualizado no schema
      objetivos: perfil.objetivos ? JSON.parse(perfil.objetivos) : [],
      objetivoOutros: perfil.objetivoOutros || undefined,
      mensagem: perfil.mensagem || undefined
    } as PerfilImigrante;
  }

  // Deletar perfil de imigrante
  async deletePerfil(userId: string): Promise<void> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilImigrante.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de imigrante não encontrado');
    }

    // Deletar perfil
    await prisma.perfilImigrante.delete({
      where: { userId }
    });
  }

  // Listar todos os perfis de imigrantes (para admin/debug)
  async listPerfis(): Promise<PerfilImigrante[]> {
    const perfis = await prisma.perfilImigrante.findMany({
      include: {
        user: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
            categoria: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Deserializar objetivos para todos os perfis
    return perfis.map(perfil => ({
      ...perfil,
      // @ts-ignore - Campo atualizado no schema
      objetivos: perfil.objetivos ? JSON.parse(perfil.objetivos) : [],
      objetivoOutros: perfil.objetivoOutros || undefined,
      mensagem: perfil.mensagem || undefined
    } as PerfilImigrante));
  }

  // Verificar se usuário tem perfil de imigrante
  async hasPerfilImigrante(userId: string): Promise<boolean> {
    const perfil = await prisma.perfilImigrante.findUnique({
      where: { userId }
    });

    return !!perfil;
  }
} 