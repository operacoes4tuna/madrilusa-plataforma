// Tipos específicos do módulo Empresas

export interface PerfilEmpresa {
  id: string;
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePerfilEmpresaRequest {
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

export interface UpdatePerfilEmpresaRequest {
  nomeEmpresa?: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

export interface PerfilEmpresaResponse {
  success: boolean;
  data?: PerfilEmpresa;
  error?: string;
  message?: string;
}

// Constantes para validação
export const USER_CATEGORIES = {
  IMIGRANTE: 'IMIGRANTE',
  EMPRESA: 'EMPRESA', 
  MUNICIPIO: 'MUNICIPIO',
  ACADEMIA: 'ACADEMIA',
  FAMILIA_ACOLHIMENTO: 'FAMILIA_ACOLHIMENTO'
} as const;

export type UserCategory = typeof USER_CATEGORIES[keyof typeof USER_CATEGORIES];

// Registro completo de empresa (combina User + PerfilEmpresa)
export interface RegisterEmpresaCompleteRequest {
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
} 