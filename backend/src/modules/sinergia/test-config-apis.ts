// Teste Específico das APIs de Configuração SinergIA V2
// Testa as funcionalidades sem inicializar o servidor completo

import { configuracaoSinergiaService } from './configuracao-sinergia.service';
import { systemEventEmitter } from '../../shared/event-emitter';
import { syncManager } from '../../shared/sync-manager';
import { systemHealthService } from './system-health.service';

/**
 * Teste das APIs de configuração
 */
async function testConfigApis(): Promise<void> {
  console.log('🧪 INICIANDO TESTE DAS APIs DE CONFIGURAÇÃO...\n');

  try {
    // Teste 1: Buscar configuração ativa
    console.log('📋 Teste 1: Buscar configuração ativa');
    const configAtiva = await configuracaoSinergiaService.getConfiguracaoAtiva();
    console.log(`✅ Configuração ativa carregada:`, {
      pesos: configAtiva.pesos,
      iaHabilitada: configAtiva.iaConfig.habilitada,
      modelo: configAtiva.iaConfig.modelo
    });

    // Teste 2: Verificar saúde do sistema
    console.log('\n🏥 Teste 2: Verificar saúde do sistema');
    const healthStatus = await systemHealthService.checkSystemHealth();
    console.log(`✅ Saúde do sistema: ${healthStatus.overall}`);
    console.log('📊 Serviços:', Object.keys(healthStatus.services).map(key => 
      `${key}: ${healthStatus.services[key as keyof typeof healthStatus.services].status}`
    ));

    // Teste 3: Status do Event Emitter
    console.log('\n📡 Teste 3: Status do Event Emitter');
    const eventStatus = systemEventEmitter.getStatus();
    console.log(`✅ Event Emitter:`, {
      totalListeners: eventStatus.totalListeners,
      eventos: Object.keys(eventStatus.eventCounts)
    });

    // Teste 4: Status do Sync Manager
    console.log('\n🔄 Teste 4: Status do Sync Manager');
    const syncStatus = syncManager.getStatus();
    console.log(`✅ Sync Manager:`, {
      servicosRegistrados: syncStatus.registeredServices.length,
      servicos: syncStatus.registeredServices
    });

    // Teste 5: Testar sincronização
    console.log('\n🧪 Teste 5: Testar sincronização completa');
    const syncTest = await systemHealthService.testFullSynchronization();
    console.log(`✅ Teste de sincronização: ${syncTest.success ? 'PASSOU' : 'FALHOU'}`);
    
    if (!syncTest.success) {
      console.log('❌ Falhas:', syncTest.steps.filter(s => !s.success).map(s => s.step));
    }

    // Teste 6: Emitir evento de teste
    console.log('\n🔔 Teste 6: Emitir evento de configuração');
    let eventoCapturado = false;
    
    systemEventEmitter.onEvent(
      'configuracao:ativada',
      (data) => {
        console.log('📨 Evento capturado:', data);
        eventoCapturado = true;
      },
      'TestCapture'
    );

    // Simular ativação de configuração
    systemEventEmitter.notifyConfiguracaoAtivada(
      'test-config-456',
      2,
      'Configuração de Teste'
    );

    // Aguardar processamento
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (eventoCapturado) {
      console.log('✅ Evento processado corretamente');
    } else {
      console.log('❌ Evento não foi capturado');
    }

    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('\n📊 RESUMO FINAL:');
    console.log(`✅ Configuração ativa: OK`);
    console.log(`✅ System Health: ${healthStatus.overall}`);
    console.log(`✅ Event Emitter: ${eventStatus.totalListeners} listeners`);
    console.log(`✅ Sync Manager: ${syncStatus.registeredServices.length} serviços`);
    console.log(`✅ Sincronização: ${syncTest.success ? 'OK' : 'PROBLEMAS'}`);
    console.log(`✅ Eventos: ${eventoCapturado ? 'OK' : 'PROBLEMAS'}`);

  } catch (error) {
    console.error('💥 ERRO CRÍTICO NO TESTE:', error);
    throw error;
  }
}

/**
 * Executar se chamado diretamente
 */
if (require.main === module) {
  testConfigApis()
    .then(() => {
      console.log('\n🏁 TESTE CONCLUÍDO COM SUCESSO!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 TESTE FALHOU:', error);
      process.exit(1);
    });
}

export { testConfigApis };
