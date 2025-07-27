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