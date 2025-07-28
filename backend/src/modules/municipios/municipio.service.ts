import { PrismaClient } from '@prisma/client';
import { 
  CreatePerfilMunicipioRequest, 
  UpdatePerfilMunicipioRequest, 
  PerfilMunicipio,
  USER_CATEGORIES
} from './municipio.types';

const prisma = new PrismaClient();

export class MunicipioService {
  // Criar perfil de município
  async createPerfil(data: CreatePerfilMunicipioRequest): Promise<PerfilMunicipio> {
    // Verificar se usuário existe e tem categoria MUNICIPIO
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.categoria !== USER_CATEGORIES.MUNICIPIO) {
      throw new Error('Usuário não é da categoria MUNICIPIO');
    }

    // Verificar se já existe perfil para este usuário
    const existingProfile = await prisma.perfilMunicipio.findUnique({
      where: { userId: data.userId }
    });

    if (existingProfile) {
      throw new Error('Perfil de município já existe para este usuário');
    }

    // Criar perfil
    const perfil = await prisma.perfilMunicipio.create({
      data: {
        userId: data.userId,
        nomeMunicipio: data.nomeMunicipio || null,
        distrito: data.distrito || null,
        pessoaContacto: data.pessoaContacto || null,
        funcaoCargo: data.funcaoCargo || null,
        projetosApoio: data.projetosApoio || null,
        disponibilidadeAcoes: data.disponibilidadeAcoes || null,
        observacoes: data.observacoes || null
      }
    });

    return perfil as PerfilMunicipio;
  }

  // Buscar perfil de município por userId
  async getPerfilByUserId(userId: string): Promise<PerfilMunicipio | null> {
    const perfil = await prisma.perfilMunicipio.findUnique({
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
      nomeMunicipio: perfil.nomeMunicipio || undefined,
      distrito: perfil.distrito || undefined,
      pessoaContacto: perfil.pessoaContacto || undefined,
      funcaoCargo: perfil.funcaoCargo || undefined,
      projetosApoio: perfil.projetosApoio || undefined,
      disponibilidadeAcoes: perfil.disponibilidadeAcoes || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilMunicipio;
  }

  // Buscar perfil de município por ID
  async getPerfilById(id: string): Promise<PerfilMunicipio | null> {
    const perfil = await prisma.perfilMunicipio.findUnique({
      where: { id }
    });

    if (!perfil) return null;

    return {
      ...perfil,
      nomeMunicipio: perfil.nomeMunicipio || undefined,
      distrito: perfil.distrito || undefined,
      pessoaContacto: perfil.pessoaContacto || undefined,
      funcaoCargo: perfil.funcaoCargo || undefined,
      projetosApoio: perfil.projetosApoio || undefined,
      disponibilidadeAcoes: perfil.disponibilidadeAcoes || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilMunicipio;
  }

  // Atualizar perfil de município
  async updatePerfil(userId: string, data: UpdatePerfilMunicipioRequest): Promise<PerfilMunicipio> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilMunicipio.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de município não encontrado');
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.nomeMunicipio !== undefined) {
      updateData.nomeMunicipio = data.nomeMunicipio;
    }
    if (data.distrito !== undefined) {
      updateData.distrito = data.distrito;
    }
    if (data.pessoaContacto !== undefined) {
      updateData.pessoaContacto = data.pessoaContacto;
    }
    if (data.funcaoCargo !== undefined) {
      updateData.funcaoCargo = data.funcaoCargo;
    }
    if (data.projetosApoio !== undefined) {
      updateData.projetosApoio = data.projetosApoio;
    }
    if (data.disponibilidadeAcoes !== undefined) {
      updateData.disponibilidadeAcoes = data.disponibilidadeAcoes;
    }
    if (data.observacoes !== undefined) {
      updateData.observacoes = data.observacoes;
    }

    // Atualizar perfil
    const perfil = await prisma.perfilMunicipio.update({
      where: { userId },
      data: updateData
    });

    return {
      ...perfil,
      nomeMunicipio: perfil.nomeMunicipio || undefined,
      distrito: perfil.distrito || undefined,
      pessoaContacto: perfil.pessoaContacto || undefined,
      funcaoCargo: perfil.funcaoCargo || undefined,
      projetosApoio: perfil.projetosApoio || undefined,
      disponibilidadeAcoes: perfil.disponibilidadeAcoes || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilMunicipio;
  }

  // Deletar perfil de município
  async deletePerfil(userId: string): Promise<void> {
    // Verificar se perfil existe
    const existingProfile = await prisma.perfilMunicipio.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new Error('Perfil de município não encontrado');
    }

    // Deletar perfil
    await prisma.perfilMunicipio.delete({
      where: { userId }
    });
  }

  // Listar todos os perfis de municípios (para admin/debug)
  async listPerfis(): Promise<PerfilMunicipio[]> {
    const perfis = await prisma.perfilMunicipio.findMany({
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
      nomeMunicipio: perfil.nomeMunicipio || undefined,
      distrito: perfil.distrito || undefined,
      pessoaContacto: perfil.pessoaContacto || undefined,
      funcaoCargo: perfil.funcaoCargo || undefined,
      projetosApoio: perfil.projetosApoio || undefined,
      disponibilidadeAcoes: perfil.disponibilidadeAcoes || undefined,
      observacoes: perfil.observacoes || undefined
    } as PerfilMunicipio));
  }

  // Verificar se usuário tem perfil de município
  async hasPerfilByUserId(userId: string): Promise<boolean> {
    const perfil = await prisma.perfilMunicipio.findUnique({
      where: { userId }
    });

    return !!perfil;
  }
} 