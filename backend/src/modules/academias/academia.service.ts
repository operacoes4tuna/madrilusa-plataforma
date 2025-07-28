import { PrismaClient } from '@prisma/client';
import { 
  CreatePerfilAcademiaRequest, 
  UpdatePerfilAcademiaRequest, 
  PerfilAcademia,
  USER_CATEGORIES
} from './academia.types';

const prisma = new PrismaClient();

export class AcademiaService {
  // Criar perfil de academia
  async createPerfil(data: CreatePerfilAcademiaRequest): Promise<PerfilAcademia> {
    // Verificar se usuário existe e tem categoria ACADEMIA
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.categoria !== USER_CATEGORIES.ACADEMIA) {
      throw new Error('Usuário não é da categoria ACADEMIA');
    }

    // Verificar se já existe perfil para este usuário
    const existingProfile = await prisma.perfilAcademia.findUnique({
      where: { userId: data.userId }
    });

    if (existingProfile) {
      throw new Error('Perfil de academia já existe para este usuário');
    }

    // Criar perfil
    const perfil = await prisma.perfilAcademia.create({
      data: {
        userId: data.userId,
        nomeAcademia: data.nomeAcademia,
        tipoAcademia: data.tipoAcademia || null,
        regiao: data.regiao || null,
        pessoaContacto: data.pessoaContacto || null,
        emailInstitucional: data.emailInstitucional || null,
        telefone: data.telefone || null,
        ofertaFormativa: data.ofertaFormativa || null,
        website: data.website || null,
        observacoes: data.observacoes || null
      }
    });

    return perfil as PerfilAcademia;
  }

  // Buscar perfil de academia por userId
  async getPerfilByUserId(userId: string): Promise<PerfilAcademia | null> {
    const perfil = await prisma.perfilAcademia.findUnique({
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
      tipoAcademia: perfil.tipoAcademia || undefined,
      regiao: perfil.regiao || undefined,
      pessoaContacto: perfil.pessoaContacto || undefined,
      emailInstitucional: perfil.emailInstitucional || undefined,
      telefone: perfil.telefone || undefined,
      ofertaFormativa: perfil.ofertaFormativa || undefined,
      website: perfil.website || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilAcademia;
  }

  // Buscar perfil de academia por ID
  async getPerfilById(id: string): Promise<PerfilAcademia | null> {
    const perfil = await prisma.perfilAcademia.findUnique({
      where: { id }
    });

    if (!perfil) return null;

    return {
      ...perfil,
      tipoAcademia: perfil.tipoAcademia || undefined,
      regiao: perfil.regiao || undefined,
      pessoaContacto: perfil.pessoaContacto || undefined,
      emailInstitucional: perfil.emailInstitucional || undefined,
      telefone: perfil.telefone || undefined,
      ofertaFormativa: perfil.ofertaFormativa || undefined,
      website: perfil.website || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilAcademia;
  }

  // Atualizar perfil de academia
  async updatePerfil(userId: string, data: UpdatePerfilAcademiaRequest): Promise<PerfilAcademia> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilAcademia.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de academia não encontrado');
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.nomeAcademia !== undefined) {
      updateData.nomeAcademia = data.nomeAcademia;
    }
    if (data.tipoAcademia !== undefined) {
      updateData.tipoAcademia = data.tipoAcademia;
    }
    if (data.regiao !== undefined) {
      updateData.regiao = data.regiao;
    }
    if (data.pessoaContacto !== undefined) {
      updateData.pessoaContacto = data.pessoaContacto;
    }
    if (data.emailInstitucional !== undefined) {
      updateData.emailInstitucional = data.emailInstitucional;
    }
    if (data.telefone !== undefined) {
      updateData.telefone = data.telefone;
    }
    if (data.ofertaFormativa !== undefined) {
      updateData.ofertaFormativa = data.ofertaFormativa;
    }
    if (data.website !== undefined) {
      updateData.website = data.website;
    }
    if (data.observacoes !== undefined) {
      updateData.observacoes = data.observacoes;
    }

    // Atualizar perfil
    const perfil = await prisma.perfilAcademia.update({
      where: { userId },
      data: updateData
    });

    return {
      ...perfil,
      tipoAcademia: perfil.tipoAcademia || undefined,
      regiao: perfil.regiao || undefined,
      pessoaContacto: perfil.pessoaContacto || undefined,
      emailInstitucional: perfil.emailInstitucional || undefined,
      telefone: perfil.telefone || undefined,
      ofertaFormativa: perfil.ofertaFormativa || undefined,
      website: perfil.website || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilAcademia;
  }

  // Deletar perfil de academia
  async deletePerfil(userId: string): Promise<void> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilAcademia.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de academia não encontrado');
    }

    // Deletar perfil
    await prisma.perfilAcademia.delete({
      where: { userId }
    });
  }

  // Listar todos os perfis de academias (para admin/debug)
  async listPerfis(): Promise<PerfilAcademia[]> {
    const perfis = await prisma.perfilAcademia.findMany({
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
      tipoAcademia: perfil.tipoAcademia || undefined,
      regiao: perfil.regiao || undefined,
      pessoaContacto: perfil.pessoaContacto || undefined,
      emailInstitucional: perfil.emailInstitucional || undefined,
      telefone: perfil.telefone || undefined,
      ofertaFormativa: perfil.ofertaFormativa || undefined,
      website: perfil.website || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilAcademia));
  }

  // Verificar se usuário tem perfil de academia
  async hasPerfilByUserId(userId: string): Promise<boolean> {
    const perfil = await prisma.perfilAcademia.findUnique({
      where: { userId }
    });

    return !!perfil;
  }
} 