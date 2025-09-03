// Tipos específicos do módulo dados profissionais
import type {
  TipoDadoProfissional,
  DadosProfissionaisUnion,
  DadosExperiencia,
  DadosFormacao,
  DadosIdioma,
  NivelEscolaridade,
  NivelIdioma,
  TempoCargo
} from '../../../../shared-types/api.types';

// Re-exportar tipos para uso local
export type {
  TipoDadoProfissional,
  DadosProfissionaisUnion,
  DadosExperiencia,
  DadosFormacao,
  DadosIdioma,
  NivelEscolaridade,
  NivelIdioma,
  TempoCargo
};

// Re-exportar enums
export {
  TIPOS_DADO_PROFISSIONAL,
  NIVEIS_ESCOLARIDADE,
  NIVEIS_IDIOMA,
  TEMPOS_CARGO
} from '../../../../shared-types/api.types';

// Tipos internos do módulo
export interface DadoProfissionalCreateData {
  userId: string;
  tipo: TipoDadoProfissional;
  dados: DadosProfissionaisUnion;
  ordem?: number;
}

export interface DadoProfissionalUpdateData {
  dados?: DadosProfissionaisUnion;
  titulo?: string;
  ordem?: number;
  ativo?: boolean;
}

// Tipos para validação
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Tipos para queries
export interface DadosProfissionaisFilters {
  tipo?: TipoDadoProfissional;
  ativo?: boolean;
  userId?: string;
}
