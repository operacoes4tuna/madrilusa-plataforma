/**
 * 🧪 TESTE AUTOMATIZADO SINERGIA V2 - PLAYWRIGHT
 *
 * Este script executa uma bateria completa de testes para validar
 * o funcionamento do SinergIA V2 confrontando configurações vs. resultados reais.
 *
 * CENÁRIOS:
 * 1. Match Perfeito (85-95% esperado)
 * 2. Match Parcial (45-65% esperado)
 * 3. Match Eliminado (0% esperado)
 *
 * VALIDAÇÕES:
 * - Pesos administrativos
 * - Critérios eliminatórios
 * - Score mínimo
 * - Threshold de IA
 * - Uso completo dos dados do perfil
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📊 DADOS DE TESTE ESTRUTURADOS
const CENARIOS_TESTE = {
  matchPerfeito: {
    imigrante: {
      nomeCompleto: 'João Silva Santos',
      email: 'joao.teste@madrilusa.test',
      senha: 'teste123456',
      genero: 'M',
      dataNascimento: '1995-05-15', // 28 anos
      municipioResidencia: 'Porto',
      transporteProprio: true,
      fluenciaPortugues: 'Avançada',
      objetivos: 'Trabalhar na área de tecnologia em Portugal',
      experiencias: [
        {
          cargo: 'Desenvolvedor JavaScript',
          empresa: 'TechBrasil Solutions',
          tempoNoCargo: '3 anos',
          descricao: 'Desenvolvimento de aplicações web com React, Node.js e MongoDB. Trabalho em equipe ágil com metodologias Scrum.'
        },
        {
          cargo: 'Analista de Sistemas',
          empresa: 'SoftwareCorp',
          tempoNoCargo: '2 anos',
          descricao: 'Análise de requisitos, modelagem de banco de dados MySQL, documentação técnica.'
        }
      ],
      formacoes: [
        {
          nivelEscolaridade: 'Licenciatura',
          areaEstudo: 'Engenharia Informática',
          instituicao: 'Universidade Federal do Rio de Janeiro',
          anoInicio: '2013',
          anoTermino: '2017'
        }
      ],
      idiomas: [
        {
          idioma: 'Português',
          nivel: 'Fluente'
        },
        {
          idioma: 'Inglês',
          nivel: 'Avançado'
        },
        {
          idioma: 'Espanhol',
          nivel: 'Intermediário'
        }
      ],
      habilidades: ['JavaScript', 'React', 'Node.js', 'MySQL', 'Git', 'HTML', 'CSS', 'MongoDB']
    },
    empresa: {
      nomeCompleto: 'TechPorto Solutions Lda',
      email: 'rh.teste@techporto.test',
      senha: 'teste123456',
      categoria: 'EMPRESA',
      oportunidade: {
        titulo: 'Desenvolvedor Full-Stack Sénior',
        nomeCargo: 'Desenvolvedor Full-Stack',
        nomeProfissao: 'Programador',
        descricaoCargo: 'Procuramos desenvolvedor Full-Stack com experiência em JavaScript moderno, React e Node.js para projeto inovador em startup tecnológica no Porto.',
        municipioResidencia: 'Porto',
        genero: 'M', // Prefere masculino
        idade: '25-35 anos',
        transporteProprio: 'S', // Obrigatório
        fluenciaPortugues: 'S', // Obrigatório
        denominacoes: ['Desenvolvedor', 'Programador', 'Software Engineer'],
        experienciasAceitas: ['Desenvolvedor JavaScript', 'Desenvolvedor Web', 'Full-Stack Developer'],
        habilidades: ['JavaScript', 'React', 'Node.js', 'MySQL'],
        caracteristicas: ['Proativo', 'Trabalho em equipe', 'Resolução de problemas'],
        areasFormacao: ['Engenharia Informática', 'Ciências da Computação', 'Sistemas de Informação'],
        idiomasPreferenciais: [
          { idioma: 'Português', nivel: 'Avançado' },
          { idioma: 'Inglês', nivel: 'Intermediário' }
        ],
        nivelEscolaridade: 'Licenciatura'
      }
    },
    scoreEsperado: { min: 85, max: 95 }
  },

  matchParcial: {
    imigrante: {
      nomeCompleto: 'Maria Santos Silva',
      email: 'maria.teste@madrilusa.test',
      senha: 'teste123456',
      genero: 'F',
      dataNascimento: '1988-08-22', // 35 anos
      municipioResidencia: 'Lisboa', // Diferente do Porto
      transporteProprio: false, // Não tem
      fluenciaPortugues: 'Básica', // Insuficiente
      objetivos: 'Trabalhar na área de educação ou administrativa',
      experiencias: [
        {
          cargo: 'Professora de Matemática',
          empresa: 'Escola Secundária Brasil',
          tempoNoCargo: '8 anos',
          descricao: 'Ensino de matemática para ensino médio, preparação de aulas, avaliação de alunos.'
        },
        {
          cargo: 'Tutora Particular',
          empresa: 'Autónoma',
          tempoNoCargo: '3 anos',
          descricao: 'Aulas particulares de matemática e física para estudantes universitários.'
        }
      ],
      formacoes: [
        {
          nivelEscolaridade: 'Licenciatura',
          areaEstudo: 'Matemática',
          instituicao: 'Universidade de São Paulo',
          anoInicio: '2006',
          anoTermino: '2010'
        }
      ],
      idiomas: [
        {
          idioma: 'Português',
          nivel: 'Básico'
        },
        {
          idioma: 'Espanhol',
          nivel: 'Nativo'
        }
      ],
      habilidades: ['Ensino', 'Matemática', 'Excel básico', 'PowerPoint']
    },
    scoreEsperado: { min: 45, max: 65 }
  },

  matchEliminado: {
    imigrante: {
      nomeCompleto: 'Carlos Lima Pereira',
      email: 'carlos.teste@madrilusa.test',
      senha: 'teste123456',
      genero: 'M',
      dataNascimento: '1978-12-10', // 45 anos
      municipioResidencia: 'Faro', // Muito diferente do Porto
      transporteProprio: false, // Não tem (eliminatório)
      fluenciaPortugues: 'Básica', // Insuficiente (eliminatório)
      objetivos: 'Trabalhar na agricultura ou vendas',
      experiencias: [
        {
          cargo: 'Agricultor',
          empresa: 'Fazenda Família Lima',
          tempoNoCargo: '20 anos',
          descricao: 'Cultivo de milho e feijão, cuidado de animais, venda de produtos agrícolas.'
        },
        {
          cargo: 'Vendedor',
          empresa: 'Mercado Central',
          tempoNoCargo: '5 anos',
          descricao: 'Venda de produtos agrícolas, atendimento ao cliente, controle de caixa.'
        }
      ],
      formacoes: [
        {
          nivelEscolaridade: 'Ensino Básico',
          areaEstudo: 'Ensino Fundamental',
          instituicao: 'Escola Municipal Santos Dumont',
          anoInicio: '1985',
          anoTermino: '1993'
        }
      ],
      idiomas: [
        {
          idioma: 'Português',
          nivel: 'Básico'
        },
        {
          idioma: 'Crioulo',
          nivel: 'Nativo'
        }
      ],
      habilidades: ['Agricultura', 'Vendas', 'Atendimento ao cliente']
    },
    scoreEsperado: { min: 0, max: 20 } // Deve ser eliminado
  }
};

// 🎛️ CONFIGURAÇÃO ESPERADA DO SISTEMA
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
    transporteProprio: true, // Se obrigatório e não tem = eliminado
    fluenciaPortugues: true, // Se obrigatório e insuficiente = eliminado
    genero: false // Apenas pontuação
  },
  ia: {
    thresholdMinimo: 40, // Só usa IA se score ≥ 40%
    pesoIA: 30 // 70% estruturado + 30% IA
  }
};

// 📊 VARIÁVEIS GLOBAIS PARA RELATÓRIO
let relatorioTestes = {
  timestamp: new Date().toISOString(),
  cenarios: {},
  conformidade: {
    pesosCorretos: null,
    eliminatoriosFuncionam: null,
    scoreMinimo: null,
    thresholdIA: null,
    dadosCompletos: null
  },
  bugs: [],
  sugestoes: []
};

/**
 * 🎭 FUNÇÃO PRINCIPAL DE EXECUÇÃO
 */
async function executarTestesCompletos() {
  console.log('🚀 INICIANDO TESTES AUTOMATIZADOS SINERGIA V2');
  console.log('=' * 60);

  const browser = await chromium.launch({
    headless: false, // Mostrar navegador para depuração
    slowMo: 1000 // Atraso entre ações para visualização
  });

  try {
    // Testar cada cenário
    for (const [nomeCenario, dadosCenario] of Object.entries(CENARIOS_TESTE)) {
      console.log(`\n🧪 TESTANDO CENÁRIO: ${nomeCenario.toUpperCase()}`);
      console.log('-' * 40);

      const resultadoCenario = await testarCenario(browser, nomeCenario, dadosCenario);
      relatorioTestes.cenarios[nomeCenario] = resultadoCenario;
    }

    // Gerar relatório final
    await gerarRelatorioConformidade();
    await salvarRelatorio();

  } catch (error) {
    console.error('❌ ERRO DURANTE EXECUÇÃO DOS TESTES:', error);
  } finally {
    await browser.close();
  }
}

/**
 * 🎯 TESTAR UM CENÁRIO ESPECÍFICO
 */
async function testarCenario(browser, nomeCenario, dados) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // 1. Criar usuário imigrante
    console.log('👤 Criando perfil imigrante...');
    const imigranteId = await criarPerfilImigrante(page, dados.imigrante);

    // 2. Criar usuário empresa (novo contexto)
    console.log('🏢 Criando perfil empresa...');
    const empresaContext = await browser.newContext();
    const empresaPage = await empresaContext.newPage();
    const { empresaId, oportunidadeId } = await criarPerfilEmpresa(empresaPage, dados.empresa);

    // 3. Executar análise SinergIA V2
    console.log('🔬 Executando análise SinergIA V2...');
    const resultadoAnalise = await executarAnaliseSinergia(empresaPage, oportunidadeId);

    // 4. Validar resultados
    console.log('✅ Validando resultados...');
    const validacao = await validarResultados(resultadoAnalise, dados.scoreEsperado, imigranteId);

    // 5. Capturar evidências
    await capturarEvidencias(empresaPage, nomeCenario);

    await empresaContext.close();
    return {
      imigranteId,
      empresaId,
      oportunidadeId,
      resultadoAnalise,
      validacao,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ ERRO NO CENÁRIO ${nomeCenario}:`, error);
    return {
      erro: error.message,
      timestamp: new Date().toISOString()
    };
  } finally {
    await context.close();
  }
}

/**
 * 👤 CRIAR PERFIL IMIGRANTE COMPLETO
 */
async function criarPerfilImigrante(page, dados) {
  console.log(`  📝 Cadastrando: ${dados.nomeCompleto}`);

  // Navegar para página inicial
  await page.goto('http://localhost:8081');

  // Clicar em Login/Registro
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(1000);

  // Ir para registro
  await page.click('text=Criar conta');
  await page.waitForTimeout(1000);

  // Selecionar categoria Imigrante
  await page.click('button:has-text("🌍 Imigrante")');
  await page.waitForTimeout(1000);

  // Preencher dados básicos
  await page.fill('input[name="nomeCompleto"]', dados.nomeCompleto);
  await page.fill('input[name="email"]', dados.email);
  await page.fill('input[name="senha"]', dados.senha);
  await page.fill('input[name="confirmarSenha"]', dados.senha);

  // Submeter registro
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // Aguardar redirecionamento para perfil
  await page.waitForURL(/.*\/app.*/);

  // Preencher perfil demográfico
  if (dados.genero) {
    await page.selectOption('select[name="genero"]', dados.genero);
  }

  if (dados.dataNascimento) {
    await page.fill('input[name="dataNascimento"]', dados.dataNascimento);
  }

  if (dados.municipioResidencia) {
    await page.fill('input[name="municipioResidencia"]', dados.municipioResidencia);
  }

  if (dados.transporteProprio !== undefined) {
    const selector = dados.transporteProprio ?
      'input[name="transporteProprio"][value="true"]' :
      'input[name="transporteProprio"][value="false"]';
    await page.click(selector);
  }

  if (dados.fluenciaPortugues) {
    await page.selectOption('select[name="fluenciaPortugues"]', dados.fluenciaPortugues);
  }

  if (dados.objetivos) {
    await page.fill('textarea[name="objetivos"]', dados.objetivos);
  }

  // Salvar perfil básico
  await page.click('button:has-text("Salvar")');
  await page.waitForTimeout(2000);

  // Adicionar experiências profissionais
  if (dados.experiencias && dados.experiencias.length > 0) {
    await page.click('text=Experiências Profissionais');
    await page.waitForTimeout(1000);

    for (const exp of dados.experiencias) {
      await page.click('button:has-text("Adicionar Experiência")');
      await page.waitForTimeout(1000);

      await page.fill('input[name="cargo"]', exp.cargo);
      await page.fill('input[name="empresa"]', exp.empresa);
      await page.fill('input[name="tempoNoCargo"]', exp.tempoNoCargo);
      await page.fill('textarea[name="descricao"]', exp.descricao);

      await page.click('button:has-text("Salvar Experiência")');
      await page.waitForTimeout(1000);
    }
  }

  // Adicionar formações
  if (dados.formacoes && dados.formacoes.length > 0) {
    await page.click('text=Formação Acadêmica');
    await page.waitForTimeout(1000);

    for (const form of dados.formacoes) {
      await page.click('button:has-text("Adicionar Formação")');
      await page.waitForTimeout(1000);

      await page.selectOption('select[name="nivelEscolaridade"]', form.nivelEscolaridade);
      await page.fill('input[name="areaEstudo"]', form.areaEstudo);
      await page.fill('input[name="instituicao"]', form.instituicao);
      await page.fill('input[name="anoInicio"]', form.anoInicio);
      await page.fill('input[name="anoTermino"]', form.anoTermino);

      await page.click('button:has-text("Salvar Formação")');
      await page.waitForTimeout(1000);
    }
  }

  // Adicionar idiomas
  if (dados.idiomas && dados.idiomas.length > 0) {
    await page.click('text=Idiomas Conhecidos');
    await page.waitForTimeout(1000);

    for (const idioma of dados.idiomas) {
      await page.click('button:has-text("Adicionar Idioma")');
      await page.waitForTimeout(1000);

      await page.fill('input[name="idioma"]', idioma.idioma);
      await page.selectOption('select[name="nivel"]', idioma.nivel);

      await page.click('button:has-text("Salvar Idioma")');
      await page.waitForTimeout(1000);
    }
  }

  // Capturar ID do usuário criado (da URL ou localStorage)
  const userId = await page.evaluate(() => {
    const userData = localStorage.getItem('madrilusa_user');
    return userData ? JSON.parse(userData).id : null;
  });

  console.log(`  ✅ Imigrante criado com ID: ${userId}`);
  return userId;
}

/**
 * 🏢 CRIAR PERFIL EMPRESA COM OPORTUNIDADE
 */
async function criarPerfilEmpresa(page, dados) {
  console.log(`  🏢 Cadastrando empresa: ${dados.nomeCompleto}`);

  // Navegar para página inicial
  await page.goto('http://localhost:8081');

  // Processo similar ao imigrante, mas categoria EMPRESA
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(1000);

  await page.click('text=Criar conta');
  await page.waitForTimeout(1000);

  // Selecionar categoria Empresa
  await page.click('button:has-text("🏢 Empresa")');
  await page.waitForTimeout(1000);

  // Preencher dados básicos
  await page.fill('input[name="nomeCompleto"]', dados.nomeCompleto);
  await page.fill('input[name="email"]', dados.email);
  await page.fill('input[name="senha"]', dados.senha);
  await page.fill('input[name="confirmarSenha"]', dados.senha);

  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // Aguardar redirecionamento
  await page.waitForURL(/.*\/app.*/);

  // Preencher perfil empresarial básico
  await page.waitForTimeout(2000);

  // Navegar para criar oportunidade
  await page.click('text=Oportunidades de Trabalho');
  await page.waitForTimeout(1000);

  await page.click('button:has-text("Nova Oportunidade")');
  await page.waitForTimeout(1000);

  // Preencher dados da oportunidade
  const opp = dados.oportunidade;

  await page.fill('input[name="titulo"]', opp.titulo);
  await page.fill('input[name="nomeCargo"]', opp.nomeCargo);
  await page.fill('input[name="nomeProfissao"]', opp.nomeProfissao);
  await page.fill('textarea[name="descricaoCargo"]', opp.descricaoCargo);
  await page.fill('input[name="municipioResidencia"]', opp.municipioResidencia);

  if (opp.genero) {
    await page.selectOption('select[name="genero"]', opp.genero);
  }

  if (opp.idade) {
    await page.fill('input[name="idade"]', opp.idade);
  }

  if (opp.transporteProprio) {
    await page.selectOption('select[name="transporteProprio"]', opp.transporteProprio);
  }

  if (opp.fluenciaPortugues) {
    await page.selectOption('select[name="fluenciaPortugues"]', opp.fluenciaPortugues);
  }

  // Preencher arrays como JSON ou campos individuais conforme interface
  if (opp.habilidades && opp.habilidades.length > 0) {
    await page.fill('textarea[name="habilidades"]', opp.habilidades.join(', '));
  }

  if (opp.experienciasAceitas && opp.experienciasAceitas.length > 0) {
    await page.fill('textarea[name="experienciasAceitas"]', opp.experienciasAceitas.join(', '));
  }

  // Salvar oportunidade
  await page.click('button:has-text("Criar Oportunidade")');
  await page.waitForTimeout(3000);

  // Capturar IDs
  const empresaId = await page.evaluate(() => {
    const userData = localStorage.getItem('madrilusa_user');
    return userData ? JSON.parse(userData).id : null;
  });

  // Capturar ID da oportunidade (assumindo que aparece na URL ou resposta)
  const oportunidadeId = await page.evaluate(() => {
    // Tentar capturar da URL ou de algum elemento na página
    const url = window.location.href;
    const match = url.match(/oportunidade\/([a-f0-9-]+)/);
    return match ? match[1] : 'opp_' + Date.now();
  });

  console.log(`  ✅ Empresa criada - ID: ${empresaId}, Oportunidade: ${oportunidadeId}`);
  return { empresaId, oportunidadeId };
}

/**
 * 🔬 EXECUTAR ANÁLISE SINERGIA V2
 */
async function executarAnaliseSinergia(page, oportunidadeId) {
  console.log('  🧠 Iniciando análise SinergIA V2...');

  // Navegar para SinergIA V2
  await page.click('text=SinergIA V2');
  await page.waitForTimeout(2000);

  // Selecionar a oportunidade criada
  if (await page.isVisible('select[name="oportunidade"]')) {
    await page.selectOption('select[name="oportunidade"]', oportunidadeId);
  }

  // Configurar filtros para o teste
  await page.fill('input[name="minScore"]', '0'); // Mostrar todos os resultados

  // Executar análise
  await page.click('button:has-text("Analisar Candidatos")');

  // Aguardar resultados (timeout generoso para IA)
  await page.waitForTimeout(15000);

  // Capturar resultados da página
  const resultados = await page.evaluate(() => {
    // Tentar capturar dados de uma tabela ou lista de resultados
    const resultadosContainer = document.querySelector('[data-testid="resultados-sinergia"]');
    if (!resultadosContainer) {
      return { erro: 'Container de resultados não encontrado' };
    }

    // Capturar dados estruturados dos resultados
    const matches = [];
    const linhasResultado = resultadosContainer.querySelectorAll('.match-item');

    linhasResultado.forEach(linha => {
      const scoreElement = linha.querySelector('.score');
      const nomeElement = linha.querySelector('.nome-candidato');
      const detalhesElement = linha.querySelector('.detalhes-match');

      if (scoreElement && nomeElement) {
        matches.push({
          score: parseInt(scoreElement.textContent),
          nome: nomeElement.textContent,
          detalhes: detalhesElement ? detalhesElement.textContent : null
        });
      }
    });

    return { matches, timestamp: new Date().toISOString() };
  });

  console.log(`  ✅ Análise concluída - ${resultados.matches?.length || 0} resultados`);
  return resultados;
}

/**
 * ✅ VALIDAR RESULTADOS CONTRA CONFIGURAÇÃO ESPERADA
 */
async function validarResultados(resultadoAnalise, scoreEsperado, imigranteId) {
  console.log('  🔍 Validando conformidade...');

  if (resultadoAnalise.erro) {
    return { erro: resultadoAnalise.erro };
  }

  // Encontrar resultado do imigrante específico
  const matchEspecifico = resultadoAnalise.matches?.find(match =>
    match.nome.includes('João Silva') ||
    match.nome.includes('Maria Santos') ||
    match.nome.includes('Carlos Lima')
  );

  if (!matchEspecifico) {
    return {
      erro: 'Match específico não encontrado nos resultados',
      todosOsMatches: resultadoAnalise.matches
    };
  }

  const scoreRecebido = matchEspecifico.score;
  const scoreEstaNoRange = scoreRecebido >= scoreEsperado.min && scoreRecebido <= scoreEsperado.max;

  // Análises de conformidade
  const conformidade = {
    scoreNoRange: scoreEstaNoRange,
    scoreEsperado: scoreEsperado,
    scoreRecebido: scoreRecebido,
    diferenca: Math.abs(scoreRecebido - ((scoreEsperado.min + scoreEsperado.max) / 2)),
    detalhesMatch: matchEspecifico.detalhes
  };

  // Detectar possíveis bugs baseado no score
  if (!scoreEstaNoRange) {
    if (scoreRecebido === 100 || scoreRecebido === 75 || scoreRecebido === 50) {
      conformidade.possivelBug = 'Score fixo detectado - possível implementação placeholder';
    } else if (scoreRecebido === 0 && scoreEsperado.min > 0) {
      conformidade.possivelBug = 'Eliminação inesperada - verificar critérios eliminatórios';
    }
  }

  return conformidade;
}

/**
 * 📸 CAPTURAR EVIDÊNCIAS (SCREENSHOTS)
 */
async function capturarEvidencias(page, nomeCenario) {
  const screenshotPath = path.join(__dirname, 'evidencias', `${nomeCenario}_${Date.now()}.png`);

  // Criar diretório se não existir
  const evidenciasDir = path.join(__dirname, 'evidencias');
  if (!fs.existsSync(evidenciasDir)) {
    fs.mkdirSync(evidenciasDir, { recursive: true });
  }

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  console.log(`  📸 Screenshot salva: ${screenshotPath}`);
}

/**
 * 📊 GERAR RELATÓRIO DE CONFORMIDADE
 */
async function gerarRelatorioConformidade() {
  console.log('\n📊 GERANDO RELATÓRIO DE CONFORMIDADE');
  console.log('=' * 50);

  // Analisar resultados de todos os cenários
  const resultados = Object.values(relatorioTestes.cenarios);

  // Verificar conformidade de pesos
  let pesosCorretos = true;
  let eliminatoriosFuncionam = true;
  let scoresMinimosFuncionam = true;

  resultados.forEach(resultado => {
    if (resultado.validacao && resultado.validacao.possivelBug) {
      relatorioTestes.bugs.push({
        cenario: resultado.nome,
        bug: resultado.validacao.possivelBug,
        scoreEsperado: resultado.validacao.scoreEsperado,
        scoreRecebido: resultado.validacao.scoreRecebido
      });

      if (resultado.validacao.possivelBug.includes('Score fixo')) {
        pesosCorretos = false;
      }
    }
  });

  // Atualizar conformidade
  relatorioTestes.conformidade.pesosCorretos = pesosCorretos;
  relatorioTestes.conformidade.eliminatoriosFuncionam = eliminatoriosFuncionam;
  relatorioTestes.conformidade.scoreMinimo = scoresMinimosFuncionam;

  // Gerar sugestões baseadas nos bugs encontrados
  if (relatorioTestes.bugs.length > 0) {
    relatorioTestes.sugestoes.push(
      'Revisar implementação dos métodos calculateIdadeMatch, calculateFormacaoMatch e calculateCaracteristicasMatch',
      'Implementar lógica real ao invés de scores fixos',
      'Adicionar testes unitários para cada critério de matching',
      'Validar se todos os dados do perfil estão sendo considerados na análise'
    );
  }
}

/**
 * 💾 SALVAR RELATÓRIO FINAL
 */
async function salvarRelatorio() {
  const relatorioPath = path.join(__dirname, `relatorio_sinergia_v2_${Date.now()}.json`);

  fs.writeFileSync(relatorioPath, JSON.stringify(relatorioTestes, null, 2));

  console.log('\n📋 RELATÓRIO FINAL GERADO');
  console.log('=' * 40);
  console.log(`📁 Arquivo: ${relatorioPath}`);
  console.log(`🐛 Bugs encontrados: ${relatorioTestes.bugs.length}`);
  console.log(`💡 Sugestões: ${relatorioTestes.sugestoes.length}`);

  // Exibir resumo no console
  if (relatorioTestes.bugs.length > 0) {
    console.log('\n🐛 BUGS IDENTIFICADOS:');
    relatorioTestes.bugs.forEach((bug, index) => {
      console.log(`${index + 1}. ${bug.bug} (Score: ${bug.scoreRecebido} vs esperado: ${bug.scoreEsperado.min}-${bug.scoreEsperado.max})`);
    });
  }

  if (relatorioTestes.sugestoes.length > 0) {
    console.log('\n💡 SUGESTÕES DE CORREÇÃO:');
    relatorioTestes.sugestoes.forEach((sugestao, index) => {
      console.log(`${index + 1}. ${sugestao}`);
    });
  }

  console.log('\n✅ TESTES CONCLUÍDOS COM SUCESSO!');
}

// 🚀 EXECUTAR TESTES
if (import.meta.url === `file://${process.argv[1]}`) {
  executarTestesCompletos().catch(console.error);
}

export {
  executarTestesCompletos,
  CENARIOS_TESTE,
  CONFIG_ESPERADA
};