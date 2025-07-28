import { prisma } from '../../shared/database';
import type { UpdateUserRequest } from '../../../shared-types/api.types';

export const userService = {
  async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        telemovel: true,
        foto: true,
        categoria: true, // ✨ ADICIONADO: categoria
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        telemovel: true,
        foto: true,
        categoria: true, // ✨ ADICIONADO: categoria
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  },

  // ✨ NOVO: Buscar usuário por ID incluindo senha (para auth)
  async getUserByIdWithPassword(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  // ✨ ATUALIZADO: createUser agora aceita categoria
  async createUser(data: { 
    nomeCompleto: string; 
    email: string; 
    senha: string; 
    telemovel?: string;
    categoria?: string; // ✨ ADICIONADO: categoria opcional
  }) {
    const user = await prisma.user.create({
      data: {
        nomeCompleto: data.nomeCompleto,
        email: data.email.toLowerCase(),
        senha: data.senha, // Sem hash por enquanto
        telemovel: data.telemovel,
        categoria: data.categoria, // ✨ ADICIONADO: categoria
      },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        telemovel: true,
        foto: true,
        categoria: true, // ✨ ADICIONADO: categoria
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  },

  async updateUser(id: string, data: UpdateUserRequest) {
    const updateData: any = {};
    
    if (data.nomeCompleto !== undefined) {
      updateData.nomeCompleto = data.nomeCompleto;
    }
    
    if (data.email !== undefined) {
      updateData.email = data.email.toLowerCase();
    }
    
    if (data.senha !== undefined) {
      updateData.senha = data.senha;
    }
    
    if (data.telemovel !== undefined) {
      updateData.telemovel = data.telemovel;
    }
    
    if (data.foto !== undefined) {
      updateData.foto = data.foto;
    }

    // ✨ ADICIONADO: Suporte para atualizar categoria
    if (data.categoria !== undefined) {
      updateData.categoria = data.categoria;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        telemovel: true,
        foto: true,
        categoria: true, // ✨ ADICIONADO: categoria
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return user;
  },

  async deleteUser(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  // ✨ NOVO: Buscar usuários por categoria
  async getUsersByCategory(categoria: string) {
    const users = await prisma.user.findMany({
      where: { categoria },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        telemovel: true,
        foto: true,
        categoria: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  },

  // ✨ NOVO: Contar usuários por categoria
  async countUsersByCategory() {
    const counts = await prisma.user.groupBy({
      by: ['categoria'],
      _count: {
        categoria: true,
      },
    });
    return counts;
  }
}; 