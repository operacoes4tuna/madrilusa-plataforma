// Tipos compartilhados entre frontend e backend

// User types
export interface User {
  id: string;
  nomeCompleto: string;
  email: string;
  foto?: string; // URL da foto do usuário
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
}

export interface UpdateUserRequest {
  nomeCompleto?: string;
  email?: string;
  senha?: string;
  foto?: string; // URL da foto do usuário
}

// Auth types
export interface RegisterRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error types
export interface ApiError {
  status: number;
  message: string;
  details?: any;
} 