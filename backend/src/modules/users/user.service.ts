import { prisma } from '@/shared/database';
import { AppError } from '@/shared/middleware/errorHandler';
import { CreateUserRequest, UpdateUserRequest, SafeUser, UserServiceInterface } from './user.types';

export class UserService implements UserServiceInterface {
  
  async create(data: CreateUserRequest): Promise<SafeUser> {
    try {
      const user = await prisma.user.create({
        data: {
          nomeCompleto: data.nomeCompleto,
          email: data.email.toLowerCase(),
          senha: data.senha, // Sem hash por enquanto
        },
      });

      return this.excludePassword(user);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new AppError('Este email já está em uso', 400, 'DUPLICATE_EMAIL');
      }
      throw new AppError('Erro ao criar usuário', 500);
    }
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.excludePassword(user) : null;
  }

  async findByEmail(email: string): Promise<any> {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => this.excludePassword(user));
  }

  async update(id: string, data: UpdateUserRequest): Promise<SafeUser> {
    try {
      const updateData: any = {};
      
      if (data.nomeCompleto) updateData.nomeCompleto = data.nomeCompleto;
      if (data.email) updateData.email = data.email.toLowerCase();
      if (data.senha) updateData.senha = data.senha; // Sem hash por enquanto

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      return this.excludePassword(user);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new AppError('Este email já está em uso', 400, 'DUPLICATE_EMAIL');
      }
      if (error.code === 'P2025') {
        throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
      }
      throw new AppError('Erro ao atualizar usuário', 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
      }
      throw new AppError('Erro ao deletar usuário', 500);
    }
  }

  private excludePassword(user: any): SafeUser {
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const userService = new UserService(); 