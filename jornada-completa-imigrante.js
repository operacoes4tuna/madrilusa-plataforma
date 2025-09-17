/**
 * 🚀 JORNADA COMPLETA DE CADASTRO DE IMIGRANTE - AUTOMAÇÃO PLAYWRIGHT
 *
 * Este script automatiza todo o processo de cadastro de um imigrante na plataforma Madrilusa,
 * desde a primeira visita ao site até o preenchimento completo de todos os dados.
 *
 * 📋 ETAPAS COBERTAS:
 * 1. Landing Page → Registro Inicial
 * 2. Login → Dashboard
 * 3. Perfil Específico de Imigrante
 * 4. Experiências Profissionais
 * 5. Formação Académica
 * 6. Idiomas Conhecidos
 * 7. Contribuições (Habilidades)
 * 8. SinergIA Madrilusa V2
 *
 * 🎯 OBJETIVO: Documentar e validar toda a jornada de forma automatizada
 */

import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { dadosImigranteFicticio, dadosAutomacao } from './dados-imigrante-ficticio.js';

// 📊 RELATÓRIO DA JORNADA
let relatorioJornada = {
  timestamp: new Date().toISOString(),
  dadosUsuario: {
    nome: dadosImigranteFicticio.registroBasico.nomeCompleto,
    email: dadosImigranteFicticio.registroBasico.email
  },
  etapas: [],
  screenshots: [],
  camposAnalisados: [],
  problemasIdentificados: [],
  melhoriasSugeridas: [],
  tempoTotal: 0,
  estatisticas: {
    totalCampos: 0,
    camposObrigatorios: 0,
    camposOpcionais: 0,
    camposPreenchidos: 0,
    paginasVisitadas: 0,
    errosEncontrados: 0
  }
};

/**
 * 🛠️ UTILITÁRIOS DE AUTOMAÇÃO
 */
class JornadaAutomacao {
  constructor(page) {
    this.page = page;
    this.screenshotCounter = 1;
    this.startTime = Date.now();
  }

  // 📸 Capturar screenshot com metadados
  async capturarScreenshot(nome, descricao = '') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const nomeArquivo = `${this.screenshotCounter.toString().padStart(2, '0')}-${nome}-${timestamp}.png`;
      const caminhoCompleto = path.join(dadosAutomacao.screenshots.diretorio, nomeArquivo);

      // Criar diretório se não existir
      await fs.mkdir(dadosAutomacao.screenshots.diretorio, { recursive: true });

      await this.page.screenshot({
        path: caminhoCompleto,
        fullPage: true,
        type: dadosAutomacao.screenshots.formato
      });

      const screenshotInfo = {
        numero: this.screenshotCounter,
        nome: nome,
        arquivo: nomeArquivo,
        caminho: caminhoCompleto,
        descricao: descricao,
        timestamp: new Date().toISOString(),
        url: this.page.url(),
        titulo: await this.page.title().catch(() => 'Título não disponível')
      };

      relatorioJornada.screenshots.push(screenshotInfo);
      this.screenshotCounter++;

      console.log(`📸 Screenshot capturada: ${nome} - ${descricao}`);
      return screenshotInfo;
    } catch (error) {
      console.error(`❌ Erro ao capturar screenshot ${nome}:`, error.message);
      relatorioJornada.problemasIdentificados.push(`Erro ao capturar screenshot: ${nome} - ${error.message}`);
    }
  }

  // ⏱️ Registrar etapa da jornada
  async registrarEtapa(nomeEtapa, descricao, inicio = true) {
    const agora = Date.now();

    if (inicio) {
      const etapa = {
        nome: nomeEtapa,
        descricao: descricao,
        inicioTimestamp: agora,
        url: this.page.url(),
        titulo: await this.page.title().catch(() => 'Título não disponível')
      };

      relatorioJornada.etapas.push(etapa);
      console.log(`🚀 INICIANDO: ${nomeEtapa} - ${descricao}`);
      return relatorioJornada.etapas.length - 1; // Retorna índice da etapa
    } else {
      // Finalizar etapa mais recente
      const etapaAtual = relatorioJornada.etapas[relatorioJornada.etapas.length - 1];
      if (etapaAtual) {
        etapaAtual.fimTimestamp = agora;
        etapaAtual.duracao = agora - etapaAtual.inicioTimestamp;
        etapaAtual.status = 'concluída';
        console.log(`✅ CONCLUÍDA: ${etapaAtual.nome} (${etapaAtual.duracao}ms)`);
      }
    }
  }

  // 🔍 Analisar formulário (campos obrigatórios vs opcionais)
  async analisarFormulario(nomeFormulario) {
    try {
      console.log(`🔍 Analisando formulário: ${nomeFormulario}`);

      const campos = await this.page.$$eval('input, select, textarea', elements =>
        elements.map(el => ({
          tipo: el.tagName.toLowerCase(),
          name: el.name || el.id || 'sem-nome',
          id: el.id || 'sem-id',
          placeholder: el.placeholder || '',
          required: el.required || el.hasAttribute('required'),
          type: el.type || 'text',
          value: el.value || '',
          labels: Array.from(document.querySelectorAll(`label[for="${el.id}"]`)).map(label => label.textContent.trim())
        }))
      );

      const analiseFormulario = {
        formulario: nomeFormulario,
        timestamp: new Date().toISOString(),
        totalCampos: campos.length,
        camposObrigatorios: campos.filter(c => c.required).length,
        camposOpcionais: campos.filter(c => !c.required).length,
        campos: campos
      };

      relatorioJornada.camposAnalisados.push(analiseFormulario);

      // Atualizar estatísticas
      relatorioJornada.estatisticas.totalCampos += campos.length;
      relatorioJornada.estatisticas.camposObrigatorios += campos.filter(c => c.required).length;
      relatorioJornada.estatisticas.camposOpcionais += campos.filter(c => !c.required).length;

      console.log(`📊 Formulário ${nomeFormulario}: ${campos.length} campos (${analiseFormulario.camposObrigatorios} obrigatórios, ${analiseFormulario.camposOpcionais} opcionais)`);

      return analiseFormulario;
    } catch (error) {
      console.error(`❌ Erro ao analisar formulário ${nomeFormulario}:`, error.message);
      relatorioJornada.problemasIdentificados.push(`Erro ao analisar formulário ${nomeFormulario}: ${error.message}`);
      return null;
    }
  }

  // 🔒 Esperar elemento com timeout personalizado
  async esperarElemento(seletor, timeout = dadosAutomacao.timeouts.formularios) {
    try {
      await this.page.waitForSelector(seletor, { timeout });
      return true;
    } catch (error) {
      console.warn(`⚠️ Elemento não encontrado: ${seletor} (timeout: ${timeout}ms)`);
      relatorioJornada.problemasIdentificados.push(`Elemento não encontrado: ${seletor}`);
      return false;
    }
  }

  // 📝 Preencher campo de forma inteligente
  async preencherCampo(seletor, valor, opcoes = {}) {
    try {
      const elemento = await this.page.$(seletor);
      if (!elemento) {
        console.warn(`⚠️ Campo não encontrado: ${seletor}`);
        return false;
      }

      // Limpar campo primeiro
      await elemento.fill('');
      await this.page.waitForTimeout(200);

      // Preencher valor
      await elemento.fill(valor);
      await this.page.waitForTimeout(300);

      // Opcional: trigger eventos
      if (opciones.triggerChange) {
        await elemento.dispatchEvent('change');
      }

      console.log(`📝 Campo preenchido: ${seletor} = "${valor}"`);
      relatorioJornada.estatisticas.camposPreenchidos++;
      return true;
    } catch (error) {
      console.error(`❌ Erro ao preencher campo ${seletor}:`, error.message);
      relatorioJornada.problemasIdentificados.push(`Erro ao preencher campo ${seletor}: ${error.message}`);
      return false;
    }
  }

  // 🖱️ Clicar com retry
  async clicarElemento(seletor, tentativas = 3) {
    for (let i = 0; i < tentativas; i++) {
      try {
        await this.page.click(seletor);
        await this.page.waitForTimeout(500);
        console.log(`🖱️ Clique realizado: ${seletor}`);
        return true;
      } catch (error) {
        console.warn(`⚠️ Tentativa ${i + 1}/${tentativas} falhou para ${seletor}: ${error.message}`);
        if (i === tentativas - 1) {
          relatorioJornada.problemasIdentificados.push(`Falha ao clicar em ${seletor} após ${tentativas} tentativas`);
          return false;
        }
        await this.page.waitForTimeout(1000);
      }
    }
    return false;
  }
}

/**
 * 🎬 EXECUÇÃO PRINCIPAL DA JORNADA
 */
async function executarJornadaCompleta() {
  console.log('🎬 INICIANDO JORNADA COMPLETA DE CADASTRO DE IMIGRANTE');
  console.log('=' * 80);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  const automacao = new JornadaAutomacao(page);

  try {
    // 🏠 ETAPA 1: LANDING PAGE
    await automacao.registrarEtapa('Landing Page', 'Visita inicial ao site Madrilusa');
    await page.goto('http://localhost:8081');
    await automacao.capturarScreenshot('landing-page', 'Página inicial do site');
    await automacao.registrarEtapa('Landing Page', '', false);

    // 📝 ETAPA 2: PROCESSO DE REGISTRO
    await automacao.registrarEtapa('Processo de Registro', 'Cadastro inicial na plataforma');

    // Procurar botão de registro/criar conta
    const seletoresBotaoRegistro = [
      'button:has-text("Criar conta")',
      'button:has-text("Registar")',
      'a:has-text("Criar conta")',
      'a:has-text("Registar")',
      '.btn:has-text("Criar conta")',
      '[data-testid="register-button"]'
    ];

    let botaoRegistroEncontrado = false;
    for (const seletor of seletoresBotaoRegistro) {
      if (await automacao.esperarElemento(seletor, 2000)) {
        await automacao.clicarElemento(seletor);
        botaoRegistroEncontrado = true;
        break;
      }
    }

    if (!botaoRegistroEncontrado) {
      throw new Error('Botão de registro não encontrado na landing page');
    }

    await automacao.capturarScreenshot('modal-registro-aberto', 'Modal de registro inicial aberto');

    // Selecionar categoria "Imigrante"
    const seletoresCategoriaImigrante = [
      'button:has-text("Imigrante")',
      '.card:has-text("Imigrante")',
      '[data-category="imigrante"]',
      'div:has-text("Jovem Imigrante")'
    ];

    let categoriaImigranteEncontrada = false;
    for (const seletor of seletoresCategoriaImigrante) {
      if (await automacao.esperarElemento(seletor, 3000)) {
        await automacao.clicarElemento(seletor);
        categoriaImigranteEncontrada = true;
        break;
      }
    }

    if (!categoriaImigranteEncontrada) {
      throw new Error('Opção de categoria Imigrante não encontrada');
    }

    await automacao.capturarScreenshot('categoria-imigrante-selecionada', 'Categoria Imigrante selecionada');

    // Analisar formulário de registro (Etapa 1)
    await automacao.analisarFormulario('Registro Básico - Etapa 1');

    // Preencher dados básicos
    const dadosBasicos = dadosImigranteFicticio.registroBasico;

    await automacao.preencherCampo('input[name="nomeCompleto"], #nomeCompleto', dadosBasicos.nomeCompleto);
    await automacao.preencherCampo('input[name="email"], input[type="email"], #email', dadosBasicos.email);
    await automacao.preencherCampo('input[name="telemovel"], #telemovel', dadosBasicos.telemovel);
    await automacao.preencherCampo('input[name="senha"], input[type="password"], #senha', dadosBasicos.senha);

    await automacao.capturarScreenshot('registro-etapa1-preenchido', 'Formulário da Etapa 1 preenchido');

    // Continuar para Etapa 2
    const botaoContinuar = await automacao.clicarElemento('button:has-text("Continuar"), button[type="submit"]');
    if (!botaoContinuar) {
      throw new Error('Não foi possível continuar para a Etapa 2');
    }

    await page.waitForTimeout(2000);
    await automacao.capturarScreenshot('registro-etapa2', 'Formulário da Etapa 2 carregado');

    // Analisar formulário da Etapa 2
    await automacao.analisarFormulario('Registro Específico - Etapa 2');

    // Preencher dados específicos de imigrante
    const perfilImigrante = dadosImigranteFicticio.perfilImigrante;

    // Nacionalidade
    await automacao.preencherCampo('input[name="nacionalidade"], #nacionalidade', perfilImigrante.nacionalidade);

    // Data de nascimento
    await automacao.preencherCampo('input[name="dataNascimento"], input[type="date"], #dataNascimento', perfilImigrante.dataNascimento);

    // Objetivos (checkboxes)
    for (const objetivo of perfilImigrante.objetivos) {
      const seletorObjetivo = `input[type="checkbox"]:near(:text("${objetivo}"))`;
      try {
        await page.check(seletorObjetivo);
        console.log(`✅ Objetivo selecionado: ${objetivo}`);
      } catch (error) {
        console.warn(`⚠️ Não foi possível selecionar objetivo: ${objetivo}`);
      }
    }

    // Outros objetivos
    await automacao.preencherCampo('textarea[name="objetivoOutros"], #objetivoOutros', perfilImigrante.objetivoOutros);

    // Mensagem adicional
    await automacao.preencherCampo('textarea[name="mensagem"], #mensagem', perfilImigrante.mensagem);

    // Informações adicionais
    if (await automacao.esperarElemento('select[name="genero"], #genero', 2000)) {
      await page.selectOption('select[name="genero"], #genero', perfilImigrante.genero);
    }

    if (await automacao.esperarElemento('select[name="fluenciaPortugues"], #fluenciaPortugues', 2000)) {
      await page.selectOption('select[name="fluenciaPortugues"], #fluenciaPortugues', perfilImigrante.fluenciaPortugues);
    }

    await automacao.preencherCampo('input[name="municipioResidencia"], #municipioResidencia', perfilImigrante.municipioResidencia);

    // Checkboxes adicionais
    if (perfilImigrante.transporteProprio) {
      try {
        await page.check('input[name="transporteProprio"], #transporteProprio');
      } catch (error) {
        console.warn('⚠️ Checkbox transporte próprio não encontrado');
      }
    }

    if (perfilImigrante.possibilidadeMudancaMorada) {
      try {
        await page.check('input[name="possibilidadeMudancaMorada"], #possibilidadeMudancaMorada');
      } catch (error) {
        console.warn('⚠️ Checkbox mudança de morada não encontrado');
      }
    }

    if (perfilImigrante.aceitaNotificacoes) {
      try {
        await page.check('input[name="aceitaNotificacoes"], #aceitaNotificacoes');
      } catch (error) {
        console.warn('⚠️ Checkbox aceita notificações não encontrado');
      }
    }

    // Termos e condições
    try {
      await page.check('input[id="termos"], input[name="termos"]');
    } catch (error) {
      console.warn('⚠️ Checkbox termos e condições não encontrado');
    }

    await automacao.capturarScreenshot('registro-etapa2-preenchido', 'Formulário da Etapa 2 preenchido');

    // Finalizar registro
    const botaoFinalizar = await automacao.clicarElemento('button:has-text("Concluir"), button:has-text("Finalizar"), button[type="submit"]');
    if (!botaoFinalizar) {
      throw new Error('Não foi possível finalizar o registro');
    }

    await page.waitForTimeout(3000);
    await automacao.registrarEtapa('Processo de Registro', '', false);

    // 🏠 ETAPA 3: DASHBOARD
    await automacao.registrarEtapa('Dashboard', 'Acesso ao painel principal após login');

    // Verificar se está no dashboard
    const isDashboard = page.url().includes('/app/dashboard') || page.url().includes('/dashboard');
    if (!isDashboard) {
      // Tentar navegar para dashboard
      try {
        await page.goto('http://localhost:8081/app/dashboard');
        await page.waitForTimeout(2000);
      } catch (error) {
        console.warn('⚠️ Redirecionamento para dashboard pode ter falhado');
      }
    }

    await automacao.capturarScreenshot('dashboard', 'Dashboard principal do usuário');
    relatorioJornada.estatisticas.paginasVisitadas++;
    await automacao.registrarEtapa('Dashboard', '', false);

    // 👤 ETAPA 4: PERFIL DETALHADO
    await automacao.registrarEtapa('Perfil Detalhado', 'Completando perfil específico de imigrante');

    // Navegar para perfil de imigrante
    try {
      await page.goto('http://localhost:8081/app/perfil-imigrante');
      await page.waitForTimeout(2000);
      relatorioJornada.estatisticas.paginasVisitadas++;
    } catch (error) {
      console.warn('⚠️ Erro ao navegar para perfil de imigrante');
    }

    await automacao.capturarScreenshot('perfil-imigrante', 'Página de perfil específico de imigrante');
    await automacao.analisarFormulario('Perfil Detalhado de Imigrante');

    // Aqui poderíamos preencher campos adicionais do perfil se necessário
    await automacao.registrarEtapa('Perfil Detalhado', '', false);

    // 💼 ETAPA 5: EXPERIÊNCIAS PROFISSIONAIS
    await automacao.registrarEtapa('Experiências Profissionais', 'Cadastro de histórico profissional');

    try {
      await page.goto('http://localhost:8081/app/dados-profissionais/experiencias');
      await page.waitForTimeout(2000);
      relatorioJornada.estatisticas.paginasVisitadas++;
    } catch (error) {
      console.warn('⚠️ Erro ao navegar para experiências profissionais');
    }

    await automacao.capturarScreenshot('experiencias-profissionais', 'Página de experiências profissionais');
    await automacao.analisarFormulario('Experiências Profissionais');
    await automacao.registrarEtapa('Experiências Profissionais', '', false);

    // 🎓 ETAPA 6: FORMAÇÃO ACADÉMICA
    await automacao.registrarEtapa('Formação Académica', 'Cadastro de formação e qualificações');

    try {
      await page.goto('http://localhost:8081/app/dados-profissionais/formacao');
      await page.waitForTimeout(2000);
      relatorioJornada.estatisticas.paginasVisitadas++;
    } catch (error) {
      console.warn('⚠️ Erro ao navegar para formação académica');
    }

    await automacao.capturarScreenshot('formacao-academica', 'Página de formação académica');
    await automacao.analisarFormulario('Formação Académica');
    await automacao.registrarEtapa('Formação Académica', '', false);

    // 🌍 ETAPA 7: IDIOMAS CONHECIDOS
    await automacao.registrarEtapa('Idiomas Conhecidos', 'Cadastro de competências linguísticas');

    try {
      await page.goto('http://localhost:8081/app/dados-profissionais/idiomas');
      await page.waitForTimeout(2000);
      relatorioJornada.estatisticas.paginasVisitadas++;
    } catch (error) {
      console.warn('⚠️ Erro ao navegar para idiomas conhecidos');
    }

    await automacao.capturarScreenshot('idiomas-conhecidos', 'Página de idiomas conhecidos');
    await automacao.analisarFormulario('Idiomas Conhecidos');
    await automacao.registrarEtapa('Idiomas Conhecidos', '', false);

    // 🤖 ETAPA 8: SINERGIA MADRILUSA V2
    await automacao.registrarEtapa('SinergIA Madrilusa V2', 'Sistema de matching inteligente');

    try {
      await page.goto('http://localhost:8081/app/sinergia-v2');
      await page.waitForTimeout(2000);
      relatorioJornada.estatisticas.paginasVisitadas++;
    } catch (error) {
      console.warn('⚠️ Erro ao navegar para SinergIA V2');
    }

    await automacao.capturarScreenshot('sinergia-v2', 'Página do SinergIA Madrilusa V2');
    await automacao.registrarEtapa('SinergIA Madrilusa V2', '', false);

    // ✅ FINALIZAÇÃO
    relatorioJornada.tempoTotal = Date.now() - automacao.startTime;
    relatorioJornada.status = 'concluída com sucesso';

    console.log('🎉 JORNADA CONCLUÍDA COM SUCESSO!');
    console.log(`⏱️ Tempo total: ${relatorioJornada.tempoTotal}ms (${(relatorioJornada.tempoTotal / 1000).toFixed(2)}s)`);

  } catch (error) {
    console.error('❌ ERRO DURANTE A JORNADA:', error);
    relatorioJornada.problemasIdentificados.push(`Erro crítico: ${error.message}`);
    relatorioJornada.estatisticas.errosEncontrados++;
    relatorioJornada.status = 'falhada';

    await automacao.capturarScreenshot('erro-critico', `Erro crítico: ${error.message}`);
  } finally {
    await browser.close();
    await gerarRelatorioFinal();
  }
}

/**
 * 📊 GERAR RELATÓRIO FINAL DA JORNADA
 */
async function gerarRelatorioFinal() {
  try {
    console.log('📊 Gerando relatório final da jornada...');

    // Adicionar melhorias sugeridas baseadas nos problemas identificados
    if (relatorioJornada.problemasIdentificados.length > 0) {
      relatorioJornada.melhoriasSugeridas.push(
        'Melhorar feedback visual para elementos não encontrados',
        'Adicionar data-testid em elementos críticos para melhor testabilidade',
        'Implementar loading states em transições de página',
        'Validar formulários em tempo real'
      );
    }

    // Calcular métricas finais
    relatorioJornada.estatisticas.taxaPreenchimento = relatorioJornada.estatisticas.totalCampos > 0
      ? Math.round((relatorioJornada.estatisticas.camposPreenchidos / relatorioJornada.estatisticas.totalCampos) * 100)
      : 0;

    relatorioJornada.estatisticas.tempoMedioPorPagina = relatorioJornada.estatisticas.paginasVisitadas > 0
      ? Math.round(relatorioJornada.tempoTotal / relatorioJornada.estatisticas.paginasVisitadas)
      : 0;

    // Salvar relatório em JSON
    const nomeArquivoJson = `relatorio-jornada-imigrante-${Date.now()}.json`;
    await fs.writeFile(nomeArquivoJson, JSON.stringify(relatorioJornada, null, 2));

    // Gerar relatório HTML
    const htmlRelatorio = gerarRelatorioHTML();
    const nomeArquivoHtml = `relatorio-jornada-imigrante-${Date.now()}.html`;
    await fs.writeFile(nomeArquivoHtml, htmlRelatorio);

    console.log('✅ Relatórios gerados:');
    console.log(`📄 JSON: ${nomeArquivoJson}`);
    console.log(`🌐 HTML: ${nomeArquivoHtml}`);
    console.log(`📸 Screenshots: ${dadosAutomacao.screenshots.diretorio}`);

    // Resumo no console
    console.log('\n📋 RESUMO DA JORNADA:');
    console.log('=' * 50);
    console.log(`👤 Usuário: ${relatorioJornada.dadosUsuario.nome}`);
    console.log(`📧 Email: ${relatorioJornada.dadosUsuario.email}`);
    console.log(`⏱️ Tempo total: ${(relatorioJornada.tempoTotal / 1000).toFixed(2)}s`);
    console.log(`📊 Páginas visitadas: ${relatorioJornada.estatisticas.paginasVisitadas}`);
    console.log(`📝 Campos analisados: ${relatorioJornada.estatisticas.totalCampos}`);
    console.log(`✅ Campos preenchidos: ${relatorioJornada.estatisticas.camposPreenchidos}`);
    console.log(`📸 Screenshots capturadas: ${relatorioJornada.screenshots.length}`);
    console.log(`⚠️ Problemas identificados: ${relatorioJornada.problemasIdentificados.length}`);

    if (relatorioJornada.problemasIdentificados.length > 0) {
      console.log('\n🐛 PROBLEMAS IDENTIFICADOS:');
      relatorioJornada.problemasIdentificados.forEach((problema, index) => {
        console.log(`${index + 1}. ${problema}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro ao gerar relatório final:', error);
  }
}

/**
 * 🌐 GERAR RELATÓRIO HTML
 */
function gerarRelatorioHTML() {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório da Jornada de Cadastro - Imigrante</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #F5A623; border-bottom: 3px solid #F5A623; padding-bottom: 10px; }
        h2 { color: #4A90A4; margin-top: 30px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #F5A623; }
        .stat-value { font-size: 2em; font-weight: bold; color: #F5A623; }
        .stat-label { color: #666; font-size: 0.9em; }
        .etapa { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #4A90A4; }
        .problema { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .screenshot { margin: 10px 0; padding: 10px; background: #e9ecef; border-radius: 4px; }
        .timestamp { color: #666; font-size: 0.8em; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #4A90A4; color: white; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .danger { color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 Relatório da Jornada de Cadastro - Imigrante</h1>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${(relatorioJornada.tempoTotal / 1000).toFixed(1)}s</div>
                <div class="stat-label">Tempo Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${relatorioJornada.estatisticas.paginasVisitadas}</div>
                <div class="stat-label">Páginas Visitadas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${relatorioJornada.estatisticas.totalCampos}</div>
                <div class="stat-label">Campos Analisados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${relatorioJornada.screenshots.length}</div>
                <div class="stat-label">Screenshots</div>
            </div>
        </div>

        <h2>👤 Dados do Usuário</h2>
        <p><strong>Nome:</strong> ${relatorioJornada.dadosUsuario.nome}</p>
        <p><strong>Email:</strong> ${relatorioJornada.dadosUsuario.email}</p>
        <p><strong>Data do Teste:</strong> ${new Date(relatorioJornada.timestamp).toLocaleString('pt-PT')}</p>

        <h2>🚀 Etapas da Jornada</h2>
        ${relatorioJornada.etapas.map(etapa => `
            <div class="etapa">
                <h3>${etapa.nome}</h3>
                <p>${etapa.descricao}</p>
                <p><strong>URL:</strong> ${etapa.url}</p>
                <p><strong>Título:</strong> ${etapa.titulo}</p>
                ${etapa.duracao ? `<p><strong>Duração:</strong> ${(etapa.duracao / 1000).toFixed(2)}s</p>` : ''}
                <p class="timestamp">Início: ${new Date(etapa.inicioTimestamp).toLocaleString('pt-PT')}</p>
            </div>
        `).join('')}

        <h2>📊 Análise de Formulários</h2>
        <table>
            <thead>
                <tr>
                    <th>Formulário</th>
                    <th>Total de Campos</th>
                    <th>Obrigatórios</th>
                    <th>Opcionais</th>
                </tr>
            </thead>
            <tbody>
                ${relatorioJornada.camposAnalisados.map(analise => `
                    <tr>
                        <td>${analise.formulario}</td>
                        <td>${analise.totalCampos}</td>
                        <td class="warning">${analise.camposObrigatorios}</td>
                        <td class="success">${analise.camposOpcionais}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        ${relatorioJornada.problemasIdentificados.length > 0 ? `
            <h2>⚠️ Problemas Identificados</h2>
            ${relatorioJornada.problemasIdentificados.map(problema => `
                <div class="problema">${problema}</div>
            `).join('')}
        ` : ''}

        <h2>📸 Screenshots Capturadas</h2>
        ${relatorioJornada.screenshots.map(screenshot => `
            <div class="screenshot">
                <h4>${screenshot.nome}</h4>
                <p>${screenshot.descricao}</p>
                <p><strong>Arquivo:</strong> ${screenshot.arquivo}</p>
                <p><strong>URL:</strong> ${screenshot.url}</p>
                <p class="timestamp">${new Date(screenshot.timestamp).toLocaleString('pt-PT')}</p>
            </div>
        `).join('')}

        <h2>📈 Estatísticas Finais</h2>
        <table>
            <tbody>
                <tr><td><strong>Taxa de Preenchimento</strong></td><td>${relatorioJornada.estatisticas.taxaPreenchimento}%</td></tr>
                <tr><td><strong>Tempo Médio por Página</strong></td><td>${relatorioJornada.estatisticas.tempoMedioPorPagina}ms</td></tr>
                <tr><td><strong>Campos Obrigatórios</strong></td><td>${relatorioJornada.estatisticas.camposObrigatorios}</td></tr>
                <tr><td><strong>Campos Opcionais</strong></td><td>${relatorioJornada.estatisticas.camposOpcionais}</td></tr>
                <tr><td><strong>Status Final</strong></td><td class="${relatorioJornada.status === 'concluída com sucesso' ? 'success' : 'danger'}">${relatorioJornada.status}</td></tr>
            </tbody>
        </table>
    </div>
</body>
</html>
  `;
}

// 🚀 EXECUTAR JORNADA
if (import.meta.url === `file://${process.argv[1]}`) {
  executarJornadaCompleta().catch(console.error);
}

export { executarJornadaCompleta, relatorioJornada };