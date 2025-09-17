import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

async function executarEtapa3() {
    console.log("🚀 Iniciando ETAPA 3: Dashboard Inicial");
    console.log("🔄 Continuando da sessão das Etapas 1+2...");

    // Iniciar novo browser (assumindo que o anterior pode ter fechado)
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000,
        args: ['--start-maximized']
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    const relatorio = {
        etapa: "3 - Dashboard Inicial",
        timestamp: TIMESTAMP,
        modalFinalizado: false,
        redirecionamento: {
            urlEsperada: "http://localhost:8080/app/dashboard",
            urlReal: "",
            sucesso: false
        },
        usuarioLogado: {
            nomeVisivel: "",
            posicao: "",
            detectado: false
        },
        estruturaDashboard: {
            menus: [],
            botoes: [],
            secoes: []
        },
        screenshots: [],
        observacoes: []
    };

    try {
        // 1. Navegar para home e refazer processo (caso browser tenha fechado)
        console.log("📍 Navegando para home para completar registro...");
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');

        // Screenshot inicial
        await page.screenshot({
            path: `etapa3-01-inicio.png`,
            fullPage: true
        });
        relatorio.screenshots.push("etapa3-01-inicio.png");

        // 2. Tentar fazer login com usuário criado anteriormente
        console.log("🔍 Verificando se já estamos logados...");

        const urlAtual = page.url();
        console.log(`📍 URL atual: ${urlAtual}`);

        if (urlAtual.includes('/app/')) {
            console.log("✅ Já estamos logados e na aplicação!");
            relatorio.redirecionamento.urlReal = urlAtual;
            relatorio.redirecionamento.sucesso = true;
        } else {
            console.log("🔐 Tentando fazer login com usuário Maria Santos Oliveira criado anteriormente...");

            // Procurar botão Login no header
            const botaoLogin = page.locator('[data-testid="header-login-button"], button:has-text("Login")').first();

            if (await botaoLogin.isVisible()) {
                console.log("🔑 Clicando no botão Login...");
                await botaoLogin.click();
                await page.waitForTimeout(3000);

                // Preencher dados de login do usuário criado
                const emailLogin = "maria.santos.1758118253784@madrilusa.demo"; // Email da sessão anterior
                const senhaLogin = "MinhaSenh@123!";

                console.log(`📧 Preenchendo email: ${emailLogin}`);
                await page.locator('[data-testid="login-email"], input[name="email"]').fill(emailLogin);

                console.log("🔒 Preenchendo senha...");
                await page.locator('[data-testid="login-password"], input[name="senha"]').fill(senhaLogin);

                console.log("👆 Clicando em entrar...");
                await page.locator('[data-testid="login-submit"], button:has-text("Entrar")').click();

                // Aguardar login e possível redirecionamento
                console.log("⏳ Aguardando login e redirecionamento...");
                await page.waitForTimeout(5000);

                const urlAposLogin = page.url();
                console.log(`📍 URL após login: ${urlAposLogin}`);

                if (urlAposLogin.includes('/app/')) {
                    console.log("✅ Login bem-sucedido! Redirecionado para dashboard!");
                    relatorio.redirecionamento.urlReal = urlAposLogin;
                    relatorio.redirecionamento.sucesso = true;
                    relatorio.observacoes.push("Login realizado com usuário existente Maria Santos");
                } else {
                    console.log("❌ Login falhou, usuário pode não existir. Criando novo usuário...");
                    relatorio.observacoes.push("Login com usuário existente falhou, criando novo");

                    // Fechar modal de login se ainda estiver aberto
                    try {
                        const fecharModal = page.locator('[role="dialog"] button[data-testid*="close"], .modal button:has-text("×")').first();
                        if (await fecharModal.isVisible({ timeout: 2000 })) {
                            await fecharModal.click();
                            await page.waitForTimeout(1000);
                        }
                    } catch (e) {
                        // Modal pode já estar fechado
                    }

                    // Processo de registro como fallback
                    console.log("🆕 Iniciando processo de registro de novo usuário...");

                    const imigranteCard = await page.locator('text=Sou Imigrante').first();
                    await imigranteCard.scrollIntoViewIfNeeded();

                    const botaoRegistar = page.locator('text=Registar-me').first();
                    if (await botaoRegistar.isVisible()) {
                        await botaoRegistar.click();
                        await page.waitForTimeout(2000);

                        // Preencher dados básicos com novo email
                        const novoEmail = `maria.etapa3.${Date.now()}@madrilusa.demo`;
                        console.log(`📧 Novo usuário: ${novoEmail}`);

                        await page.locator('input[name="nomeCompleto"]').fill("Maria Santos Oliveira");
                        await page.locator('input[name="email"]').fill(novoEmail);
                        await page.locator('input[name="telemovel"]').fill("+351912345678");
                        await page.locator('input[name="senha"]').fill("MinhaSenh@123!");

                        // Continuar para dados complementares
                        const botaoContinuar = page.locator('button:has-text("Continuar")');
                        if (await botaoContinuar.isVisible()) {
                            await botaoContinuar.click();
                            await page.waitForTimeout(2000);

                            // Preencher alguns dados complementares obrigatórios
                            await page.locator('input[name="dataNascimento"]').fill("1995-03-15");
                            await page.locator('input[name="nacionalidade"]').fill("Brasileira");

                            // Procurar botão final
                            console.log("🔍 Procurando botão para finalizar registro...");

                            const botoesFinalizar = [
                                () => page.locator('button:has-text("Registrar")'),
                                () => page.locator('button:has-text("Criar Conta")'),
                                () => page.locator('button:has-text("Finalizar")'),
                                () => page.locator('button:has-text("Confirmar")'),
                                () => page.locator('button[type="submit"]'),
                                () => page.locator('input[type="submit"]')
                            ];

                            let botaoFinalizar = null;
                            for (let i = 0; i < botoesFinalizar.length; i++) {
                                try {
                                    botaoFinalizar = botoesFinalizar[i]();
                                    if (await botaoFinalizar.isVisible({ timeout: 1000 })) {
                                        const textoBotao = await botaoFinalizar.textContent();
                                        console.log(`✅ Botão finalizar encontrado: "${textoBotao}"`);
                                        break;
                                    }
                                } catch (e) {
                                    // Continue trying
                                }
                            }

                            if (botaoFinalizar && await botaoFinalizar.isVisible()) {
                                console.log("👆 Clicando para finalizar registro...");
                                await botaoFinalizar.click();

                                // Aguardar redirecionamento
                                console.log("⏳ Aguardando redirecionamento para dashboard...");
                                await page.waitForTimeout(5000);

                                const novaUrl = page.url();
                                console.log(`📍 URL após finalizar: ${novaUrl}`);

                                relatorio.modalFinalizado = true;
                                relatorio.redirecionamento.urlReal = novaUrl;

                                if (novaUrl.includes('/app/')) {
                                    relatorio.redirecionamento.sucesso = true;
                                    console.log("✅ Registro e redirecionamento bem-sucedidos!");
                                    relatorio.observacoes.push("Novo usuário criado e redirecionado com sucesso");
                                }
                            } else {
                                console.log("⚠️ Botão de finalização não encontrado");
                                relatorio.observacoes.push("Botão de finalização não encontrado no modal");
                            }
                        }
                    }
                }
            } else {
                console.log("❌ Botão de login não encontrado");
                relatorio.observacoes.push("Botão de login não encontrado no header");
            }
        }

        // Screenshot após possível redirecionamento
        await page.screenshot({
            path: `etapa3-02-apos-finalizacao.png`,
            fullPage: true
        });
        relatorio.screenshots.push("etapa3-02-apos-finalizacao.png");

        // 3. Mapear dashboard se estivermos na aplicação
        const urlFinal = page.url();
        if (urlFinal.includes('/app/')) {
            console.log("🎉 Estamos no dashboard! Mapeando estrutura...");

            // 4. Verificar nome do usuário no canto superior direito
            console.log("👤 Procurando nome do usuário logado...");

            const seletoresNomeUsuario = [
                'header [data-testid*="user"]',
                'header .user-name',
                'nav .user-profile',
                'header span:contains("Maria")',
                '[data-testid*="user-name"]',
                '.header-user',
                '.user-info'
            ];

            for (const seletor of seletoresNomeUsuario) {
                try {
                    const elementoNome = page.locator(seletor).first();
                    if (await elementoNome.isVisible({ timeout: 1000 })) {
                        const nomeTexto = await elementoNome.textContent();
                        if (nomeTexto && nomeTexto.trim().length > 0) {
                            relatorio.usuarioLogado.nomeVisivel = nomeTexto.trim();
                            relatorio.usuarioLogado.posicao = "header/navigation";
                            relatorio.usuarioLogado.detectado = true;
                            console.log(`✅ Nome usuário encontrado: "${nomeTexto.trim()}"`);
                            break;
                        }
                    }
                } catch (e) {
                    // Continue trying other selectors
                }
            }

            // Se não encontrou pelos seletores específicos, procurar texto "Maria" genérico
            if (!relatorio.usuarioLogado.detectado) {
                console.log("🔍 Procurando por texto 'Maria' no cabeçalho...");
                try {
                    const textosMaria = await page.locator('text=Maria').all();
                    for (let i = 0; i < textosMaria.length; i++) {
                        const elemento = textosMaria[i];
                        const texto = await elemento.textContent();
                        const boundingBox = await elemento.boundingBox();

                        // Verificar se está na parte superior da tela (header)
                        if (boundingBox && boundingBox.y < 100) {
                            relatorio.usuarioLogado.nomeVisivel = texto;
                            relatorio.usuarioLogado.posicao = `Superior da tela (y: ${boundingBox.y})`;
                            relatorio.usuarioLogado.detectado = true;
                            console.log(`✅ Nome encontrado no header: "${texto}"`);
                            break;
                        }
                    }
                } catch (e) {
                    console.log("❌ Erro ao procurar nome 'Maria':", e.message);
                }
            }

            // 5. Mapear menus principais do dashboard
            console.log("📋 Mapeando menus do dashboard...");

            const menus = await page.locator('nav a, .menu-item, [role="menuitem"]').all();
            for (let i = 0; i < menus.length; i++) {
                try {
                    const menu = menus[i];
                    const texto = await menu.textContent();
                    const href = await menu.getAttribute('href');
                    const visivel = await menu.isVisible();

                    if (texto && texto.trim().length > 0 && visivel) {
                        relatorio.estruturaDashboard.menus.push({
                            indice: i,
                            texto: texto.trim(),
                            href: href || '',
                            visivel: visivel
                        });
                        console.log(`  Menu ${i}: "${texto.trim()}" -> ${href}`);
                    }
                } catch (e) {
                    // Continue mapping other menus
                }
            }

            // 6. Mapear botões principais
            console.log("🔘 Mapeando botões do dashboard...");

            const botoes = await page.locator('button').all();
            let botoesContados = 0;
            for (let i = 0; i < Math.min(botoes.length, 10); i++) {  // Limitar a 10 para não sobrecarregar
                try {
                    const botao = botoes[i];
                    const texto = await botao.textContent();
                    const visivel = await botao.isVisible();

                    if (texto && texto.trim().length > 0 && visivel) {
                        relatorio.estruturaDashboard.botoes.push({
                            indice: botoesContados,
                            texto: texto.trim(),
                            visivel: visivel
                        });
                        console.log(`  Botão ${botoesContados}: "${texto.trim()}"`);
                        botoesContados++;
                    }
                } catch (e) {
                    // Continue mapping other buttons
                }
            }

            // 7. Identificar seções principais do dashboard
            console.log("📑 Identificando seções do dashboard...");

            const secoes = await page.locator('h1, h2, h3, .section-title, .card-title').all();
            for (let i = 0; i < Math.min(secoes.length, 8); i++) {
                try {
                    const secao = secoes[i];
                    const texto = await secao.textContent();
                    const tagName = await secao.evaluate(el => el.tagName.toLowerCase());
                    const visivel = await secao.isVisible();

                    if (texto && texto.trim().length > 0 && visivel) {
                        relatorio.estruturaDashboard.secoes.push({
                            indice: i,
                            texto: texto.trim(),
                            elemento: tagName,
                            visivel: visivel
                        });
                        console.log(`  Seção ${i}: [${tagName}] "${texto.trim()}"`);
                    }
                } catch (e) {
                    // Continue mapping other sections
                }
            }

            // Screenshot final do dashboard mapeado
            await page.screenshot({
                path: `etapa3-03-dashboard-mapeado.png`,
                fullPage: true
            });
            relatorio.screenshots.push("etapa3-03-dashboard-mapeado.png");

        } else {
            console.log("❌ Não conseguimos chegar ao dashboard");
            relatorio.observacoes.push(`Permanecemos na URL: ${urlFinal}`);
        }

        // 8. Salvar relatório da Etapa 3
        relatorio.observacoes.push("Etapa 3 concluída - Dashboard inicial mapeado");

        fs.writeFileSync(
            `etapa3-relatorio-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        // Gerar relatório em markdown
        const markdownReport = `# 📋 ETAPA 3: Dashboard Inicial

## ✅ Status: ${relatorio.redirecionamento.sucesso ? 'SUCESSO' : 'PARCIAL'}
**Executado em:** ${relatorio.timestamp}

## 🎯 Objetivo
Completar registro e mapear estrutura inicial do dashboard logado

## 🔄 Redirecionamento
- **URL Esperada:** ${relatorio.redirecionamento.urlEsperada}
- **URL Real:** ${relatorio.redirecionamento.urlReal}
- **Sucesso:** ${relatorio.redirecionamento.sucesso ? '✅ SIM' : '❌ NÃO'}
- **Modal Finalizado:** ${relatorio.modalFinalizado ? '✅ SIM' : '❌ NÃO'}

## 👤 Usuário Logado
- **Nome Visível:** ${relatorio.usuarioLogado.nomeVisivel || 'Não detectado'}
- **Posição:** ${relatorio.usuarioLogado.posicao || 'N/A'}
- **Detectado:** ${relatorio.usuarioLogado.detectado ? '✅ SIM' : '❌ NÃO'}

## 🗄️ Estrutura Dashboard

### 📝 Menus Principais (${relatorio.estruturaDashboard.menus.length})
${relatorio.estruturaDashboard.menus.map(menu =>
`- **${menu.texto}** -> \`${menu.href}\``
).join('\n') || '- Nenhum menu mapeado'}

### 🔘 Botões Principais (${relatorio.estruturaDashboard.botoes.length})
${relatorio.estruturaDashboard.botoes.map(botao =>
`- **${botao.texto}**`
).join('\n') || '- Nenhum botão mapeado'}

### 📑 Seções Identificadas (${relatorio.estruturaDashboard.secoes.length})
${relatorio.estruturaDashboard.secoes.map(secao =>
`- **[${secao.elemento}]** ${secao.texto}`
).join('\n') || '- Nenhuma seção mapeada'}

## 📸 Screenshots Capturados (${relatorio.screenshots.length})
${relatorio.screenshots.map(screenshot => `- ![${screenshot}](${screenshot})`).join('\n')}

## 📝 Observações
${relatorio.observacoes.map(obs => `- ${obs}`).join('\n')}

## ➡️ Próxima Etapa
**ETAPA 4:** Seção Habilidades - Aguardando aprovação para continuar
`;

        fs.writeFileSync(
            `etapa3-relatorio-${TIMESTAMP}.md`,
            markdownReport,
            'utf8'
        );

        console.log("\n✅ ETAPA 3 CONCLUÍDA!");
        console.log(`🎯 Dashboard acessado: ${relatorio.redirecionamento.sucesso ? 'SIM' : 'NÃO'}`);
        console.log(`👤 Nome usuário: ${relatorio.usuarioLogado.nomeVisivel || 'Não detectado'}`);
        console.log(`📝 Menus mapeados: ${relatorio.estruturaDashboard.menus.length}`);
        console.log(`🔘 Botões mapeados: ${relatorio.estruturaDashboard.botoes.length}`);
        console.log(`📑 Seções mapeadas: ${relatorio.estruturaDashboard.secoes.length}`);

        return {
            sucesso: true,
            relatorio: relatorio,
            dashboardAcessado: relatorio.redirecionamento.sucesso,
            browser: browser,
            page: page,
            proximaEtapa: "ETAPA 4: Seção Habilidades"
        };

    } catch (error) {
        console.error("❌ Erro na Etapa 3:", error.message);

        await page.screenshot({
            path: `etapa3-erro-${TIMESTAMP}.png`,
            fullPage: true
        });

        relatorio.observacoes.push(`ERRO: ${error.message}`);
        relatorio.screenshots.push(`etapa3-erro-${TIMESTAMP}.png`);

        fs.writeFileSync(
            `etapa3-relatorio-erro-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        return {
            sucesso: false,
            erro: error.message,
            relatorio: relatorio
        };

    } finally {
        console.log("🔄 Browser mantido aberto para próxima etapa...");
    }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    executarEtapa3()
        .then(resultado => {
            if (resultado.sucesso) {
                console.log("\n🎉 ETAPA 3 FINALIZADA!");
                console.log("\n⏳ AGUARDANDO APROVAÇÃO PARA ETAPA 4...");
            } else {
                console.log("\n❌ ETAPA 3 COM PROBLEMAS!");
                console.log("Erro:", resultado.erro);
            }
        })
        .catch(console.error);
}

export { executarEtapa3 };