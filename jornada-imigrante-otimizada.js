import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Dados realistas para teste
const dadosImigrante = {
    nome: "Ana Maria Santos Silva",
    email: "ana.santos.teste@madrilusa.demo",
    telefone: "+351 912 345 678",
    nacionalidade: "Brasileira",
    dataNascimento: "1995-03-15",
    genero: "F",
    municipioResidencia: "Porto",
    fluenciaPortugues: "Avançada",
    objetivos: ["Emprego", "Formação"],
    transporteProprio: true
};

// Login com credenciais existentes
const credenciais = {
    email: "imigrante@madrilusa.com.pt",
    senha: "vcgvcg"
};

class AnalisadorJornadaOtimizada {
    constructor() {
        this.timestamp = Date.now();
        this.jornada = {
            inicio: new Date().toISOString(),
            dadosUsuario: dadosImigrante,
            etapas: [],
            screenshots: [],
            campos: [],
            problemas: [],
            tempoTotal: 0
        };

        // Criar diretório para screenshots
        this.screenshotDir = `./screenshots-jornada-${this.timestamp}`;
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

    async analisarFormulario(page, nomeFormulario) {
        try {
            console.log(`📋 Analisando formulário: ${nomeFormulario}`);

            // Aguardar carregamento
            await page.waitForLoadState('networkidle');

            // Buscar todos os inputs, selects e textareas
            const campos = await page.evaluate(() => {
                const elementos = Array.from(document.querySelectorAll('input, select, textarea'));
                return elementos.map(el => ({
                    tipo: el.tagName.toLowerCase(),
                    name: el.name || '',
                    id: el.id || '',
                    placeholder: el.placeholder || '',
                    required: el.required || false,
                    type: el.type || '',
                    className: el.className || '',
                    label: (() => {
                        // Buscar label associado
                        let label = '';
                        if (el.id) {
                            const labelEl = document.querySelector(`label[for="${el.id}"]`);
                            if (labelEl) label = labelEl.textContent.trim();
                        }
                        // Se não encontrou, buscar label pai ou irmão
                        if (!label) {
                            const parent = el.closest('div');
                            if (parent) {
                                const labelEl = parent.querySelector('label');
                                if (labelEl) label = labelEl.textContent.trim();
                            }
                        }
                        return label;
                    })(),
                    visible: el.offsetParent !== null
                })).filter(campo => campo.visible &&
                          (campo.name || campo.id) &&
                          !['hidden', 'submit', 'button'].includes(campo.type));
            });

            if (campos.length > 0) {
                this.jornada.campos.push({
                    formulario: nomeFormulario,
                    url: page.url(),
                    campos: campos,
                    timestamp: new Date().toISOString()
                });

                console.log(`   ✅ ${campos.length} campos encontrados`);
                campos.forEach(campo => {
                    const obrigatorio = campo.required ? "OBRIGATÓRIO" : "opcional";
                    console.log(`   📝 ${campo.label || campo.placeholder || campo.name} (${campo.tipo}/${campo.type}) - ${obrigatorio}`);
                });
            }

            return campos;
        } catch (erro) {
            console.log(`❌ Erro ao analisar formulário ${nomeFormulario}:`, erro.message);
            this.jornada.problemas.push(`Erro ao analisar formulário ${nomeFormulario}: ${erro.message}`);
            return [];
        }
    }

    async navegarPara(page, url, nomeEtapa, descricaoEtapa) {
        try {
            const inicioEtapa = Date.now();
            console.log(`🚀 INICIANDO: ${nomeEtapa}`);

            await page.goto(url, { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000); // Aguardar estabilização

            const etapa = {
                nome: nomeEtapa,
                descricao: descricaoEtapa,
                inicioTimestamp: inicioEtapa,
                url: page.url(),
                titulo: await page.title().catch(() => ''),
                fimTimestamp: Date.now(),
                duracao: Date.now() - inicioEtapa,
                status: 'concluída'
            };

            this.jornada.etapas.push(etapa);
            await this.capturarScreenshot(page, nomeEtapa.toLowerCase().replace(/\s+/g, '-'), descricaoEtapa);

            return etapa;
        } catch (erro) {
            console.log(`❌ Erro ao navegar para ${nomeEtapa}:`, erro.message);
            this.jornada.problemas.push(`Erro ao navegar para ${nomeEtapa}: ${erro.message}`);
            throw erro;
        }
    }

    async executarLogin(page) {
        try {
            console.log(`🔐 Realizando login direto na aplicação...`);

            // Ir diretamente para a página de aplicação
            await page.goto('http://localhost:8080/app', { waitUntil: 'networkidle' });

            // Se não estiver logado, será redirecionado para login
            const url = page.url();
            if (url.includes('/login') || url === 'http://localhost:8080/') {
                console.log(`📋 Página de login detectada, realizando autenticação...`);

                // Aguardar e fechar possíveis modais
                try {
                    await page.waitForTimeout(1000);
                    const modals = await page.locator('[role="dialog"]').count();
                    if (modals > 0) {
                        await page.keyboard.press('Escape');
                        await page.waitForTimeout(500);
                    }
                } catch {}

                // Procurar botão de login na página principal
                const botaoLogin = page.locator('text=Login').first();
                if (await botaoLogin.isVisible()) {
                    await botaoLogin.click();
                    await page.waitForTimeout(1000);
                }

                // Preencher formulário de login
                await page.fill('input[type="email"]', credenciais.email);
                await page.fill('input[type="password"]', credenciais.senha);

                // Buscar botão de submit com diferentes estratégias
                const botaoSubmit = page.locator('button[type="submit"]:has-text("Entrar"), button:has-text("Entrar"), button:has-text("Login")').first();
                await botaoSubmit.click();

                // Aguardar redirecionamento
                await page.waitForURL('**/app**', { timeout: 10000 });
                await page.waitForLoadState('networkidle');

                console.log(`✅ Login realizado com sucesso!`);
            } else {
                console.log(`✅ Já autenticado na aplicação!`);
            }

            await this.capturarScreenshot(page, 'dashboard-inicial', 'Dashboard após login');
            return true;

        } catch (erro) {
            console.log(`❌ Erro no login:`, erro.message);
            await this.capturarScreenshot(page, 'erro-login', `Erro no login: ${erro.message}`);
            this.jornada.problemas.push(`Erro no login: ${erro.message}`);
            return false;
        }
    }

    async analisarMenus(page) {
        try {
            console.log(`📱 Analisando menus e navegação disponível...`);

            const menus = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a, button'));
                return links
                    .filter(el => el.offsetParent !== null) // Visível
                    .map(el => ({
                        texto: el.textContent.trim(),
                        href: el.href || '',
                        tipo: el.tagName.toLowerCase(),
                        className: el.className || ''
                    }))
                    .filter(item => item.texto && item.texto.length > 1)
                    .slice(0, 20); // Limitar para os mais relevantes
            });

            console.log(`   📋 ${menus.length} opções de menu encontradas:`);
            menus.forEach(menu => {
                console.log(`   🔗 ${menu.texto} (${menu.tipo})`);
            });

            this.jornada.menus = menus;
            return menus;

        } catch (erro) {
            console.log(`❌ Erro ao analisar menus:`, erro.message);
            return [];
        }
    }

    async explorarSecao(page, nomeSecao, urlSecao) {
        try {
            console.log(`\n🔍 EXPLORANDO SEÇÃO: ${nomeSecao}`);

            // Navegar para a seção específica
            await page.goto(urlSecao, { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000);

            await this.capturarScreenshot(page, `secao-${nomeSecao.toLowerCase().replace(/\s+/g, '-')}`, `Seção ${nomeSecao}`);

            // Analisar formulários na seção
            await this.analisarFormulario(page, nomeSecao);

            // Verificar se há botões de ação importantes
            const acoes = await page.evaluate(() => {
                const botoes = Array.from(document.querySelectorAll('button, input[type="submit"]'));
                return botoes
                    .filter(btn => btn.offsetParent !== null)
                    .map(btn => ({
                        texto: btn.textContent.trim() || btn.value || '',
                        tipo: btn.type || '',
                        className: btn.className || ''
                    }))
                    .filter(acao => acao.texto && acao.texto.length > 1);
            });

            if (acoes.length > 0) {
                console.log(`   🎯 Ações disponíveis:`);
                acoes.forEach(acao => {
                    console.log(`   ⚡ ${acao.texto} (${acao.tipo})`);
                });
            }

            return { formularios: true, acoes };

        } catch (erro) {
            console.log(`❌ Erro ao explorar seção ${nomeSecao}:`, erro.message);
            this.jornada.problemas.push(`Erro ao explorar seção ${nomeSecao}: ${erro.message}`);
            return { formularios: false, acoes: [] };
        }
    }

    async gerarRelatorios() {
        try {
            // Estatísticas finais
            const totalCampos = this.jornada.campos.reduce((total, form) => total + form.campos.length, 0);
            const camposObrigatorios = this.jornada.campos.reduce((total, form) =>
                total + form.campos.filter(campo => campo.required).length, 0);

            this.jornada.estatisticas = {
                totalCampos,
                camposObrigatorios,
                camposOpcionais: totalCampos - camposObrigatorios,
                formularios: this.jornada.campos.length,
                screenshots: this.jornada.screenshots.length,
                problemas: this.jornada.problemas.length,
                etapas: this.jornada.etapas.length
            };

            // Relatório JSON
            const nomeRelatorioJSON = `relatorio-jornada-otimizada-${this.timestamp}.json`;
            fs.writeFileSync(nomeRelatorioJSON, JSON.stringify(this.jornada, null, 2));

            // Relatório HTML
            const htmlRelatorio = this.gerarRelatorioHTML();
            const nomeRelatorioHTML = `relatorio-jornada-otimizada-${this.timestamp}.html`;
            fs.writeFileSync(nomeRelatorioHTML, htmlRelatorio);

            console.log(`\n🎉 RELATÓRIOS GERADOS:`);
            console.log(`📊 JSON: ${nomeRelatorioJSON}`);
            console.log(`📈 HTML: ${nomeRelatorioHTML}`);
            console.log(`📸 Screenshots: ${this.screenshotDir}`);

            return { json: nomeRelatorioJSON, html: nomeRelatorioHTML };

        } catch (erro) {
            console.log(`❌ Erro ao gerar relatórios:`, erro.message);
            return null;
        }
    }

    gerarRelatorioHTML() {
        const stats = this.jornada.estatisticas;

        return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Jornada Imigrante - Madrilusa</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #F5A623; border-bottom: 3px solid #F5A623; padding-bottom: 10px; }
        h2 { color: #4A90A4; margin-top: 30px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #F5A623; }
        .stat-value { font-size: 2em; font-weight: bold; color: #F5A623; }
        .stat-label { color: #666; font-size: 0.9em; }
        .form-section { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #4A90A4; }
        .campo { margin: 5px 0; padding: 8px; background: white; border-radius: 4px; border-left: 3px solid #ddd; }
        .obrigatorio { border-left-color: #dc3545; }
        .opcional { border-left-color: #28a745; }
        .problema { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .screenshot { margin: 10px 0; padding: 10px; background: #e9ecef; border-radius: 4px; }
        .timestamp { color: #666; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 Relatório Completo - Jornada do Imigrante</h1>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${stats.totalCampos}</div>
                <div class="stat-label">Campos Analisados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.camposObrigatorios}</div>
                <div class="stat-label">Campos Obrigatórios</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.camposOpcionais}</div>
                <div class="stat-label">Campos Opcionais</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.formularios}</div>
                <div class="stat-label">Formulários</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.screenshots}</div>
                <div class="stat-label">Screenshots</div>
            </div>
        </div>

        <h2>👤 Dados do Usuário</h2>
        <p><strong>Nome:</strong> ${this.jornada.dadosUsuario.nome}</p>
        <p><strong>Email:</strong> ${this.jornada.dadosUsuario.email}</p>
        <p><strong>Data do Teste:</strong> ${new Date(this.jornada.inicio).toLocaleString('pt-PT')}</p>

        <h2>📋 Formulários Analisados</h2>
        ${this.jornada.campos.map(form => `
            <div class="form-section">
                <h3>${form.formulario}</h3>
                <p><strong>URL:</strong> ${form.url}</p>
                <p><strong>Campos encontrados:</strong> ${form.campos.length}</p>

                ${form.campos.map(campo => `
                    <div class="campo ${campo.required ? 'obrigatorio' : 'opcional'}">
                        <strong>${campo.label || campo.placeholder || campo.name}</strong>
                        <br>
                        <small>Tipo: ${campo.tipo}/${campo.type} | ${campo.required ? 'OBRIGATÓRIO' : 'Opcional'}</small>
                    </div>
                `).join('')}
            </div>
        `).join('')}

        ${this.jornada.problemas.length > 0 ? `
            <h2>⚠️ Problemas Identificados</h2>
            ${this.jornada.problemas.map(problema => `
                <div class="problema">${problema}</div>
            `).join('')}
        ` : ''}

        <h2>📸 Screenshots Capturadas</h2>
        ${this.jornada.screenshots.map(screenshot => `
            <div class="screenshot">
                <h4>${screenshot.nome}</h4>
                <p>${screenshot.descricao}</p>
                <p><strong>Arquivo:</strong> ${screenshot.arquivo}</p>
                <p><strong>URL:</strong> ${screenshot.url}</p>
                <p class="timestamp">${new Date(screenshot.timestamp).toLocaleString('pt-PT')}</p>
            </div>
        `).join('')}

        <h2>📈 Estatísticas Finais</h2>
        <p><strong>Total de Etapas:</strong> ${stats.etapas}</p>
        <p><strong>Total de Formulários:</strong> ${stats.formularios}</p>
        <p><strong>Total de Campos:</strong> ${stats.totalCampos}</p>
        <p><strong>Taxa de Campos Obrigatórios:</strong> ${stats.totalCampos > 0 ? Math.round((stats.camposObrigatorios / stats.totalCampos) * 100) : 0}%</p>
        <p><strong>Problemas Encontrados:</strong> ${stats.problemas}</p>
    </div>
</body>
</html>`;
    }
}

async function executarJornadaOtimizada() {
    const analisador = new AnalisadorJornadaOtimizada();

    console.log('🎯 INICIANDO JORNADA OTIMIZADA - MAPEAMENTO COMPLETO');
    console.log('=========================================================');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 300,
        args: ['--start-maximized']
    });

    try {
        const page = await browser.newPage();

        // 1. LOGIN DIRETO
        const loginSucesso = await analisador.executarLogin(page);
        if (!loginSucesso) {
            throw new Error('Falha no login - interrompendo jornada');
        }

        // 2. ANALISAR DASHBOARD
        await analisador.analisarMenus(page);
        await analisador.analisarFormulario(page, 'Dashboard Principal');

        // 3. EXPLORAR PERFIL DO IMIGRANTE
        console.log('\n🔍 SEÇÃO 1: PERFIL DO IMIGRANTE');
        await analisador.explorarSecao(page, 'Perfil Imigrante', 'http://localhost:8080/app/perfil-imigrante');

        // 4. EXPERIÊNCIAS PROFISSIONAIS
        console.log('\n🔍 SEÇÃO 2: EXPERIÊNCIAS PROFISSIONAIS');
        await analisador.explorarSecao(page, 'Experiências Profissionais', 'http://localhost:8080/app/experiencias-profissionais');

        // 5. FORMAÇÃO ACADÊMICA
        console.log('\n🔍 SEÇÃO 3: FORMAÇÃO ACADÊMICA');
        await analisador.explorarSecao(page, 'Formação Acadêmica', 'http://localhost:8080/app/formacao-academica');

        // 6. IDIOMAS
        console.log('\n🔍 SEÇÃO 4: IDIOMAS CONHECIDOS');
        await analisador.explorarSecao(page, 'Idiomas Conhecidos', 'http://localhost:8080/app/idiomas-conhecidos');

        // 7. CONTRIBUIÇÕES
        console.log('\n🔍 SEÇÃO 5: CONTRIBUIÇÕES');
        await analisador.explorarSecao(page, 'Minhas Contribuições', 'http://localhost:8080/app/minhas-contribuicoes');

        // 8. SINERGIA
        console.log('\n🔍 SEÇÃO 6: SINERGIA MADRILUSA');
        await analisador.explorarSecao(page, 'SinergIA Madrilusa', 'http://localhost:8080/app/sinergia');

        // 9. DADOS PROFISSIONAIS (SE EXISTIR)
        try {
            console.log('\n🔍 SEÇÃO 7: DADOS PROFISSIONAIS');
            await analisador.explorarSecao(page, 'Dados Profissionais', 'http://localhost:8080/app/dados-profissionais');
        } catch (erro) {
            console.log('ℹ️ Seção Dados Profissionais não encontrada ou indisponível');
        }

        console.log('\n📊 Gerando relatórios finais...');
        const relatorios = await analisador.gerarRelatorios();

        console.log('\n🎉 JORNADA COMPLETA FINALIZADA COM SUCESSO!');
        console.log('=========================================================');
        console.log(`📊 Total de campos analisados: ${analisador.jornada.estatisticas.totalCampos}`);
        console.log(`📋 Total de formulários: ${analisador.jornada.estatisticas.formularios}`);
        console.log(`📸 Screenshots capturadas: ${analisador.jornada.estatisticas.screenshots}`);
        console.log(`⚠️ Problemas encontrados: ${analisador.jornada.estatisticas.problemas}`);

        if (relatorios) {
            console.log(`\n📂 Relatórios disponíveis:`);
            console.log(`📊 JSON: ${relatorios.json}`);
            console.log(`📈 HTML: ${relatorios.html}`);
        }

    } catch (erro) {
        console.log('\n❌ ERRO CRÍTICO:', erro.message);
        await analisador.capturarScreenshot(page, 'erro-critico', `Erro crítico: ${erro.message}`);
        await analisador.gerarRelatorios();
    } finally {
        await browser.close();
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    executarJornadaOtimizada().catch(console.error);
}

export { executarJornadaOtimizada, AnalisadorJornadaOtimizada };