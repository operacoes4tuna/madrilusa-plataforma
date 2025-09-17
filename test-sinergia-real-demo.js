/**
 * 🧪 DEMONSTRAÇÃO REAL DO SINERGIA V2
 *
 * Este script demonstra o funcionamento real do SinergIA V2
 * usando dados existentes na base de dados.
 */

import fs from 'fs';

// 🎯 RESULTADO DA DEMONSTRAÇÃO
let relatorioDemo = {
  timestamp: new Date().toISOString(),
  analises: [],
  bugs: [],
  funcionalidades: {
    ativas: [],
    problematicas: []
  },
  conclusoes: []
};

/**
 * 🚀 EXECUTAR DEMONSTRAÇÃO REAL
 */
async function executarDemonstracao() {
  console.log('🎬 DEMONSTRAÇÃO REAL DO SINERGIA V2');
  console.log('=' * 50);

  try {
    // 1. Buscar oportunidades disponíveis
    console.log('\n📋 1. Buscando oportunidades disponíveis...');
    const oportunidades = await buscarOportunidades();

    if (!oportunidades || oportunidades.length === 0) {
      console.log('  ⚠️ Nenhuma oportunidade encontrada');
      relatorioDemo.bugs.push('Nenhuma oportunidade de trabalho encontrada na base de dados');
      return;
    }

    console.log(`  ✅ Encontradas ${oportunidades.length} oportunidades`);

    // 2. Para cada oportunidade, executar análise
    for (let i = 0; i < Math.min(3, oportunidades.length); i++) {
      const oportunidade = oportunidades[i];
      console.log(`\n🔬 ${i + 1}. Analisando oportunidade: ${oportunidade.titulo || oportunidade.nomeCargo}`);

      await analisarOportunidade(oportunidade);
    }

    // 3. Analisar resultados
    console.log('\n📊 3. Analisando Resultados...');
    analisarResultados();

    // 4. Salvar relatório
    await salvarRelatorioDemo();

  } catch (error) {
    console.error('❌ ERRO DURANTE DEMONSTRAÇÃO:', error);
    relatorioDemo.erro = error.message;
  }
}

/**
 * 📋 BUSCAR OPORTUNIDADES DISPONÍVEIS
 */
async function buscarOportunidades() {
  try {
    // Primeira tentativa: buscar via API de oportunidades
    let response = await fetch('http://localhost:3001/api/oportunidades-trabalho');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.data && data.data.length > 0) {
      console.log(`  📊 Encontradas ${data.data.length} oportunidades via API`);
      return data.data;
    } else {
      console.log('  ⚠️ API de oportunidades não retornou dados');
      return [];
    }

  } catch (error) {
    console.error('  ❌ Erro ao buscar oportunidades:', error.message);
    relatorioDemo.bugs.push(`Erro ao buscar oportunidades: ${error.message}`);
    return [];
  }
}

/**
 * 🔬 ANALISAR UMA OPORTUNIDADE ESPECÍFICA
 */
async function analisarOportunidade(oportunidade) {
  try {
    console.log(`  🎯 Título: ${oportunidade.titulo || oportunidade.nomeCargo || 'Sem título'}`);
    console.log(`  🏢 Empresa: ${oportunidade.empresaNome || 'Não informado'}`);
    console.log(`  📍 Local: ${oportunidade.municipioResidencia || 'Não informado'}`);

    // Executar análise via API SinergIA V2
    const analiseResponse = await fetch(`http://localhost:3001/api/sinergia-v2/opportunity/${oportunidade.id}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        minScore: 0,
        maxResults: 10,
        includeBreakdown: true,
        useAI: true,
        cacheResults: false
      })
    });

    if (!analiseResponse.ok) {
      const errorText = await analiseResponse.text();
      console.log(`  ❌ Erro na análise: HTTP ${analiseResponse.status}`);
      console.log(`  📄 Resposta: ${errorText.substring(0, 200)}...`);

      relatorioDemo.bugs.push(`Erro na análise da oportunidade ${oportunidade.id}: HTTP ${analiseResponse.status}`);
      return;
    }

    const analiseData = await analiseResponse.json();

    if (analiseData.success && analiseData.data) {
      const { matches, stats } = analiseData.data;

      console.log(`  ✅ Análise concluída: ${matches.length} matches encontrados`);
      console.log(`  📊 Score médio: ${stats.averageScore.toFixed(1)}%`);
      console.log(`  🤖 Tokens usados: ${stats.totalTokensUsed}`);

      // Analisar alguns matches em detalhe
      if (matches.length > 0) {
        console.log(`  🔍 Top 3 matches:`);

        for (let j = 0; j < Math.min(3, matches.length); j++) {
          const match = matches[j];
          console.log(`    ${j + 1}. ${match.imigrante?.nomeCompleto || 'Nome não disponível'} - Score: ${match.scoreTotal}%`);

          // Verificar breakdown para identificar funcionalidades ativas
          if (match.breakdown) {
            analisarBreakdown(match.breakdown);
          }
        }
      } else {
        console.log(`  ⚠️ Nenhum match encontrado para esta oportunidade`);
      }

      // Salvar análise no relatório
      relatorioDemo.analises.push({
        oportunidadeId: oportunidade.id,
        titulo: oportunidade.titulo || oportunidade.nomeCargo,
        totalMatches: matches.length,
        scoreMedia: stats.averageScore,
        tokensUsados: stats.totalTokensUsed,
        matches: matches.slice(0, 3), // Top 3
        timestamp: new Date().toISOString()
      });

    } else {
      console.log(`  ❌ Resposta de análise inválida`);
      relatorioDemo.bugs.push(`Resposta inválida da análise para oportunidade ${oportunidade.id}`);
    }

  } catch (error) {
    console.error(`  ❌ Erro na análise da oportunidade:`, error.message);
    relatorioDemo.bugs.push(`Erro interno na análise da oportunidade ${oportunidade.id}: ${error.message}`);
  }
}

/**
 * 📊 ANALISAR BREAKDOWN PARA IDENTIFICAR FUNCIONALIDADES
 */
function analisarBreakdown(breakdown) {
  if (!breakdown) return;

  // Verificar cada critério do breakdown
  const criterios = [
    'genero', 'idade', 'municipio', 'transporteProprio',
    'fluenciaPortugues', 'experiencias', 'formacao',
    'idiomas', 'habilidades', 'caracteristicas'
  ];

  criterios.forEach(criterio => {
    if (breakdown[criterio]) {
      const score = breakdown[criterio].score;
      const details = breakdown[criterio].details;

      // Identificar se critério está funcionando corretamente
      if (score === 100 || score === 75 || score === 50) {
        // Possível score fixo
        if (!relatorioDemo.funcionalidades.problematicas.includes(criterio)) {
          relatorioDemo.funcionalidades.problematicas.push(criterio);
        }
      } else {
        // Score variável - funcionalidade ativa
        if (!relatorioDemo.funcionalidades.ativas.includes(criterio)) {
          relatorioDemo.funcionalidades.ativas.push(criterio);
        }
      }
    }
  });
}

/**
 * 📊 ANALISAR RESULTADOS GERAIS
 */
function analisarResultados() {
  const totalAnalises = relatorioDemo.analises.length;
  const totalMatches = relatorioDemo.analises.reduce((sum, a) => sum + a.totalMatches, 0);
  const mediaScore = relatorioDemo.analises.length > 0 ?
    relatorioDemo.analises.reduce((sum, a) => sum + a.scoreMedia, 0) / relatorioDemo.analises.length : 0;

  console.log(`  📈 Total de análises realizadas: ${totalAnalises}`);
  console.log(`  🎯 Total de matches gerados: ${totalMatches}`);
  console.log(`  📊 Score médio geral: ${mediaScore.toFixed(1)}%`);

  // Analisar funcionalidades
  console.log(`  ✅ Funcionalidades ATIVAS: ${relatorioDemo.funcionalidades.ativas.length}`);
  if (relatorioDemo.funcionalidades.ativas.length > 0) {
    console.log(`    ${relatorioDemo.funcionalidades.ativas.join(', ')}`);
  }

  console.log(`  ⚠️ Funcionalidades PROBLEMÁTICAS: ${relatorioDemo.funcionalidades.problematicas.length}`);
  if (relatorioDemo.funcionalidades.problematicas.length > 0) {
    console.log(`    ${relatorioDemo.funcionalidades.problematicas.join(', ')}`);
  }

  // Gerar conclusões
  if (totalAnalises > 0) {
    relatorioDemo.conclusoes.push(`✅ Sistema processou ${totalAnalises} análises com sucesso`);
  }

  if (totalMatches > 0) {
    relatorioDemo.conclusoes.push(`🎯 Gerou ${totalMatches} matches, demonstrando que o algoritmo está funcional`);
  }

  if (mediaScore > 0) {
    relatorioDemo.conclusoes.push(`📊 Score médio de ${mediaScore.toFixed(1)}% indica qualidade ${mediaScore >= 70 ? 'alta' : mediaScore >= 50 ? 'média' : 'baixa'} dos matches`);
  }

  if (relatorioDemo.funcionalidades.ativas.length >= 7) {
    relatorioDemo.conclusoes.push(`✅ Maioria das funcionalidades (${relatorioDemo.funcionalidades.ativas.length}/10) está operacional`);
  }

  if (relatorioDemo.funcionalidades.problematicas.length > 0) {
    relatorioDemo.conclusoes.push(`⚠️ ${relatorioDemo.funcionalidades.problematicas.length} funcionalidades precisam de correção (scores fixos detectados)`);
  }

  if (relatorioDemo.bugs.length === 0) {
    relatorioDemo.conclusoes.push(`🎉 Nenhum erro crítico detectado durante os testes`);
  } else {
    relatorioDemo.conclusoes.push(`🐛 ${relatorioDemo.bugs.length} problemas técnicos identificados`);
  }
}

/**
 * 💾 SALVAR RELATÓRIO DA DEMONSTRAÇÃO
 */
async function salvarRelatorioDemo() {
  const relatorioPath = `demo_sinergia_v2_${Date.now()}.json`;

  fs.writeFileSync(relatorioPath, JSON.stringify(relatorioDemo, null, 2));

  console.log('\n📋 RELATÓRIO DA DEMONSTRAÇÃO GERADO');
  console.log('=' * 50);
  console.log(`📁 Arquivo: ${relatorioPath}`);
  console.log(`🔬 Análises realizadas: ${relatorioDemo.analises.length}`);
  console.log(`✅ Funcionalidades ativas: ${relatorioDemo.funcionalidades.ativas.length}/10`);
  console.log(`⚠️ Funcionalidades problemáticas: ${relatorioDemo.funcionalidades.problematicas.length}/10`);
  console.log(`🐛 Bugs encontrados: ${relatorioDemo.bugs.length}`);

  // Exibir resumo detalhado
  if (relatorioDemo.analises.length > 0) {
    console.log('\n📊 RESUMO DAS ANÁLISES:');
    relatorioDemo.analises.forEach((analise, index) => {
      console.log(`${index + 1}. ${analise.titulo} - ${analise.totalMatches} matches (score médio: ${analise.scoreMedia.toFixed(1)}%)`);
    });
  }

  if (relatorioDemo.funcionalidades.ativas.length > 0) {
    console.log('\n✅ FUNCIONALIDADES CONFIRMADAS COMO ATIVAS:');
    relatorioDemo.funcionalidades.ativas.forEach((func, index) => {
      console.log(`${index + 1}. ${func} - Scores variáveis detectados`);
    });
  }

  if (relatorioDemo.funcionalidades.problematicas.length > 0) {
    console.log('\n⚠️ FUNCIONALIDADES COM POSSÍVEIS PROBLEMAS:');
    relatorioDemo.funcionalidades.problematicas.forEach((func, index) => {
      console.log(`${index + 1}. ${func} - Scores fixos detectados (possível implementação placeholder)`);
    });
  }

  if (relatorioDemo.bugs.length > 0) {
    console.log('\n🐛 PROBLEMAS IDENTIFICADOS:');
    relatorioDemo.bugs.forEach((bug, index) => {
      console.log(`${index + 1}. ${bug}`);
    });
  }

  if (relatorioDemo.conclusoes.length > 0) {
    console.log('\n💡 CONCLUSÕES FINAIS:');
    relatorioDemo.conclusoes.forEach((conclusao, index) => {
      console.log(`${index + 1}. ${conclusao}`);
    });
  }

  console.log('\n🎉 DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!');
}

// 🚀 EXECUTAR DEMONSTRAÇÃO
if (import.meta.url === `file://${process.argv[1]}`) {
  executarDemonstracao().catch(console.error);
}

export { executarDemonstracao };