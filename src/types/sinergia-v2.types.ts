// Tipos TypeScript para SinergIA V2 - Frontend

export interface MatchingCriteriaFrontend {
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

export interface RigorousMatchFrontend {
  oportunidadeId: string;
  imigranteId: string;
  scoreTotal: number;
  breakdown: MatchingCriteriaFrontend;
  justificativa: string;
  tokensUsed: number;
  matchedItems: string[];
  unmatchedItems: string[];
  penalizacoes: string[];
  createdAt: string;
  
  // Dados completos para desenvolvimento/testes
  oportunidade?: {
    titulo: string;
    nomeCargo: string;
    nomeProfissao?: string;
    descricaoCargo?: string;
    empresa: string;
    municipioResidencia?: string;
    genero?: string;
    idade?: string;
    transporteProprio?: string;
    fluenciaPortugues?: string;
    denominacoes: string[];
    experienciasAceitas: string[];
    areasFormacao: string[];
    habilidades: string[];
    caracteristicas: string[];
    idiomasPreferenciais: Array<{idioma: string; nivel: string}>;
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
      tempoNoCargo: string;
      descricao?: string;
    }>;
    formacoes: Array<{
      nivelEscolaridade: string;
      areaEstudo: string;
      instituicao: string;
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

export interface MatchAnalysisOptions {
  minScore: number;
  maxResults: number;
  includeBreakdown: boolean;
  useAI: boolean;
  cacheResults: boolean;
}

export interface MatchAnalysisResponse {
  success: boolean;
  data: {
    oportunidadeId?: string;
    imigranteId?: string;
    matches: RigorousMatchFrontend[];
    stats: {
      totalMatches: number;
      averageScore: number;
      scoreDistribution: {
        '0-20': number;
        '21-40': number;
        '41-60': number;
        '61-80': number;
        '81-100': number;
      };
      totalTokensUsed: number;
    };
    processedAt: string;
  };
  message: string;
}

export interface CostMetrics {
  totalTokensToday: number;
  totalCostToday: number;
  averageTokensPerAnalysis: number;
  totalAnalysesToday: number;
  aiUsageRate: number;
  costTrend: 'increasing' | 'stable' | 'decreasing';
}

export interface PerformanceMetrics {
  averageProcessingTime: number;
  averageScore: number;
  scoreDistribution: {
    '0-20': number;
    '21-40': number;
    '41-60': number;
    '61-80': number;
    '81-100': number;
  };
  topMissingCriteria: {
    criteria: string;
    frequency: number;
  }[];
}

export interface DetailedStats {
  cost: CostMetrics;
  performance: PerformanceMetrics;
  system: {
    bufferSize: number;
    oldestRecord: string | null;
    newestRecord: string | null;
  };
  recommendations: string[];
}

export interface FilterOptions {
  minScore: number;
  maxScore: number;
  sortBy: 'score' | 'created' | 'tokens';
  sortOrder: 'asc' | 'desc';
  showOnlyAI: boolean;
  showOnlyHigh: boolean; // Score >= 70
}

export interface ExportData {
  matches: RigorousMatchFrontend[];
  exportedAt: string;
  filters: FilterOptions;
  summary: {
    totalMatches: number;
    averageScore: number;
    highQualityMatches: number;
    aiAnalyzedMatches: number;
  };
}
