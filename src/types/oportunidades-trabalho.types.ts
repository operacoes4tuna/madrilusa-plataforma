// Re-export dos tipos compartilhados para uso no frontend
export type {
  GeneroOportunidade,
  OpcaoBinariaOportunidade,
  NivelEscolaridadeOportunidade,
  IdiomaOportunidade,
  OportunidadeTrabalho,
  CreateOportunidadeTrabalhoRequest,
  UpdateOportunidadeTrabalhoRequest,
  ContribuicaoUnificada
} from '../../shared-types/api.types.ts';

export {
  OPCOES_GENERO_OPORTUNIDADE,
  OPCOES_BINARIAS_OPORTUNIDADE,
  NIVEIS_ESCOLARIDADE_OPORTUNIDADE,
  NIVEIS_IDIOMA
} from '../../shared-types/api.types.ts';

// Tipos específicos para o frontend
export interface OportunidadeFormData {
  // Informações básicas
  titulo: string;
  nomeCargo: string;
  nomeProfissao?: string;
  descricaoCargo?: string;
  
  // Critérios de seleção
  genero?: GeneroOportunidade;
  idade?: string;
  municipioResidencia?: string;
  transporteProprio?: OpcaoBinariaOportunidade;
  fluenciaPortugues?: OpcaoBinariaOportunidade;
  
  // Arrays dinâmicos
  denominacoes: string[];
  experienciasAceitas: string[];
  areasFormacao: string[];
  idiomasPreferenciais: IdiomaOportunidade[];
  habilidades: string[];
  caracteristicas: string[];
  
  // Formação
  nivelEscolaridade?: NivelEscolaridadeOportunidade;
}

// Props para componentes
export interface OportunidadeCardProps {
  oportunidade: ContribuicaoUnificada;
  onEdit: (oportunidade: ContribuicaoUnificada) => void;
  onDelete: (id: string, titulo: string) => void;
  onToggleStatus: (id: string, ativo: boolean) => void;
  onDuplicate: (id: string) => void;
  showActions?: boolean;
}

export interface OportunidadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingOportunidade?: ContribuicaoUnificada | null;
}

export interface ArrayFieldProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  required?: boolean;
}

export interface IdiomaFieldProps {
  label: string;
  idiomas: IdiomaOportunidade[];
  onChange: (idiomas: IdiomaOportunidade[]) => void;
  maxItems?: number;
}

// Estados do formulário
export type FormSection = 
  | 'basicas' 
  | 'criterios' 
  | 'experiencia' 
  | 'formacao' 
  | 'idiomas' 
  | 'competencias';

// Utilitários
export interface OportunidadeStats {
  totalOportunidades: number;
  oportunidadesAtivas: number;
  oportunidadesInativas: number;
  totalVisualizacoes: number;
  mediaVisualizacoesPorOportunidade: number;
}
