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
  
  // ✨ NOVOS CAMPOS - Informações Adicionais
  genero?: Genero;
  municipioResidencia?: string;
  transporteProprio?: boolean;
  possibilidadeMudancaMorada?: boolean;
  fluenciaPortugues?: FluenciaPortugues;
  
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
  
  // ✨ NOVOS CAMPOS - Informações Adicionais
  genero?: Genero;
  municipioResidencia?: string;
  transporteProprio?: boolean;
  possibilidadeMudancaMorada?: boolean;
  fluenciaPortugues?: FluenciaPortugues;
}

export interface UpdatePerfilImigranteRequest {
  nacionalidade?: string;
  dataNascimento?: Date;
  objetivos?: string[]; // Array de objetivos selecionados
  objetivoOutros?: string;
  mensagem?: string;
  aceitaNotificacoes?: boolean; // Aceita receber notificações
  
  // ✨ NOVOS CAMPOS - Informações Adicionais
  genero?: Genero;
  municipioResidencia?: string;
  transporteProprio?: boolean;
  possibilidadeMudancaMorada?: boolean;
  fluenciaPortugues?: FluenciaPortugues;
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
// Lista de nacionalidades no feminino - Países lusófonos primeiro, depois alfabética
export const NACIONALIDADES = [
  // Países de língua portuguesa (prioritários)
  'Portuguesa',
  'Angolana',
  'Brasileira',
  'Cabo-verdiana',
  'Guineense',
  'Macaense',
  'Moçambicana',
  'São-tomense',
  'Timorense',
  
  // Outras nacionalidades (ordem alfabética)
  'Afegã',
  'Africana',
  'Albanesa',
  'Alemã',
  'Americana',
  'Andorrana',
  'Argelina',
  'Argentina',
  'Arménia',
  'Australiana',
  'Austríaca',
  'Azerbaijana',
  'Bahraini',
  'Bangladeshiana',
  'Barbadiana',
  'Belga',
  'Belizenha',
  'Bielorrussa',
  'Boliviana',
  'Bósnia',
  'Botswanesa',
  'Búlgara',
  'Burkinabe',
  'Burundesa',
  'Butanesa',
  'Cambojana',
  'Camaronesa',
  'Canadiana',
  'Catariana',
  'Cazaque',
  'Chadiana',
  'Chilena',
  'Chinesa',
  'Cipriota',
  'Colombiana',
  'Comorense',
  'Congolesa',
  'Coreana',
  'Costa-riquenha',
  'Croata',
  'Cubana',
  'Dinamarquesa',
  'Dominicana',
  'Egípcia',
  'Salvadorenha',
  'Emiradense',
  'Equatoriana',
  'Eritreia',
  'Eslovaca',
  'Eslovena',
  'Espanhola',
  'Estónia',
  'Etíope',
  'Fijiana',
  'Filipina',
  'Finlandesa',
  'Francesa',
  'Gabonesa',
  'Gambiana',
  'Ganesa',
  'Georgiana',
  'Grega',
  'Grenada',
  'Guatemalteca',
  'Guianense',
  'Haitiana',
  'Hondurenha',
  'Húngara',
  'Iemenita',
  'Indiana',
  'Indonésia',
  'Iraniana',
  'Iraquiana',
  'Irlandesa',
  'Islandesa',
  'Israelita',
  'Italiana',
  'Jamaicana',
  'Japonesa',
  'Jordana',
  'Quilombola',
  'Kosovar',
  'Kuwaitiana',
  'Laociana',
  'Letã',
  'Libanesa',
  'Liberiana',
  'Líbia',
  'Liechtensteiniana',
  'Lituana',
  'Luxemburguesa',
  'Macedónia',
  'Malgaxe',
  'Malaia',
  'Malauiana',
  'Maldivense',
  'Maliana',
  'Maltesa',
  'Marroquina',
  'Mauriciana',
  'Mauritana',
  'Mexicana',
  'Moldava',
  'Monegasca',
  'Mongol',
  'Montenegrina',
  'Namibiana',
  'Nepalesa',
  'Nicaraguense',
  'Nigeriana',
  'Nigerina',
  'Norueguesa',
  'Neozelandesa',
  'Omanense',
  'Holandesa',
  'Paquistanesa',
  'Palauense',
  'Palestiniana',
  'Panamenha',
  'Papua',
  'Paraguaia',
  'Peruana',
  'Polaca',
  'Romena',
  'Ruandesa',
  'Russa',
  'Samoana',
  'Saudita',
  'Senegalesa',
  'Serra-leonesa',
  'Sérvia',
  'Seichelense',
  'Singapurense',
  'Síria',
  'Somali',
  'Sri-lankesa',
  'Sueca',
  'Suíça',
  'Surinamesa',
  'Tailandesa',
  'Tanzaniana',
  'Tcheca',
  'Togolesa',
  'Tonganesa',
  'Tunisiana',
  'Turca',
  'Turcomena',
  'Tuvaluana',
  'Ucraniana',
  'Ugandesa',
  'Uruguaia',
  'Uzbeque',
  'Venezuelana',
  'Vietnamita',
  'Zambiana',
  'Zimbabuense',
  'Outra'
] as const;

export const OBJETIVOS_IMIGRANTE = [
  'Emprego',
  'Formação',
  'Regularização'
] as const;

// ✨ NOVOS ENUMS: Campos adicionais para imigrantes
export const GENEROS = [
  'F',
  'M', 
  'Outro'
] as const;

export type Genero = typeof GENEROS[number];

export const FLUENCIA_PORTUGUES = [
  'Básica',
  'Intermediária', 
  'Avançada',
  'Fluente'
] as const;

export type FluenciaPortugues = typeof FLUENCIA_PORTUGUES[number]; 