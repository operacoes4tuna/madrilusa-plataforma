// Sistema de cores consistente por categoria de usuário - Madrilusa

export const CATEGORY_COLORS = {
  IMIGRANTE: {
    primary: '#28a745',      // Verde (integração, crescimento)
    light: '#d4edda',        // Verde claro para backgrounds
    badge: 'success',        // Classe Bootstrap
    icon: 'language',
    label: 'Imigrante'
  },
  EMPRESA: {
    primary: '#007bff',      // Azul (profissional, confiança)
    light: '#d1ecf1',        // Azul claro
    badge: 'primary',
    icon: 'business',
    label: 'Empresa'
  },
  MUNICIPIO: {
    primary: '#ffc107',      // Amarelo (institucional, governo)
    light: '#fff3cd',        // Amarelo claro
    badge: 'warning',
    icon: 'location_city',
    label: 'Município'
  },
  ACADEMIA: {
    primary: '#17a2b8',      // Turquesa (educação, conhecimento)
    light: '#d1ecf1',        // Turquesa claro
    badge: 'info',
    icon: 'school',
    label: 'Academia'
  },
  FAMILIA_ACOLHIMENTO: {
    primary: '#e83e8c',      // Rosa (acolhimento, carinho)
    light: '#f8d7e4',        // Rosa claro
    badge: 'danger',         // Usando danger para rosa
    icon: 'family_restroom',
    label: 'Família'
  }
} as const;

export type CategoryKey = keyof typeof CATEGORY_COLORS;

export interface CategoryConfig {
  primary: string;
  light: string;
  badge: string;
  icon: string;
  label: string;
}

// Função principal para obter configuração da categoria
export const getCategoryConfig = (categoria: string): CategoryConfig => {
  return CATEGORY_COLORS[categoria as CategoryKey] || {
    primary: '#6c757d',
    light: '#f8f9fa',
    badge: 'secondary',
    icon: 'category',
    label: categoria
  };
};

// Helpers específicos para facilitar uso
export const getCategoryColor = (categoria: string): string => {
  return getCategoryConfig(categoria).primary;
};

export const getCategoryLightColor = (categoria: string): string => {
  return getCategoryConfig(categoria).light;
};

export const getCategoryBadge = (categoria: string): string => {
  return getCategoryConfig(categoria).badge;
};

export const getCategoryIcon = (categoria: string): string => {
  return getCategoryConfig(categoria).icon;
};

export const getCategoryLabel = (categoria: string): string => {
  return getCategoryConfig(categoria).label;
};

// Função para obter classe CSS do card
export const getCategoryCardClass = (categoria: string): string => {
  return `card-categoria-${categoria.toLowerCase().replace('_', '-')}`;
};

// Função para obter classe CSS do header
export const getCategoryHeaderClass = (categoria: string): string => {
  return `header-categoria-${categoria.toLowerCase().replace('_', '-')}`;
};

// Lista de todas as categorias disponíveis
export const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS) as CategoryKey[];

// Função para validar se categoria existe
export const isValidCategory = (categoria: string): boolean => {
  return categoria in CATEGORY_COLORS;
};
