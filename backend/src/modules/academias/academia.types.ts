// Tipos específicos do módulo Academias

export interface PerfilAcademia {
  id: string;
  userId: string;
  nomeAcademia: string;
  tipoAcademia?: string;
  regiao?: string;
  pessoaContacto?: string;
  emailInstitucional?: string;
  telefone?: string;
  ofertaFormativa?: string;
  website?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePerfilAcademiaRequest {
  userId: string;
  nomeAcademia: string;
  tipoAcademia?: string;
  regiao?: string;
  pessoaContacto?: string;
  emailInstitucional?: string;
  telefone?: string;
  ofertaFormativa?: string;
  website?: string;
  observacoes?: string;
}

export interface UpdatePerfilAcademiaRequest {
  nomeAcademia?: string;
  tipoAcademia?: string;
  regiao?: string;
  pessoaContacto?: string;
  emailInstitucional?: string;
  telefone?: string;
  ofertaFormativa?: string;
  website?: string;
  observacoes?: string;
}

export interface PerfilAcademiaResponse {
  success: boolean;
  data?: PerfilAcademia;
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

// Registro completo de academia (combina User + PerfilAcademia)
export interface RegisterAcademiaCompleteRequest {
  userId: string;
  nomeAcademia: string;
  tipoAcademia?: string;
  regiao?: string;
  pessoaContacto?: string;
  emailInstitucional?: string;
  telefone?: string;
  ofertaFormativa?: string;
  website?: string;
  observacoes?: string;
} 