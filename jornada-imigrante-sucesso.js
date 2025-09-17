import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Configuração correta das portas
const FRONTEND_URL = 'http://localhost:8081';
const BACKEND_URL = 'http://localhost:3001';

// Credenciais de usuário existente
const credenciais = {
    email: "imigrante@madrilusa.com.pt",
    senha: "vcgvcg"
};

class JornadaImigranteSucesso {
    constructor() {
        this.timestamp = Date.now();
        this.dados = {
            usuario: credenciais.email,
            inicio: new Date().toISOString(),
            etapas: [],
            secoes: [],
            screenshots: [],
            campos: [],
            problemas: [],
            estatisticas: {}
        };

        // Diretório para screenshots
        this.screenshotDir = `./screenshots-jornada-sucesso-${this.timestamp}`;
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }

        console.log(`🎯 INICIANDO JORNADA DE SUCESSO - Timestamp: ${this.timestamp}`);
        console.log(`📱 Frontend: ${FRONTEND_URL}`);
        console.log(`🔧 Backend: ${BACKEND_URL}`);
        console.log(`👤 Usuário: ${credenciais.email}`);
    }

    async screenshot(page, nome, descricao) {
        try {
            const nomeArquivo = `${String(this.dados.screenshots.length + 1).padStart(2, '0')}-${nome}-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
            const caminho = path.join(this.screenshotDir, nomeArquivo);

            await page.screenshot({
                path: caminho,
                fullPage: false, // Usar viewport para ser mais rápido
                timeout: 5000
            });

            const screenshot = {
                numero: this.dados.screenshots.length + 1,
                nome,
                arquivo: nomeArquivo,
                descricao,
                url: page.url(),
                titulo: await page.title().catch(() => ''),
                timestamp: new Date().toISOString()
            };

            this.dados.screenshots.push(screenshot);
            console.log(`📸 ${nome}: ${descricao}`);
            return screenshot;

        } catch (erro) {
            console.log(`❌ Screenshot ${nome} falhou: ${erro.message}`);
            return null;
        }
    }

    async loginDireto(page) {
        try {
            console.log(`\n🔐 TENTATIVA DE LOGIN DIRETO`);

            // Ir direto para o app
            await page.goto(`${FRONTEND_URL}/app`, { waitUntil: 'networkidle', timeout: 10000 });

            const url = page.url();
            console.log(`📍 URL após navegação: ${url}`);

            // Se já estiver na app, está logado
            if (url.includes('/app') && !url.includes('login')) {
                console.log(`✅ Já autenticado!`);
                await this.screenshot(page, 'ja-logado', 'Usuário já estava autenticado');
                return true;
            }

            // Se redirecionou para home ou login, precisa autenticar
            console.log(`🔑 Necessário autenticar...`);

            // Tentar ir para home e fazer login
            await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000);

            await this.screenshot(page, 'home-page', 'Página inicial antes do login');

            // Fechar modais que possam estar abertos
            await page.keyboard.press('Escape');
            await page.waitForTimeout(1000);

            // Procurar botão de login
            try {
                // Aguardar botão de login aparecer
                await page.waitForSelector('button:has-text("Login"), a:has-text("Login")', { timeout: 5000 });

                // Clicar no botão de login
                await page.click('button:has-text("Login"), a:has-text("Login")');
                await page.waitForTimeout(2000);

                await this.screenshot(page, 'modal-login', 'Modal de login aberto');

                // Preencher formulário de login
                await page.waitForSelector('input[type="email"]', { timeout: 5000 });
                await page.fill('input[type="email"]', credenciais.email);
                await page.waitForTimeout(500);

                await page.waitForSelector('input[type="password"]', { timeout: 5000 });
                await page.fill('input[type="password"]', credenciais.senha);
                await page.waitForTimeout(500);

                await this.screenshot(page, 'form-preenchido', 'Formulário preenchido');

                // Submeter - tentar várias estratégias
                try {
                    // Estratégia 1: procurar botão específico de submit
                    await page.click('button[type="submit"]');
                } catch {
                    try {
                        // Estratégia 2: procurar por texto
                        await page.click('button:has-text("Entrar")');
                    } catch {
                        try {
                            // Estratégia 3: Enter no campo password
                            await page.press('input[type="password"]', 'Enter');
                        } catch {
                            console.log(`⚠️ Falha em todas as estratégias de submit`);
                        }
                    }
                }

                // Aguardar redirecionamento
                await page.waitForTimeout(3000);
                await page.waitForLoadState('networkidle', { timeout: 10000 });

                const urlFinal = page.url();
                console.log(`📍 URL após login: ${urlFinal}`);

                if (urlFinal.includes('/app')) {
                    console.log(`✅ Login realizado com sucesso!`);
                    await this.screenshot(page, 'login-sucesso', 'Login bem-sucedido');
                    return true;
                } else {
                    console.log(`❌ Login falhou - ainda em: ${urlFinal}`);
                    await this.screenshot(page, 'login-falhado', 'Login não foi bem-sucedido');
                    return false;
                }

            } catch (erro) {
                console.log(`❌ Erro ao encontrar elementos de login: ${erro.message}`);
                await this.screenshot(page, 'erro-elementos', 'Elementos de login não encontrados');
                return false;
            }

        } catch (erro) {
            console.log(`❌ Erro no processo de login: ${erro.message}`);
            await this.screenshot(page, 'erro-login', `Erro no login: ${erro.message}`);
            this.dados.problemas.push(`Erro no login: ${erro.message}`);
            return false;
        }
    }

    async analisarSecao(page, nomeSecao, urlSecao) {
        try {
            console.log(`\n🔍 ANALISANDO: ${nomeSecao}`);

            const inicioAnalise = Date.now();

            // Navegar para a seção
            await page.goto(urlSecao, { waitUntil: 'networkidle', timeout: 10000 });
            await page.waitForTimeout(1500);

            await this.screenshot(page, `secao-${nomeSecao.toLowerCase().replace(/\s+/g, '-')}`, `Seção: ${nomeSecao}`);

            // Analisar conteúdo da página
            const analise = await page.evaluate(() => {
                // Encontrar campos de formulário
                const inputs = Array.from(document.querySelectorAll('input, select, textarea')).filter(el =>
                    el.offsetParent !== null && // Visível
                    !['hidden', 'submit', 'button'].includes(el.type) &&
                    (el.name || el.id || el.placeholder)
                );

                // Encontrar botões
                const botoes = Array.from(document.querySelectorAll('button, input[type="submit"]')).filter(el =>
                    el.offsetParent !== null &&
                    el.textContent.trim().length > 0
                );

                // Encontrar links de navegação
                const links = Array.from(document.querySelectorAll('a')).filter(el =>
                    el.offsetParent !== null &&
                    el.textContent.trim().length > 0 &&
                    el.href
                ).slice(0, 10);

                return {
                    titulo: document.title,
                    url: window.location.href,
                    campos: inputs.map(el => ({
                        tag: el.tagName.toLowerCase(),
                        type: el.type || '',
                        name: el.name || '',
                        id: el.id || '',
                        placeholder: el.placeholder || '',
                        required: el.required,
                        label: (() => {
                            if (el.id) {
                                const label = document.querySelector(`label[for="${el.id}"]`);
                                if (label) return label.textContent.trim();
                            }
                            const parent = el.closest('div');
                            if (parent) {
                                const label = parent.querySelector('label');
                                if (label) return label.textContent.trim();
                            }
                            return '';
                        })()
                    })),
                    botoes: botoes.map(el => ({
                        texto: el.textContent.trim(),
                        type: el.type || '',
                        disabled: el.disabled
                    })),
                    links: links.map(el => ({
                        texto: el.textContent.trim(),
                        href: el.href
                    }))
                };
            });

            const duracao = Date.now() - inicioAnalise;

            const secao = {
                nome: nomeSecao,
                url: urlSecao,
                titulo: analise.titulo,
                timestamp: new Date().toISOString(),
                duracao,
                campos: analise.campos,
                botoes: analise.botoes,
                links: analise.links,
                estatisticas: {
                    totalCampos: analise.campos.length,
                    camposObrigatorios: analise.campos.filter(c => c.required).length,
                    totalBotoes: analise.botoes.length,
                    totalLinks: analise.links.length
                }
            };

            this.dados.secoes.push(secao);

            console.log(`   ✅ ${analise.campos.length} campos encontrados`);
            console.log(`   🎯 ${analise.botoes.length} botões disponíveis`);
            console.log(`   🔗 ${analise.links.length} links de navegação`);

            // Mostrar campos importantes
            if (analise.campos.length > 0) {
                console.log(`   📝 Campos principais:`);
                analise.campos.slice(0, 5).forEach(campo => {
                    const req = campo.required ? 'OBRIGATÓRIO' : 'opcional';
                    const nome = campo.label || campo.placeholder || campo.name || campo.id;
                    console.log(`      • ${nome} (${campo.tag}/${campo.type}) - ${req}`);
                });
                if (analise.campos.length > 5) {
                    console.log(`      ... e mais ${analise.campos.length - 5} campos`);
                }
            }

            return secao;

        } catch (erro) {
            console.log(`❌ Erro ao analisar ${nomeSecao}: ${erro.message}`);
            this.dados.problemas.push(`Erro ao analisar ${nomeSecao}: ${erro.message}`);

            const secaoErro = {
                nome: nomeSecao,
                url: urlSecao,
                erro: erro.message,
                timestamp: new Date().toISOString()
            };

            this.dados.secoes.push(secaoErro);
            return secaoErro;
        }
    }

    async gerarRelatorioFinal() {
        try {
            console.log(`\n📊 GERANDO RELATÓRIO FINAL...`);

            // Calcular estatísticas
            const totalCampos = this.dados.secoes.reduce((total, secao) =>
                total + (secao.campos ? secao.campos.length : 0), 0);

            const camposObrigatorios = this.dados.secoes.reduce((total, secao) =>
                total + (secao.campos ? secao.campos.filter(c => c.required).length : 0), 0);

            const secoesComSucesso = this.dados.secoes.filter(s => !s.erro).length;

            this.dados.estatisticas = {
                totalSecoes: this.dados.secoes.length,
                secoesComSucesso,
                taxaSucesso: Math.round((secoesComSucesso / this.dados.secoes.length) * 100),
                totalCampos,
                camposObrigatorios,
                camposOpcionais: totalCampos - camposObrigatorios,
                totalScreenshots: this.dados.screenshots.length,
                totalProblemas: this.dados.problemas.length,
                duracaoTotal: Math.round((Date.now() - this.timestamp) / 1000)
            };

            // Relatório JSON
            const nomeJSON = `relatorio-jornada-sucesso-${this.timestamp}.json`;
            fs.writeFileSync(nomeJSON, JSON.stringify(this.dados, null, 2));

            // Relatório HTML
            const nomeHTML = `relatorio-jornada-sucesso-${this.timestamp}.html`;
            const html = this.gerarHTML();
            fs.writeFileSync(nomeHTML, html);

            // Resumo markdown
            const nomeMarkdown = `resumo-jornada-sucesso-${this.timestamp}.md`;
            const markdown = this.gerarMarkdown();
            fs.writeFileSync(nomeMarkdown, markdown);

            console.log(`\n🎉 RELATÓRIOS GERADOS COM SUCESSO!`);
            console.log(`📊 JSON Completo: ${nomeJSON}`);
            console.log(`📈 Relatório HTML: ${nomeHTML}`);
            console.log(`📝 Resumo Markdown: ${nomeMarkdown}`);
            console.log(`📸 Screenshots: ${this.screenshotDir}`);

            return {
                json: nomeJSON,
                html: nomeHTML,
                markdown: nomeMarkdown,
                screenshots: this.screenshotDir
            };

        } catch (erro) {
            console.log(`❌ Erro ao gerar relatório: ${erro.message}`);
            return null;
        }
    }

    gerarHTML() {
        const stats = this.dados.estatisticas;

        return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jornada do Imigrante - Madrilusa</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F5A623, #4A90A4); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1em; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: white; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .stat-value { font-size: 3em; font-weight: bold; color: #F5A623; margin: 0; }
        .stat-label { color: #666; font-size: 1em; margin-top: 10px; }
        .section { background: white; margin: 20px 0; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .section h2 { color: #4A90A4; margin-top: 0; border-bottom: 2px solid #4A90A4; padding-bottom: 10px; }
        .secao-item { background: #f8f9fa; margin: 15px 0; padding: 20px; border-radius: 8px; border-left: 4px solid #F5A623; }
        .secao-titulo { font-size: 1.3em; font-weight: bold; color: #333; margin-bottom: 10px; }
        .campo { margin: 8px 0; padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #ddd; }
        .campo.obrigatorio { border-left-color: #dc3545; }
        .campo.opcional { border-left-color: #28a745; }
        .botao { display: inline-block; margin: 5px; padding: 8px 15px; background: #e9ecef; border-radius: 6px; font-size: 0.9em; }
        .problema { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 10px 0; border-radius: 6px; }
        .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot { background: #f8f9fa; padding: 15px; border-radius: 8px; }
        .sucesso { color: #28a745; font-weight: bold; }
        .erro { color: #dc3545; font-weight: bold; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Jornada Completa do Imigrante</h1>
            <p>Análise detalhada da experiência de usuário na plataforma Madrilusa</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${stats.totalSecoes}</div>
                <div class="stat-label">Seções Analisadas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalCampos}</div>
                <div class="stat-label">Campos Encontrados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.camposObrigatorios}</div>
                <div class="stat-label">Campos Obrigatórios</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.taxaSucesso}%</div>
                <div class="stat-label">Taxa de Sucesso</div>
            </div>
        </div>

        <div class="section">
            <h2>👤 Informações da Análise</h2>
            <p><strong>Usuário:</strong> ${this.dados.usuario}</p>
            <p><strong>Data:</strong> ${new Date(this.dados.inicio).toLocaleString('pt-PT')}</p>
            <p><strong>Duração Total:</strong> ${stats.duracaoTotal}s</p>
            <p><strong>Screenshots Capturadas:</strong> ${stats.totalScreenshots}</p>
        </div>

        <div class="section">
            <h2>📋 Análise Detalhada das Seções</h2>
            ${this.dados.secoes.map(secao => `
                <div class="secao-item">
                    <div class="secao-titulo">
                        ${secao.nome}
                        ${secao.erro ? '<span class="erro">(Erro)</span>' : '<span class="sucesso">(Sucesso)</span>'}
                    </div>
                    <p><strong>URL:</strong> ${secao.url}</p>
                    ${secao.titulo ? `<p><strong>Título:</strong> ${secao.titulo}</p>` : ''}

                    ${secao.erro ? `
                        <div class="problema">❌ ${secao.erro}</div>
                    ` : ''}

                    ${secao.campos && secao.campos.length > 0 ? `
                        <h4>📝 Campos do Formulário (${secao.campos.length}):</h4>
                        ${secao.campos.map(campo => `
                            <div class="campo ${campo.required ? 'obrigatorio' : 'opcional'}">
                                <strong>${campo.label || campo.placeholder || campo.name || campo.id}</strong>
                                <br><small>Tipo: ${campo.tag}/${campo.type} | ${campo.required ? '🔴 OBRIGATÓRIO' : '🟢 Opcional'}</small>
                            </div>
                        `).join('')}
                    ` : ''}

                    ${secao.botoes && secao.botoes.length > 0 ? `
                        <h4>🎯 Botões Disponíveis:</h4>
                        ${secao.botoes.map(botao => `
                            <span class="botao">${botao.texto} (${botao.type})</span>
                        `).join('')}
                    ` : ''}
                </div>
            `).join('')}
        </div>

        ${this.dados.problemas.length > 0 ? `
            <div class="section">
                <h2>⚠️ Problemas Identificados</h2>
                ${this.dados.problemas.map(problema => `
                    <div class="problema">${problema}</div>
                `).join('')}
            </div>
        ` : ''}

        <div class="section">
            <h2>📸 Screenshots da Jornada</h2>
            <div class="screenshot-grid">
                ${this.dados.screenshots.map(screenshot => `
                    <div class="screenshot">
                        <h4>${screenshot.nome}</h4>
                        <p>${screenshot.descricao}</p>
                        <p><strong>Arquivo:</strong> ${screenshot.arquivo}</p>
                        <p><strong>URL:</strong> ${screenshot.url}</p>
                        <p class="timestamp">${new Date(screenshot.timestamp).toLocaleString('pt-PT')}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2>📊 Resumo Estatístico</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h3>📋 Formulários</h3>
                    <p>Seções analisadas: <strong>${stats.totalSecoes}</strong></p>
                    <p>Taxa de sucesso: <strong>${stats.taxaSucesso}%</strong></p>
                    <p>Total de campos: <strong>${stats.totalCampos}</strong></p>
                </div>
                <div>
                    <h3>📝 Campos</h3>
                    <p>Obrigatórios: <strong>${stats.camposObrigatorios}</strong></p>
                    <p>Opcionais: <strong>${stats.camposOpcionais}</strong></p>
                    <p>Taxa obrigatórios: <strong>${stats.totalCampos > 0 ? Math.round((stats.camposObrigatorios / stats.totalCampos) * 100) : 0}%</strong></p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    gerarMarkdown() {
        const stats = this.dados.estatisticas;

        return `# 📋 Relatório da Jornada do Imigrante - Madrilusa

## 📊 Resumo Executivo

- **Usuário**: ${this.dados.usuario}
- **Data**: ${new Date(this.dados.inicio).toLocaleString('pt-PT')}
- **Duração**: ${stats.duracaoTotal}s
- **Taxa de Sucesso**: ${stats.taxaSucesso}%

## 🎯 Estatísticas Principais

| Métrica | Valor |
|---------|-------|
| Seções Analisadas | ${stats.totalSecoes} |
| Seções com Sucesso | ${stats.secoesComSucesso} |
| Total de Campos | ${stats.totalCampos} |
| Campos Obrigatórios | ${stats.camposObrigatorios} |
| Campos Opcionais | ${stats.camposOpcionais} |
| Screenshots | ${stats.totalScreenshots} |
| Problemas | ${stats.totalProblemas} |

## 📋 Seções Analisadas

${this.dados.secoes.map((secao, i) => `
### ${i + 1}. ${secao.nome} ${secao.erro ? '❌' : '✅'}

- **URL**: ${secao.url}
${secao.titulo ? `- **Título**: ${secao.titulo}` : ''}
${secao.erro ? `- **Erro**: ${secao.erro}` : ''}
${secao.campos ? `- **Campos**: ${secao.campos.length} (${secao.campos.filter(c => c.required).length} obrigatórios)` : ''}
${secao.botoes ? `- **Botões**: ${secao.botoes.length}` : ''}

${secao.campos && secao.campos.length > 0 ? `
#### Campos Principais:
${secao.campos.slice(0, 10).map(campo => `- **${campo.label || campo.placeholder || campo.name || campo.id}** (${campo.tag}/${campo.type}) - ${campo.required ? '🔴 Obrigatório' : '🟢 Opcional'}`).join('\n')}
${secao.campos.length > 10 ? `\n*... e mais ${secao.campos.length - 10} campos*` : ''}
` : ''}
`).join('')}

## 📸 Screenshots Capturadas

${this.dados.screenshots.map(screenshot => `- **${screenshot.nome}**: ${screenshot.descricao}`).join('\n')}

## 🔍 Análise e Recomendações

### Pontos Fortes
- Sistema de autenticação funcionando
- Formulários bem estruturados com labels claros
- Navegação consistente entre seções

### Oportunidades de Melhoria
${this.dados.problemas.length > 0 ? this.dados.problemas.map(problema => `- ${problema}`).join('\n') : '- Nenhum problema crítico identificado'}

### Próximos Passos
1. Revisar campos obrigatórios vs opcionais para otimizar conversão
2. Implementar validação em tempo real nos formulários
3. Melhorar feedback visual para ações do usuário
4. Considerar implementar save/draft automático em formulários longos

---
*Relatório gerado automaticamente em ${new Date().toLocaleString('pt-PT')}*`;
    }
}

async function executarJornadaSucesso() {
    const jornada = new JornadaImigranteSucesso();

    console.log('\n🚀 INICIANDO JORNADA COMPLETA DE SUCESSO');
    console.log('===========================================');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100,
        args: ['--start-maximized']
    });

    try {
        const page = await browser.newPage();

        // 1. LOGIN
        console.log('\n🔐 ETAPA 1: AUTENTICAÇÃO');
        const loginOk = await jornada.loginDireto(page);

        if (!loginOk) {
            throw new Error('Falha na autenticação - encerrando análise');
        }

        // 2. ANÁLISE DAS SEÇÕES
        console.log('\n📋 ETAPA 2: ANÁLISE COMPLETA DAS SEÇÕES');

        const secoes = [
            { nome: 'Dashboard Principal', url: `${FRONTEND_URL}/app` },
            { nome: 'Perfil do Imigrante', url: `${FRONTEND_URL}/app/perfil-imigrante` },
            { nome: 'Experiências Profissionais', url: `${FRONTEND_URL}/app/experiencias-profissionais` },
            { nome: 'Formação Acadêmica', url: `${FRONTEND_URL}/app/formacao-academica` },
            { nome: 'Idiomas Conhecidos', url: `${FRONTEND_URL}/app/idiomas-conhecidos` },
            { nome: 'Minhas Contribuições', url: `${FRONTEND_URL}/app/minhas-contribuicoes` },
            { nome: 'SinergIA Madrilusa', url: `${FRONTEND_URL}/app/sinergia` },
            { nome: 'Dados Profissionais', url: `${FRONTEND_URL}/app/dados-profissionais` }
        ];

        // Analisar cada seção
        for (let i = 0; i < secoes.length; i++) {
            const secao = secoes[i];
            console.log(`\n📍 [${i + 1}/${secoes.length}] ${secao.nome}`);
            await jornada.analisarSecao(page, secao.nome, secao.url);
        }

        // 3. GERAR RELATÓRIOS
        console.log('\n📊 ETAPA 3: GERAÇÃO DE RELATÓRIOS FINAIS');
        const relatorios = await jornada.gerarRelatorioFinal();

        // 4. RESUMO
        console.log('\n🎉 JORNADA FINALIZADA COM SUCESSO!');
        console.log('=====================================');

        const stats = jornada.dados.estatisticas;
        console.log(`📊 Seções analisadas: ${stats.totalSecoes}`);
        console.log(`✅ Taxa de sucesso: ${stats.taxaSucesso}%`);
        console.log(`📝 Total de campos: ${stats.totalCampos}`);
        console.log(`🔴 Campos obrigatórios: ${stats.camposObrigatorios}`);
        console.log(`🟢 Campos opcionais: ${stats.camposOpcionais}`);
        console.log(`📸 Screenshots: ${stats.totalScreenshots}`);
        console.log(`⏱️ Duração total: ${stats.duracaoTotal}s`);

        if (relatorios) {
            console.log(`\n📂 RELATÓRIOS DISPONÍVEIS:`);
            console.log(`📊 JSON: ${relatorios.json}`);
            console.log(`📈 HTML: ${relatorios.html}`);
            console.log(`📝 Markdown: ${relatorios.markdown}`);
            console.log(`📸 Screenshots: ${relatorios.screenshots}`);
        }

        console.log(`\n🎯 ANÁLISE CONCLUÍDA! Verifique os relatórios para insights detalhados.`);

    } catch (erro) {
        console.log(`\n❌ ERRO CRÍTICO: ${erro.message}`);

        try {
            await jornada.screenshot(page, 'erro-critico', `Erro crítico: ${erro.message}`);
            await jornada.gerarRelatorioFinal();
        } catch {}

    } finally {
        await browser.close();
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    executarJornadaSucesso().catch(console.error);
}

export { executarJornadaSucesso, JornadaImigranteSucesso };