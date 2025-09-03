import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type {
  MatchAnalysisOptions,
  MatchAnalysisResponse,
  RigorousMatchFrontend,
  CostMetrics,
  PerformanceMetrics,
  DetailedStats
} from '../types/sinergia-v2.types';

export const useSinergiaV2 = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matches, setMatches] = useState<RigorousMatchFrontend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Analisar matches para uma oportunidade
   */
  const analyzeOpportunityMatches = async (
    oportunidadeId: string,
    options: Partial<MatchAnalysisOptions> = {}
  ): Promise<MatchAnalysisResponse | null> => {
    if (!oportunidadeId) {
      toast({
        title: "Erro",
        description: "ID da oportunidade é obrigatório",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const defaultOptions: MatchAnalysisOptions = {
        minScore: 0,
        maxResults: 50,
        includeBreakdown: true,
        useAI: true,
        cacheResults: true,
        ...options
      };

      const response = await fetch(`/api/sinergia-v2/opportunity/${oportunidadeId}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultOptions),
      });

      const data: MatchAnalysisResponse = await response.json();

      if (data.success) {
        setMatches(data.data.matches);
        
        toast({
          title: "✅ Análise Concluída",
          description: `${data.data.matches.length} matches encontrados (${data.data.stats.totalTokensUsed} tokens)`,
        });

        return data;
      } else {
        throw new Error(data.message || 'Erro desconhecido');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao analisar matches';
      setError(errorMessage);
      
      toast({
        title: "Erro na Análise",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Analisar oportunidades para um imigrante
   */
  const analyzeImigranteOpportunities = async (
    imigranteId: string,
    options: Partial<MatchAnalysisOptions> = {}
  ): Promise<MatchAnalysisResponse | null> => {
    if (!imigranteId) {
      toast({
        title: "Erro",
        description: "ID do imigrante é obrigatório",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const defaultOptions: MatchAnalysisOptions = {
        minScore: 0,
        maxResults: 50,
        includeBreakdown: true,
        useAI: true,
        cacheResults: true,
        ...options
      };

      const response = await fetch(`/api/sinergia-v2/imigrante/${imigranteId}/opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultOptions),
      });

      const data: MatchAnalysisResponse = await response.json();

      if (data.success) {
        setMatches(data.data.matches);
        
        toast({
          title: "✅ Análise Concluída",
          description: `${data.data.matches.length} oportunidades encontradas (${data.data.stats.totalTokensUsed} tokens)`,
        });

        return data;
      } else {
        throw new Error(data.message || 'Erro desconhecido');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao analisar oportunidades';
      setError(errorMessage);
      
      toast({
        title: "Erro na Análise",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Obter detalhes de um match específico
   */
  const getMatchDetails = async (
    oportunidadeId: string,
    imigranteId: string
  ): Promise<RigorousMatchFrontend | null> => {
    try {
      const response = await fetch(`/api/sinergia-v2/match/${oportunidadeId}/${imigranteId}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Match não encontrado');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao obter detalhes';
      setError(errorMessage);
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  /**
   * Obter métricas de custo
   */
  const getCostMetrics = async (): Promise<CostMetrics | null> => {
    try {
      const response = await fetch('/api/sinergia-v2/metrics/cost');
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Erro ao obter métricas');
      }

    } catch (error) {
      console.error('Erro ao obter métricas de custo:', error);
      return null;
    }
  };

  /**
   * Obter métricas de performance
   */
  const getPerformanceMetrics = async (): Promise<PerformanceMetrics | null> => {
    try {
      const response = await fetch('/api/sinergia-v2/metrics/performance');
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Erro ao obter métricas');
      }

    } catch (error) {
      console.error('Erro ao obter métricas de performance:', error);
      return null;
    }
  };

  /**
   * Obter estatísticas detalhadas
   */
  const getDetailedStats = async (): Promise<DetailedStats | null> => {
    try {
      const response = await fetch('/api/sinergia-v2/stats');
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Erro ao obter estatísticas');
      }

    } catch (error) {
      console.error('Erro ao obter estatísticas detalhadas:', error);
      return null;
    }
  };

  /**
   * Health check do sistema
   */
  const checkHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/sinergia-v2/health');
      const data = await response.json();
      
      return data.success;
    } catch (error) {
      console.error('Erro no health check:', error);
      return false;
    }
  };

  return {
    // Actions
    analyzeOpportunityMatches,
    analyzeImigranteOpportunities,
    getMatchDetails,
    getCostMetrics,
    getPerformanceMetrics,
    getDetailedStats,
    checkHealth,
    
    // State
    isAnalyzing,
    matches,
    error,
    
    // Utils
    clearError: () => setError(null),
    clearMatches: () => setMatches([])
  };
};
