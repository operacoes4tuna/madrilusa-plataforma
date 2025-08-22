import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Tipos para IA
interface AIContext {
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

interface EnhanceResponse {
  success: boolean;
  data?: {
    originalText: string;
    enhancedText: string;
    timestamp: string;
    tokensUsed?: number;
  };
  error?: string;
  message?: string;
}

interface SuggestTagsResponse {
  success: boolean;
  data?: {
    tags: string[];
    timestamp: string;
    tokensUsed?: number;
  };
  error?: string;
  message?: string;
}

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const enhanceText = async (
    text: string, 
    context: AIContext, 
    enhancementType: 'enhance' | 'expand' | 'refine' | 'correct' = 'enhance'
  ): Promise<string | null> => {
    if (!text.trim() || text.length < 10) {
      toast({
        title: "Texto insuficiente",
        description: "Escreva pelo menos 10 caracteres para usar a IA",
        variant: "destructive",
      });
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/enhance-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          context,
          enhancementType
        }),
      });

      const data: EnhanceResponse = await response.json();

      if (data.success && data.data) {
        return data.data.enhancedText;
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar com IA';
      setError(errorMessage);
      
      toast({
        title: "Erro na IA",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestTags = async (
    text: string, 
    context: AIContext, 
    existingTags: string[] = [],
    selectedTags: string[] = []
  ): Promise<string[]> => {
    if (!text.trim() || text.length < 10) {
      toast({
        title: "Texto insuficiente",
        description: "Escreva pelo menos 10 caracteres para sugerir tags",
        variant: "destructive",
      });
      return [];
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/suggest-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          context,
          existingTags,
          selectedTags
        }),
      });

      const data: SuggestTagsResponse = await response.json();

      if (data.success && data.data) {
        return data.data.tags;
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar com IA';
      setError(errorMessage);
      
      toast({
        title: "Erro na IA",
        description: errorMessage,
        variant: "destructive",
      });
      
      return [];
    } finally {
      setIsProcessing(false);
    }
  };

  const checkAIHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/ai/health');
      const data = await response.json();
      
      return data.success && data.data?.available;
    } catch (error) {
      console.error('Erro ao verificar saúde da IA:', error);
      return false;
    }
  };

  return {
    // Actions
    enhanceText,
    suggestTags,
    checkAIHealth,
    
    // State
    isProcessing,
    error,
    
    // Utils
    clearError: () => setError(null)
  };
};
