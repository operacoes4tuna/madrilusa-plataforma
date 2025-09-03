// Tipos compatíveis com backend - versão simplificada para resolver problemas de build

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

export interface IAConfiguration {
  habilitada: boolean;
  provider: 'openai' | 'anthropic';
  modelo: string;
  thresholdMinimo: number;
  pesoIA: number;
  maxTokens: number;
  temperatura: number;
  custoMaximoPorAnalise: number;
}

export interface ConfiguracaoCompleta {
  pesos: ScoringWeights;
  eliminatorios: any;
  iaConfig: IAConfiguration;
  prefiltros: any;
  scoringRules: any;
  limites: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StatusSistema {
  configuracaoAtiva: {
    id: string;
    nome: string;
    versao: number;
  } | null;
  totalConfiguracoes: number;
  versaoMaisRecente: number;
  templatesDisponiveis: number;
  cacheAtivo: boolean;
}

export interface ImpactoSimulado {
  totalAfetados: number;
  scoreMedioAntes: number;
  scoreMedioDepois: number;
  eliminadosAntes: number;
  eliminadosDepois: number;
  exemplos: any[];
}

export interface ValidationResult {
  valido: boolean;
  erros: string[];
  avisos: string[];
}
