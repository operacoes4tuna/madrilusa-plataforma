// Sistema de Notificação entre Serviços - Event Emitter
// Permite comunicação assíncrona entre ConfiguracaoSinergiaService e SinergiaV2Service

import { EventEmitter } from 'events';

// Tipos de eventos do sistema
export interface SystemEvents {
  'configuracao:ativada': {
    configuracaoId: string;
    versao: number;
    nome: string;
    timestamp: number;
  };
  'configuracao:criada': {
    configuracaoId: string;
    versao: number;
    nome: string;
    timestamp: number;
  };
  'configuracao:atualizada': {
    configuracaoId: string;
    versao: number;
    nome: string;
    timestamp: number;
  };
  'configuracao:desativada': {
    configuracaoId: string;
    versao: number;
    motivo?: string;
    timestamp: number;
  };
  'cache:invalidar': {
    servico: string;
    motivo: string;
    timestamp: number;
  };
  'cache:limpar': {
    servicos: string[];
    timestamp: number;
  };
}

export type EventName = keyof SystemEvents;
export type EventData<T extends EventName> = SystemEvents[T];

// Classe principal do Event Emitter
class SystemEventEmitter extends EventEmitter {
  private static instance: SystemEventEmitter;
  private eventCounts: Map<string, number> = new Map();

  private constructor() {
    super();
    this.setMaxListeners(50); // Permitir muitos listeners
  }

  static getInstance(): SystemEventEmitter {
    if (!SystemEventEmitter.instance) {
      SystemEventEmitter.instance = new SystemEventEmitter();
    }
    return SystemEventEmitter.instance;
  }

  /**
   * Emitir evento tipado
   */
  emitEvent<T extends EventName>(eventName: T, data: EventData<T>): void {
    console.log(`🔔 EVENT EMITTER: ${eventName}`, data);
    this.emit(eventName, data);
  }

  /**
   * Escutar evento tipado
   */
  onEvent<T extends EventName>(
    eventName: T,
    listener: (data: EventData<T>) => void | Promise<void>,
    serviceName: string
  ): void {
    const wrappedListener = async (data: EventData<T>) => {
      try {
        console.log(`👂 EVENT LISTENER [${serviceName}]: Recebido ${eventName}`);
        await listener(data);
        console.log(`✅ EVENT LISTENER [${serviceName}]: Processado ${eventName}`);
      } catch (error) {
        console.error(`❌ EVENT LISTENER [${serviceName}]: Erro ao processar ${eventName}:`, error);
      }
    };

    this.on(eventName, wrappedListener);
    
    // Rastrear listeners para debugging
    const currentCount = this.eventCounts.get(eventName) || 0;
    this.eventCounts.set(eventName, currentCount + 1);
    
    console.log(`📋 EVENT EMITTER: Listener registrado [${serviceName}] para ${eventName} (total: ${currentCount + 1})`);
  }

  /**
   * Remover listener específico
   */
  removeEventListener<T extends EventName>(
    eventName: T,
    listener: (data: EventData<T>) => void,
    serviceName: string
  ): void {
    this.off(eventName, listener);
    
    const currentCount = this.eventCounts.get(eventName) || 0;
    this.eventCounts.set(eventName, Math.max(0, currentCount - 1));
    
    console.log(`🗑️  EVENT EMITTER: Listener removido [${serviceName}] para ${eventName} (total: ${currentCount - 1})`);
  }

  /**
   * Limpar todos os listeners (para testes)
   */
  clearAllListeners(): void {
    this.removeAllListeners();
    this.eventCounts.clear();
    console.log('🧹 EVENT EMITTER: Todos os listeners removidos');
  }

  /**
   * Status do sistema de eventos
   */
  getStatus(): {
    totalListeners: number;
    eventCounts: Record<string, number>;
    maxListeners: number;
  } {
    return {
      totalListeners: Array.from(this.eventCounts.values()).reduce((acc, count) => acc + count, 0),
      eventCounts: Object.fromEntries(this.eventCounts.entries()),
      maxListeners: this.getMaxListeners()
    };
  }

  /**
   * Emitir evento de invalidação de cache
   */
  invalidateCache(servico: string, motivo: string): void {
    this.emitEvent('cache:invalidar', {
      servico,
      motivo,
      timestamp: Date.now()
    });
  }

  /**
   * Emitir evento de limpeza total de cache
   */
  clearAllCaches(servicos: string[] = ['SinergiaV2Service', 'ConfiguracaoSinergiaService']): void {
    this.emitEvent('cache:limpar', {
      servicos,
      timestamp: Date.now()
    });
  }

  /**
   * Emitir eventos de configuração
   */
  notifyConfiguracaoAtivada(configuracaoId: string, versao: number, nome: string): void {
    this.emitEvent('configuracao:ativada', {
      configuracaoId,
      versao,
      nome,
      timestamp: Date.now()
    });
  }

  notifyConfiguracaoCriada(configuracaoId: string, versao: number, nome: string): void {
    this.emitEvent('configuracao:criada', {
      configuracaoId,
      versao,
      nome,
      timestamp: Date.now()
    });
  }

  notifyConfiguracaoAtualizada(configuracaoId: string, versao: number, nome: string): void {
    this.emitEvent('configuracao:atualizada', {
      configuracaoId,
      versao,
      nome,
      timestamp: Date.now()
    });
  }

  notifyConfiguracaoDesativada(configuracaoId: string, versao: number, motivo?: string): void {
    this.emitEvent('configuracao:desativada', {
      configuracaoId,
      versao,
      motivo,
      timestamp: Date.now()
    });
  }
}

// Singleton instance
export const systemEventEmitter = SystemEventEmitter.getInstance();

// Helper functions para uso mais fácil
export const notifyConfigurationChange = (
  action: 'ativada' | 'criada' | 'atualizada' | 'desativada',
  configuracaoId: string,
  versao: number,
  nome: string,
  motivo?: string
) => {
  switch (action) {
    case 'ativada':
      systemEventEmitter.notifyConfiguracaoAtivada(configuracaoId, versao, nome);
      break;
    case 'criada':
      systemEventEmitter.notifyConfiguracaoCriada(configuracaoId, versao, nome);
      break;
    case 'atualizada':
      systemEventEmitter.notifyConfiguracaoAtualizada(configuracaoId, versao, nome);
      break;
    case 'desativada':
      systemEventEmitter.notifyConfiguracaoDesativada(configuracaoId, versao, motivo);
      break;
  }
};

export const invalidateServiceCache = (servico: string, motivo: string) => {
  systemEventEmitter.invalidateCache(servico, motivo);
};

export const clearAllServiceCaches = (servicos?: string[]) => {
  systemEventEmitter.clearAllCaches(servicos);
};
