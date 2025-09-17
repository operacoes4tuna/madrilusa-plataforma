// Imports dos tipos que usamos no arquivo
import type { 
  UserCategory, 
  User, 
  RegisterBasicResponse 
} from '../../../../shared-types/api.types.ts';
// USER_CATEGORIES será exportado abaixo junto com outras constantes

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
  
  // Tipos para empresa
  PerfilEmpresa,
  CreatePerfilEmpresaRequest,
  UpdatePerfilEmpresaRequest,
  PerfilEmpresaResponse,
  
  // Tipos para município
  PerfilMunicipio,
  CreatePerfilMunicipioRequest,
  UpdatePerfilMunicipioRequest,
  PerfilMunicipioResponse,
  
  // Tipos para academia
  PerfilAcademia,
  CreatePerfilAcademiaRequest,
  UpdatePerfilAcademiaRequest,
  PerfilAcademiaResponse,
  
  // Tipos para família
  PerfilFamilia,
  CreatePerfilFamiliaRequest,
  UpdatePerfilFamiliaRequest,
  PerfilFamiliaResponse,
  
  // ✨ NOVOS: Registro em 2 etapas
  RegisterBasicRequest,
  RegisterBasicResponse,
  RegisterImigranteCompleteRequest,
  RegisterEmpresaCompleteRequest,
  RegisterMunicipioCompleteRequest,
  RegisterAcademiaCompleteRequest,
  RegisterFamiliaCompleteRequest,
  
  // ✨ NOVOS: Nacionalidades
  Nacionalidade,
  
  // ✨ NOVOS ENUMS: Campos adicionais
  Genero,
  FluenciaPortugues
} from '../../../../shared-types/api.types.ts';

// ✨ NOVO: Definições locais para evitar problemas de import
export const USER_CATEGORIES = {
  IMIGRANTE: 'IMIGRANTE',
  EMPRESA: 'EMPRESA', 
  MUNICIPIO: 'MUNICIPIO',
  ACADEMIA: 'ACADEMIA',
  FAMILIA_ACOLHIMENTO: 'FAMILIA_ACOLHIMENTO',
  ADMIN: 'ADMIN'
} as const;

export const NACIONALIDADES = [
  'Portuguesa', 'Angolana', 'Brasileira', 'Cabo-verdiana', 'Guineense',
  'Macaense', 'Moçambicana', 'São-tomense', 'Timorense', 'Outra'
] as const;

export const GENEROS = ['F', 'M', 'Outro'] as const;

export const FLUENCIA_PORTUGUES = [
  'Básica', 'Intermediária', 'Avançada', 'Fluente'
] as const;

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
  
  // ✨ NOVOS CAMPOS - Informações Adicionais
  genero?: string; // 'F', 'M', 'Outro'
  municipioResidencia?: string;
  transporteProprio?: boolean;
  possibilidadeMudancaMorada?: boolean;
  fluenciaPortugues?: string; // 'Básica', 'Intermediária', 'Avançada', 'Fluente'
}

export interface CategoryRegistrationState {
  step: 1 | 2;
  category: UserCategory | null;
  basicData: RegisterBasicResponse | null;
  isLoading: boolean;
  error: string | null;
} 