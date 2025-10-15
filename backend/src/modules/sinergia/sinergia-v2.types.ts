// Tipos para o novo sistema SinergIA 2.0 - Matching rigoroso Empresa ↔ Imigrante

export interface MatchingCriteria {
  // Critérios Demográficos (peso: 40%)
  genero: {
    match: boolean;
    required: boolean;
    score: number;
    details: string;
  };
  
  idade: {
    match: boolean;
    difference: number;
    score: number;
    details: string;
  };
  
  municipio: {
    match: boolean;
    distance: number;
    score: number;
    details: string;
  };
  
  // Critérios Essenciais (peso: 30%)
  transporteProprio: {
    match: boolean;
    required: boolean;
    score: number;
    details: string;
  };
  
  fluenciaPortugues: {
    match: boolean;
    level: string;
    score: number;
    details: string;
  };
  
  // Critérios Profissionais (peso: 20%)
  experiencias: {
    matches: string[];
    total: number;
    percentage: number;
    score: number;
    details: string;
  };
  
  formacao: {
    match: boolean;
    areas: string[];
    score: number;
    details: string;
  };
  
  // Critérios Complementares (peso: 10%)
  idiomas: {
    matches: string[];
    levels: string[];
    score: number;
    details: string;
  };
  
  habilidades: {
    matches: string[];
    percentage: number;
    score: number;
    details: string;
  };
  
  caracteristicas: {
    matches: string[];
    percentage: number;
    score: number;
    details: string;
  };
}

export interface RigorousMatch {
  oportunidadeId: string;
  imigranteId: string;
  scoreTotal: number; // 0-100
  breakdown: MatchingCriteria;
  justificativa: string;
  tokensUsed: number;
  matchedItems: string[];
  unmatchedItems: string[];
  penalizacoes: string[];
  createdAt: string;
  
  // Dados completos para visualização
  oportunidade?: {
    titulo: string;
    nomeCargo: string;
    nomeProfissao?: string;
    descricaoCargo?: string;
    empresa: string;
    municipioResidencia?: string | null;
    genero: string | null;
    idade?: string | null;
    transporteProprio: string | null;
    fluenciaPortugues: string | null;
    denominacoes: string[];
    experienciasAceitas: string[];
    areasFormacao: string[];
    habilidades: string[];
    caracteristicas: string[];
    idiomasPreferenciais: { idioma: string; nivel: string; }[];
    nivelEscolaridade?: string;
  };
  
  imigrante?: {
    nomeCompleto: string;
    email: string;
    foto?: string;
    municipioResidencia?: string;
    genero?: string;
    idade?: number;
    transporteProprio?: boolean;
    fluenciaPortugues?: string;
    objetivos: string[];
    experiencias: Array<{
      cargo: string;
      empresa: string;
      descricao: string;
      dataInicio: Date;
      dataFim?: Date;
      atual: boolean;
    }>;
    formacoes: Array<{
      curso: string;
      instituicao: string;
      nivel: string;
      status: string;
      dataInicio: Date;
      dataFim?: Date;
    }>;
    idiomas: Array<{
      idioma: string;
      nivel: string;
    }>;
    habilidades: string[];
    contribuicoesTexto: string[];
    interesses: string[];
  };
  
  // Dados estruturados para comparação visual
  dadosEstruturados?: {
    empresa: string;
    empresaFoto?: string;
    municipioResidencia?: string | null;
    genero: string | null;
    idade?: string | null;
    transporteProprio: string | null;
    fluenciaPortugues: string | null;
  };
}

export interface ImigranteCompleteProfile {
  id: string;
  nomeCompleto: string;
  email: string;
  foto?: string;

  // Dados básicos
  genero?: string;
  municipioResidencia?: string;
  transporteProprio?: boolean;
  fluenciaPortugues?: string;
  idade?: number;
  
  // Dados profissionais estruturados
  experiencias: {
    cargo: string;
    empresa: string;
    descricao: string;
    tempoNoCargo: string;
  }[];
  
  formacoes: {
    nivelEscolaridade: string;
    areaEstudo: string;
    instituicao: string;
  }[];
  
  idiomas: {
    idioma: string;
    nivel: string;
  }[];
  
  // Dados de contribuições
  habilidades: string[];
  interesses: string[];
  objetivos: string[];
  contribuicoesTexto: string[];
}

export interface OportunidadeCompleteData {
  id: string;
  titulo: string;
  userId: string;
  
  // Critérios demográficos
  genero: string | null;
  idade?: string | null;
  municipioResidencia?: string | null;
  
  // Critérios essenciais
  transporteProprio: string | null;
  fluenciaPortugues: string | null;
  
  // Dados do cargo
  nomeCargo: string;
  nomeProfissao?: string;
  descricaoCargo?: string;
  denominacoes: string[];
  
  // Critérios profissionais
  experienciasAceitas: string[];
  nivelEscolaridade?: string;
  areasFormacao: string[];
  
  // Critérios complementares
  idiomasPreferenciais: {
    idioma: string;
    nivel: string;
  }[];
  habilidades: string[];
  caracteristicas: string[];
  
  // Metadados
  ativo: boolean;
  visualizacoes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchOptions {
  minScore?: number; // Default: 0 (mostrar todos)
  maxResults?: number; // Default: 100
  includeBreakdown?: boolean; // Default: true
  useAI?: boolean; // Default: true para scores > 40%
  cacheResults?: boolean; // Default: true
}

export interface SemanticAnalysis {
  experienciasMatched: string[];
  experienciasMissing: string[];
  habilidadesMatched: string[];
  habilidadesMissing: string[];
  score: number;
  justificativa: string;
  tokensUsed: number;
}

export interface ScoringWeights {
  genero: number;
  idade: number;
  municipio: number;
  transporteProprio: number;
  fluenciaPortugues: number;
  experiencias: number;
  formacao: number;
  idiomas: number;
  habilidades: number;
  caracteristicas: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  genero: 10,
  idade: 10,
  municipio: 15,
  transporteProprio: 10,
  fluenciaPortugues: 15,
  experiencias: 20,
  formacao: 15,
  idiomas: 5,
  habilidades: 3,
  caracteristicas: 2
};

export interface MatchingStats {
  totalAnalyses: number;
  averageScore: number;
  tokensConsumed: number;
  averageProcessingTime: number;
  scoreDistribution: {
    range: string;
    count: number;
  }[];
  topMissingCriteria: {
    criteria: string;
    frequency: number;
  }[];
}
