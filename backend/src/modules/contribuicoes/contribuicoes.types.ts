// Tipos específicos do módulo contribuições
export interface ContribuicaoCreateData {
  userId: string;
  tipoContribuicaoId: string;
  descricao: string;
  tags?: string[];
}

export interface ContribuicaoUpdateData {
  descricao?: string;
  tags?: string[];
  ativo?: boolean;
}

export interface TipoContribuicaoCreateData {
  titulo: string;
  categoria: string;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[];
  perguntasModelo?: string;
}

export interface TipoContribuicaoUpdateData {
  titulo?: string;
  categoria?: string;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[];
  perguntasModelo?: string;
  ativo?: boolean;
}

export interface TagSistemaCreateData {
  nome: string;
  cor?: string;
  categoria?: string;
}

export interface TagSistemaUpdateData {
  nome?: string;
  cor?: string;
  categoria?: string;
}

export interface ContribuicaoFilters {
  userId?: string;
  categoria?: string;
  tags?: string[];
  ativo?: boolean;
}
