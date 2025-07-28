import { PrismaClient } from '@prisma/client';
import { 
  CreatePerfilEmpresaRequest, 
  UpdatePerfilEmpresaRequest, 
  PerfilEmpresa,
  USER_CATEGORIES
} from './empresa.types';

const prisma = new PrismaClient();

export class EmpresaService {
  // Criar perfil de empresa
  async createPerfil(data: CreatePerfilEmpresaRequest): Promise<PerfilEmpresa> {
    // Verificar se usuário existe e tem categoria EMPRESA
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.categoria !== USER_CATEGORIES.EMPRESA) {
      throw new Error('Usuário não é da categoria EMPRESA');
    }

    // Verificar se já existe perfil para este usuário
    const existingProfile = await prisma.perfilEmpresa.findUnique({
      where: { userId: data.userId }
    });

    if (existingProfile) {
      throw new Error('Perfil de empresa já existe para este usuário');
    }

    // Criar perfil
    const perfil = await prisma.perfilEmpresa.create({
      data: {
        userId: data.userId,
        nomeEmpresa: data.nomeEmpresa,
        pessoaContacto: data.pessoaContacto || null,
        morada: data.morada || null,
        observacoes: data.observacoes || null
      }
    });

    return perfil as PerfilEmpresa;
  }

  // Buscar perfil de empresa por userId
  async getPerfilByUserId(userId: string): Promise<PerfilEmpresa | null> {
    const perfil = await prisma.perfilEmpresa.findUnique({
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
      pessoaContacto: perfil.pessoaContacto || undefined,
      morada: perfil.morada || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilEmpresa;
  }

  // Buscar perfil de empresa por ID
  async getPerfilById(id: string): Promise<PerfilEmpresa | null> {
    const perfil = await prisma.perfilEmpresa.findUnique({
      where: { id }
    });

    if (!perfil) return null;

    return {
      ...perfil,
      pessoaContacto: perfil.pessoaContacto || undefined,
      morada: perfil.morada || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilEmpresa;
  }

  // Atualizar perfil de empresa
  async updatePerfil(userId: string, data: UpdatePerfilEmpresaRequest): Promise<PerfilEmpresa> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilEmpresa.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de empresa não encontrado');
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.nomeEmpresa !== undefined) {
      updateData.nomeEmpresa = data.nomeEmpresa;
    }
    if (data.pessoaContacto !== undefined) {
      updateData.pessoaContacto = data.pessoaContacto;
    }
    if (data.morada !== undefined) {
      updateData.morada = data.morada;
    }
    if (data.observacoes !== undefined) {
      updateData.observacoes = data.observacoes;
    }

    // Atualizar perfil
    const perfil = await prisma.perfilEmpresa.update({
      where: { userId },
      data: updateData
    });

    return {
      ...perfil,
      pessoaContacto: perfil.pessoaContacto || undefined,
      morada: perfil.morada || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilEmpresa;
  }

  // Deletar perfil de empresa
  async deletePerfil(userId: string): Promise<void> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilEmpresa.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de empresa não encontrado');
    }

    // Deletar perfil
    await prisma.perfilEmpresa.delete({
      where: { userId }
    });
  }

  // Listar todos os perfis de empresas (para admin/debug)
  async listPerfis(): Promise<PerfilEmpresa[]> {
    const perfis = await prisma.perfilEmpresa.findMany({
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
      pessoaContacto: perfil.pessoaContacto || undefined,
      morada: perfil.morada || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilEmpresa));
  }

  // Verificar se usuário tem perfil de empresa
  async hasPerfilByUserId(userId: string): Promise<boolean> {
    const perfil = await prisma.perfilEmpresa.findUnique({
      where: { userId }
    });

    return !!perfil;
  }
} 