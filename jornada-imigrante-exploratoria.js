/**
 * 🔍 JORNADA EXPLORATÓRIA - IDENTIFICAÇÃO DE INTERFACE
 *
 * Este script explora a interface real para identificar seletores corretos
 * e documentar a jornada atual antes de automatizar o preenchimento.
 */

import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

// 📊 RELATÓRIO EXPLORATÓRIO
let relatorioExploracao = {
  timestamp: new Date().toISOString(),
  paginasExploradas: [],
  elementosEncontrados: [],
  screenshots: [],
  observacoes: [],
  proximos_passos: []
};

/**
 * 🔍 EXPLORAÇÃO DA INTERFACE
 */
async function explorarInterface() {
  console.log('🔍 INICIANDO EXPLORAÇÃO DA INTERFACE MADRILUSA');
  console.log('=' * 60);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  let screenshotCounter = 1;

  try {
    // Criar diretório para screenshots
    const screenshotDir = './screenshots-exploracao-interface';
    await fs.mkdir(screenshotDir, { recursive: true });

    // 🏠 ETAPA 1: LANDING PAGE
    console.log('📍 1. Explorando Landing Page...');
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(3000);

    // Screenshot inicial
    const screenshotPath1 = path.join(screenshotDir, `${screenshotCounter++}-landing-page.png`);
    await page.screenshot({ path: screenshotPath1, fullPage: true });
    relatorioExploracao.screenshots.push({
      numero: screenshotCounter - 1,
      nome: 'landing-page',
      caminho: screenshotPath1,
      url: page.url(),
      titulo: await page.title().catch(() => 'N/A')
    });

    // Analisar elementos disponíveis na landing page
    const elementosLanding = await page.$$eval('button, a, .btn, [role="button"]', elements =>
      elements.map(el => ({
        tagName: el.tagName,
        textContent: el.textContent?.trim().substring(0, 50) || '',
        className: el.className || '',
        id: el.id || '',
        href: el.href || '',
        type: el.type || '',
        visible: !el.hidden && el.offsetHeight > 0 && el.offsetWidth > 0
      }))
    );

    relatorioExploracao.elementosEncontrados.push({
      pagina: 'Landing Page',
      elementos: elementosLanding.filter(el => el.visible),
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Landing Page analisada: ${elementosLanding.filter(el => el.visible).length} elementos interativos encontrados`);

    // Procurar botões de registro/login
    const botoesRelevantes = elementosLanding.filter(el =>
      el.visible && (
        el.textContent.toLowerCase().includes('registar') ||
        el.textContent.toLowerCase().includes('criar') ||
        el.textContent.toLowerCase().includes('conta') ||
        el.textContent.toLowerCase().includes('entrar') ||
        el.textContent.toLowerCase().includes('login')
      )
    );

    console.log(`🎯 Botões relevantes encontrados:`, botoesRelevantes);

    // Tentar encontrar e clicar em botão de registro
    let botaoRegistroClicado = false;
    const possiveisSelectors = [
      'text=Registar',
      'text=Criar conta',
      'text=Registar-se',
      'button:has-text("Registar")',
      'a:has-text("Registar")',
      '.btn:has-text("Registar")',
      'button:has-text("Criar")',
      'a:has-text("Criar")'
    ];

    for (const selector of possiveisSelectors) {
      try {
        const elemento = await page.$(selector);
        if (elemento && await elemento.isVisible()) {
          console.log(`🎯 Tentando clicar em: ${selector}`);
          await elemento.click();
          await page.waitForTimeout(2000);
          botaoRegistroClicado = true;
          relatorioExploracao.observacoes.push(`Botão de registro encontrado e clicado: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`⚠️ Seletor não funcionou: ${selector}`);
      }
    }

    if (botaoRegistroClicado) {
      // 📝 ETAPA 2: MODAL DE REGISTRO (se abriu)
      console.log('📍 2. Explorando Modal de Registro...');
      await page.waitForTimeout(2000);

      const screenshotPath2 = path.join(screenshotDir, `${screenshotCounter++}-modal-registro.png`);
      await page.screenshot({ path: screenshotPath2, fullPage: true });
      relatorioExploracao.screenshots.push({
        numero: screenshotCounter - 1,
        nome: 'modal-registro',
        caminho: screenshotPath2,
        url: page.url(),
        titulo: await page.title().catch(() => 'N/A')
      });

      // Procurar categorias de usuário
      const categorias = await page.$$eval('button, .card, div', elements =>
        elements.map(el => ({
          tagName: el.tagName,
          textContent: el.textContent?.trim().substring(0, 100) || '',
          className: el.className || '',
          id: el.id || '',
          visible: !el.hidden && el.offsetHeight > 0 && el.offsetWidth > 0
        })).filter(el =>
          el.visible && (
            el.textContent.toLowerCase().includes('imigrante') ||
            el.textContent.toLowerCase().includes('empresa') ||
            el.textContent.toLowerCase().includes('município') ||
            el.textContent.toLowerCase().includes('academia') ||
            el.textContent.toLowerCase().includes('família')
          )
        )
      );

      console.log(`🎯 Categorias encontradas:`, categorias);
      relatorioExploracao.elementosEncontrados.push({
        pagina: 'Modal de Registro - Categorias',
        elementos: categorias,
        timestamp: new Date().toISOString()
      });

      // Tentar selecionar categoria Imigrante
      const seletoresImigrante = [
        'text=Imigrante',
        'text=Jovem Imigrante',
        'button:has-text("Imigrante")',
        '.card:has-text("Imigrante")',
        'div:has-text("Imigrante")'
      ];

      let categoriaImigranteClicada = false;
      for (const selector of seletoresImigrante) {
        try {
          const elemento = await page.$(selector);
          if (elemento && await elemento.isVisible()) {
            console.log(`🎯 Tentando clicar em categoria Imigrante: ${selector}`);
            await elemento.click();
            await page.waitForTimeout(2000);
            categoriaImigranteClicada = true;
            relatorioExploracao.observacoes.push(`Categoria Imigrante encontrada e clicada: ${selector}`);
            break;
          }
        } catch (error) {
          console.log(`⚠️ Seletor categoria não funcionou: ${selector}`);
        }
      }

      if (categoriaImigranteClicada) {
        // 📝 ETAPA 3: FORMULÁRIO DE REGISTRO
        console.log('📍 3. Explorando Formulário de Registro...');
        await page.waitForTimeout(2000);

        const screenshotPath3 = path.join(screenshotDir, `${screenshotCounter++}-formulario-registro.png`);
        await page.screenshot({ path: screenshotPath3, fullPage: true });
        relatorioExploracao.screenshots.push({
          numero: screenshotCounter - 1,
          nome: 'formulario-registro',
          caminho: screenshotPath3,
          url: page.url(),
          titulo: await page.title().catch(() => 'N/A')
        });

        // Analisar campos do formulário
        const camposFormulario = await page.$$eval('input, select, textarea', elements =>
          elements.map(el => ({
            tagName: el.tagName,
            type: el.type || 'text',
            name: el.name || '',
            id: el.id || '',
            placeholder: el.placeholder || '',
            required: el.required || el.hasAttribute('required'),
            value: el.value || '',
            visible: !el.hidden && el.offsetHeight > 0 && el.offsetWidth > 0,
            labels: Array.from(document.querySelectorAll(`label[for="${el.id}"]`)).map(label => label.textContent?.trim() || '')
          })).filter(el => el.visible)
        );

        console.log(`📊 Campos do formulário encontrados: ${camposFormulario.length}`);
        relatorioExploracao.elementosEncontrados.push({
          pagina: 'Formulário de Registro',
          elementos: camposFormulario,
          timestamp: new Date().toISOString()
        });

        // Analisar botões do formulário
        const botoesFormulario = await page.$$eval('button, input[type="submit"]', elements =>
          elements.map(el => ({
            tagName: el.tagName,
            type: el.type || '',
            textContent: el.textContent?.trim() || '',
            className: el.className || '',
            id: el.id || '',
            visible: !el.hidden && el.offsetHeight > 0 && el.offsetWidth > 0
          })).filter(el => el.visible)
        );

        relatorioExploracao.elementosEncontrados.push({
          pagina: 'Formulário de Registro - Botões',
          elementos: botoesFormulario,
          timestamp: new Date().toISOString()
        });
      } else {
        relatorioExploracao.observacoes.push('❌ Não foi possível encontrar/clicar na categoria Imigrante');
        relatorioExploracao.proximos_passos.push('Investigar melhor os seletores para categoria Imigrante');
      }
    } else {
      relatorioExploracao.observacoes.push('❌ Não foi possível encontrar/clicar no botão de registro');
      relatorioExploracao.proximos_passos.push('Investigar melhor os seletores para botão de registro na landing page');
    }

    // 🔐 ETAPA 4: TENTAR ACESSAR VIA LOGIN DIRETO
    console.log('📍 4. Tentando acesso via login direto...');

    try {
      await page.goto('http://localhost:8080/app/dashboard');
      await page.waitForTimeout(3000);

      const screenshotPath4 = path.join(screenshotDir, `${screenshotCounter++}-tentativa-dashboard.png`);
      await page.screenshot({ path: screenshotPath4, fullPage: true });
      relatorioExploracao.screenshots.push({
        numero: screenshotCounter - 1,
        nome: 'tentativa-dashboard',
        caminho: screenshotPath4,
        url: page.url(),
        titulo: await page.title().catch(() => 'N/A')
      });

      // Verificar se há modal de login ou se está no dashboard
      const currentUrl = page.url();
      if (currentUrl.includes('dashboard')) {
        relatorioExploracao.observacoes.push('✅ Dashboard acessível diretamente');
      } else {
        relatorioExploracao.observacoes.push(`📍 Redirecionado para: ${currentUrl}`);
      }
    } catch (error) {
      relatorioExploracao.observacoes.push(`❌ Erro ao tentar acessar dashboard: ${error.message}`);
    }

    // 🔍 ETAPA 5: EXPLORAR LOGIN COM CREDENCIAIS CONHECIDAS
    console.log('📍 5. Tentando login com credenciais conhecidas...');

    try {
      await page.goto('http://localhost:8080');
      await page.waitForTimeout(2000);

      // Procurar botão de login
      const seletoresLogin = [
        'text=Login',
        'text=Entrar',
        'button:has-text("Login")',
        'button:has-text("Entrar")',
        'a:has-text("Login")',
        'a:has-text("Entrar")'
      ];

      let loginClicado = false;
      for (const selector of seletoresLogin) {
        try {
          const elemento = await page.$(selector);
          if (elemento && await elemento.isVisible()) {
            console.log(`🎯 Tentando clicar em login: ${selector}`);
            await elemento.click();
            await page.waitForTimeout(2000);
            loginClicado = true;
            break;
          }
        } catch (error) {
          console.log(`⚠️ Seletor login não funcionou: ${selector}`);
        }
      }

      if (loginClicado) {
        const screenshotPath5 = path.join(screenshotDir, `${screenshotCounter++}-modal-login.png`);
        await page.screenshot({ path: screenshotPath5, fullPage: true });
        relatorioExploracao.screenshots.push({
          numero: screenshotCounter - 1,
          nome: 'modal-login',
          caminho: screenshotPath5,
          url: page.url(),
          titulo: await page.title().catch(() => 'N/A')
        });

        // Tentar fazer login com imigrante de teste
        try {
          await page.fill('input[type="email"], input[name="email"]', 'imigrante@madrilusa.com.pt');
          await page.fill('input[type="password"], input[name="password"], input[name="senha"]', 'vcgvcg');
          await page.click('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")');
          await page.waitForTimeout(3000);

          const screenshotPath6 = path.join(screenshotDir, `${screenshotCounter++}-pos-login.png`);
          await page.screenshot({ path: screenshotPath6, fullPage: true });
          relatorioExploracao.screenshots.push({
            numero: screenshotCounter - 1,
            nome: 'pos-login',
            caminho: screenshotPath6,
            url: page.url(),
            titulo: await page.title().catch(() => 'N/A')
          });

          relatorioExploracao.observacoes.push(`✅ Login realizado com sucesso - URL: ${page.url()}`);

          // Se o login foi bem-sucedido, explorar o dashboard
          if (page.url().includes('app') || page.url().includes('dashboard')) {
            await explorarDashboard(page, screenshotDir, screenshotCounter);
          }

        } catch (loginError) {
          relatorioExploracao.observacoes.push(`❌ Erro no login: ${loginError.message}`);
        }
      }
    } catch (error) {
      relatorioExploracao.observacoes.push(`❌ Erro ao tentar fazer login: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ ERRO DURANTE EXPLORAÇÃO:', error);
    relatorioExploracao.observacoes.push(`Erro crítico: ${error.message}`);
  } finally {
    await browser.close();
    await gerarRelatorioExploracao();
  }
}

/**
 * 🏠 EXPLORAR DASHBOARD E PÁGINAS INTERNAS
 */
async function explorarDashboard(page, screenshotDir, screenshotCounterInicial) {
  console.log('📍 6. Explorando Dashboard e páginas internas...');
  let screenshotCounter = screenshotCounterInicial;

  try {
    // Analisar menu lateral
    const itensMenu = await page.$$eval('nav a, .sidebar a, .nav-link', elements =>
      elements.map(el => ({
        href: el.href || '',
        textContent: el.textContent?.trim() || '',
        className: el.className || '',
        visible: !el.hidden && el.offsetHeight > 0 && el.offsetWidth > 0
      })).filter(el => el.visible && el.href)
    );

    relatorioExploracao.elementosEncontrados.push({
      pagina: 'Dashboard - Menu Lateral',
      elementos: itensMenu,
      timestamp: new Date().toISOString()
    });

    console.log(`📊 Itens do menu encontrados: ${itensMenu.length}`);

    // Capturar screenshots das páginas principais
    const paginasParaExplorar = [
      { nome: 'perfil-imigrante', url: '/app/perfil-imigrante' },
      { nome: 'experiencias-profissionais', url: '/app/dados-profissionais/experiencias' },
      { nome: 'formacao-academica', url: '/app/dados-profissionais/formacao' },
      { nome: 'idiomas-conhecidos', url: '/app/dados-profissionais/idiomas' },
      { nome: 'contribuicoes', url: '/app/minhas-contribuicoes' },
      { nome: 'sinergia-v2', url: '/app/sinergia-v2' }
    ];

    for (const pagina of paginasParaExplorar) {
      try {
        console.log(`📍 Explorando página: ${pagina.nome}`);
        await page.goto(`http://localhost:8080${pagina.url}`);
        await page.waitForTimeout(2000);

        const screenshotPath = path.join(screenshotDir, `${screenshotCounter++}-${pagina.nome}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        relatorioExploracao.screenshots.push({
          numero: screenshotCounter - 1,
          nome: pagina.nome,
          caminho: screenshotPath,
          url: page.url(),
          titulo: await page.title().catch(() => 'N/A')
        });

        // Analisar formulários na página
        const formularios = await page.$$eval('form, .form', elements =>
          elements.map((form, index) => ({
            index: index,
            className: form.className || '',
            id: form.id || '',
            action: form.action || '',
            campos: form.querySelectorAll('input, select, textarea').length
          }))
        );

        if (formularios.length > 0) {
          relatorioExploracao.elementosEncontrados.push({
            pagina: `${pagina.nome} - Formulários`,
            elementos: formularios,
            timestamp: new Date().toISOString()
          });
        }

        relatorioExploracao.paginasExploradas.push({
          nome: pagina.nome,
          url: pagina.url,
          acessivel: true,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.warn(`⚠️ Erro ao explorar ${pagina.nome}: ${error.message}`);
        relatorioExploracao.paginasExploradas.push({
          nome: pagina.nome,
          url: pagina.url,
          acessivel: false,
          erro: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

  } catch (error) {
    console.error(`❌ Erro durante exploração do dashboard: ${error.message}`);
  }
}

/**
 * 📊 GERAR RELATÓRIO DA EXPLORAÇÃO
 */
async function gerarRelatorioExploracao() {
  try {
    console.log('📊 Gerando relatório da exploração...');

    // Adicionar recomendações baseadas nos achados
    relatorioExploracao.proximos_passos.push(
      'Usar credenciais existentes para automatização (imigrante@madrilusa.com.pt)',
      'Focar em login direto em vez de processo de registro',
      'Criar seletores mais específicos baseados na estrutura HTML real',
      'Implementar navegação por URLs diretas após login'
    );

    // Salvar relatório JSON
    const nomeArquivoJson = `relatorio-exploracao-interface-${Date.now()}.json`;
    await fs.writeFile(nomeArquivoJson, JSON.stringify(relatorioExploracao, null, 2));

    // Gerar relatório HTML
    const htmlRelatorio = gerarHTMLExploracao();
    const nomeArquivoHtml = `relatorio-exploracao-interface-${Date.now()}.html`;
    await fs.writeFile(nomeArquivoHtml, htmlRelatorio);

    console.log('✅ Relatórios de exploração gerados:');
    console.log(`📄 JSON: ${nomeArquivoJson}`);
    console.log(`🌐 HTML: ${nomeArquivoHtml}`);
    console.log(`📸 Screenshots: ./screenshots-exploracao-interface`);

    // Resumo no console
    console.log('\n📋 RESUMO DA EXPLORAÇÃO:');
    console.log('=' * 50);
    console.log(`📸 Screenshots capturadas: ${relatorioExploracao.screenshots.length}`);
    console.log(`📊 Páginas exploradas: ${relatorioExploracao.paginasExploradas.length}`);
    console.log(`🔍 Elementos analisados: ${relatorioExploracao.elementosEncontrados.length}`);
    console.log(`💡 Observações: ${relatorioExploracao.observacoes.length}`);

    if (relatorioExploracao.observacoes.length > 0) {
      console.log('\n📝 PRINCIPAIS OBSERVAÇÕES:');
      relatorioExploracao.observacoes.forEach((obs, index) => {
        console.log(`${index + 1}. ${obs}`);
      });
    }

    if (relatorioExploracao.proximos_passos.length > 0) {
      console.log('\n🚀 PRÓXIMOS PASSOS RECOMENDADOS:');
      relatorioExploracao.proximos_passos.forEach((passo, index) => {
        console.log(`${index + 1}. ${passo}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro ao gerar relatório de exploração:', error);
  }
}

/**
 * 🌐 GERAR HTML DO RELATÓRIO
 */
function gerarHTMLExploracao() {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Exploração da Interface - Madrilusa</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #F5A623; border-bottom: 3px solid #F5A623; padding-bottom: 10px; }
        h2 { color: #4A90A4; margin-top: 30px; }
        .screenshot { margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #F5A623; }
        .elemento { background: #e9ecef; margin: 5px 0; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        .observacao { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .pagina { background: #d4edda; border: 1px solid #c3e6cb; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .timestamp { color: #666; font-size: 0.8em; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #4A90A4; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Relatório de Exploração da Interface - Madrilusa</h1>

        <p><strong>Data da Exploração:</strong> ${new Date(relatorioExploracao.timestamp).toLocaleString('pt-PT')}</p>

        <h2>📸 Screenshots Capturadas</h2>
        ${relatorioExploracao.screenshots.map(screenshot => `
            <div class="screenshot">
                <h4>${screenshot.nome}</h4>
                <p><strong>Arquivo:</strong> ${screenshot.caminho}</p>
                <p><strong>URL:</strong> ${screenshot.url}</p>
                <p><strong>Título:</strong> ${screenshot.titulo}</p>
                <p class="timestamp">${new Date(screenshot.timestamp).toLocaleString('pt-PT')}</p>
            </div>
        `).join('')}

        <h2>🔍 Elementos Encontrados por Página</h2>
        ${relatorioExploracao.elementosEncontrados.map(grupo => `
            <div style="margin: 20px 0;">
                <h3>${grupo.pagina}</h3>
                <p><strong>Elementos encontrados:</strong> ${grupo.elementos.length}</p>
                ${grupo.elementos.slice(0, 10).map(elemento => `
                    <div class="elemento">${JSON.stringify(elemento, null, 2)}</div>
                `).join('')}
                ${grupo.elementos.length > 10 ? `<p><em>... e mais ${grupo.elementos.length - 10} elementos</em></p>` : ''}
                <p class="timestamp">${new Date(grupo.timestamp).toLocaleString('pt-PT')}</p>
            </div>
        `).join('')}

        <h2>🌐 Páginas Exploradas</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>URL</th>
                    <th>Acessível</th>
                    <th>Observações</th>
                </tr>
            </thead>
            <tbody>
                ${relatorioExploracao.paginasExploradas.map(pagina => `
                    <tr>
                        <td>${pagina.nome}</td>
                        <td>${pagina.url}</td>
                        <td class="${pagina.acessivel ? 'success' : 'error'}">${pagina.acessivel ? 'Sim' : 'Não'}</td>
                        <td>${pagina.erro || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <h2>📝 Observações Principais</h2>
        ${relatorioExploracao.observacoes.map(observacao => `
            <div class="observacao">${observacao}</div>
        `).join('')}

        <h2>🚀 Próximos Passos Recomendados</h2>
        ${relatorioExploracao.proximos_passos.map((passo, index) => `
            <div class="pagina">${index + 1}. ${passo}</div>
        `).join('')}
    </div>
</body>
</html>
  `;
}

// 🚀 EXECUTAR EXPLORAÇÃO
if (import.meta.url === `file://${process.argv[1]}`) {
  explorarInterface().catch(console.error);
}

export { explorarInterface, relatorioExploracao };