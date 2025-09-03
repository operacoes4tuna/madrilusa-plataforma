// Gerenciador Central de Sincronização entre Serviços
// Coordena invalidação de cache e comunicação entre serviços

import { systemEventEmitter } from './event-emitter';

// Interface para serviços que possuem cache
interface CacheableService {
  clearCache(): void;
  serviceName: string;
}

// Gerenciador de sincronização
export class SyncManager {
  private static instance: SyncManager;
  private registeredServices: Map<string, CacheableService> = new Map();

  private constructor() {
    this.setupGlobalListeners();
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  /**
   * Registrar serviço com cache
   */
  registerService(service: CacheableService): void {
    this.registeredServices.set(service.serviceName, service);
    console.log(`📋 SYNC MANAGER: Serviço ${service.serviceName} registrado`);
  }

  /**
   * Remover serviço
   */
  unregisterService(serviceName: string): void {
    this.registeredServices.delete(serviceName);
    console.log(`🗑️  SYNC MANAGER: Serviço ${serviceName} removido`);
  }

  /**
   * Invalidar cache de serviço específico
   */
  invalidateServiceCache(serviceName: string, motivo: string): void {
    const service = this.registeredServices.get(serviceName);
    if (service) {
      console.log(`🔄 SYNC MANAGER: Invalidando cache de ${serviceName} - ${motivo}`);
      service.clearCache();
    } else {
      console.warn(`⚠️  SYNC MANAGER: Serviço ${serviceName} não encontrado`);
    }
  }

  /**
   * Invalidar cache de todos os serviços
   */
  invalidateAllCaches(motivo: string): void {
    console.log(`🧹 SYNC MANAGER: Invalidando todos os caches - ${motivo}`);
    
    for (const [serviceName, service] of Array.from(this.registeredServices.entries())) {
      try {
        console.log(`🔄 SYNC MANAGER: Limpando cache de ${serviceName}`);
        service.clearCache();
      } catch (error) {
        console.error(`❌ SYNC MANAGER: Erro ao limpar cache de ${serviceName}:`, error);
      }
    }
  }

  /**
   * Configurar listeners globais
   */
  private setupGlobalListeners(): void {
    // Listener para mudanças de configuração
    systemEventEmitter.onEvent(
      'configuracao:ativada',
      (data) => {
        this.invalidateAllCaches(`Configuração ${data.nome} v${data.versao} ativada`);
      },
      'SyncManager'
    );

    systemEventEmitter.onEvent(
      'configuracao:atualizada',
      (data) => {
        this.invalidateAllCaches(`Configuração ${data.nome} v${data.versao} atualizada`);
      },
      'SyncManager'
    );

    // Listener para comandos de cache
    systemEventEmitter.onEvent(
      'cache:invalidar',
      (data) => {
        if (data.servico === 'all') {
          this.invalidateAllCaches(data.motivo);
        } else {
          this.invalidateServiceCache(data.servico, data.motivo);
        }
      },
      'SyncManager'
    );

    systemEventEmitter.onEvent(
      'cache:limpar',
      (data) => {
        if (data.servicos.includes('all')) {
          this.invalidateAllCaches('Limpeza total solicitada');
        } else {
          for (const serviceName of data.servicos) {
            this.invalidateServiceCache(serviceName, 'Limpeza seletiva solicitada');
          }
        }
      },
      'SyncManager'
    );

    console.log('📡 SYNC MANAGER: Listeners globais configurados');
  }

  /**
   * Status do gerenciador
   */
  getStatus(): {
    registeredServices: string[];
    eventEmitterStatus: any;
  } {
    return {
      registeredServices: Array.from(this.registeredServices.keys()),
      eventEmitterStatus: systemEventEmitter.getStatus()
    };
  }

  /**
   * Forçar sincronização completa
   */
  forceSyncAll(motivo: string = 'Sincronização manual'): void {
    console.log(`🔄 SYNC MANAGER: Sincronização forçada - ${motivo}`);
    this.invalidateAllCaches(motivo);
  }

  /**
   * Testar conectividade entre serviços
   */
  testConnectivity(): {
    syncManager: boolean;
    eventEmitter: boolean;
    registeredServices: Record<string, boolean>;
  } {
    const result = {
      syncManager: true,
      eventEmitter: !!systemEventEmitter,
      registeredServices: {} as Record<string, boolean>
    };

    // Testar cada serviço registrado
    for (const [serviceName, service] of Array.from(this.registeredServices.entries())) {
      try {
        // Verificar se tem método clearCache
        result.registeredServices[serviceName] = typeof service.clearCache === 'function';
      } catch (error) {
        result.registeredServices[serviceName] = false;
      }
    }

    return result;
  }
}

// Singleton instance
export const syncManager = SyncManager.getInstance();
