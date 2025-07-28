// Imports dos tipos que usamos no arquivo
import type { 
  UserCategory, 
  User, 
  RegisterBasicResponse 
} from '../../../../shared-types/api.types';

// Reexport ALL shared types (atualizado com categorias)
export type { 
  // ✅ Tipos existentes
  RegisterRequest, 
  LoginRequest, 
  AuthResponse,
  User,
  ApiResponse,
  
  // ✨ NOVOS: Tipos para categorias
  UserCategory,
  PerfilImigrante,
  CreatePerfilImigranteRequest,
  UpdatePerfilImigranteRequest,
  PerfilImigranteResponse,
  
  // ✨ FASE 2: Tipos para empresa
  PerfilEmpresa,
  CreatePerfilEmpresaRequest,
  UpdatePerfilEmpresaRequest,
  PerfilEmpresaResponse,
  
  // ✨ NOVOS: Registro em 2 etapas
  RegisterBasicRequest,
  RegisterBasicResponse,
  RegisterImigranteCompleteRequest,
  RegisterEmpresaCompleteRequest,
  
  // ✨ NOVOS: Nacionalidades
  Nacionalidade
} from '../../../../shared-types/api.types';

// ✨ NOVO: Reexportar valores (constantes)
export { 
  USER_CATEGORIES,
  NACIONALIDADES 
} from '../../../../shared-types/api.types';

// Frontend-specific types (únicos do frontend)
export interface AuthFormData {
  nomeCompleto?: string;
  email: string;
  telemovel?: string;
  senha: string;
  categoria?: UserCategory; // ✨ ADICIONADO: categoria opcional
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthMode = 'register' | 'login';

// ✨ NOVO: Tipos específicos para fluxo em 2 etapas no frontend
export interface BasicRegistrationFormData {
  nomeCompleto: string;
  email: string;
  telemovel?: string;
  senha: string;
  categoria: UserCategory;
}

export interface ImigranteRegistrationFormData {
  nacionalidade: string;
  dataNascimento: string; // String porque input type="date" retorna string
  objetivos?: string[]; // Array de objetivos selecionados
  objetivoOutros?: string;
  mensagem?: string;
  aceitaNotificacoes?: boolean; // Aceita receber notificações
}

export interface CategoryRegistrationState {
  step: 1 | 2;
  category: UserCategory | null;
  basicData: RegisterBasicResponse | null;
  isLoading: boolean;
  error: string | null;
} 