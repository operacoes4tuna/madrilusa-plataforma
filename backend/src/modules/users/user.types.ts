import { User as PrismaUser } from '@prisma/client';
import { CreateUserRequest, UpdateUserRequest } from '../../../../shared-types/api.types';

// Reexport shared types
export { CreateUserRequest, UpdateUserRequest };

// User without password for responses
export type SafeUser = Omit<PrismaUser, 'senha'>;

// Internal types
export interface UserServiceInterface {
  create(data: CreateUserRequest): Promise<SafeUser>;
  findById(id: string): Promise<SafeUser | null>;
  findByEmail(email: string): Promise<PrismaUser | null>;
  findAll(): Promise<SafeUser[]>;
  update(id: string, data: UpdateUserRequest): Promise<SafeUser>;
  delete(id: string): Promise<void>;
} 