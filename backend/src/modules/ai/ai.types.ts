// Tipos específicos do módulo AI
export interface AIContext {
  platformContext: string;
  userCategory: string;
  contributionType: string;
  typeContext?: string;
  specificGuidance?: string;
  tone: string;
  focus: string;
  maxLength: number;
  additionalGuidelines?: string;
}

export interface EnhanceTextRequest {
  text: string;
  context: AIContext;
  userId?: string;
}

export interface EnhanceTextResponse {
  originalText: string;
  enhancedText: string;
  timestamp: string;
  tokensUsed?: number;
}

export interface SuggestTagsRequest {
  text: string;
  context: AIContext;
  existingTags?: string[];
  selectedTags?: string[];
  userId?: string;
}

export interface SuggestTagsResponse {
  tags: string[];
  timestamp: string;
  tokensUsed?: number;
}

export interface AIInteractionData {
  userId?: string;
  contribuicaoId?: string;
  tipoAcao: 'enhance_text' | 'suggest_tags' | 'expand_text' | 'refine_text' | 'correct_text';
  inputText: string;
  outputText: string;
  accepted?: boolean;
  feedback?: number; // 1-5 rating
  tokensUsed?: number;
}

export interface AIUserSettings {
  userId: string;
  aiEnabled: boolean;
  saveInteractions: boolean;
  feedbackEnabled: boolean;
  preferredTone: 'formal' | 'casual' | 'professional';
  maxTokensPerRequest: number;
}

export type EnhancementType = 'enhance' | 'expand' | 'refine' | 'correct';

export interface AIMetrics {
  totalEnhancements: number;
  totalTagSuggestions: number;
  averageResponseTime: number;
  enhancementAcceptanceRate: number;
  tagAcceptanceRate: number;
  usageByCategory: Record<string, number>;
  userSatisfactionScore: number;
  totalTokensUsed: number;
}
