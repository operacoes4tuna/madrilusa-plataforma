// Tipos específicos do módulo Imigrantes

export interface PerfilImigrante {
  id: string;
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivos?: string[]; // Array de objetivos selecionados
  objetivoOutros?: string;
  mensagem?: string;
  aceitaNotificacoes?: boolean; // Aceita receber notificações
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePerfilImigranteRequest {
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivos?: string[]; // Array de objetivos selecionados
  objetivoOutros?: string;
  mensagem?: string;
  aceitaNotificacoes?: boolean; // Aceita receber notificações
}

export interface UpdatePerfilImigranteRequest {
  nacionalidade?: string;
  dataNascimento?: Date;
  objetivos?: string[]; // Array de objetivos selecionados
  objetivoOutros?: string;
  mensagem?: string;
  aceitaNotificacoes?: boolean; // Aceita receber notificações
}

export interface PerfilImigranteResponse {
  success: boolean;
  data?: PerfilImigrante;
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

// Lista de países para nacionalidade
export const NACIONALIDADES = [
  'Portugal',
  'Brasil', 
  'Angola',
  'Moçambique',
  'Cabo Verde',
  'Guiné-Bissau',
  'São Tomé e Príncipe',
  'Timor-Leste',
  'Macau',
  'Alemanha',
  'Áustria',
  'Bélgica',
  'Bulgária',
  'Chipre',
  'Croácia',
  'Dinamarca',
  'Eslováquia',
  'Eslovênia',
  'Espanha',
  'Estados Unidos',
  'França',
  'Itália',
  'Reino Unido',
  'Outros'
] as const;

export const OBJETIVOS_IMIGRANTE = [
  'Emprego',
  'Formação',
  'Regularização'
] as const; 