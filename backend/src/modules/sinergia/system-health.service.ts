// Serviço de Monitoramento de Saúde do Sistema SinergIA
// Monitora conectividade, performance e sincronização entre serviços

import { systemEventEmitter } from '../../shared/event-emitter';
import { syncManager } from '../../shared/sync-manager';
import { configuracaoSinergiaService } from './configuracao-sinergia.service';

export interface SystemHealthStatus {
  timestamp: number;
  overall: 'healthy' | 'warning' | 'error';
  services: {
    eventEmitter: {
      status: 'active' | 'inactive' | 'error';
      listeners: number;
      events: Record<string, number>;
    };
    syncManager: {
      status: 'active' | 'inactive' | 'error';
      registeredServices: string[];
    };
    configuracaoService: {
      status: 'active' | 'inactive' | 'error';
      cacheStatus: 'empty' | 'populated';
      lastConfigLoad?: number;
    };
    sinergiaV2Service: {
      status: 'active' | 'inactive' | 'error';
      cacheStatus: 'empty' | 'populated';
      lastConfigLoad?: number;
    };
  };
  issues: string[];
  recommendations: string[];
}

export class SystemHealthService {
  private static instance: SystemHealthService;
  private healthHistory: SystemHealthStatus[] = [];
  private readonly MAX_HISTORY = 50;

  private constructor() {}

  static getInstance(): SystemHealthService {
    if (!SystemHealthService.instance) {
      SystemHealthService.instance = new SystemHealthService();
    }
    return SystemHealthService.instance;
  }

  /**
   * Verificar saúde completa do sistema
   */
  async checkSystemHealth(): Promise<SystemHealthStatus> {
    const timestamp = Date.now();
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Verificar Event Emitter
      const eventEmitterStatus = this.checkEventEmitter();
      
      // Verificar Sync Manager
      const syncManagerStatus = this.checkSyncManager();
      
      // Verificar Configuração Service
      const configuracaoStatus = await this.checkConfiguracaoService();
      
      // Verificar SinergIA V2 Service (simulado - não temos instância direta)
      const sinergiaV2Status = this.checkSinergiaV2Service();

      // Determinar status geral
      const allStatuses = [
        eventEmitterStatus.status,
        syncManagerStatus.status,
        configuracaoStatus.status,
        sinergiaV2Status.status
      ];

      let overall: 'healthy' | 'warning' | 'error' = 'healthy';
      if (allStatuses.includes('error')) {
        overall = 'error';
      } else if (allStatuses.includes('inactive')) {
        overall = 'warning';
      }

      // Gerar recomendações
      if (eventEmitterStatus.listeners === 0) {
        recommendations.push('Configurar listeners para eventos de configuração');
      }
      
      if (syncManagerStatus.registeredServices.length === 0) {
        recommendations.push('Registrar serviços no SyncManager');
      }

      if (configuracaoStatus.cacheStatus === 'empty') {
        recommendations.push('Pré-carregar configuração ativa no cache');
      }

      const healthStatus: SystemHealthStatus = {
        timestamp,
        overall,
        services: {
          eventEmitter: eventEmitterStatus,
          syncManager: syncManagerStatus,
          configuracaoService: configuracaoStatus,
          sinergiaV2Service: sinergiaV2Status
        },
        issues,
        recommendations
      };

      // Armazenar no histórico
      this.healthHistory.push(healthStatus);
      if (this.healthHistory.length > this.MAX_HISTORY) {
        this.healthHistory.shift();
      }

      return healthStatus;

    } catch (error) {
      console.error('❌ SYSTEM HEALTH: Erro ao verificar saúde do sistema:', error);
      
      return {
        timestamp,
        overall: 'error',
        services: {
          eventEmitter: { status: 'error', listeners: 0, events: {} },
          syncManager: { status: 'error', registeredServices: [] },
          configuracaoService: { status: 'error', cacheStatus: 'empty' },
          sinergiaV2Service: { status: 'error', cacheStatus: 'empty' }
        },
        issues: [`Erro crítico: ${error instanceof Error ? error.message : 'Erro desconhecido'}`],
        recommendations: ['Verificar logs do sistema', 'Reiniciar serviços']
      };
    }
  }

  /**
   * Verificar Event Emitter
   */
  private checkEventEmitter(): SystemHealthStatus['services']['eventEmitter'] {
    try {
      const status = systemEventEmitter.getStatus();
      return {
        status: status.totalListeners > 0 ? 'active' : 'inactive',
        listeners: status.totalListeners,
        events: status.eventCounts
      };
    } catch (error) {
      return {
        status: 'error',
        listeners: 0,
        events: {}
      };
    }
  }

  /**
   * Verificar Sync Manager
   */
  private checkSyncManager(): SystemHealthStatus['services']['syncManager'] {
    try {
      const status = syncManager.getStatus();
      return {
        status: status.registeredServices.length > 0 ? 'active' : 'inactive',
        registeredServices: status.registeredServices
      };
    } catch (error) {
      return {
        status: 'error',
        registeredServices: []
      };
    }
  }

  /**
   * Verificar Configuração Service
   */
  private async checkConfiguracaoService(): Promise<SystemHealthStatus['services']['configuracaoService']> {
    try {
      // Tentar buscar configuração ativa
      const config = await configuracaoSinergiaService.getConfiguracaoAtiva();
      
      return {
        status: config ? 'active' : 'inactive',
        cacheStatus: config ? 'populated' : 'empty',
        lastConfigLoad: Date.now()
      };
    } catch (error) {
      return {
        status: 'error',
        cacheStatus: 'empty'
      };
    }
  }

  /**
   * Verificar SinergIA V2 Service (simulado)
   */
  private checkSinergiaV2Service(): SystemHealthStatus['services']['sinergiaV2Service'] {
    // Como não temos instância direta, simular baseado nos listeners
    const eventStatus = systemEventEmitter.getStatus();
    const hasV2Listeners = Object.keys(eventStatus.eventCounts).some(event => 
      event.includes('configuracao')
    );

    return {
      status: hasV2Listeners ? 'active' : 'inactive',
      cacheStatus: hasV2Listeners ? 'populated' : 'empty',
      lastConfigLoad: hasV2Listeners ? Date.now() : undefined
    };
  }

  /**
   * Obter histórico de saúde
   */
  getHealthHistory(): SystemHealthStatus[] {
    return [...this.healthHistory];
  }

  /**
   * Obter estatísticas de saúde
   */
  getHealthStats(): {
    totalChecks: number;
    healthyPercentage: number;
    lastCheck?: number;
    mostCommonIssues: Record<string, number>;
  } {
    const totalChecks = this.healthHistory.length;
    const healthyChecks = this.healthHistory.filter(h => h.overall === 'healthy').length;
    const healthyPercentage = totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 0;
    
    const lastCheck = this.healthHistory.length > 0 
      ? this.healthHistory[this.healthHistory.length - 1].timestamp 
      : undefined;

    // Contar issues mais comuns
    const issueCount: Record<string, number> = {};
    for (const health of this.healthHistory) {
      for (const issue of health.issues) {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      }
    }

    return {
      totalChecks,
      healthyPercentage,
      lastCheck,
      mostCommonIssues: issueCount
    };
  }

  /**
   * Testar sincronização completa
   */
  async testFullSynchronization(): Promise<{
    success: boolean;
    steps: Array<{
      step: string;
      success: boolean;
      duration: number;
      error?: string;
    }>;
  }> {
    const steps: Array<{
      step: string;
      success: boolean;
      duration: number;
      error?: string;
    }> = [];

    try {
      // Passo 1: Verificar conectividade
      const startConnectivity = Date.now();
      try {
        const connectivity = syncManager.testConnectivity();
        steps.push({
          step: 'Verificar conectividade',
          success: connectivity.syncManager && connectivity.eventEmitter,
          duration: Date.now() - startConnectivity
        });
      } catch (error) {
        steps.push({
          step: 'Verificar conectividade',
          success: false,
          duration: Date.now() - startConnectivity,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // Passo 2: Testar invalidação de cache
      const startCache = Date.now();
      try {
        syncManager.forceSyncAll('Teste de sincronização completa');
        steps.push({
          step: 'Invalidar caches',
          success: true,
          duration: Date.now() - startCache
        });
      } catch (error) {
        steps.push({
          step: 'Invalidar caches',
          success: false,
          duration: Date.now() - startCache,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // Passo 3: Verificar configuração ativa
      const startConfig = Date.now();
      try {
        const config = await configuracaoSinergiaService.getConfiguracaoAtiva();
        steps.push({
          step: 'Carregar configuração',
          success: !!config,
          duration: Date.now() - startConfig
        });
      } catch (error) {
        steps.push({
          step: 'Carregar configuração',
          success: false,
          duration: Date.now() - startConfig,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      const success = steps.every(step => step.success);
      return { success, steps };

    } catch (error) {
      return {
        success: false,
        steps: [{
          step: 'Teste geral',
          success: false,
          duration: 0,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        }]
      };
    }
  }
}

// Singleton instance
export const systemHealthService = SystemHealthService.getInstance();
