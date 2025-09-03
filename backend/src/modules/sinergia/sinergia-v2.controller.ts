import { Request, Response } from 'express';
import { SinergiaV2Service } from './sinergia-v2.service';
import { SinergiaV2FeedbackService } from './sinergia-v2-feedback.service';
import type { MatchOptions } from './sinergia-v2.types';
import type { UserFeedback } from './sinergia-v2-feedback.service';

export class SinergiaV2Controller {
  private sinergiaV2Service = new SinergiaV2Service();
  private feedbackService = SinergiaV2FeedbackService.getInstance();

  /**
   * Analisar matches para uma oportunidade específica
   * POST /api/sinergia-v2/opportunity/:oportunidadeId/matches
   */
  analyzeOpportunityMatches = async (req: Request, res: Response) => {
    try {
      const { oportunidadeId } = req.params;
      const options: MatchOptions = {
        minScore: parseInt(req.body.minScore) || 0,
        maxResults: parseInt(req.body.maxResults) || 100,
        includeBreakdown: req.body.includeBreakdown !== false,
        useAI: req.body.useAI !== false,
        cacheResults: req.body.cacheResults !== false
      };

      console.log(`🎯 SINERGIA V2: Analisando matches para oportunidade ${oportunidadeId}`);

      if (!oportunidadeId) {
        return res.status(400).json({
          success: false,
          error: 'ID da oportunidade é obrigatório'
        });
      }

      const matches = await this.sinergiaV2Service.analyzeOpportunityMatches(oportunidadeId, options);

      // Estatísticas da análise
      const stats = {
        totalMatches: matches.length,
        averageScore: matches.length > 0 ? 
          matches.reduce((sum, m) => sum + m.scoreTotal, 0) / matches.length : 0,
        scoreDistribution: this.calculateScoreDistribution(matches),
        totalTokensUsed: matches.reduce((sum, m) => sum + m.tokensUsed, 0)
      };

      res.json({
        success: true,
        data: {
          oportunidadeId,
          matches,
          stats,
          processedAt: new Date().toISOString()
        },
        message: `${matches.length} matches encontrados para a oportunidade`
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao analisar oportunidade:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Analisar oportunidades para um imigrante específico
   * POST /api/sinergia-v2/imigrante/:imigranteId/opportunities
   */
  analyzeImigranteOpportunities = async (req: Request, res: Response) => {
    try {
      const { imigranteId } = req.params;
      const options: MatchOptions = {
        minScore: parseInt(req.body.minScore) || 0,
        maxResults: parseInt(req.body.maxResults) || 100,
        includeBreakdown: req.body.includeBreakdown !== false,
        useAI: req.body.useAI !== false,
        cacheResults: req.body.cacheResults !== false
      };

      console.log(`🎯 SINERGIA V2: Analisando oportunidades para imigrante ${imigranteId}`);

      if (!imigranteId) {
        return res.status(400).json({
          success: false,
          error: 'ID do imigrante é obrigatório'
        });
      }

      const matches = await this.sinergiaV2Service.analyzeImigranteOpportunities(imigranteId, options);

      // Estatísticas da análise
      const stats = {
        totalMatches: matches.length,
        averageScore: matches.length > 0 ? 
          matches.reduce((sum, m) => sum + m.scoreTotal, 0) / matches.length : 0,
        scoreDistribution: this.calculateScoreDistribution(matches),
        totalTokensUsed: matches.reduce((sum, m) => sum + m.tokensUsed, 0)
      };

      res.json({
        success: true,
        data: {
          imigranteId,
          matches,
          stats,
          processedAt: new Date().toISOString()
        },
        message: `${matches.length} oportunidades encontradas para o imigrante`
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao analisar imigrante:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Obter detalhes de um match específico
   * GET /api/sinergia-v2/match/:oportunidadeId/:imigranteId
   */
  getMatchDetails = async (req: Request, res: Response) => {
    try {
      const { oportunidadeId, imigranteId } = req.params;

      if (!oportunidadeId || !imigranteId) {
        return res.status(400).json({
          success: false,
          error: 'IDs da oportunidade e imigrante são obrigatórios'
        });
      }

      // Analisar match específico
      const matches = await this.sinergiaV2Service.analyzeOpportunityMatches(oportunidadeId, {
        maxResults: 1000 // Buscar todos para encontrar o específico
      });

      const specificMatch = matches.find(m => m.imigranteId === imigranteId);

      if (!specificMatch) {
        return res.status(404).json({
          success: false,
          error: 'Match não encontrado',
          message: 'Não foi encontrada compatibilidade entre esta oportunidade e imigrante'
        });
      }

      res.json({
        success: true,
        data: specificMatch,
        message: 'Detalhes do match obtidos com sucesso'
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao obter detalhes do match:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Health check do sistema V2
   * GET /api/sinergia-v2/health
   */
  healthCheck = async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        data: {
          status: 'healthy',
          version: '2.0',
          features: [
            'Rigorous matching algorithm',
            'Structured data analysis',
            'Token optimization',
            'Detailed breakdowns',
            'Performance metrics'
          ],
          timestamp: new Date().toISOString()
        },
        message: 'SinergIA V2 está operacional'
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro no health check:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro no sistema',
        message: 'SinergIA V2 não está respondendo corretamente'
      });
    }
  };

  /**
   * Estatísticas gerais do sistema
   * GET /api/sinergia-v2/stats
   */
  getSystemStats = async (req: Request, res: Response) => {
    try {
      const detailedStats = this.sinergiaV2Service.getDetailedStats();

      res.json({
        success: true,
        data: detailedStats,
        message: 'Estatísticas do sistema obtidas com sucesso'
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao obter estatísticas:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível obter estatísticas do sistema'
      });
    }
  };

  /**
   * Métricas de custo em tempo real
   * GET /api/sinergia-v2/metrics/cost
   */
  getCostMetrics = async (req: Request, res: Response) => {
    try {
      const costMetrics = this.sinergiaV2Service.getCostMetrics();

      res.json({
        success: true,
        data: costMetrics,
        message: 'Métricas de custo obtidas com sucesso'
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao obter métricas de custo:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível obter métricas de custo'
      });
    }
  };

  /**
   * Métricas de performance
   * GET /api/sinergia-v2/metrics/performance
   */
  getPerformanceMetrics = async (req: Request, res: Response) => {
    try {
      const performanceMetrics = this.sinergiaV2Service.getPerformanceMetrics();

      res.json({
        success: true,
        data: performanceMetrics,
        message: 'Métricas de performance obtidas com sucesso'
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao obter métricas de performance:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível obter métricas de performance'
      });
    }
  };

  /**
   * Submeter feedback sobre um match
   * POST /api/sinergia-v2/feedback
   */
  submitFeedback = async (req: Request, res: Response) => {
    try {
      const feedback: UserFeedback = req.body;

      // Validações
      if (!feedback.userId || !feedback.oportunidadeId || !feedback.imigranteId) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios em falta',
          message: 'userId, oportunidadeId e imigranteId são obrigatórios'
        });
      }

      if (feedback.scorePercebido < 1 || feedback.scorePercebido > 5) {
        return res.status(400).json({
          success: false,
          error: 'Score inválido',
          message: 'scorePercebido deve estar entre 1 e 5'
        });
      }

      await this.feedbackService.submitFeedback(feedback);

      res.json({
        success: true,
        data: { feedbackId: `feedback_${Date.now()}` },
        message: 'Feedback registrado com sucesso'
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao registrar feedback:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível registrar o feedback'
      });
    }
  };

  /**
   * Obter estatísticas de feedback
   * GET /api/sinergia-v2/feedback/stats
   */
  getFeedbackStats = async (req: Request, res: Response) => {
    try {
      const stats = this.feedbackService.getFeedbackStats();

      res.json({
        success: true,
        data: stats,
        message: 'Estatísticas de feedback obtidas com sucesso'
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao obter stats de feedback:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível obter estatísticas de feedback'
      });
    }
  };

  /**
   * Obter recomendações de tuning do algoritmo
   * GET /api/sinergia-v2/tuning/recommendations
   */
  getTuningRecommendations = async (req: Request, res: Response) => {
    try {
      const tuning = this.feedbackService.analyzeFeedbacksForTuning();

      res.json({
        success: true,
        data: tuning,
        message: 'Recomendações de tuning obtidas com sucesso'
      });

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao obter recomendações:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível obter recomendações de tuning'
      });
    }
  };

  /**
   * Método auxiliar para calcular distribuição de scores
   */
  private calculateScoreDistribution(matches: any[]) {
    const distribution = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    };

    matches.forEach(match => {
      const score = match.scoreTotal;
      if (score <= 20) distribution['0-20']++;
      else if (score <= 40) distribution['21-40']++;
      else if (score <= 60) distribution['41-60']++;
      else if (score <= 80) distribution['61-80']++;
      else distribution['81-100']++;
    });

    return distribution;
  }
}
