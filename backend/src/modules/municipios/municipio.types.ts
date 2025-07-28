// Tipos específicos do módulo Municípios

export interface PerfilMunicipio {
  id: string;
  userId: string;
  nomeMunicipio?: string;
  distrito?: string;
  pessoaContacto?: string;
  funcaoCargo?: string;
  projetosApoio?: string;
  disponibilidadeAcoes?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePerfilMunicipioRequest {
  userId: string;
  nomeMunicipio?: string;
  distrito?: string;
  pessoaContacto?: string;
  funcaoCargo?: string;
  projetosApoio?: string;
  disponibilidadeAcoes?: string;
  observacoes?: string;
}

export interface UpdatePerfilMunicipioRequest {
  nomeMunicipio?: string;
  distrito?: string;
  pessoaContacto?: string;
  funcaoCargo?: string;
  projetosApoio?: string;
  disponibilidadeAcoes?: string;
  observacoes?: string;
}

export interface PerfilMunicipioResponse {
  success: boolean;
  data?: PerfilMunicipio;
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

// Registro completo de município (combina User + PerfilMunicipio)
export interface RegisterMunicipioCompleteRequest {
  userId: string;
  nomeMunicipio?: string;
  distrito?: string;
  pessoaContacto?: string;
  funcaoCargo?: string;
  projetosApoio?: string;
  disponibilidadeAcoes?: string;
  observacoes?: string;
} 