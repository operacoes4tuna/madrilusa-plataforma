// Tipos específicos do módulo SinergIA MVP
export interface UserProfile {
  userId: string;
  categoria: string;
  fullDescription: string;  // Todas as descrições consolidadas
  allTags: string[];       // Todas as tags únicas
  contributionTypes: string[]; // Tipos de contribuição do usuário
  contributionsCount: number;
}

export interface Match {
  score: number;           // Porcentagem 0-100
  explanation: string;     // Explicação da IA
  contributionType: string; // Tipo da contribuição que fez match
  targetCategory: string;  // Categoria da entidade com match
  targetContributionId: string; // ID da contribuição
  commonTags: string[];    // Tags em comum
}

export interface CategoryResults {
  categoria: string;
  totalFound: number;      // Total de matches encontrados
  topMatches: Match[];     // Top 3 matches
  averageScore: number;    // Score médio
}

export interface SinergiaResults {
  userId: string;
  processedAt: string;
  totalMatches: number;
  empresas: CategoryResults;
  municipios: CategoryResults;
  academias: CategoryResults;
  familias: CategoryResults;
}

export interface SinergiaAnalysisRequest {
  userId: string;
  maxMatchesPerCategory?: number; // Default: 10
  minScoreThreshold?: number;     // Default: 30
}

export interface ContactRequest {
  userId: string;
  targetCategory: string;
  matchScore: number;
  explanation: string;
  userMessage: string;
  userEmail: string;
  userName: string;
}

// Resposta da IA para matching individual
export interface AIMatchResponse {
  hasSinergia: boolean;
  porcentagem: number;
  explicacao: string;
  tagsComuns: string[];
  pontosSinergia: string[];
}
