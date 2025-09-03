// Sistema de Feedback para SinergIA V2 - Machine Learning e Tuning
import { prisma } from '../../shared/database';

export interface UserFeedback {
  id?: string;
  userId: string;
  oportunidadeId: string;
  imigranteId: string;
  scoreOriginal: number;
  scorePercebido: number; // 1-5 stars
  relevante: boolean;
  comentario?: string;
  criteriosImportantes: string[]; // Quais critérios o usuário considera mais importantes
  createdAt?: Date;
}

export interface TuningRecommendation {
  criterio: string;
  pesoAtual: number;
  pesoSugerido: number;
  justificativa: string;
  confianca: number; // 0-100%
  baseadoEm: number; // Quantidade de feedbacks
}

export interface AlgorithmTuning {
  currentWeights: Record<string, number>;
  suggestedWeights: Record<string, number>;
  recommendations: TuningRecommendation[];
  confidence: number;
  basedOnFeedbacks: number;
}

export class SinergiaV2FeedbackService {
  private static instance: SinergiaV2FeedbackService;
  private feedbackBuffer: UserFeedback[] = [];

  public static getInstance(): SinergiaV2FeedbackService {
    if (!SinergiaV2FeedbackService.instance) {
      SinergiaV2FeedbackService.instance = new SinergiaV2FeedbackService();
    }
    return SinergiaV2FeedbackService.instance;
  }

  /**
   * Registrar feedback do usuário
   */
  async submitFeedback(feedback: UserFeedback): Promise<void> {
    try {
      // Adicionar ao buffer
      this.feedbackBuffer.push({
        ...feedback,
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      });

      console.log(`📝 FEEDBACK: Score ${feedback.scoreOriginal}% → ${feedback.scorePercebido}/5 stars, relevante: ${feedback.relevante}`);

      // Manter apenas últimos 500 feedbacks
      if (this.feedbackBuffer.length > 500) {
        this.feedbackBuffer = this.feedbackBuffer.slice(-500);
      }

    } catch (error) {
      console.error('❌ Erro ao registrar feedback:', error);
      throw error;
    }
  }

  /**
   * Analisar feedbacks e gerar recomendações de tuning
   */
  analyzeFeedbacksForTuning(): AlgorithmTuning {
    const feedbacks = this.feedbackBuffer;
    
    if (feedbacks.length < 10) {
      return {
        currentWeights: {},
        suggestedWeights: {},
        recommendations: [],
        confidence: 0,
        basedOnFeedbacks: feedbacks.length
      };
    }

    // Analisar discrepâncias entre score calculado e percebido
    const discrepancies = feedbacks.map(fb => {
      const scoreDiff = (fb.scorePercebido * 20) - fb.scoreOriginal; // Converter 5 stars para 100%
      return {
        feedback: fb,
        discrepancy: scoreDiff,
        isPositive: scoreDiff > 10, // Score percebido muito maior que calculado
        isNegative: scoreDiff < -10 // Score percebido muito menor que calculado
      };
    });

    // Identificar critérios que precisam ajuste
    const criteriosFrequentes = this.analyzeCriteriaFrequency(feedbacks);
    const recommendations: TuningRecommendation[] = [];

    // Gerar recomendações baseadas em padrões
    Object.entries(criteriosFrequentes).forEach(([criterio, dados]) => {
      if (dados.frequency > 0.3 && dados.avgDiscrepancy !== 0) {
        recommendations.push({
          criterio,
          pesoAtual: this.getCurrentWeight(criterio),
          pesoSugerido: this.calculateSuggestedWeight(criterio, dados),
          justificativa: this.generateTuningJustification(criterio, dados),
          confianca: Math.min(100, dados.frequency * 100),
          baseadoEm: dados.count
        });
      }
    });

    const confidence = Math.min(100, (feedbacks.length / 50) * 100); // Máxima confiança com 50+ feedbacks

    return {
      currentWeights: this.getCurrentWeights(),
      suggestedWeights: this.calculateSuggestedWeights(recommendations),
      recommendations,
      confidence,
      basedOnFeedbacks: feedbacks.length
    };
  }

  /**
   * Obter estatísticas de feedback
   */
  getFeedbackStats() {
    const recent = this.feedbackBuffer.slice(-100);
    
    const avgScoreOriginal = recent.reduce((sum, fb) => sum + fb.scoreOriginal, 0) / recent.length || 0;
    const avgScorePercebido = recent.reduce((sum, fb) => sum + (fb.scorePercebido * 20), 0) / recent.length || 0;
    const relevanceRate = recent.filter(fb => fb.relevante).length / recent.length || 0;
    
    return {
      totalFeedbacks: this.feedbackBuffer.length,
      recentFeedbacks: recent.length,
      avgScoreOriginal: Math.round(avgScoreOriginal),
      avgScorePercebido: Math.round(avgScorePercebido),
      scoreDifference: Math.round(avgScorePercebido - avgScoreOriginal),
      relevanceRate: Math.round(relevanceRate * 100),
      topCriteriaImportant: this.getTopImportantCriteria()
    };
  }

  /**
   * Métodos auxiliares privados
   */
  private analyzeCriteriaFrequency(feedbacks: UserFeedback[]) {
    const criteria: Record<string, { frequency: number; avgDiscrepancy: number; count: number }> = {};
    
    feedbacks.forEach(fb => {
      const scoreDiff = (fb.scorePercebido * 20) - fb.scoreOriginal;
      
      fb.criteriosImportantes.forEach(criterio => {
        if (!criteria[criterio]) {
          criteria[criterio] = { frequency: 0, avgDiscrepancy: 0, count: 0 };
        }
        criteria[criterio].count++;
        criteria[criterio].avgDiscrepancy += scoreDiff;
      });
    });

    // Calcular frequências e médias
    Object.keys(criteria).forEach(criterio => {
      criteria[criterio].frequency = criteria[criterio].count / feedbacks.length;
      criteria[criterio].avgDiscrepancy = criteria[criterio].avgDiscrepancy / criteria[criterio].count;
    });

    return criteria;
  }

  private getCurrentWeight(criterio: string): number {
    const weightMap: Record<string, number> = {
      'genero': 10,
      'idade': 10,
      'municipio': 15,
      'transporteProprio': 10,
      'fluenciaPortugues': 15,
      'experiencias': 20,
      'formacao': 15,
      'idiomas': 5,
      'habilidades': 3,
      'caracteristicas': 2
    };
    
    return weightMap[criterio] || 5;
  }

  private calculateSuggestedWeight(criterio: string, dados: any): number {
    const currentWeight = this.getCurrentWeight(criterio);
    const adjustment = dados.avgDiscrepancy * 0.1; // Ajuste de 10% baseado na discrepância
    
    return Math.max(1, Math.min(25, currentWeight + adjustment));
  }

  private generateTuningJustification(criterio: string, dados: any): string {
    if (dados.avgDiscrepancy > 10) {
      return `Usuários consideram este critério mais importante que o algoritmo atual (${dados.count} feedbacks)`;
    } else if (dados.avgDiscrepancy < -10) {
      return `Usuários consideram este critério menos importante que o algoritmo atual (${dados.count} feedbacks)`;
    } else {
      return `Critério está bem calibrado segundo feedback dos usuários (${dados.count} feedbacks)`;
    }
  }

  private getCurrentWeights(): Record<string, number> {
    return {
      genero: 10,
      idade: 10,
      municipio: 15,
      transporteProprio: 10,
      fluenciaPortugues: 15,
      experiencias: 20,
      formacao: 15,
      idiomas: 5,
      habilidades: 3,
      caracteristicas: 2
    };
  }

  private calculateSuggestedWeights(recommendations: TuningRecommendation[]): Record<string, number> {
    const suggested = this.getCurrentWeights();
    
    recommendations.forEach(rec => {
      if (rec.confianca > 60) { // Só aplicar se confiança > 60%
        suggested[rec.criterio] = rec.pesoSugerido;
      }
    });

    return suggested;
  }

  private getTopImportantCriteria(): { criterio: string; frequency: number }[] {
    const criteriaCount: Record<string, number> = {};
    
    this.feedbackBuffer.forEach(fb => {
      fb.criteriosImportantes.forEach(criterio => {
        criteriaCount[criterio] = (criteriaCount[criterio] || 0) + 1;
      });
    });

    return Object.entries(criteriaCount)
      .map(([criterio, count]) => ({
        criterio,
        frequency: count / this.feedbackBuffer.length
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  }

  /**
   * Reset do sistema de feedback (para testes)
   */
  resetFeedback(): void {
    this.feedbackBuffer = [];
    console.log('📝 Feedback buffer resetado');
  }
}
