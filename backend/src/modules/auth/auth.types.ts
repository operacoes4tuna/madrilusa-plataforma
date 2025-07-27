import { RegisterRequest, LoginRequest, AuthResponse } from '../../../../shared-types/api.types';
import { SafeUser } from '../users/user.types';

// Reexport shared types
export { RegisterRequest, LoginRequest, AuthResponse };

// Internal types
export interface AuthServiceInterface {
  register(data: RegisterRequest): Promise<SafeUser>;
  login(data: LoginRequest): Promise<SafeUser>;
}

export interface AuthUser {
  id: string;
  nomeCompleto: string;
  email: string;
} 