// Sistema de Analytics e Monitoramento para SinergIA V2
import { prisma } from '../../shared/database';

interface AnalyticsData {
  timestamp: Date;
  oportunidadeId: string;
  imigranteId: string;
  scoreTotal: number;
  tokensUsed: number;
  processingTime: number;
  usedAI: boolean;
  breakdown: any;
}

interface CostMetrics {
  totalTokensToday: number;
  totalCostToday: number;
  averageTokensPerAnalysis: number;
  totalAnalysesToday: number;
  aiUsageRate: number; // % de análises que usaram IA
  costTrend: 'increasing' | 'stable' | 'decreasing';
}

interface PerformanceMetrics {
  averageProcessingTime: number;
  averageScore: number;
  scoreDistribution: {
    '0-20': number;
    '21-40': number;
    '41-60': number;
    '61-80': number;
    '81-100': number;
  };
  topMissingCriteria: {
    criteria: string;
    frequency: number;
  }[];
}

export class SinergiaV2AnalyticsService {
  private static instance: SinergiaV2AnalyticsService;
  private analyticsBuffer: AnalyticsData[] = [];
  
  // Custos OpenAI (valores aproximados em USD)
  private readonly GPT4_INPUT_COST = 0.03 / 1000;  // $0.03 per 1K tokens
  private readonly GPT4_OUTPUT_COST = 0.06 / 1000; // $0.06 per 1K tokens
  private readonly AVERAGE_OUTPUT_RATIO = 0.3; // 30% output, 70% input

  public static getInstance(): SinergiaV2AnalyticsService {
    if (!SinergiaV2AnalyticsService.instance) {
      SinergiaV2AnalyticsService.instance = new SinergiaV2AnalyticsService();
    }
    return SinergiaV2AnalyticsService.instance;
  }

  /**
   * Registrar uma análise para analytics
   */
  async recordAnalysis(data: AnalyticsData): Promise<void> {
    try {
      // Adicionar ao buffer em memória
      this.analyticsBuffer.push(data);
      
      // Manter apenas últimas 1000 análises em memória
      if (this.analyticsBuffer.length > 1000) {
        this.analyticsBuffer = this.analyticsBuffer.slice(-1000);
      }

      // Log para monitoramento
      const cost = this.calculateTokenCost(data.tokensUsed);
      console.log(`📊 ANALYTICS: Score ${data.scoreTotal}%, ${data.tokensUsed} tokens, $${cost.toFixed(4)}, ${data.processingTime}ms`);
      
    } catch (error) {
      console.error('❌ Erro ao registrar analytics:', error);
    }
  }

  /**
   * Obter métricas de custo em tempo real
   */
  getCostMetrics(): CostMetrics {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAnalyses = this.analyticsBuffer.filter(a => 
      a.timestamp >= today
    );

    const totalTokensToday = todayAnalyses.reduce((sum, a) => sum + a.tokensUsed, 0);
    const totalCostToday = this.calculateTokenCost(totalTokensToday);
    const analysesWithAI = todayAnalyses.filter(a => a.usedAI).length;
    
    return {
      totalTokensToday,
      totalCostToday,
      averageTokensPerAnalysis: todayAnalyses.length > 0 ? 
        totalTokensToday / todayAnalyses.length : 0,
      totalAnalysesToday: todayAnalyses.length,
      aiUsageRate: todayAnalyses.length > 0 ? 
        (analysesWithAI / todayAnalyses.length) * 100 : 0,
      costTrend: this.calculateCostTrend()
    };
  }

  /**
   * Obter métricas de performance
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const recentAnalyses = this.analyticsBuffer.slice(-100); // Últimas 100 análises
    
    const averageProcessingTime = recentAnalyses.length > 0 ?
      recentAnalyses.reduce((sum, a) => sum + a.processingTime, 0) / recentAnalyses.length : 0;
    
    const averageScore = recentAnalyses.length > 0 ?
      recentAnalyses.reduce((sum, a) => sum + a.scoreTotal, 0) / recentAnalyses.length : 0;

    // Distribuição de scores
    const scoreDistribution = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    };

    recentAnalyses.forEach(analysis => {
      const score = analysis.scoreTotal;
      if (score <= 20) scoreDistribution['0-20']++;
      else if (score <= 40) scoreDistribution['21-40']++;
      else if (score <= 60) scoreDistribution['41-60']++;
      else if (score <= 80) scoreDistribution['61-80']++;
      else scoreDistribution['81-100']++;
    });

    // Critérios mais problemáticos (placeholder)
    const topMissingCriteria = [
      { criteria: 'Experiência específica', frequency: 45 },
      { criteria: 'Transporte próprio', frequency: 32 },
      { criteria: 'Localização geográfica', frequency: 28 },
      { criteria: 'Fluência em português', frequency: 22 },
      { criteria: 'Formação acadêmica', frequency: 18 }
    ];

    return {
      averageProcessingTime,
      averageScore,
      scoreDistribution,
      topMissingCriteria
    };
  }

  /**
   * Calcular custo de tokens
   */
  private calculateTokenCost(tokens: number): number {
    if (tokens === 0) return 0;
    
    const inputTokens = tokens * (1 - this.AVERAGE_OUTPUT_RATIO);
    const outputTokens = tokens * this.AVERAGE_OUTPUT_RATIO;
    
    return (inputTokens * this.GPT4_INPUT_COST) + (outputTokens * this.GPT4_OUTPUT_COST);
  }

  /**
   * Calcular tendência de custo
   */
  private calculateCostTrend(): 'increasing' | 'stable' | 'decreasing' {
    const recent = this.analyticsBuffer.slice(-50);
    const older = this.analyticsBuffer.slice(-100, -50);
    
    if (recent.length < 10 || older.length < 10) {
      return 'stable';
    }

    const recentAvgTokens = recent.reduce((sum, a) => sum + a.tokensUsed, 0) / recent.length;
    const olderAvgTokens = older.reduce((sum, a) => sum + a.tokensUsed, 0) / older.length;
    
    const change = (recentAvgTokens - olderAvgTokens) / olderAvgTokens;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  /**
   * Obter estatísticas detalhadas para admin
   */
  getDetailedStats() {
    const costMetrics = this.getCostMetrics();
    const performanceMetrics = this.getPerformanceMetrics();
    
    return {
      cost: costMetrics,
      performance: performanceMetrics,
      system: {
        bufferSize: this.analyticsBuffer.length,
        oldestRecord: this.analyticsBuffer.length > 0 ? this.analyticsBuffer[0].timestamp : null,
        newestRecord: this.analyticsBuffer.length > 0 ? 
          this.analyticsBuffer[this.analyticsBuffer.length - 1].timestamp : null
      },
      recommendations: this.generateRecommendations(costMetrics, performanceMetrics)
    };
  }

  /**
   * Gerar recomendações baseadas nas métricas
   */
  private generateRecommendations(
    cost: CostMetrics, 
    performance: PerformanceMetrics
  ): string[] {
    const recommendations = [];

    // Recomendações de custo
    if (cost.aiUsageRate > 80) {
      recommendations.push('Considere aumentar o threshold mínimo para uso de IA (atualmente 40%)');
    }
    
    if (cost.averageTokensPerAnalysis > 600) {
      recommendations.push('Prompts podem ser otimizados para reduzir consumo de tokens');
    }

    if (cost.totalCostToday > 10) {
      recommendations.push('Custo diário alto - considere implementar cache de resultados');
    }

    // Recomendações de performance
    if (performance.averageScore < 50) {
      recommendations.push('Score médio baixo - revisar critérios de matching ou dados de entrada');
    }

    if (performance.averageProcessingTime > 5000) {
      recommendations.push('Tempo de processamento alto - otimizar consultas ao banco de dados');
    }

    // Distribuição de scores
    const lowScores = performance.scoreDistribution['0-20'] + performance.scoreDistribution['21-40'];
    const totalScores = Object.values(performance.scoreDistribution).reduce((a, b) => a + b, 0);
    
    if (totalScores > 0 && (lowScores / totalScores) > 0.6) {
      recommendations.push('Muitos matches com score baixo - considere ajustar pesos dos critérios');
    }

    return recommendations.length > 0 ? recommendations : ['Sistema operando dentro dos parâmetros ideais'];
  }

  /**
   * Reset das métricas (para testes)
   */
  resetMetrics(): void {
    this.analyticsBuffer = [];
    console.log('📊 Analytics buffer resetado');
  }
}
