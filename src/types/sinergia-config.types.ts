// Tipos Frontend para Sistema de Configuração Parametrizável do SinergIA V2

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

export interface CriterioEliminatorio {
  ativo: boolean;
  condicoes: {
    aplicarQuando: 'especifico' | 'obrigatorio' | 'sempre';
    valorEliminatorio?: string[];
    valorObrigatorio?: string;
    niveisMinimos?: string[];
  };
}

export interface CriteriosEliminatorios {
  genero: CriterioEliminatorio;
  transporteProprio: CriterioEliminatorio;
  fluenciaPortugues: CriterioEliminatorio;
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

export interface ScoringRuleGenero {
  matchPerfeito: number;
  indiferente: number;
  naoCorresponde: number;
  naoInformado: number;
}

export interface ScoringRuleIdade {
  algoritmo: 'faixa' | 'diferenca' | 'fixo';
  parametros: {
    tolerancia?: number;
    penalizacaoPorAno?: number;
    scoreFixo?: number;
  };
}

export interface ScoringRuleMunicipio {
  mesmoMunicipio: number;
  municipioDiferente: number;
  naoInformado: number;
  usarDistancia: boolean;
  penalizacaoPorKm?: number;
}

export interface ScoringRuleExperiencias {
  algoritmo: 'percentual' | 'minimo';
  minimoAceito?: number;
  bonusPorExperiencia?: number;
  matchParcial: boolean;
}

export interface ScoringRules {
  genero: ScoringRuleGenero;
  idade: ScoringRuleIdade;
  municipio: ScoringRuleMunicipio;
  transporteProprio: ScoringRuleGenero;
  fluenciaPortugues: ScoringRuleGenero;
  experiencias: ScoringRuleExperiencias;
  formacao: any;
  idiomas: any;
  habilidades: any;
  caracteristicas: any;
}

export interface PrefiltroRules {
  genero: {
    ativo: boolean;
    eliminarSeNaoCorresponder: boolean;
  };
  transporteProprio: {
    ativo: boolean;
    eliminarSeObrigatorioENaoTem: boolean;
  };
  fluenciaPortugues: {
    ativo: boolean;
    eliminarSeObrigatorioENaoTem: boolean;
    niveisMinimos: string[];
  };
}

export interface LimitesPerformance {
  maxCandidatosPorAnalise: number;
  timeoutAnalise: number;
  cacheResultados: boolean;
  tempoCache: number;
}

export interface ConfiguracaoCompleta {
  pesos: ScoringWeights;
  eliminatorios: CriteriosEliminatorios;
  iaConfig: IAConfiguration;
  prefiltros: PrefiltroRules;
  scoringRules: ScoringRules;
  limites: LimitesPerformance;
}

// Tipos para API responses
export interface ConfiguracaoListItem {
  id: string;
  versao: number;
  ativa: boolean;
  nome: string;
  descricao?: string;
  criadoPor: string;
  createdAt: string;
}

export interface ImpactoSimulado {
  totalAfetados: number;
  scoreMedioAntes: number;
  scoreMedioDepois: number;
  eliminadosAntes: number;
  eliminadosDepois: number;
  exemplos: {
    oportunidadeId: string;
    imigranteId: string;
    scoreAntes: number;
    scoreDepois: number;
    diferenca: number;
  }[];
}

export interface ValidationResult {
  valido: boolean;
  erros: string[];
  avisos: string[];
}

export interface StatusSistema {
  configuracaoAtiva: {
    id: string;
    nome: string;
    versao: number;
    criadoPor: string;
    criadaEm: string;
  } | null;
  totalConfiguracoes: number;
  versaoMaisRecente: number;
  templatesDisponiveis: number;
  cacheAtivo: boolean;
}

export interface TemplateInfo {
  nome: string;
  titulo: string;
  descricao: string;
  modificacoes: string[];
}

export interface HistoricoItem {
  id: string;
  configuracaoId: string;
  acao: 'criada' | 'editada' | 'ativada' | 'desativada';
  usuarioId: string;
  motivo?: string;
  createdAt: string;
}

// Tipos para componentes da UI
export interface PesoSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  disabled?: boolean;
  description?: string;
}

export interface CriterioEliminatorioProps {
  criterio: keyof CriteriosEliminatorios;
  config: CriterioEliminatorio;
  onChange: (config: CriterioEliminatorio) => void;
  disabled?: boolean;
}

export interface IAConfigProps {
  config: IAConfiguration;
  onChange: (config: IAConfiguration) => void;
  disabled?: boolean;
}

export interface PreviewImpactoProps {
  configuracao: ConfiguracaoCompleta;
  amostraSize?: number;
  onSimular?: () => void;
}

// Estado do formulário de configuração
export interface ConfigFormState {
  configuracao: ConfiguracaoCompleta;
  isValid: boolean;
  isDirty: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConfigFormActions {
  updatePesos: (pesos: Partial<ScoringWeights>) => void;
  updateEliminatorios: (eliminatorios: Partial<CriteriosEliminatorios>) => void;
  updateIAConfig: (iaConfig: Partial<IAConfiguration>) => void;
  updatePrefiltros: (prefiltros: Partial<PrefiltroRules>) => void;
  resetToDefault: () => void;
  loadTemplate: (templateNome: string) => void;
  validate: () => ValidationResult;
}

// Estados da aplicação
export type ConfigPageView = 'editor' | 'templates' | 'historico' | 'status';

export interface ConfigPageState {
  currentView: ConfigPageView;
  selectedConfigId?: string;
  isLoading: boolean;
  isSaving: boolean;
  showPreview: boolean;
  previewData?: ImpactoSimulado;
}

// Configurações padrão para o frontend
export const DEFAULT_FRONTEND_CONFIG: ConfiguracaoCompleta = {
  pesos: {
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
  },
  eliminatorios: {
    genero: {
      ativo: true,
      condicoes: {
        aplicarQuando: 'especifico',
        valorEliminatorio: ['F', 'M']
      }
    },
    transporteProprio: {
      ativo: true,
      condicoes: {
        aplicarQuando: 'obrigatorio',
        valorObrigatorio: 'S'
      }
    },
    fluenciaPortugues: {
      ativo: true,
      condicoes: {
        aplicarQuando: 'obrigatorio',
        niveisMinimos: ['Avançada', 'Fluente']
      }
    }
  },
  iaConfig: {
    habilitada: true,
    provider: 'openai',
    modelo: 'gpt-4',
    thresholdMinimo: 40,
    pesoIA: 30,
    maxTokens: 2000,
    temperatura: 0.3,
    custoMaximoPorAnalise: 0.10
  },
  prefiltros: {
    genero: {
      ativo: true,
      eliminarSeNaoCorresponder: true
    },
    transporteProprio: {
      ativo: true,
      eliminarSeObrigatorioENaoTem: true
    },
    fluenciaPortugues: {
      ativo: true,
      eliminarSeObrigatorioENaoTem: true,
      niveisMinimos: ['Avançada', 'Fluente']
    }
  },
  scoringRules: {
    genero: {
      matchPerfeito: 100,
      indiferente: 100,
      naoCorresponde: 0,
      naoInformado: 50
    },
    idade: {
      algoritmo: 'fixo',
      parametros: {
        scoreFixo: 100
      }
    },
    municipio: {
      mesmoMunicipio: 100,
      municipioDiferente: 50,
      naoInformado: 50,
      usarDistancia: false
    },
    transporteProprio: {
      matchPerfeito: 100,
      indiferente: 75,
      naoCorresponde: 0,
      naoInformado: 50
    },
    fluenciaPortugues: {
      matchPerfeito: 100,
      indiferente: 75,
      naoCorresponde: 0,
      naoInformado: 50
    },
    experiencias: {
      algoritmo: 'percentual',
      matchParcial: true,
      bonusPorExperiencia: 0
    },
    formacao: {},
    idiomas: {},
    habilidades: {},
    caracteristicas: {}
  },
  limites: {
    maxCandidatosPorAnalise: 100,
    timeoutAnalise: 30,
    cacheResultados: true,
    tempoCache: 10
  }
};

// Labels para a UI
export const CRITERIO_LABELS: Record<keyof ScoringWeights, string> = {
  genero: 'Género',
  idade: 'Idade',
  municipio: 'Município',
  transporteProprio: 'Transporte Próprio',
  fluenciaPortugues: 'Fluência em Português',
  experiencias: 'Experiências Profissionais',
  formacao: 'Formação Académica',
  idiomas: 'Idiomas',
  habilidades: 'Habilidades',
  caracteristicas: 'Características Pessoais'
};

export const CRITERIO_DESCRIPTIONS: Record<keyof ScoringWeights, string> = {
  genero: 'Correspondência de género quando especificado pela empresa',
  idade: 'Compatibilidade de faixa etária (implementação futura)',
  municipio: 'Proximidade geográfica entre candidato e oportunidade',
  transporteProprio: 'Disponibilidade de transporte quando obrigatório',
  fluenciaPortugues: 'Nível de fluência em português quando exigido',
  experiencias: 'Correspondência entre experiências do candidato e requisitos',
  formacao: 'Compatibilidade de nível e área de formação',
  idiomas: 'Conhecimento de idiomas preferenciais',
  habilidades: 'Competências técnicas e profissionais',
  caracteristicas: 'Traços de personalidade e soft skills'
};
