// Tipos específicos do módulo Famílias de Acolhimento

export interface PerfilFamilia {
  id: string;
  userId: string;
  moradaCompleta: string;
  quantidadePessoas?: string;
  tiposAcolhimento?: string;
  duracaoAcolhimento?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePerfilFamiliaRequest {
  userId: string;
  moradaCompleta: string;
  quantidadePessoas?: string;
  tiposAcolhimento?: string;
  duracaoAcolhimento?: string;
  observacoes?: string;
}

export interface UpdatePerfilFamiliaRequest {
  moradaCompleta?: string;
  quantidadePessoas?: string;
  tiposAcolhimento?: string;
  duracaoAcolhimento?: string;
  observacoes?: string;
}

export interface PerfilFamiliaResponse {
  success: boolean;
  data?: PerfilFamilia;
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

// Opções para tipos de acolhimento
export const TIPOS_ACOLHIMENTO = [
  'Dormida',
  'Alimentação',
  'Transporte Local',
  'Apoio Emocional',
  'Acolhimento de Emergência',
  'Outro'
] as const;

// Opções para duração do acolhimento
export const DURACAO_ACOLHIMENTO = [
  'Curto Prazo (até 7 dias)',
  'Médio Prazo (1 a 3 meses)',
  'Longo Prazo (mais de 3 meses)'
] as const;

// Registro completo de família (combina User + PerfilFamilia)
export interface RegisterFamiliaCompleteRequest {
  userId: string;
  moradaCompleta: string;
  quantidadePessoas?: string;
  tiposAcolhimento?: string;
  duracaoAcolhimento?: string;
  observacoes?: string;
} 