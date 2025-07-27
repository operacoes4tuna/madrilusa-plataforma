import { userService } from '../users/user.service';
import { AppError } from '@/shared/middleware/errorHandler';
import { RegisterRequest, LoginRequest, AuthServiceInterface } from './auth.types';
import { SafeUser } from '../users/user.types';

export class AuthService implements AuthServiceInterface {
  
  async register(data: RegisterRequest): Promise<SafeUser> {
    try {
      // Verificar se email já existe
      const existingUser = await userService.findByEmail(data.email);
      if (existingUser) {
        throw new AppError('Este email já está em uso', 400, 'EMAIL_EXISTS');
      }

      // Criar usuário (reutilizando service do users)
      const user = await userService.create({
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        senha: data.senha, // Sem hash por enquanto
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao registrar usuário', 500);
    }
  }

  async login(data: LoginRequest): Promise<SafeUser> {
    try {
      // Buscar usuário por email
      const user = await userService.findByEmail(data.email);
      if (!user) {
        throw new AppError('Email ou senha incorretos', 401, 'INVALID_CREDENTIALS');
      }

      // Verificar senha (sem hash por enquanto)
      if (user.senha !== data.senha) {
        throw new AppError('Email ou senha incorretos', 401, 'INVALID_CREDENTIALS');
      }

      // Retornar usuário sem senha
      const { senha, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao fazer login', 500);
    }
  }
}

export const authService = new AuthService(); 