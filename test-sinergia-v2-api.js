/**
 * 🧪 TESTE DIRETO DA API SINERGIA V2
 *
 * Este teste valida diretamente as APIs do SinergIA V2 sem depender da interface web.
 * Foca na validação dos pesos, critérios eliminatórios e uso da IA.
 */

import fs from 'fs';

// 📊 CONFIGURAÇÃO ESPERADA
const CONFIG_ESPERADA = {
  pesos: {
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
  },
  eliminatorios: {
    transporteProprio: true,
    fluenciaPortugues: true,
    genero: false
  },
  ia: {
    thresholdMinimo: 40,
    pesoIA: 30
  }
};

// 🎯 RESULTADOS DOS TESTES
let relatorioAPI = {
  timestamp: new Date().toISOString(),
  testes: {},
  configuracaoAtiva: null,
  health: null,
  metricas: null,
  conformidade: {
    configuracaoValida: null,
    healthOK: null,
    metricasDisponiveis: null
  },
  bugs: [],
  conclusoes: []
};

/**
 * 🚀 EXECUTAR TESTES DA API
 */
async function executarTestesAPI() {
  console.log('🧪 INICIANDO TESTES DIRETOS DA API SINERGIA V2');
  console.log('=' * 60);

  try {
    // 1. Testar Health Check
    console.log('\n🏥 1. Testando Health Check...');
    await testarHealthCheck();

    // 2. Testar Configuração Ativa
    console.log('\n⚙️ 2. Verificando Configuração Ativa...');
    await testarConfiguracaoAtiva();

    // 3. Testar Métricas do Sistema
    console.log('\n📊 3. Coletando Métricas...');
    await testarMetricas();

    // 4. Analisar Conformidade
    console.log('\n✅ 4. Analisando Conformidade...');
    analisarConformidade();

    // 5. Salvar Relatório
    await salvarRelatorioAPI();

  } catch (error) {
    console.error('❌ ERRO DURANTE EXECUÇÃO DOS TESTES API:', error);
    relatorioAPI.erro = error.message;
  }
}

/**
 * 🏥 TESTAR HEALTH CHECK
 */
async function testarHealthCheck() {
  try {
    const response = await fetch('http://localhost:3001/api/sinergia-v2/health');
    const data = await response.json();

    relatorioAPI.health = {
      status: response.status,
      ok: response.ok,
      data: data,
      timestamp: new Date().toISOString()
    };

    if (response.ok && data.success) {
      console.log('  ✅ SinergIA V2 está operacional');
      console.log(`  📋 Versão: ${data.data.version}`);
      console.log(`  🔧 Features: ${data.data.features.length} disponíveis`);
      relatorioAPI.conformidade.healthOK = true;
    } else {
      console.log('  ❌ Health check falhou');
      relatorioAPI.conformidade.healthOK = false;
      relatorioAPI.bugs.push('Health check do SinergIA V2 não está respondendo corretamente');
    }

  } catch (error) {
    console.error('  ❌ Erro no health check:', error.message);
    relatorioAPI.health = { erro: error.message };
    relatorioAPI.conformidade.healthOK = false;
    relatorioAPI.bugs.push(`Erro de conectividade com API: ${error.message}`);
  }
}

/**
 * ⚙️ TESTAR CONFIGURAÇÃO ATIVA
 */
async function testarConfiguracaoAtiva() {
  try {
    const response = await fetch('http://localhost:3001/api/sinergia-config/active');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    relatorioAPI.configuracaoAtiva = {
      status: response.status,
      data: data,
      timestamp: new Date().toISOString()
    };

    if (data.success && data.data) {
      const config = data.data;
      console.log('  ✅ Configuração ativa encontrada');

      // Validar pesos
      console.log('  🔍 Validando pesos configurados...');
      if (config.pesos) {
        const somaPesos = Object.values(config.pesos).reduce((sum, peso) => sum + peso, 0);
        console.log(`    📊 Soma dos pesos: ${somaPesos}% (esperado: 100%)`);

        if (Math.abs(somaPesos - 100) < 0.01) {
          console.log('    ✅ Soma dos pesos está correta');
        } else {
          console.log(`    ❌ Soma dos pesos incorreta: ${somaPesos}%`);
          relatorioAPI.bugs.push(`Soma dos pesos é ${somaPesos}% ao invés de 100%`);
        }

        // Comparar pesos individuais
        for (const [criterio, pesoEsperado] of Object.entries(CONFIG_ESPERADA.pesos)) {
          const pesoAtual = config.pesos[criterio];
          if (pesoAtual === pesoEsperado) {
            console.log(`    ✅ ${criterio}: ${pesoAtual}% (correto)`);
          } else {
            console.log(`    ⚠️ ${criterio}: ${pesoAtual}% (esperado: ${pesoEsperado}%)`);
          }
        }
      } else {
        relatorioAPI.bugs.push('Configuração não contém dados de pesos');
      }

      // Validar configuração de IA
      if (config.iaConfig) {
        console.log('  🤖 Validando configuração de IA...');
        console.log(`    🎯 Threshold mínimo: ${config.iaConfig.thresholdMinimo}% (esperado: ${CONFIG_ESPERADA.ia.thresholdMinimo}%)`);
        console.log(`    ⚖️ Peso da IA: ${config.iaConfig.pesoIA}% (esperado: ${CONFIG_ESPERADA.ia.pesoIA}%)`);
        console.log(`    🔧 Modelo: ${config.iaConfig.modelo}`);
        console.log(`    🌡️ Temperatura: ${config.iaConfig.temperatura}`);
        console.log(`    💰 Custo máximo: $${config.iaConfig.custoMaximoPorAnalise}`);

        if (config.iaConfig.thresholdMinimo === CONFIG_ESPERADA.ia.thresholdMinimo) {
          console.log('    ✅ Threshold da IA correto');
        } else {
          relatorioAPI.bugs.push(`Threshold da IA é ${config.iaConfig.thresholdMinimo}% ao invés de ${CONFIG_ESPERADA.ia.thresholdMinimo}%`);
        }

        if (config.iaConfig.pesoIA === CONFIG_ESPERADA.ia.pesoIA) {
          console.log('    ✅ Peso da IA correto');
        } else {
          relatorioAPI.bugs.push(`Peso da IA é ${config.iaConfig.pesoIA}% ao invés de ${CONFIG_ESPERADA.ia.pesoIA}%`);
        }
      }

      relatorioAPI.conformidade.configuracaoValida = true;
    } else {
      console.log('  ❌ Configuração ativa não encontrada');
      relatorioAPI.conformidade.configuracaoValida = false;
      relatorioAPI.bugs.push('Nenhuma configuração ativa encontrada no sistema');
    }

  } catch (error) {
    console.error('  ❌ Erro ao buscar configuração:', error.message);
    relatorioAPI.configuracaoAtiva = { erro: error.message };
    relatorioAPI.conformidade.configuracaoValida = false;
    relatorioAPI.bugs.push(`Erro ao acessar configuração: ${error.message}`);
  }
}

/**
 * 📊 TESTAR MÉTRICAS
 */
async function testarMetricas() {
  try {
    // Testar métricas de custo
    console.log('  💰 Coletando métricas de custo...');
    const costResponse = await fetch('http://localhost:3001/api/sinergia-v2/metrics/cost');

    if (costResponse.ok) {
      const costData = await costResponse.json();
      relatorioAPI.metricas = relatorioAPI.metricas || {};
      relatorioAPI.metricas.custo = costData.data;

      console.log(`    📈 Total de análises: ${costData.data?.totalAnalyses || 0}`);
      console.log(`    💵 Custo total: $${costData.data?.totalCost?.toFixed(4) || '0.0000'}`);
      console.log(`    📊 Média por análise: $${costData.data?.averageCostPerAnalysis?.toFixed(4) || '0.0000'}`);
    }

    // Testar métricas de performance
    console.log('  ⚡ Coletando métricas de performance...');
    const perfResponse = await fetch('http://localhost:3001/api/sinergia-v2/metrics/performance');

    if (perfResponse.ok) {
      const perfData = await perfResponse.json();
      relatorioAPI.metricas = relatorioAPI.metricas || {};
      relatorioAPI.metricas.performance = perfData.data;

      console.log(`    ⏱️ Tempo médio: ${perfData.data?.averageProcessingTime || 0}ms`);
      console.log(`    🎯 Taxa de sucesso: ${perfData.data?.successRate || 0}%`);
      console.log(`    🤖 Uso de IA: ${perfData.data?.aiUsageRate || 0}%`);
    }

    // Testar estatísticas gerais
    console.log('  📊 Coletando estatísticas gerais...');
    const statsResponse = await fetch('http://localhost:3001/api/sinergia-v2/stats');

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      relatorioAPI.metricas = relatorioAPI.metricas || {};
      relatorioAPI.metricas.estatisticas = statsData.data;

      console.log(`    📈 Estatísticas disponíveis: ${Object.keys(statsData.data || {}).length} categorias`);
    }

    relatorioAPI.conformidade.metricasDisponiveis = true;
    console.log('  ✅ Métricas coletadas com sucesso');

  } catch (error) {
    console.error('  ❌ Erro ao coletar métricas:', error.message);
    relatorioAPI.metricas = { erro: error.message };
    relatorioAPI.conformidade.metricasDisponiveis = false;
    relatorioAPI.bugs.push(`Erro ao coletar métricas: ${error.message}`);
  }
}

/**
 * ✅ ANALISAR CONFORMIDADE GERAL
 */
function analisarConformidade() {
  console.log('\n📋 ANÁLISE DE CONFORMIDADE GERAL');
  console.log('-' * 40);

  // Verificar se todos os testes passaram
  const healthOK = relatorioAPI.conformidade.healthOK;
  const configOK = relatorioAPI.conformidade.configuracaoValida;
  const metricasOK = relatorioAPI.conformidade.metricasDisponiveis;

  console.log(`🏥 Health Check: ${healthOK ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`⚙️ Configuração: ${configOK ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`📊 Métricas: ${metricasOK ? '✅ OK' : '❌ FALHOU'}`);

  // Calcular score de conformidade
  let scoreConformidade = 0;
  if (healthOK) scoreConformidade += 40;
  if (configOK) scoreConformidade += 40;
  if (metricasOK) scoreConformidade += 20;

  console.log(`\n🎯 SCORE DE CONFORMIDADE: ${scoreConformidade}%`);

  // Adicionar conclusões baseadas no score
  if (scoreConformidade >= 90) {
    relatorioAPI.conclusoes.push('✅ Sistema SinergIA V2 está totalmente operacional e conforme');
  } else if (scoreConformidade >= 70) {
    relatorioAPI.conclusoes.push('⚠️ Sistema SinergIA V2 está operacional mas com algumas questões menores');
  } else if (scoreConformidade >= 50) {
    relatorioAPI.conclusoes.push('⚠️ Sistema SinergIA V2 está funcionando mas precisa de atenção');
  } else {
    relatorioAPI.conclusoes.push('❌ Sistema SinergIA V2 tem problemas significativos que precisam ser resolvidos');
  }

  // Analisar bugs específicos
  if (relatorioAPI.bugs.length === 0) {
    relatorioAPI.conclusoes.push('🎉 Nenhum bug foi identificado nos testes da API');
  } else {
    relatorioAPI.conclusoes.push(`🐛 ${relatorioAPI.bugs.length} bugs identificados que precisam de atenção`);
  }

  // Verificar dados específicos da configuração
  if (relatorioAPI.configuracaoAtiva?.data?.data) {
    const config = relatorioAPI.configuracaoAtiva.data.data;

    // Verificar se IA está habilitada
    if (config.iaConfig?.habilitada) {
      relatorioAPI.conclusoes.push(`🤖 IA está habilitada (modelo: ${config.iaConfig.modelo})`);
    } else {
      relatorioAPI.conclusoes.push('🤖 IA está desabilitada');
    }

    // Verificar critérios eliminatórios
    if (config.prefiltros) {
      const eliminatoriosAtivos = Object.entries(config.prefiltros)
        .filter(([_, filtro]) => filtro.ativo)
        .map(([criterio, _]) => criterio);

      relatorioAPI.conclusoes.push(`🚫 ${eliminatoriosAtivos.length} critérios eliminatórios ativos: ${eliminatoriosAtivos.join(', ')}`);
    }
  }

  relatorioAPI.scoreConformidade = scoreConformidade;
}

/**
 * 💾 SALVAR RELATÓRIO DA API
 */
async function salvarRelatorioAPI() {
  const relatorioPath = `relatorio_api_sinergia_v2_${Date.now()}.json`;

  fs.writeFileSync(relatorioPath, JSON.stringify(relatorioAPI, null, 2));

  console.log('\n📋 RELATÓRIO DA API GERADO');
  console.log('=' * 40);
  console.log(`📁 Arquivo: ${relatorioPath}`);
  console.log(`🎯 Score de Conformidade: ${relatorioAPI.scoreConformidade}%`);
  console.log(`🐛 Bugs encontrados: ${relatorioAPI.bugs.length}`);
  console.log(`💡 Conclusões: ${relatorioAPI.conclusoes.length}`);

  // Exibir resumo
  if (relatorioAPI.bugs.length > 0) {
    console.log('\n🐛 BUGS IDENTIFICADOS:');
    relatorioAPI.bugs.forEach((bug, index) => {
      console.log(`${index + 1}. ${bug}`);
    });
  }

  if (relatorioAPI.conclusoes.length > 0) {
    console.log('\n💡 CONCLUSÕES:');
    relatorioAPI.conclusoes.forEach((conclusao, index) => {
      console.log(`${index + 1}. ${conclusao}`);
    });
  }

  console.log('\n✅ TESTES DA API CONCLUÍDOS!');
}

// 🚀 EXECUTAR TESTES
if (import.meta.url === `file://${process.argv[1]}`) {
  executarTestesAPI().catch(console.error);
}

export { executarTestesAPI, CONFIG_ESPERADA };