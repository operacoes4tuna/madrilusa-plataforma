// Controller para Monitoramento de Saúde do Sistema SinergIA
// Endpoints para verificar conectividade e sincronização entre serviços

import { Request, Response } from 'express';
import { systemHealthService } from './system-health.service';
import { syncManager } from '../../shared/sync-manager';
import { systemEventEmitter } from '../../shared/event-emitter';

export class SystemHealthController {
  
  /**
   * GET /api/system/health
   * Verificar saúde geral do sistema
   */
  async getSystemHealth(req: Request, res: Response): Promise<void> {
    try {
      const healthStatus = await systemHealthService.checkSystemHealth();
      
      res.json({
        success: true,
        data: healthStatus,
        message: `Sistema ${healthStatus.overall === 'healthy' ? 'saudável' : 'com problemas'}`
      });

    } catch (error) {
      console.error('❌ SYSTEM HEALTH: Erro ao verificar saúde:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao verificar saúde do sistema',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * GET /api/system/health/stats
   * Estatísticas históricas de saúde
   */
  async getHealthStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = systemHealthService.getHealthStats();
      const history = systemHealthService.getHealthHistory();
      
      res.json({
        success: true,
        data: {
          stats,
          recentHistory: history.slice(-10) // Últimos 10 checks
        }
      });

    } catch (error) {
      console.error('❌ SYSTEM HEALTH: Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar estatísticas de saúde'
      });
    }
  }

  /**
   * POST /api/system/sync/force
   * Forçar sincronização completa
   */
  async forceSynchronization(req: Request, res: Response): Promise<void> {
    try {
      const { motivo = 'Sincronização manual via API' } = req.body;
      
      // Forçar sincronização
      syncManager.forceSyncAll(motivo);
      
      // Verificar resultado
      const healthAfter = await systemHealthService.checkSystemHealth();
      
      res.json({
        success: true,
        data: {
          syncForced: true,
          healthAfter: healthAfter.overall,
          timestamp: Date.now()
        },
        message: 'Sincronização forçada executada com sucesso'
      });

    } catch (error) {
      console.error('❌ SYSTEM HEALTH: Erro ao forçar sincronização:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao forçar sincronização'
      });
    }
  }

  /**
   * POST /api/system/sync/test
   * Testar sincronização completa
   */
  async testSynchronization(req: Request, res: Response): Promise<void> {
    try {
      const testResult = await systemHealthService.testFullSynchronization();
      
      res.json({
        success: testResult.success,
        data: testResult,
        message: testResult.success 
          ? 'Teste de sincronização passou'
          : 'Teste de sincronização falhou'
      });

    } catch (error) {
      console.error('❌ SYSTEM HEALTH: Erro ao testar sincronização:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao testar sincronização'
      });
    }
  }

  /**
   * GET /api/system/connectivity
   * Testar conectividade entre serviços
   */
  async testConnectivity(req: Request, res: Response): Promise<void> {
    try {
      const connectivity = syncManager.testConnectivity();
      const eventEmitterStatus = systemEventEmitter.getStatus();
      
      const overallConnectivity = connectivity.syncManager && 
                                  connectivity.eventEmitter && 
                                  Object.values(connectivity.registeredServices).every(status => status);

      res.json({
        success: true,
        data: {
          connectivity,
          eventEmitterStatus,
          overall: overallConnectivity ? 'connected' : 'issues'
        },
        message: overallConnectivity 
          ? 'Todos os serviços conectados'
          : 'Problemas de conectividade detectados'
      });

    } catch (error) {
      console.error('❌ SYSTEM HEALTH: Erro ao testar conectividade:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao testar conectividade'
      });
    }
  }

  /**
   * POST /api/system/cache/clear
   * Limpar cache de serviços específicos
   */
  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      const { 
        servicos = ['all'], 
        motivo = 'Limpeza manual via API' 
      } = req.body;

      if (servicos.includes('all')) {
        syncManager.forceSyncAll(motivo);
      } else {
        for (const servico of servicos) {
          syncManager.invalidateServiceCache(servico, motivo);
        }
      }

      res.json({
        success: true,
        data: {
          servicosLimpos: servicos,
          motivo,
          timestamp: Date.now()
        },
        message: 'Cache limpo com sucesso'
      });

    } catch (error) {
      console.error('❌ SYSTEM HEALTH: Erro ao limpar cache:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao limpar cache'
      });
    }
  }

  /**
   * GET /api/system/events/status
   * Status detalhado do sistema de eventos
   */
  async getEventsStatus(req: Request, res: Response): Promise<void> {
    try {
      const eventStatus = systemEventEmitter.getStatus();
      const syncStatus = syncManager.getStatus();
      
      res.json({
        success: true,
        data: {
          eventEmitter: eventStatus,
          syncManager: syncStatus,
          integration: {
            totalServices: syncStatus.registeredServices.length,
            totalListeners: eventStatus.totalListeners,
            ratio: eventStatus.totalListeners / Math.max(1, syncStatus.registeredServices.length)
          }
        }
      });

    } catch (error) {
      console.error('❌ SYSTEM HEALTH: Erro ao buscar status de eventos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar status de eventos'
      });
    }
  }
}
