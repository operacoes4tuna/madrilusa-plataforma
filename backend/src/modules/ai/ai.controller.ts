import { Request, Response } from 'express';
import { AIService } from './ai.service';
import type { 
  EnhanceTextRequest, 
  SuggestTagsRequest,
  AIContext 
} from './ai.types';

export class AIController {
  private aiService = new AIService();

  enhanceText = async (req: Request, res: Response) => {
    try {
      const { text, context, enhancementType = 'enhance' } = req.body as EnhanceTextRequest & { enhancementType?: string };
      
      // Validações básicas
      if (!text || !context) {
        return res.status(400).json({
          success: false,
          error: 'Texto e contexto são obrigatórios'
        });
      }

      if (text.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Texto deve ter pelo menos 10 caracteres'
        });
      }

      if (text.length > 2000) {
        return res.status(400).json({
          success: false,
          error: 'Texto deve ter no máximo 2000 caracteres'
        });
      }

      // Sanitizar input
      const sanitizedText = this.aiService.sanitizeInput(text);
      
      // Preparar request para IA
      const aiRequest: EnhanceTextRequest = {
        text: sanitizedText,
        context: {
          ...context,
          platformContext: "Plataforma Madrilusa para integração de jovens imigrantes em territórios rurais portugueses"
        },
        userId: (req as any).userId || undefined // Será configurado por middleware de auth
      };

      const result = await this.aiService.enhanceText(aiRequest, enhancementType as any);

      res.json({
        success: true,
        data: result,
        message: 'Texto aprimorado com sucesso'
      });

    } catch (error) {
      console.error('❌ Erro no controller de aprimoramento:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível aprimorar o texto no momento'
      });
    }
  };

  suggestTags = async (req: Request, res: Response) => {
    try {
      const { text, context, existingTags = [], selectedTags = [] } = req.body as SuggestTagsRequest;
      
      // Validações básicas
      if (!text || !context) {
        return res.status(400).json({
          success: false,
          error: 'Texto e contexto são obrigatórios'
        });
      }

      if (text.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Texto deve ter pelo menos 10 caracteres para sugerir tags'
        });
      }

      // Sanitizar input
      const sanitizedText = this.aiService.sanitizeInput(text);
      
      // Preparar request para IA
      const aiRequest: SuggestTagsRequest = {
        text: sanitizedText,
        context: {
          ...context,
          platformContext: "Plataforma Madrilusa para integração de jovens imigrantes em territórios rurais portugueses"
        },
        existingTags,
        selectedTags,
        userId: (req as any).userId || undefined
      };

      const result = await this.aiService.suggestTags(aiRequest);

      res.json({
        success: true,
        data: result,
        message: 'Tags sugeridas com sucesso'
      });

    } catch (error) {
      console.error('❌ Erro na sugestão de tags:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível sugerir tags no momento'
      });
    }
  };

  healthCheck = async (req: Request, res: Response) => {
    try {
      const health = await this.aiService.healthCheck();
      
      res.json({
        success: true,
        data: health,
        message: 'Health check da IA realizado'
      });
    } catch (error) {
      console.error('❌ Erro no health check da IA:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro no health check',
        data: {
          status: 'unhealthy',
          model: 'gpt-4',
          available: false
        }
      });
    }
  };

  // Método para obter métricas básicas (será expandido na Etapa 5)
  getMetrics = async (req: Request, res: Response) => {
    try {
      // Por enquanto, métricas básicas simuladas
      // Será implementado completamente na Etapa 5
      const basicMetrics = {
        totalInteractions: 0,
        averageResponseTime: 0,
        successRate: 100,
        lastUpdated: new Date().toISOString()
      };

      res.json({
        success: true,
        data: basicMetrics,
        message: 'Métricas básicas obtidas'
      });
    } catch (error) {
      console.error('❌ Erro ao obter métricas:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro ao obter métricas'
      });
    }
  };
}
