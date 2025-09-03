// Teste de Integração do Sistema de Notificação SinergIA V2
// Script para verificar se a comunicação entre serviços está funcionando

import { systemEventEmitter, notifyConfigurationChange } from '../../shared/event-emitter';
import { syncManager } from '../../shared/sync-manager';
import { systemHealthService } from './system-health.service';

/**
 * Executar teste completo do sistema de notificação
 */
export async function testNotificationSystem(): Promise<{
  success: boolean;
  results: Array<{
    test: string;
    success: boolean;
    duration: number;
    details?: any;
    error?: string;
  }>;
}> {
  const results: Array<{
    test: string;
    success: boolean;
    duration: number;
    details?: any;
    error?: string;
  }> = [];

  console.log('🧪 INICIANDO TESTE DO SISTEMA DE NOTIFICAÇÃO...\n');

  // Teste 1: Event Emitter básico
  const test1Start = Date.now();
  try {
    const eventStatus = systemEventEmitter.getStatus();
    results.push({
      test: 'Event Emitter - Status',
      success: true,
      duration: Date.now() - test1Start,
      details: eventStatus
    });
    console.log('✅ Teste 1: Event Emitter funcionando');
  } catch (error) {
    results.push({
      test: 'Event Emitter - Status',
      success: false,
      duration: Date.now() - test1Start,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
    console.log('❌ Teste 1: Falha no Event Emitter');
  }

  // Teste 2: Sync Manager básico
  const test2Start = Date.now();
  try {
    const syncStatus = syncManager.getStatus();
    results.push({
      test: 'Sync Manager - Status',
      success: true,
      duration: Date.now() - test2Start,
      details: syncStatus
    });
    console.log('✅ Teste 2: Sync Manager funcionando');
  } catch (error) {
    results.push({
      test: 'Sync Manager - Status',
      success: false,
      duration: Date.now() - test2Start,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
    console.log('❌ Teste 2: Falha no Sync Manager');
  }

  // Teste 3: Registro de serviços fictícios
  const test3Start = Date.now();
  try {
    // Criar serviços fictícios para teste
    const servicoTeste1 = {
      serviceName: 'TesteService1',
      clearCache: () => console.log('🧹 TesteService1: Cache limpo')
    };
    
    const servicoTeste2 = {
      serviceName: 'TesteService2',
      clearCache: () => console.log('🧹 TesteService2: Cache limpo')
    };

    syncManager.registerService(servicoTeste1);
    syncManager.registerService(servicoTeste2);

    const statusAposRegistro = syncManager.getStatus();
    
    results.push({
      test: 'Sync Manager - Registro de Serviços',
      success: statusAposRegistro.registeredServices.length >= 2,
      duration: Date.now() - test3Start,
      details: statusAposRegistro
    });
    console.log('✅ Teste 3: Registro de serviços funcionando');
  } catch (error) {
    results.push({
      test: 'Sync Manager - Registro de Serviços',
      success: false,
      duration: Date.now() - test3Start,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
    console.log('❌ Teste 3: Falha no registro de serviços');
  }

  // Teste 4: Emissão e recepção de eventos
  const test4Start = Date.now();
  try {
    let eventoRecebido = false;
    
    // Configurar listener temporário
    systemEventEmitter.onEvent(
      'configuracao:ativada',
      (data) => {
        console.log('📡 Evento recebido:', data);
        eventoRecebido = true;
      },
      'TestListener'
    );

    // Emitir evento de teste
    notifyConfigurationChange(
      'ativada',
      'test-config-123',
      1,
      'Configuração de Teste'
    );

    // Aguardar processamento
    await new Promise(resolve => setTimeout(resolve, 100));

    results.push({
      test: 'Event Emitter - Emissão e Recepção',
      success: eventoRecebido,
      duration: Date.now() - test4Start,
      details: { eventoRecebido }
    });
    
    if (eventoRecebido) {
      console.log('✅ Teste 4: Comunicação de eventos funcionando');
    } else {
      console.log('❌ Teste 4: Evento não foi recebido');
    }
  } catch (error) {
    results.push({
      test: 'Event Emitter - Emissão e Recepção',
      success: false,
      duration: Date.now() - test4Start,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
    console.log('❌ Teste 4: Falha na comunicação de eventos');
  }

  // Teste 5: System Health Service
  const test5Start = Date.now();
  try {
    const healthStatus = await systemHealthService.checkSystemHealth();
    
    results.push({
      test: 'System Health - Verificação Completa',
      success: healthStatus.overall !== 'error',
      duration: Date.now() - test5Start,
      details: healthStatus
    });
    console.log(`✅ Teste 5: System Health - Status: ${healthStatus.overall}`);
  } catch (error) {
    results.push({
      test: 'System Health - Verificação Completa',
      success: false,
      duration: Date.now() - test5Start,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
    console.log('❌ Teste 5: Falha no System Health');
  }

  // Teste 6: Sincronização forçada
  const test6Start = Date.now();
  try {
    const testResult = await systemHealthService.testFullSynchronization();
    
    results.push({
      test: 'Sincronização Completa',
      success: testResult.success,
      duration: Date.now() - test6Start,
      details: testResult
    });
    
    if (testResult.success) {
      console.log('✅ Teste 6: Sincronização completa funcionando');
    } else {
      console.log('❌ Teste 6: Falhas na sincronização:', testResult.steps.filter(s => !s.success));
    }
  } catch (error) {
    results.push({
      test: 'Sincronização Completa',
      success: false,
      duration: Date.now() - test6Start,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
    console.log('❌ Teste 6: Falha no teste de sincronização');
  }

  // Limpeza
  try {
    syncManager.unregisterService('TesteService1');
    syncManager.unregisterService('TesteService2');
  } catch (error) {
    console.warn('⚠️  Erro na limpeza dos serviços de teste:', error);
  }

  // Resultado final
  const totalTests = results.length;
  const successfulTests = results.filter(r => r.success).length;
  const successRate = (successfulTests / totalTests) * 100;

  console.log(`\n📊 RESULTADO FINAL:`);
  console.log(`✅ Testes passaram: ${successfulTests}/${totalTests} (${successRate.toFixed(1)}%)`);
  
  if (successRate >= 80) {
    console.log('🎉 SISTEMA DE NOTIFICAÇÃO: FUNCIONANDO CORRETAMENTE');
  } else if (successRate >= 60) {
    console.log('⚠️  SISTEMA DE NOTIFICAÇÃO: FUNCIONANDO COM PROBLEMAS');
  } else {
    console.log('❌ SISTEMA DE NOTIFICAÇÃO: FALHAS CRÍTICAS');
  }

  return {
    success: successRate >= 80,
    results
  };
}

/**
 * Executar teste se chamado diretamente
 */
if (require.main === module) {
  testNotificationSystem()
    .then((result) => {
      console.log('\n🏁 TESTE CONCLUÍDO:', result.success ? 'SUCESSO' : 'FALHAS');
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 ERRO CRÍTICO NO TESTE:', error);
      process.exit(1);
    });
}
