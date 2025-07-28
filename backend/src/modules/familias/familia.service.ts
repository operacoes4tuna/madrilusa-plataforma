import { PrismaClient } from '@prisma/client';
import { 
  CreatePerfilFamiliaRequest, 
  UpdatePerfilFamiliaRequest, 
  PerfilFamilia,
  USER_CATEGORIES
} from './familia.types';

const prisma = new PrismaClient();

export class FamiliaService {
  // Criar perfil de família
  async createPerfil(data: CreatePerfilFamiliaRequest): Promise<PerfilFamilia> {
    // Verificar se usuário existe e tem categoria FAMILIA_ACOLHIMENTO
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.categoria !== USER_CATEGORIES.FAMILIA_ACOLHIMENTO) {
      throw new Error('Usuário não é da categoria FAMILIA_ACOLHIMENTO');
    }

    // Verificar se já existe perfil para este usuário
    const existingProfile = await prisma.perfilFamilia.findUnique({
      where: { userId: data.userId }
    });

    if (existingProfile) {
      throw new Error('Perfil de família já existe para este usuário');
    }

    // Criar perfil
    const perfil = await prisma.perfilFamilia.create({
      data: {
        userId: data.userId,
        moradaCompleta: data.moradaCompleta,
        quantidadePessoas: data.quantidadePessoas || null,
        tiposAcolhimento: data.tiposAcolhimento || null,
        duracaoAcolhimento: data.duracaoAcolhimento || null,
        observacoes: data.observacoes || null
      }
    });

    return perfil as PerfilFamilia;
  }

  // Buscar perfil de família por userId
  async getPerfilByUserId(userId: string): Promise<PerfilFamilia | null> {
    const perfil = await prisma.perfilFamilia.findUnique({
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

    return {
      ...perfil,
      quantidadePessoas: perfil.quantidadePessoas || undefined,
      tiposAcolhimento: perfil.tiposAcolhimento || undefined,
      duracaoAcolhimento: perfil.duracaoAcolhimento || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilFamilia;
  }

  // Buscar perfil de família por ID
  async getPerfilById(id: string): Promise<PerfilFamilia | null> {
    const perfil = await prisma.perfilFamilia.findUnique({
      where: { id }
    });

    if (!perfil) return null;

    return {
      ...perfil,
      quantidadePessoas: perfil.quantidadePessoas || undefined,
      tiposAcolhimento: perfil.tiposAcolhimento || undefined,
      duracaoAcolhimento: perfil.duracaoAcolhimento || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilFamilia;
  }

  // Atualizar perfil de família
  async updatePerfil(userId: string, data: UpdatePerfilFamiliaRequest): Promise<PerfilFamilia> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilFamilia.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de família não encontrado');
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.moradaCompleta !== undefined) {
      updateData.moradaCompleta = data.moradaCompleta;
    }
    if (data.quantidadePessoas !== undefined) {
      updateData.quantidadePessoas = data.quantidadePessoas;
    }
    if (data.tiposAcolhimento !== undefined) {
      updateData.tiposAcolhimento = data.tiposAcolhimento;
    }
    if (data.duracaoAcolhimento !== undefined) {
      updateData.duracaoAcolhimento = data.duracaoAcolhimento;
    }
    if (data.observacoes !== undefined) {
      updateData.observacoes = data.observacoes;
    }

    // Atualizar perfil
    const perfil = await prisma.perfilFamilia.update({
      where: { userId },
      data: updateData
    });

    return {
      ...perfil,
      quantidadePessoas: perfil.quantidadePessoas || undefined,
      tiposAcolhimento: perfil.tiposAcolhimento || undefined,
      duracaoAcolhimento: perfil.duracaoAcolhimento || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilFamilia;
  }

  // Deletar perfil de família
  async deletePerfil(userId: string): Promise<void> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilFamilia.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de família não encontrado');
    }

    // Deletar perfil
    await prisma.perfilFamilia.delete({
      where: { userId }
    });
  }

  // Listar todos os perfis de famílias (para admin/debug)
  async listPerfis(): Promise<PerfilFamilia[]> {
    const perfis = await prisma.perfilFamilia.findMany({
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

    return perfis.map(perfil => ({
      ...perfil,
      quantidadePessoas: perfil.quantidadePessoas || undefined,
      tiposAcolhimento: perfil.tiposAcolhimento || undefined,
      duracaoAcolhimento: perfil.duracaoAcolhimento || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilFamilia));
  }

  // Verificar se usuário tem perfil de família
  async hasPerfilByUserId(userId: string): Promise<boolean> {
    const perfil = await prisma.perfilFamilia.findUnique({
      where: { userId }
    });

    return !!perfil;
  }
} 