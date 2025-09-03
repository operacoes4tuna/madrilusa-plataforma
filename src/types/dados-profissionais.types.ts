// Re-export dos tipos compartilhados para uso no frontend
export type {
  TipoDadoProfissional,
  DadosProfissionaisUnion,
  DadosExperiencia,
  DadosFormacao,
  DadosIdioma,
  NivelEscolaridade,
  NivelIdioma,
  TempoCargo,
  DadoProfissionalImigrante,
  CreateDadoProfissionalRequest,
  UpdateDadoProfissionalRequest,
  ContribuicaoUnificada
} from '../../shared-types/api.types';

export {
  TIPOS_DADO_PROFISSIONAL,
  NIVEIS_ESCOLARIDADE,
  NIVEIS_IDIOMA,
  TEMPOS_CARGO
} from '../../shared-types/api.types';

// Tipos específicos para o frontend
export interface DadoProfissionalFormData {
  tipo: TipoDadoProfissional;
  dados: DadosProfissionaisUnion;
  ordem?: number;
}

export interface ExperienciaFormData {
  experiencias: DadosExperiencia[];
}

export interface FormacaoFormData {
  formacoes: DadosFormacao[];
}

export interface IdiomaFormData {
  idiomas: DadosIdioma[];
}

// Estados do formulário
export type ModalTipo = 'normal' | 'experiencia' | 'formacao' | 'idioma';

// Props para componentes
export interface DadoProfissionalCardProps {
  contribuicao: ContribuicaoUnificada;
  onEdit: (contribuicao: ContribuicaoUnificada) => void;
  onDelete: (id: string, titulo: string) => void;
  showActions?: boolean;
}

export interface DadoProfissionalModalProps {
  isOpen: boolean;
  tipo: ModalTipo;
  onClose: () => void;
  onSave: () => void;
  editingData?: ContribuicaoUnificada | null;
}

// Utilitários
export interface TipoInfo {
  label: string;
  icon: string;
  color: string;
  description: string;
}
