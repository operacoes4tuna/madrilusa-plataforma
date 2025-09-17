import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Credenciais para login direto
const credenciais = {
    email: "imigrante@madrilusa.com.pt",
    senha: "vcgvcg"
};

class AnalisadorJornadaAPI {
    constructor() {
        this.timestamp = Date.now();
        this.jornada = {
            inicio: new Date().toISOString(),
            credenciais: credenciais.email,
            etapas: [],
            screenshots: [],
            formularios: [],
            menus: [],
            problemas: [],
            estatisticas: {}
        };

        // Criar diretório para screenshots
        this.screenshotDir = `./screenshots-jornada-api-${this.timestamp}`;
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }
    }

    async capturarScreenshot(page, nome, descricao) {
        try {
            const nomeArquivo = `${String(this.jornada.screenshots.length + 1).padStart(2, '0')}-${nome}-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
            const caminhoCompleto = path.join(this.screenshotDir, nomeArquivo);

            await page.screenshot({
                path: caminhoCompleto,
                fullPage: true
            });

            const screenshot = {
                numero: this.jornada.screenshots.length + 1,
                nome,
                arquivo: nomeArquivo,
                caminho: caminhoCompleto,
                descricao,
                timestamp: new Date().toISOString(),
                url: page.url(),
                titulo: await page.title().catch(() => '')
            };

            this.jornada.screenshots.push(screenshot);
            console.log(`📸 Screenshot: ${nome} - ${descricao}`);

            return screenshot;
        } catch (erro) {
            console.log(`❌ Erro ao capturar screenshot ${nome}:`, erro.message);
            return null;
        }
    }

    async logarViaCookies(page) {
        try {
            console.log(`🔐 Tentando login via API/cookies...`);

            // Primeiro, fazer login via API para obter cookies
            const response = await page.context().request.post('http://localhost:3001/api/auth/login', {
                data: {
                    email: credenciais.email,
                    password: credenciais.senha
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok()) {
                const dados = await response.json();
                console.log(`✅ Login via API realizado com sucesso!`);

                // Agora navegar para a aplicação - deve estar autenticado
                await page.goto('http://localhost:8080/app', { waitUntil: 'networkidle' });

                // Verificar se realmente está autenticado
                const url = page.url();
                if (url.includes('/app') && !url.includes('/login')) {
                    console.log(`✅ Autenticação confirmada! URL: ${url}`);
                    return true;
                } else {
                    console.log(`⚠️ Ainda não autenticado, URL: ${url}`);
                    return false;
                }
            } else {
                console.log(`❌ Falha no login via API: ${response.status()}`);
                return false;
            }

        } catch (erro) {
            console.log(`❌ Erro no login via API:`, erro.message);
            return false;
        }
    }

    async logarViaInterface(page) {
        try {
            console.log(`🔐 Tentando login via interface...`);

            // Ir para a página home e aguardar carregamento
            await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000);

            // Fechar possíveis modais primeiro
            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);

            // Aguardar qualquer modal desaparecer
            await page.waitForFunction(() => {
                const modals = document.querySelectorAll('[role="dialog"]');
                return modals.length === 0 || Array.from(modals).every(modal =>
                    modal.getAttribute('data-state') === 'closed' ||
                    getComputedStyle(modal).display === 'none' ||
                    getComputedStyle(modal).visibility === 'hidden'
                );
            }, { timeout: 5000 }).catch(() => {});

            await this.capturarScreenshot(page, 'home-inicial', 'Página inicial antes do login');

            // Procurar e clicar em "Login" usando força
            await page.evaluate(() => {
                // Remover todos os modais que possam estar interferindo
                const modals = document.querySelectorAll('[role="dialog"], .modal, [data-state="open"]');
                modals.forEach(modal => modal.remove());

                // Remover overlays
                const overlays = document.querySelectorAll('[aria-hidden="true"]');
                overlays.forEach(overlay => {
                    if (overlay.style.position === 'fixed') {
                        overlay.remove();
                    }
                });
            });

            // Aguardar e clicar no botão de login
            await page.waitForTimeout(1000);

            // Tentar diferentes formas de encontrar o botão de login
            const seletoresLogin = [
                'button:has-text("Login")',
                '[data-login-button="true"]',
                'button:has-text("Entrar")',
                'a:has-text("Login")',
                '.login-button',
                'button[type="button"]:has-text("Login")'
            ];

            let botaoClicado = false;
            for (const seletor of seletoresLogin) {
                try {
                    const botao = page.locator(seletor).first();
                    if (await botao.isVisible()) {
                        console.log(`🎯 Tentando clicar no botão login: ${seletor}`);

                        // Force click
                        await botao.click({ force: true });
                        await page.waitForTimeout(1000);

                        botaoClicado = true;
                        break;
                    }
                } catch (erro) {
                    console.log(`⚠️ Seletor ${seletor} falhou: ${erro.message}`);
                }
            }

            if (!botaoClicado) {
                throw new Error('Não foi possível encontrar botão de login');
            }

            await this.capturarScreenshot(page, 'modal-login', 'Modal de login aberto');

            // Aguardar e preencher formulário
            await page.waitForTimeout(2000);

            // Preencher campos
            await page.fill('input[type="email"]', credenciais.email);
            await page.waitForTimeout(500);
            await page.fill('input[type="password"]', credenciais.senha);
            await page.waitForTimeout(500);

            await this.capturarScreenshot(page, 'formulario-preenchido', 'Formulário de login preenchido');

            // Submeter formulário - usar força total
            await page.evaluate(() => {
                const form = document.querySelector('form');
                if (form) {
                    form.submit();
                } else {
                    // Procurar botão de submit
                    const submitBtn = document.querySelector('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")');
                    if (submitBtn) {
                        submitBtn.click();
                    }
                }
            });

            // Aguardar redirecionamento
            await page.waitForURL('**/app**', { timeout: 10000 });
            await page.waitForLoadState('networkidle');

            console.log(`✅ Login via interface realizado com sucesso!`);
            return true;

        } catch (erro) {
            console.log(`❌ Erro no login via interface:`, erro.message);
            await this.capturarScreenshot(page, 'erro-login-interface', `Erro login interface: ${erro.message}`);
            return false;
        }
    }

    async analisarFormulario(page, nomeFormulario, urlPagina = null) {
        try {
            console.log(`📋 Analisando formulário: ${nomeFormulario}`);

            if (urlPagina) {
                await page.goto(urlPagina, { waitUntil: 'networkidle' });
                await page.waitForTimeout(2000);
            }

            // Capturar screenshot da página
            await this.capturarScreenshot(page,
                `formulario-${nomeFormulario.toLowerCase().replace(/\s+/g, '-')}`,
                `Formulário: ${nomeFormulario}`);

            // Analisar todos os campos de formulário
            const analise = await page.evaluate(() => {
                const campos = Array.from(document.querySelectorAll('input, select, textarea'));
                const botoes = Array.from(document.querySelectorAll('button'));
                const links = Array.from(document.querySelectorAll('a'));

                return {
                    campos: campos
                        .filter(el => el.offsetParent !== null) // Visível
                        .map(el => ({
                            tipo: el.tagName.toLowerCase(),
                            name: el.name || '',
                            id: el.id || '',
                            placeholder: el.placeholder || '',
                            required: el.required || false,
                            type: el.type || '',
                            value: el.value || '',
                            className: el.className || '',
                            label: (() => {
                                // Buscar label associado
                                if (el.id) {
                                    const label = document.querySelector(`label[for="${el.id}"]`);
                                    if (label) return label.textContent.trim();
                                }
                                // Buscar label em elemento pai
                                const parent = el.closest('div');
                                if (parent) {
                                    const label = parent.querySelector('label');
                                    if (label) return label.textContent.trim();
                                }
                                return '';
                            })()
                        }))
                        .filter(campo => (campo.name || campo.id) &&
                                        !['hidden', 'submit', 'button'].includes(campo.type)),

                    botoes: botoes
                        .filter(btn => btn.offsetParent !== null)
                        .map(btn => ({
                            texto: btn.textContent.trim(),
                            type: btn.type || '',
                            className: btn.className || ''
                        }))
                        .filter(btn => btn.texto && btn.texto.length > 1),

                    links: links
                        .filter(link => link.offsetParent !== null)
                        .map(link => ({
                            texto: link.textContent.trim(),
                            href: link.href || '',
                            className: link.className || ''
                        }))
                        .filter(link => link.texto && link.texto.length > 1)
                        .slice(0, 10), // Limitar para não sobrecarregar

                    titulo: document.title,
                    url: window.location.href
                };
            });

            if (analise.campos.length > 0 || analise.botoes.length > 0) {
                const formulario = {
                    nome: nomeFormulario,
                    url: page.url(),
                    titulo: analise.titulo,
                    timestamp: new Date().toISOString(),
                    campos: analise.campos,
                    botoes: analise.botoes,
                    links: analise.links.slice(0, 5) // Top 5 links relevantes
                };

                this.jornada.formularios.push(formulario);

                console.log(`   ✅ ${analise.campos.length} campos encontrados`);
                console.log(`   🎯 ${analise.botoes.length} botões encontrados`);
                console.log(`   🔗 ${analise.links.length} links encontrados`);

                // Mostrar detalhes dos campos
                analise.campos.forEach(campo => {
                    const obrigatorio = campo.required ? "OBRIGATÓRIO" : "opcional";
                    console.log(`   📝 ${campo.label || campo.placeholder || campo.name || campo.id} (${campo.tipo}/${campo.type}) - ${obrigatorio}`);
                });

                return formulario;
            } else {
                console.log(`   ⚠️ Nenhum campo de formulário encontrado`);
                return null;
            }

        } catch (erro) {
            console.log(`❌ Erro ao analisar formulário ${nomeFormulario}:`, erro.message);
            this.jornada.problemas.push(`Erro ao analisar formulário ${nomeFormulario}: ${erro.message}`);
            return null;
        }
    }

    async navegarParaSecao(page, nomeSecao, urlSecao) {
        try {
            console.log(`\n🔍 NAVEGANDO PARA: ${nomeSecao}`);
            console.log(`📍 URL: ${urlSecao}`);

            await page.goto(urlSecao, { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000);

            const etapa = {
                nome: nomeSecao,
                url: urlSecao,
                timestamp: new Date().toISOString(),
                titulo: await page.title().catch(() => ''),
                sucesso: true
            };

            this.jornada.etapas.push(etapa);

            // Analisar a seção
            const analise = await this.analisarFormulario(page, nomeSecao);

            console.log(`✅ Seção ${nomeSecao} analisada com sucesso`);
            return analise;

        } catch (erro) {
            console.log(`❌ Erro ao navegar para ${nomeSecao}:`, erro.message);
            this.jornada.problemas.push(`Erro ao navegar para ${nomeSecao}: ${erro.message}`);

            const etapa = {
                nome: nomeSecao,
                url: urlSecao,
                timestamp: new Date().toISOString(),
                erro: erro.message,
                sucesso: false
            };

            this.jornada.etapas.push(etapa);
            return null;
        }
    }

    async gerarRelatorio() {
        try {
            // Calcular estatísticas
            const totalCampos = this.jornada.formularios.reduce((total, form) => total + form.campos.length, 0);
            const camposObrigatorios = this.jornada.formularios.reduce((total, form) =>
                total + form.campos.filter(campo => campo.required).length, 0);

            this.jornada.estatisticas = {
                totalFormularios: this.jornada.formularios.length,
                totalCampos,
                camposObrigatorios,
                camposOpcionais: totalCampos - camposObrigatorios,
                screenshots: this.jornada.screenshots.length,
                etapas: this.jornada.etapas.length,
                problemas: this.jornada.problemas.length,
                etapasSucesso: this.jornada.etapas.filter(e => e.sucesso).length,
                porcentagemSucesso: Math.round((this.jornada.etapas.filter(e => e.sucesso).length / this.jornada.etapas.length) * 100)
            };

            // Salvar relatório JSON
            const nomeJSON = `relatorio-jornada-api-${this.timestamp}.json`;
            fs.writeFileSync(nomeJSON, JSON.stringify(this.jornada, null, 2));

            // Gerar relatório HTML
            const html = this.gerarHTML();
            const nomeHTML = `relatorio-jornada-api-${this.timestamp}.html`;
            fs.writeFileSync(nomeHTML, html);

            console.log(`\n🎉 RELATÓRIOS GERADOS:`);
            console.log(`📊 JSON: ${nomeJSON}`);
            console.log(`📈 HTML: ${nomeHTML}`);
            console.log(`📸 Screenshots: ${this.screenshotDir}`);

            return { json: nomeJSON, html: nomeHTML };

        } catch (erro) {
            console.log(`❌ Erro ao gerar relatório:`, erro.message);
            return null;
        }
    }

    gerarHTML() {
        const stats = this.jornada.estatisticas;

        return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Jornada Imigrante - API Approach</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #F5A623; border-bottom: 3px solid #F5A623; padding-bottom: 10px; }
        h2 { color: #4A90A4; margin-top: 30px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #F5A623; }
        .stat-value { font-size: 2em; font-weight: bold; color: #F5A623; }
        .stat-label { color: #666; font-size: 0.9em; }
        .form-section { background: #f8f9fa; margin: 15px 0; padding: 20px; border-radius: 8px; border-left: 4px solid #4A90A4; }
        .campo { margin: 8px 0; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #ddd; }
        .obrigatorio { border-left-color: #dc3545; }
        .opcional { border-left-color: #28a745; }
        .botao { margin: 5px 0; padding: 5px 10px; background: #e9ecef; border-radius: 4px; display: inline-block; }
        .problema { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .sucesso { color: #28a745; }
        .erro { color: #dc3545; }
        .screenshot { margin: 10px 0; padding: 10px; background: #e9ecef; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 Relatório Completo - Jornada do Imigrante (API)</h1>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${stats.totalFormularios}</div>
                <div class="stat-label">Formulários</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalCampos}</div>
                <div class="stat-label">Campos Totais</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.camposObrigatorios}</div>
                <div class="stat-label">Obrigatórios</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.camposOpcionais}</div>
                <div class="stat-label">Opcionais</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.porcentagemSucesso}%</div>
                <div class="stat-label">Taxa Sucesso</div>
            </div>
        </div>

        <h2>👤 Informações da Jornada</h2>
        <p><strong>Usuário:</strong> ${this.jornada.credenciais}</p>
        <p><strong>Início:</strong> ${new Date(this.jornada.inicio).toLocaleString('pt-PT')}</p>
        <p><strong>Etapas Concluídas:</strong> ${stats.etapasSucesso}/${stats.etapas}</p>

        <h2>📋 Formulários e Campos Analisados</h2>
        ${this.jornada.formularios.map(form => `
            <div class="form-section">
                <h3>${form.nome}</h3>
                <p><strong>URL:</strong> ${form.url}</p>
                <p><strong>Título:</strong> ${form.titulo}</p>
                <p><strong>Campos:</strong> ${form.campos.length} | <strong>Botões:</strong> ${form.botoes.length}</p>

                <h4>Campos do Formulário:</h4>
                ${form.campos.map(campo => `
                    <div class="campo ${campo.required ? 'obrigatorio' : 'opcional'}">
                        <strong>${campo.label || campo.placeholder || campo.name || campo.id}</strong>
                        <br>
                        <small>Tipo: ${campo.tipo}/${campo.type} | ${campo.required ? '🔴 OBRIGATÓRIO' : '🟢 Opcional'}</small>
                    </div>
                `).join('')}

                <h4>Botões Disponíveis:</h4>
                ${form.botoes.map(botao => `
                    <span class="botao">${botao.texto} (${botao.type})</span>
                `).join('')}
            </div>
        `).join('')}

        ${this.jornada.problemas.length > 0 ? `
            <h2>⚠️ Problemas Identificados</h2>
            ${this.jornada.problemas.map(problema => `
                <div class="problema">${problema}</div>
            `).join('')}
        ` : ''}

        <h2>📊 Etapas da Jornada</h2>
        ${this.jornada.etapas.map(etapa => `
            <div style="margin: 10px 0; padding: 10px; border-left: 4px solid ${etapa.sucesso ? '#28a745' : '#dc3545'};">
                <strong>${etapa.nome}</strong>
                <span class="${etapa.sucesso ? 'sucesso' : 'erro'}">(${etapa.sucesso ? 'Sucesso' : 'Erro'})</span>
                <br>
                <small>${etapa.url}</small>
                ${etapa.erro ? `<br><small class="erro">Erro: ${etapa.erro}</small>` : ''}
            </div>
        `).join('')}

        <h2>📸 Screenshots Capturadas</h2>
        ${this.jornada.screenshots.map(screenshot => `
            <div class="screenshot">
                <h4>${screenshot.nome}</h4>
                <p>${screenshot.descricao}</p>
                <p><strong>Arquivo:</strong> ${screenshot.arquivo}</p>
                <p><strong>URL:</strong> ${screenshot.url}</p>
                <small>${new Date(screenshot.timestamp).toLocaleString('pt-PT')}</small>
            </div>
        `).join('')}

    </div>
</body>
</html>`;
    }
}

async function executarJornadaAPI() {
    const analisador = new AnalisadorJornadaAPI();

    console.log('🚀 INICIANDO JORNADA COMPLETA VIA API');
    console.log('=====================================');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 200,
        args: ['--start-maximized']
    });

    try {
        const page = await browser.newPage();

        // 1. TENTAR LOGIN VIA API PRIMEIRO
        console.log('\n🔐 FASE 1: AUTENTICAÇÃO');
        let loginSucesso = await analisador.logarViaCookies(page);

        // 2. SE FALHAR, TENTAR VIA INTERFACE
        if (!loginSucesso) {
            console.log('⚠️ Login via API falhou, tentando via interface...');
            loginSucesso = await analisador.logarViaInterface(page);
        }

        if (!loginSucesso) {
            throw new Error('Falha em ambos os métodos de login');
        }

        // 3. MAPEAR TODAS AS SEÇÕES DISPONÍVEIS
        console.log('\n📋 FASE 2: MAPEAMENTO COMPLETO DAS SEÇÕES');

        const secoes = [
            { nome: 'Dashboard Principal', url: 'http://localhost:8080/app' },
            { nome: 'Perfil Imigrante', url: 'http://localhost:8080/app/perfil-imigrante' },
            { nome: 'Experiências Profissionais', url: 'http://localhost:8080/app/experiencias-profissionais' },
            { nome: 'Formação Acadêmica', url: 'http://localhost:8080/app/formacao-academica' },
            { nome: 'Idiomas Conhecidos', url: 'http://localhost:8080/app/idiomas-conhecidos' },
            { nome: 'Minhas Contribuições', url: 'http://localhost:8080/app/minhas-contribuicoes' },
            { nome: 'SinergIA Madrilusa', url: 'http://localhost:8080/app/sinergia' },
            { nome: 'Dados Profissionais', url: 'http://localhost:8080/app/dados-profissionais' }
        ];

        // Analisar cada seção
        for (const secao of secoes) {
            await analisador.navegarParaSecao(page, secao.nome, secao.url);
        }

        // 4. GERAR RELATÓRIOS
        console.log('\n📊 FASE 3: GERAÇÃO DE RELATÓRIOS');
        const relatorios = await analisador.gerarRelatorio();

        // 5. RESUMO FINAL
        console.log('\n🎉 JORNADA FINALIZADA COM SUCESSO!');
        console.log('=====================================');
        const stats = analisador.jornada.estatisticas;
        console.log(`📊 Formulários analisados: ${stats.totalFormularios}`);
        console.log(`📝 Total de campos: ${stats.totalCampos}`);
        console.log(`🔴 Campos obrigatórios: ${stats.camposObrigatorios}`);
        console.log(`🟢 Campos opcionais: ${stats.camposOpcionais}`);
        console.log(`📸 Screenshots: ${stats.screenshots}`);
        console.log(`✅ Taxa de sucesso: ${stats.porcentagemSucesso}%`);

        if (relatorios) {
            console.log(`\n📂 Relatórios gerados:`);
            console.log(`📊 JSON: ${relatorios.json}`);
            console.log(`📈 HTML: ${relatorios.html}`);
        }

    } catch (erro) {
        console.log('\n❌ ERRO CRÍTICO:', erro.message);
        await analisador.capturarScreenshot(page, 'erro-critico', `Erro crítico: ${erro.message}`);
        await analisador.gerarRelatorio();
    } finally {
        await browser.close();
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    executarJornadaAPI().catch(console.error);
}

export { executarJornadaAPI, AnalisadorJornadaAPI };