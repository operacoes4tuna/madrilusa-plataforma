import { userService } from '../users/user.service';
import type { 
  RegisterRequest, 
  LoginRequest,
  RegisterBasicRequest,
  RegisterBasicResponse,
  USER_CATEGORIES
} from '../../../shared-types/api.types';

export const authService = {
  // ✅ Método existente - Registro simples (mantido para compatibilidade)
  async register(data: RegisterRequest) {
    // Verificar se email já existe
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Criar usuário com categoria opcional
    const user = await userService.createUser({
      nomeCompleto: data.nomeCompleto,
      email: data.email,
      senha: data.senha,
      telemovel: data.telemovel,
      categoria: data.categoria || null
    });
    
    return user;
  },

  // ✨ NOVO: Registro básico (Etapa 1 do fluxo em 2 etapas)
  async registerBasic(data: RegisterBasicRequest): Promise<RegisterBasicResponse> {
    // Verificar se email já existe
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Validar categoria
    const validCategories = Object.values({
      IMIGRANTE: 'IMIGRANTE',
      EMPRESA: 'EMPRESA',
      MUNICIPIO: 'MUNICIPIO', 
      ACADEMIA: 'ACADEMIA',
      FAMILIA_ACOLHIMENTO: 'FAMILIA_ACOLHIMENTO'
    });
    
    if (!validCategories.includes(data.categoria)) {
      throw new Error('Categoria inválida');
    }

    // Criar usuário com dados básicos + categoria
    const user = await userService.createUser({
      nomeCompleto: data.nomeCompleto,
      email: data.email,
      senha: data.senha,
      telemovel: data.telemovel,
      categoria: data.categoria
    });

    // Gerar token temporário (simples para desenvolvimento)
    const tempToken = `temp_${user.id}_${Date.now()}`;

    return {
      userId: user.id,
      tempToken: tempToken,
      categoria: data.categoria
    };
  },

  // ✨ NOVO: Verificar se usuário pode completar registro específico
  async canCompleteRegistration(userId: string, categoria: string): Promise<boolean> {
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return false;
    }

    // Verificar se categoria bate
    if (user.categoria !== categoria) {
      return false;
    }

    return true;
  },

  // ✅ Método existente - Login (mantido)
  async login(data: LoginRequest) {
    // Buscar usuário com senha
    const user = await userService.getUserByEmail(data.email);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha normal
    const isValidPassword = user.senha === data.senha;
    
    // ✨ DESENVOLVIMENTO: Verificar login rápido
    const isDevLogin = process.env.NODE_ENV === 'development' && 
                       data.senha === 'vcgvcg' && 
                       user.email.endsWith('@madrilusa.com.pt');

    if (!isValidPassword && !isDevLogin) {
      throw new Error('Credenciais inválidas');
    }

    // Retornar usuário sem senha
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // ✨ NOVO: Buscar usuário por ID (para verificações)
  async getUserById(userId: string) {
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Retornar sem senha
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // ✨ NOVO: Verificar se categoria é válida
  isValidCategory(categoria: string): boolean {
    const validCategories = ['IMIGRANTE', 'EMPRESA', 'MUNICIPIO', 'ACADEMIA', 'FAMILIA_ACOLHIMENTO'];
    return validCategories.includes(categoria);
  },

  // ✨ NOVO: Listar usuários por categoria (para admin)
  async getUsersByCategory(categoria: string) {
    if (!this.isValidCategory(categoria)) {
      throw new Error('Categoria inválida');
    }

    const users = await userService.getAllUsers();
    const filteredUsers = users.filter(user => user.categoria === categoria);
    
    // Remover senhas
    return filteredUsers.map(user => {
      const { senha, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}; 