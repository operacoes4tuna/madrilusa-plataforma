// Tipos para o Sistema de Configuração Parametrizável do SinergIA V2

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
    valorEliminatorio?: string[]; // Para género: ['F', 'M']
    valorObrigatorio?: string; // Para transporte/fluência: 'S'
    niveisMinimos?: string[]; // Para fluência: ['Avançada', 'Fluente']
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
  modelo: string; // 'gpt-4', 'gpt-3.5-turbo'
  thresholdMinimo: number; // Score mínimo para usar IA (0-100)
  pesoIA: number; // Peso da IA no score final (0-100)
  maxTokens: number;
  temperatura: number;
  custoMaximoPorAnalise: number; // em USD
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
    tolerancia?: number; // anos de diferença aceitos
    penalizacaoPorAno?: number;
    scoreFixo?: number;
  };
}

export interface ScoringRuleMunicipio {
  mesmoMunicipio: number;
  municipioDiferente: number;
  naoInformado: number;
  // Futuro: distância em km
  usarDistancia: boolean;
  penalizacaoPorKm?: number;
}

export interface ScoringRuleExperiencias {
  algoritmo: 'percentual' | 'minimo';
  minimoAceito?: number; // quantidade mínima
  bonusPorExperiencia?: number;
  matchParcial: boolean; // aceita substring
}

export interface ScoringRuleFormacao {
  algoritmo: 'nivel' | 'area' | 'ambos' | 'fixo';
  parametros: {
    scoreFixo?: number;
    bonusPorNivel?: number;
    bonusPorArea?: number;
  };
}

export interface ScoringRuleIdiomas {
  algoritmo: 'percentual' | 'minimo' | 'fixo';
  parametros: {
    scoreFixo?: number;
    bonusPorIdioma?: number;
    considerarNivel: boolean;
  };
}

export interface ScoringRuleHabilidades {
  algoritmo: 'percentual' | 'minimo' | 'fixo';
  parametros: {
    scoreFixo?: number;
    matchParcial: boolean;
    minimoAceito?: number;
  };
}

export interface ScoringRuleCaracteristicas {
  algoritmo: 'semantico' | 'percentual' | 'fixo';
  parametros: {
    scoreFixo?: number;
    usarIA: boolean;
  };
}

export interface ScoringRules {
  genero: ScoringRuleGenero;
  idade: ScoringRuleIdade;
  municipio: ScoringRuleMunicipio;
  transporteProprio: ScoringRuleGenero; // Reutiliza a estrutura do género
  fluenciaPortugues: ScoringRuleGenero; // Reutiliza a estrutura do género
  experiencias: ScoringRuleExperiencias;
  formacao: ScoringRuleFormacao;
  idiomas: ScoringRuleIdiomas;
  habilidades: ScoringRuleHabilidades;
  caracteristicas: ScoringRuleCaracteristicas;
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
  timeoutAnalise: number; // segundos
  cacheResultados: boolean;
  tempoCache: number; // minutos
}

export interface ConfiguracaoCompleta {
  pesos: ScoringWeights;
  eliminatorios: CriteriosEliminatorios;
  iaConfig: IAConfiguration;
  prefiltros: PrefiltroRules;
  scoringRules: ScoringRules;
  limites: LimitesPerformance;
}

// Configuração padrão (atual do sistema)
export const DEFAULT_CONFIGURATION: ConfiguracaoCompleta = {
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
    formacao: {
      algoritmo: 'fixo',
      parametros: {
        scoreFixo: 75
      }
    },
    idiomas: {
      algoritmo: 'percentual',
      parametros: {
        considerarNivel: true
      }
    },
    habilidades: {
      algoritmo: 'percentual',
      parametros: {
        matchParcial: true
      }
    },
    caracteristicas: {
      algoritmo: 'fixo',
      parametros: {
        scoreFixo: 50,
        usarIA: false
      }
    }
  },
  limites: {
    maxCandidatosPorAnalise: 100,
    timeoutAnalise: 30,
    cacheResultados: true,
    tempoCache: 10
  }
};

// Tipos para o banco de dados
export interface ConfiguracaoSinergiaBD {
  id: string;
  versao: number;
  ativa: boolean;
  nome: string;
  descricao?: string;
  pesos: string; // JSON serializado
  eliminatorios: string; // JSON serializado
  iaConfig: string; // JSON serializado
  prefiltros: string; // JSON serializado
  scoringRules: string; // JSON serializado
  criadoPor: string;
  atualizadoPor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HistoricoConfiguracaoSinergiaBD {
  id: string;
  configuracaoId: string;
  snapshot: string; // JSON serializado
  acao: 'criada' | 'editada' | 'ativada' | 'desativada';
  usuarioId: string;
  motivo?: string;
  createdAt: Date;
}

// Tipos para simulação e análise de impacto
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

// Templates pré-definidos
export const TEMPLATES_CONFIGURACAO = {
  'ultra-rigoroso': {
    nome: 'Matching Ultra Rigoroso',
    descricao: 'Prioriza correspondência exata em todos os critérios',
    modificacoes: {
      'pesos.experiencias': 30,
      'pesos.formacao': 25,
      'iaConfig.thresholdMinimo': 60,
      'iaConfig.pesoIA': 20
    }
  },
  'balanceado': {
    nome: 'Matching Balanceado',
    descricao: 'Configuração equilibrada (padrão atual)',
    modificacoes: {} // Usa DEFAULT_CONFIGURATION
  },
  'flexivel': {
    nome: 'Matching Flexível',
    descricao: 'Mais tolerante a diferenças, foca em potencial',
    modificacoes: {
      'eliminatorios.genero.ativo': false,
      'eliminatorios.transporteProprio.ativo': false,
      'iaConfig.thresholdMinimo': 20,
      'iaConfig.pesoIA': 40
    }
  },
  'economico': {
    nome: 'Matching Econômico',
    descricao: 'Reduz uso de IA para economizar custos',
    modificacoes: {
      'iaConfig.habilitada': false,
      'iaConfig.thresholdMinimo': 70,
      'iaConfig.pesoIA': 15
    }
  }
};
