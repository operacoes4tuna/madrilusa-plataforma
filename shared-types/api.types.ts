// Tipos compartilhados entre frontend e backend

// ✨ NOVO: Constantes para categorias de usuário
export const USER_CATEGORIES = {
  IMIGRANTE: 'IMIGRANTE',
  EMPRESA: 'EMPRESA', 
  MUNICIPIO: 'MUNICIPIO',
  ACADEMIA: 'ACADEMIA',
  FAMILIA_ACOLHIMENTO: 'FAMILIA_ACOLHIMENTO'
} as const;

export type UserCategory = typeof USER_CATEGORIES[keyof typeof USER_CATEGORIES];

// User types (atualizado com categoria)
export interface User {
  id: string;
  nomeCompleto: string;
  email: string;
  telemovel?: string; // Telemóvel do usuário
  foto?: string; // URL da foto do usuário
  categoria?: UserCategory; // ✨ NOVO: categoria do usuário
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  telemovel?: string;
  categoria?: UserCategory; // ✨ NOVO: categoria opcional
}

export interface UpdateUserRequest {
  nomeCompleto?: string;
  email?: string;
  senha?: string;
  telemovel?: string; // Telemóvel do usuário
  foto?: string; // URL da foto do usuário
  categoria?: UserCategory; // ✨ NOVO: categoria opcional
}

// ✨ NOVO: Perfil específico de Imigrante
export interface PerfilImigrante {
  id: string;
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivos?: string[]; // ✨ ALTERADO: array de objetivos selecionados (Emprego, Formação, Regularização)
  objetivoOutros?: string; // Mantido como string para texto livre
  mensagem?: string;
  aceitaNotificacoes?: boolean; // ✨ NOVO: aceita receber notificações
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePerfilImigranteRequest {
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivos?: string[]; // ✨ ALTERADO: array de objetivos selecionados
  objetivoOutros?: string;
  mensagem?: string;
  aceitaNotificacoes?: boolean; // ✨ NOVO: aceita receber notificações
}

export interface UpdatePerfilImigranteRequest {
  nacionalidade?: string;
  dataNascimento?: Date;
  objetivos?: string[]; // ✨ ALTERADO: array de objetivos selecionados
  objetivoOutros?: string;
  mensagem?: string;
  aceitaNotificacoes?: boolean; // ✨ NOVO: aceita receber notificações
}

// ✨ FASE 2: Perfil específico de Empresa
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
  id: string;
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✨ FASE 3: Perfil específico de Município
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

// ✨ FASE 4: Perfil específico de Academia
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

// ✨ FASE 5: Perfil específico de Família de Acolhimento
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

// Auth types (atualizado)
export interface RegisterRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  telemovel?: string;
  categoria?: UserCategory; // ✨ NOVO: categoria opcional no registro
}

export interface LoginRequest {
  email: string;
  senha: string;
}

// ✨ NOVO: Registro em 2 etapas
export interface RegisterBasicRequest {
  nomeCompleto: string;
  email: string;
  telemovel?: string;
  senha: string;
  categoria: UserCategory;
}

export interface RegisterBasicResponse {
  userId: string;
  tempToken: string;
  categoria: UserCategory;
}

export interface RegisterImigranteCompleteRequest {
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
}

// ✨ FASE 2: Registro completo de empresa
export interface RegisterEmpresaCompleteRequest {
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

// ✨ FASE 3: Registro completo de município
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

// ✨ FASE 4: Registro completo de academia
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

// ✨ FASE 5: Registro completo de família
export interface RegisterFamiliaCompleteRequest {
  userId: string;
  moradaCompleta: string;
  quantidadePessoas?: string;
  tiposAcolhimento?: string;
  duracaoAcolhimento?: string;
  observacoes?: string;
}

// Auth Response type
export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ✨ NOVO: Response específico para perfil de imigrante
export interface PerfilImigranteResponse {
  success: boolean;
  data?: PerfilImigrante;
  error?: string;
  message?: string;
}

// Error types
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// ✨ NOVO: Lista de nacionalidades no feminino - Países lusófonos primeiro, depois alfabética
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

export type Nacionalidade = typeof NACIONALIDADES[number];

// ✨ NOVO: Objetivos disponíveis para imigrantes
export const OBJETIVOS_IMIGRANTE = [
  'Emprego',
  'Formação',
  'Regularização'
] as const;

export type ObjetivoImigrante = typeof OBJETIVOS_IMIGRANTE[number]; 