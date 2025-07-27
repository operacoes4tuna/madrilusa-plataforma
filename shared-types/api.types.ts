// Tipos compartilhados entre frontend e backend

// User types
export interface User {
  id: string;
  nomeCompleto: string;
  email: string;
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

export interface AuthResponse {
  user: User;
  message: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
} 