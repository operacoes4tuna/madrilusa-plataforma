// Reexport shared types
export type { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse,
  User,
  ApiResponse 
} from '../../../../shared-types/api.types';

// Frontend-specific types
export interface AuthFormData {
  nomeCompleto?: string;
  email: string;
  telemovel?: string;
  senha: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthMode = 'register' | 'login'; 

export interface User {
  id: string;
  nomeCompleto: string;
  email: string;
  foto?: string; // URL da foto do usuário
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
} 