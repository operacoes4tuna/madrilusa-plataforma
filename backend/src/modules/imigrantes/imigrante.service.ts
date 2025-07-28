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
        objetivoEmprego: data.objetivoEmprego || null,
        objetivoFormacao: data.objetivoFormacao || null,
        objetivoRegularizacao: data.objetivoRegularizacao || null,
        objetivoOutros: data.objetivoOutros || null,
        mensagem: data.mensagem || null
      }
    });

    return perfil;
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

    return perfil;
  }

  // Buscar perfil de imigrante por ID
  async getPerfilById(id: string): Promise<PerfilImigrante | null> {
    const perfil = await prisma.perfilImigrante.findUnique({
      where: { id }
    });

    return perfil;
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
    if (data.objetivoEmprego !== undefined) {
      updateData.objetivoEmprego = data.objetivoEmprego;
    }
    if (data.objetivoFormacao !== undefined) {
      updateData.objetivoFormacao = data.objetivoFormacao;
    }
    if (data.objetivoRegularizacao !== undefined) {
      updateData.objetivoRegularizacao = data.objetivoRegularizacao;
    }
    if (data.objetivoOutros !== undefined) {
      updateData.objetivoOutros = data.objetivoOutros;
    }
    if (data.mensagem !== undefined) {
      updateData.mensagem = data.mensagem;
    }

    // Atualizar perfil
    const perfil = await prisma.perfilImigrante.update({
      where: { userId },
      data: updateData
    });

    return perfil;
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

    return perfis;
  }

  // Verificar se usuário tem perfil de imigrante
  async hasPerfilImigrante(userId: string): Promise<boolean> {
    const perfil = await prisma.perfilImigrante.findUnique({
      where: { userId }
    });

    return !!perfil;
  }
} 