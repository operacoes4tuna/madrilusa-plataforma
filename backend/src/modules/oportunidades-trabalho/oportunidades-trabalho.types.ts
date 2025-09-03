// Tipos específicos do módulo oportunidades de trabalho
import type {
  GeneroOportunidade,
  OpcaoBinariaOportunidade,
  NivelEscolaridadeOportunidade,
  IdiomaOportunidade,
  OportunidadeTrabalho,
  CreateOportunidadeTrabalhoRequest,
  UpdateOportunidadeTrabalhoRequest
} from '../../../../shared-types/api.types';

// Re-exportar tipos para uso local
export type {
  GeneroOportunidade,
  OpcaoBinariaOportunidade,
  NivelEscolaridadeOportunidade,
  IdiomaOportunidade,
  OportunidadeTrabalho,
  CreateOportunidadeTrabalhoRequest,
  UpdateOportunidadeTrabalhoRequest
};

// Re-exportar enums
export {
  OPCOES_GENERO_OPORTUNIDADE,
  OPCOES_BINARIAS_OPORTUNIDADE,
  NIVEIS_ESCOLARIDADE_OPORTUNIDADE
} from '../../../../shared-types/api.types';

// Tipos internos do módulo
export interface OportunidadeCreateData {
  userId: string;
  titulo: string;
  nomeCargo: string;
  
  // Critérios opcionais
  genero?: GeneroOportunidade;
  idade?: string;
  municipioResidencia?: string;
  transporteProprio?: OpcaoBinariaOportunidade;
  fluenciaPortugues?: OpcaoBinariaOportunidade;
  
  // Dados do cargo
  nomeProfissao?: string;
  descricaoCargo?: string;
  denominacoes?: string[];
  
  // Arrays de requisitos
  experienciasAceitas?: string[];
  nivelEscolaridade?: NivelEscolaridadeOportunidade;
  areasFormacao?: string[];
  idiomasPreferenciais?: IdiomaOportunidade[];
  habilidades?: string[];
  caracteristicas?: string[];
}

export interface OportunidadeUpdateData {
  titulo?: string;
  ativo?: boolean;
  
  // Critérios básicos
  genero?: GeneroOportunidade;
  idade?: string;
  municipioResidencia?: string;
  transporteProprio?: OpcaoBinariaOportunidade;
  fluenciaPortugues?: OpcaoBinariaOportunidade;
  
  // Dados do cargo
  nomeCargo?: string;
  nomeProfissao?: string;
  descricaoCargo?: string;
  denominacoes?: string[];
  
  // Arrays de requisitos
  experienciasAceitas?: string[];
  nivelEscolaridade?: NivelEscolaridadeOportunidade;
  areasFormacao?: string[];
  idiomasPreferenciais?: IdiomaOportunidade[];
  habilidades?: string[];
  caracteristicas?: string[];
}

// Tipos para queries e filtros
export interface OportunidadeFilters {
  ativo?: boolean;
  genero?: GeneroOportunidade;
  municipio?: string;
  transporteProprio?: OpcaoBinariaOportunidade;
  fluenciaPortugues?: OpcaoBinariaOportunidade;
  nivelEscolaridade?: NivelEscolaridadeOportunidade;
}

// Tipos para estatísticas
export interface OportunidadeStats {
  totalOportunidades: number;
  oportunidadesAtivas: number;
  oportunidadesInativas: number;
  totalVisualizacoes: number;
  mediaVisualizacoesPorOportunidade: number;
  totalEmpresas: number;
}

// Tipo para validação
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
