// Tipos compartilhados entre frontend e backend

// ✨ NOVO: Constantes para categorias de usuário
export const USER_CATEGORIES = {
  IMIGRANTE: 'IMIGRANTE',
  EMPRESA: 'EMPRESA', 
  MUNICIPIO: 'MUNICIPIO',
  ACADEMIA: 'ACADEMIA',
  FAMILIA_ACOLHIMENTO: 'FAMILIA_ACOLHIMENTO'
} as const;

export type UserCategory = typeof USER_CATEGORIES[keyof typeof USER_CATEGORIES];

// User types (atualizado com categoria)
export interface User {
  id: string;
  nomeCompleto: string;
  email: string;
  telemovel?: string; // Telemóvel do usuário
  foto?: string; // URL da foto do usuário
  categoria?: UserCategory; // ✨ NOVO: categoria do usuário
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  telemovel?: string;
  categoria?: UserCategory; // ✨ NOVO: categoria opcional
}

export interface UpdateUserRequest {
  nomeCompleto?: string;
  email?: string;
  senha?: string;
  telemovel?: string; // Telemóvel do usuário
  foto?: string; // URL da foto do usuário
  categoria?: UserCategory; // ✨ NOVO: categoria opcional
}

// ✨ NOVO: Perfil específico de Imigrante
export interface PerfilImigrante {
  id: string;
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePerfilImigranteRequest {
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
}

export interface UpdatePerfilImigranteRequest {
  nacionalidade?: string;
  dataNascimento?: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
}

// Auth types (atualizado)
export interface RegisterRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  telemovel?: string;
  categoria?: UserCategory; // ✨ NOVO: categoria opcional no registro
}

export interface LoginRequest {
  email: string;
  senha: string;
}

// ✨ NOVO: Registro em 2 etapas
export interface RegisterBasicRequest {
  nomeCompleto: string;
  email: string;
  telemovel?: string;
  senha: string;
  categoria: UserCategory;
}

export interface RegisterBasicResponse {
  userId: string;
  tempToken: string;
  categoria: UserCategory;
}

export interface RegisterImigranteCompleteRequest {
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
}

// Auth Response type
export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ✨ NOVO: Response específico para perfil de imigrante
export interface PerfilImigranteResponse {
  success: boolean;
  data?: PerfilImigrante;
  error?: string;
  message?: string;
}

// Error types
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// ✨ NOVO: Lista de nacionalidades disponíveis
export const NACIONALIDADES = [
  'Portugal',
  'Brasil', 
  'Angola',
  'Moçambique',
  'Cabo Verde',
  'Guiné-Bissau',
  'São Tomé e Príncipe',
  'Timor-Leste',
  'Macau',
  'Alemanha',
  'Áustria',
  'Bélgica',
  'Bulgária',
  'Chipre',
  'Croácia',
  'Dinamarca',
  'Eslováquia',
  'Eslovênia',
  'Espanha',
  'Estados Unidos',
  'França',
  'Itália',
  'Reino Unido',
  'Outros'
] as const;

export type Nacionalidade = typeof NACIONALIDADES[number]; 