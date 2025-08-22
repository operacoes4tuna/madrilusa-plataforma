import { Request, Response } from 'express';
import { SinergiaService } from './sinergia.service';
import type { SinergiaAnalysisRequest } from './sinergia.types';

export class SinergiaController {
  private sinergiaService = new SinergiaService();

  // Endpoint principal - Analisar sinergia do usuário
  analyzeUserSynergy = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const options: Partial<SinergiaAnalysisRequest> = req.body || {};

      // Validações básicas
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      // Verificar se usuário pode fazer análise
      const canAnalyze = await this.sinergiaService.canUserAnalyze(userId);
      
      if (!canAnalyze.canAnalyze) {
        return res.status(400).json({
          success: false,
          error: canAnalyze.reason || 'Usuário não pode fazer análise no momento'
        });
      }

      console.log(`🧠 SINERGIA: Iniciando análise para usuário ${userId}`);

      // Processar análise de sinergia
      const results = await this.sinergiaService.analyzeUserSynergy(userId, options);

      res.json({
        success: true,
        data: results,
        message: `Análise concluída: ${results.totalMatches} sinergias encontradas`
      });

    } catch (error) {
      console.error('❌ Erro no controller de sinergia:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Não foi possível processar análise de sinergia'
      });
    }
  };

  // Endpoint para verificar se usuário pode fazer análise
  checkUserEligibility = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const eligibility = await this.sinergiaService.canUserAnalyze(userId);

      res.json({
        success: true,
        data: eligibility,
        message: eligibility.canAnalyze ? 'Usuário pode fazer análise' : 'Usuário não elegível'
      });

    } catch (error) {
      console.error('Erro ao verificar elegibilidade:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  };

  // Endpoint para estatísticas do sistema (debugging)
  getSystemStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.sinergiaService.getSystemStats();

      res.json({
        success: true,
        data: stats,
        message: 'Estatísticas obtidas com sucesso'
      });

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  };

  // Endpoint simples para solicitar contato (MVP)
  requestContact = async (req: Request, res: Response) => {
    try {
      const { 
        userId, 
        targetCategory, 
        matchScore, 
        explanation, 
        userMessage,
        userEmail,
        userName 
      } = req.body;

      // Validações básicas
      if (!userId || !targetCategory || !userEmail || !userName) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios: userId, targetCategory, userEmail, userName'
        });
      }

      // Por enquanto, apenas log (email será implementado depois)
      console.log('📧 CONTATO SOLICITADO:', {
        userId,
        userName,
        userEmail,
        targetCategory,
        matchScore,
        explanation,
        userMessage,
        timestamp: new Date().toISOString()
      });

      // TODO: Implementar envio de email para admin
      // await this.sendContactEmail(contactData);

      res.json({
        success: true,
        message: 'Solicitação de contato registrada. A administração entrará em contacto em breve.',
        data: {
          requestId: `req_${Date.now()}`, // ID temporário
          estimatedResponse: '24-48 horas'
        }
      });

    } catch (error) {
      console.error('Erro ao processar solicitação de contato:', error);
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  };
}
