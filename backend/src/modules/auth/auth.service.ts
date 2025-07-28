import { userService } from '../users/user.service';
import type { RegisterRequest, LoginRequest } from '../../../shared-types/api.types';

export const authService = {
  async register(data: RegisterRequest) {
    // Verificar se email já existe
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Criar usuário
    const user = await userService.createUser(data);
    return user;
  },

  async login(data: LoginRequest) {
    // Buscar usuário com senha
    const user = await userService.getUserByEmail(data.email);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha (sem hash por enquanto)
    if (user.senha !== data.senha) {
      throw new Error('Credenciais inválidas');
    }

    // Retornar usuário sem senha
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}; 