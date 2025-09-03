// Tipos compartilhados entre frontend e backend

// ✨ NOVO: Constantes para categorias de usuário
export const USER_CATEGORIES = {
  IMIGRANTE: 'IMIGRANTE',
  EMPRESA: 'EMPRESA', 
  MUNICIPIO: 'MUNICIPIO',
  ACADEMIA: 'ACADEMIA',
  FAMILIA_ACOLHIMENTO: 'FAMILIA_ACOLHIMENTO',
  ADMIN: 'ADMIN' // ✨ NOVA CATEGORIA - Interface Administração
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
  objetivos?: string[]; // ✨ ALTERADO: array de objetivos selecionados
  objetivoOutros?: string;
  mensagem?: string;
  aceitaNotificacoes?: boolean; // ✨ NOVO: aceita receber notificações
  
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
  objetivos?: string[]; // ✨ ALTERADO: array de objetivos selecionados
  objetivoOutros?: string;
  mensagem?: string;
  aceitaNotificacoes?: boolean; // ✨ NOVO: aceita receber notificações
  
  // ✨ NOVOS CAMPOS - Informações Adicionais
  genero?: Genero;
  municipioResidencia?: string;
  transporteProprio?: boolean;
  possibilidadeMudancaMorada?: boolean;
  fluenciaPortugues?: FluenciaPortugues;
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
  
  // ✨ NOVOS CAMPOS - Informações Adicionais
  genero?: Genero;
  municipioResidencia?: string;
  transporteProprio?: boolean;
  possibilidadeMudancaMorada?: boolean;
  fluenciaPortugues?: FluenciaPortugues;
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

// ✨ DADOS PROFISSIONAIS: Tipos para dados estruturados de imigrantes
export const TIPOS_DADO_PROFISSIONAL = [
  'experiencia',
  'formacao', 
  'idioma'
] as const;

export type TipoDadoProfissional = typeof TIPOS_DADO_PROFISSIONAL[number];

export const NIVEIS_ESCOLARIDADE = [
  'Ensino Básico',
  'Ensino Secundário',
  'Ensino Profissional',
  'Licenciatura',
  'Mestrado',
  'Doutoramento',
  'Outro'
] as const;

export type NivelEscolaridade = typeof NIVEIS_ESCOLARIDADE[number];

export const NIVEIS_IDIOMA = [
  'Básico',
  'Intermédio',
  'Avançado'
] as const;

export type NivelIdioma = typeof NIVEIS_IDIOMA[number];

export const TEMPOS_CARGO = [
  'Menos de 6 meses',
  '6 meses a 1 ano',
  '1 a 2 anos',
  '2 a 5 anos',
  'Mais de 5 anos'
] as const;

export type TempoCargo = typeof TEMPOS_CARGO[number];

// Interfaces para dados específicos por tipo
export interface DadosExperiencia {
  cargo: string;
  empresa: string;
  tempoNoCargo: TempoCargo;
}

export interface DadosFormacao {
  nivelEscolaridade: NivelEscolaridade;
  curso?: string;
  instituicao?: string;
  dataTermino?: string;
}

export interface DadosIdioma {
  idioma: string;
  nivel: NivelIdioma;
}

export type DadosProfissionaisUnion = DadosExperiencia | DadosFormacao | DadosIdioma;

// Interface principal
export interface DadoProfissionalImigrante {
  id: string;
  userId: string;
  tipo: TipoDadoProfissional;
  dados: DadosProfissionaisUnion;
  titulo: string;
  ordem: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Requests
export interface CreateDadoProfissionalRequest {
  tipo: TipoDadoProfissional;
  dados: DadosProfissionaisUnion;
  ordem?: number;
}

export interface UpdateDadoProfissionalRequest {
  dados?: DadosProfissionaisUnion;
  titulo?: string;
  ordem?: number;
  ativo?: boolean;
}

// Interface unificada para contribuições + dados profissionais
export interface ContribuicaoUnificada {
  id: string;
  tipo: 'contribuicao_normal' | TipoDadoProfissional;
  titulo: string;
  descricao: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  
  // Dados específicos (apenas para tipos estruturados)
  dadosEstruturados?: DadosProfissionaisUnion;
  
  // Dados originais (para contribuições normais)
  tipoContribuicao?: TipoContribuicao;
  user?: User;
}

// ✨ SISTEMA CONTRIBUIÇÕES: Interfaces para tipos de contribuição
export interface TipoContribuicao {
  id: string;
  titulo: string;
  categoria: UserCategory;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[];
  perguntasModelo?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTipoContribuicaoRequest {
  titulo: string;
  categoria: UserCategory;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[];
  perguntasModelo?: string;
}

export interface UpdateTipoContribuicaoRequest {
  titulo?: string;
  categoria?: UserCategory;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[];
  perguntasModelo?: string;
  ativo?: boolean;
}

// ✨ SISTEMA CONTRIBUIÇÕES: Interfaces para contribuições dos usuários
export interface Contribuicao {
  id: string;
  userId: string;
  tipoContribuicaoId: string;
  descricao: string;
  tags: string[]; // ✅ SEMPRE array - backend faz parse automático
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relações
  tipoContribuicao?: TipoContribuicao;
  user?: User;
}

export interface CreateContribuicaoRequest {
  tipoContribuicaoId: string;
  descricao: string;
  tags?: string[];
}

export interface UpdateContribuicaoRequest {
  descricao?: string;
  tags?: string[];
  ativo?: boolean;
}

// ✨ SISTEMA CONTRIBUIÇÕES: Interfaces para tags do sistema
export interface TagSistema {
  id: string;
  nome: string;
  cor?: string;
  categoria?: string;
  usos: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTagSistemaRequest {
  nome: string;
  cor?: string;
  categoria?: string;
}

export interface UpdateTagSistemaRequest {
  nome?: string;
  cor?: string;
  categoria?: string;
}

// ✨ SISTEMA CONTRIBUIÇÕES: Responses específicas
export interface ContribuicoesResponse {
  success: boolean;
  data?: Contribuicao[];
  error?: string;
  message?: string;
}

export interface TiposContribuicaoResponse {
  success: boolean;
  data?: TipoContribuicao[];
  error?: string;
  message?: string;
}

export interface TagsSistemaResponse {
  success: boolean;
  data?: TagSistema[];
  error?: string;
  message?: string;
} 