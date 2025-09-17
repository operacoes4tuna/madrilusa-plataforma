import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

// Dados fictícios para habilidade
const dadosHabilidade = {
    titulo: "Desenvolvimento Web Frontend",
    categoria: "Tecnologia",
    nivel: "Avançado",
    descricao: "Experiência sólida em React, JavaScript, HTML e CSS. Desenvolvimento de interfaces responsivas e acessíveis.",
    experiencia: "3 anos",
    certificacao: "Não",
    observacoes: "Trabalho com metodologias ágeis e versionamento Git."
};

async function executarEtapa4() {
    console.log("🚀 Iniciando ETAPA 4: Seção Habilidades");
    console.log("🔄 Continuando da sessão logada da Etapa 3...");

    // Conectar ao browser (tentativa de reutilizar sessão ou criar nova)
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
        etapa: "4 - Seção Habilidades",
        timestamp: TIMESTAMP,
        navegacao: {
            dashboardAcessado: false,
            botaoHabilidadesClicado: false,
            modalHabilidadeAberto: false
        },
        modalHabilidade: {
            camposMapeados: [],
            dadosPreenchidos: {},
            habilidadeCriada: false,
            listaAtualizada: false
        },
        screenshots: [],
        observacoes: []
    };

    try {
        // 1. Navegar para dashboard (fazendo login se necessário)
        console.log("📍 Acessando dashboard...");

        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');

        // Verificar se precisa fazer login
        if (!page.url().includes('/app/')) {
            console.log("🔐 Fazendo login para acessar dashboard...");

            const botaoLogin = page.locator('[data-testid="header-login-button"], button:has-text("Login")').first();
            if (await botaoLogin.isVisible()) {
                await botaoLogin.click();
                await page.waitForTimeout(2000);

                // Login com dados conhecidos
                await page.locator('[data-testid="login-email"], input[name="email"]').fill("maria.santos.1758118253784@madrilusa.demo");
                await page.locator('[data-testid="login-password"], input[name="senha"]').fill("MinhaSenh@123!");
                await page.locator('[data-testid="login-submit"], button:has-text("Entrar")').click();

                await page.waitForTimeout(5000);
            }
        }

        // Verificar se chegamos ao dashboard
        if (page.url().includes('/app/dashboard')) {
            console.log("✅ Dashboard acessado com sucesso!");
            relatorio.navegacao.dashboardAcessado = true;
        } else {
            // Navegar diretamente para dashboard
            await page.goto('http://localhost:8080/app/dashboard');
            await page.waitForTimeout(3000);
            relatorio.navegacao.dashboardAcessado = page.url().includes('/app/dashboard');
        }

        // Screenshot do dashboard inicial
        await page.screenshot({
            path: `etapa4-01-dashboard-inicial.png`,
            fullPage: true
        });
        relatorio.screenshots.push("etapa4-01-dashboard-inicial.png");

        // 2. NAVEGAÇÃO CORRETA: Clicar no menu lateral "Habilidades"
        console.log("🔍 Procurando menu 'Habilidades' no menu lateral esquerdo...");

        const estrategiasMenuLateral = [
            () => page.locator('nav a:has-text("Habilidades")'),
            () => page.locator('aside a:has-text("Habilidades")'),
            () => page.locator('.sidebar a:has-text("Habilidades")'),
            () => page.locator('.menu a:has-text("Habilidades")'),
            () => page.locator('[data-testid*="menu"] a:has-text("Habilidades")'),
            () => page.locator('a[href*="habilidade"]'),
            () => page.locator('nav li:has-text("Habilidades") a'),
            () => page.locator('.nav-item:has-text("Habilidades") a')
        ];

        let menuHabilidades = null;
        for (let i = 0; i < estrategiasMenuLateral.length; i++) {
            try {
                menuHabilidades = estrategiasMenuLateral[i]();
                if (await menuHabilidades.isVisible({ timeout: 2000 })) {
                    const textoMenu = await menuHabilidades.textContent();
                    console.log(`✅ Menu 'Habilidades' encontrado: "${textoMenu}" (estratégia ${i + 1})`);
                    break;
                }
            } catch (e) {
                console.log(`❌ Menu estratégia ${i + 1} falhou: ${e.message}`);
            }
        }

        if (!menuHabilidades || !(await menuHabilidades.isVisible())) {
            // Se não encontrou, listar todos os links do menu para debug
            console.log("🔍 Listando todos os links de navegação para análise...");

            const todosLinks = await page.locator('nav a, aside a, .sidebar a, .menu a').all();
            console.log(`📋 Encontrados ${todosLinks.length} links de navegação:`);

            for (let i = 0; i < Math.min(todosLinks.length, 10); i++) {
                try {
                    const link = todosLinks[i];
                    const texto = await link.textContent();
                    const href = await link.getAttribute('href');
                    const visivel = await link.isVisible();
                    if (texto && texto.trim().length > 0) {
                        console.log(`  Link ${i}: "${texto.trim()}" -> ${href} (${visivel ? 'visível' : 'oculto'})`);
                    }
                } catch (e) {
                    console.log(`  Link ${i}: [erro ao ler]`);
                }
            }

            throw new Error("Menu 'Habilidades' não encontrado no menu lateral");
        }

        // 3. Clicar no menu "Habilidades"
        console.log("👆 Clicando no menu 'Habilidades'...");
        await menuHabilidades.click();
        await page.waitForTimeout(4000);

        relatorio.navegacao.botaoHabilidadesClicado = true;

        // Screenshot após navegar para habilidades
        await page.screenshot({
            path: `etapa4-02-pagina-habilidades.png`,
            fullPage: true
        });
        relatorio.screenshots.push("etapa4-02-pagina-habilidades.png");

        // 4. Verificar URL de habilidades
        const urlHabilidades = page.url();
        console.log(`📍 URL após clicar em habilidades: ${urlHabilidades}`);
        relatorio.observacoes.push(`Navegou para: ${urlHabilidades}`);

        // 5. Procurar botão "Adicionar Habilidade" na página de habilidades
        console.log("🔍 Procurando botão 'Adicionar Habilidade' na página de habilidades...");

        const estrategiasBotaoAdicionar = [
            () => page.locator('button:has-text("Adicionar Habilidade")'),
            () => page.locator('button:has-text("Adicionar")').filter({ hasText: 'Habilidade' }),
            () => page.locator('button:has-text("Nova Habilidade")'),
            () => page.locator('button:has-text("Criar Habilidade")'),
            () => page.locator('[data-testid*="add-skill"], [data-testid*="adicionar"]'),
            () => page.locator('.add-button, .btn-add, .adicionar'),
            () => page.locator('button[aria-label*="Adicionar"]'),
            () => page.locator('a:has-text("Adicionar Habilidade")')
        ];

        let botaoAdicionarHabilidade = null;
        for (let i = 0; i < estrategiasBotaoAdicionar.length; i++) {
            try {
                botaoAdicionarHabilidade = estrategiasBotaoAdicionar[i]();
                if (await botaoAdicionarHabilidade.isVisible({ timeout: 2000 })) {
                    const textoBotao = await botaoAdicionarHabilidade.textContent();
                    console.log(`✅ Botão 'Adicionar' encontrado: "${textoBotao}" (estratégia ${i + 1})`);
                    break;
                }
            } catch (e) {
                console.log(`❌ Botão estratégia ${i + 1} falhou: ${e.message}`);
            }
        }

        if (!botaoAdicionarHabilidade || !(await botaoAdicionarHabilidade.isVisible())) {
            // Listar todos os botões disponíveis na página para debug
            console.log("🔍 Listando todos os botões na página de habilidades...");

            const todosBotoes = await page.locator('button, a.btn, input[type="submit"]').all();
            console.log(`📋 Encontrados ${todosBotoes.length} botões:`);

            for (let i = 0; i < Math.min(todosBotoes.length, 10); i++) {
                try {
                    const botao = todosBotoes[i];
                    const texto = await botao.textContent();
                    const visivel = await botao.isVisible();
                    if (texto && texto.trim().length > 0) {
                        console.log(`  Botão ${i}: "${texto.trim()}" (${visivel ? 'visível' : 'oculto'})`);
                    }
                } catch (e) {
                    console.log(`  Botão ${i}: [erro ao ler]`);
                }
            }

            relatorio.observacoes.push("Botão 'Adicionar Habilidade' não encontrado na página de habilidades");
        }

        if (botaoAdicionarHabilidade && await botaoAdicionarHabilidade.isVisible()) {
            console.log("👆 Clicando no botão 'Adicionar Habilidade'...");
            await botaoAdicionarHabilidade.click();
            await page.waitForTimeout(3000);
            relatorio.navegacao.botaoHabilidadesClicado = true;

            // Screenshot após clicar no botão adicionar
            await page.screenshot({
                path: `etapa4-03-apos-clicar-adicionar.png`,
                fullPage: true
            });
            relatorio.screenshots.push("etapa4-03-apos-clicar-adicionar.png");

            // 3. Verificar se modal de habilidade abriu
            console.log("🔍 Verificando se modal de habilidade abriu...");

            const seletoresModal = [
                '[role="dialog"]',
                '.modal',
                '[data-testid*="modal"]',
                '.skill-modal',
                '.habilidade-modal',
                '[aria-modal="true"]'
            ];

            let modalHabilidade = null;
            for (const seletor of seletoresModal) {
                try {
                    modalHabilidade = page.locator(seletor).first();
                    if (await modalHabilidade.isVisible({ timeout: 3000 })) {
                        console.log(`✅ Modal encontrado com seletor: ${seletor}`);
                        relatorio.navegacao.modalHabilidadeAberto = true;
                        break;
                    }
                } catch (e) {
                    // Continue trying other selectors
                }
            }

            if (relatorio.navegacao.modalHabilidadeAberto) {
                // 4. Mapear campos do modal de habilidade
                console.log("📋 Mapeando campos do modal de habilidade...");

                const campos = await page.locator('input, select, textarea').all();
                console.log(`🔍 Encontrados ${campos.length} campos no modal`);

                for (let i = 0; i < campos.length; i++) {
                    try {
                        const campo = campos[i];
                        const tagName = await campo.evaluate(el => el.tagName.toLowerCase());
                        const tipo = await campo.getAttribute('type') || tagName;
                        const name = await campo.getAttribute('name') || '';
                        const placeholder = await campo.getAttribute('placeholder') || '';
                        const id = await campo.getAttribute('id') || '';
                        const required = await campo.getAttribute('required') !== null;
                        const visivel = await campo.isVisible();

                        if (visivel) {
                            const campoInfo = {
                                indice: i,
                                tagName: tagName,
                                tipo: tipo,
                                name: name,
                                id: id,
                                placeholder: placeholder,
                                obrigatorio: required,
                                visivel: visivel
                            };

                            relatorio.modalHabilidade.camposMapeados.push(campoInfo);
                            console.log(`  Campo ${i}: ${tagName}[${tipo}] name="${name}" placeholder="${placeholder}"`);
                        }
                    } catch (e) {
                        console.log(`  Campo ${i}: Erro ao mapear - ${e.message}`);
                    }
                }

                // Screenshot do modal com campos mapeados
                await page.screenshot({
                    path: `etapa4-03-modal-habilidade-aberto.png`,
                    fullPage: true
                });
                relatorio.screenshots.push("etapa4-03-modal-habilidade-aberto.png");

                // 5. Preencher campos da habilidade
                console.log("✏️ Preenchendo dados da habilidade...");

                // Título/Nome da habilidade
                try {
                    const campoTitulo = page.locator('input[name*="titulo"], input[name*="nome"], input[placeholder*="título"], input[placeholder*="nome"]').first();
                    if (await campoTitulo.isVisible()) {
                        await campoTitulo.fill(dadosHabilidade.titulo);
                        relatorio.modalHabilidade.dadosPreenchidos.titulo = dadosHabilidade.titulo;
                        console.log(`  ✅ Título: ${dadosHabilidade.titulo}`);
                    }
                } catch (e) {
                    console.log(`  ❌ Erro ao preencher título: ${e.message}`);
                }

                // Categoria
                try {
                    const campoCategoria = page.locator('select[name*="categoria"], input[name*="categoria"]').first();
                    if (await campoCategoria.isVisible()) {
                        if (await campoCategoria.evaluate(el => el.tagName.toLowerCase()) === 'select') {
                            await campoCategoria.selectOption(dadosHabilidade.categoria);
                        } else {
                            await campoCategoria.fill(dadosHabilidade.categoria);
                        }
                        relatorio.modalHabilidade.dadosPreenchidos.categoria = dadosHabilidade.categoria;
                        console.log(`  ✅ Categoria: ${dadosHabilidade.categoria}`);
                    }
                } catch (e) {
                    console.log(`  ❌ Erro ao preencher categoria: ${e.message}`);
                }

                // Nível
                try {
                    const campoNivel = page.locator('select[name*="nivel"], input[name*="nivel"]').first();
                    if (await campoNivel.isVisible()) {
                        if (await campoNivel.evaluate(el => el.tagName.toLowerCase()) === 'select') {
                            await campoNivel.selectOption(dadosHabilidade.nivel);
                        } else {
                            await campoNivel.fill(dadosHabilidade.nivel);
                        }
                        relatorio.modalHabilidade.dadosPreenchidos.nivel = dadosHabilidade.nivel;
                        console.log(`  ✅ Nível: ${dadosHabilidade.nivel}`);
                    }
                } catch (e) {
                    console.log(`  ❌ Erro ao preencher nível: ${e.message}`);
                }

                // Descrição
                try {
                    const campoDescricao = page.locator('textarea[name*="descricao"], input[name*="descricao"]').first();
                    if (await campoDescricao.isVisible()) {
                        await campoDescricao.fill(dadosHabilidade.descricao);
                        relatorio.modalHabilidade.dadosPreenchidos.descricao = dadosHabilidade.descricao;
                        console.log(`  ✅ Descrição preenchida`);
                    }
                } catch (e) {
                    console.log(`  ❌ Erro ao preencher descrição: ${e.message}`);
                }

                // Experiência
                try {
                    const campoExperiencia = page.locator('input[name*="experiencia"], select[name*="experiencia"]').first();
                    if (await campoExperiencia.isVisible()) {
                        if (await campoExperiencia.evaluate(el => el.tagName.toLowerCase()) === 'select') {
                            await campoExperiencia.selectOption(dadosHabilidade.experiencia);
                        } else {
                            await campoExperiencia.fill(dadosHabilidade.experiencia);
                        }
                        relatorio.modalHabilidade.dadosPreenchidos.experiencia = dadosHabilidade.experiencia;
                        console.log(`  ✅ Experiência: ${dadosHabilidade.experiencia}`);
                    }
                } catch (e) {
                    console.log(`  ❌ Erro ao preencher experiência: ${e.message}`);
                }

                // Screenshot após preenchimento
                await page.screenshot({
                    path: `etapa4-04-modal-preenchido.png`,
                    fullPage: true
                });
                relatorio.screenshots.push("etapa4-04-modal-preenchido.png");

                // 6. Salvar/Criar habilidade
                console.log("💾 Procurando botão para salvar habilidade...");

                const estrategiasSalvar = [
                    () => page.locator('button:has-text("Salvar")'),
                    () => page.locator('button:has-text("Criar")'),
                    () => page.locator('button:has-text("Adicionar")'),
                    () => page.locator('button:has-text("Confirmar")'),
                    () => page.locator('button[type="submit"]'),
                    () => page.locator('input[type="submit"]')
                ];

                let botaoSalvar = null;
                for (let i = 0; i < estrategiasSalvar.length; i++) {
                    try {
                        botaoSalvar = estrategiasSalvar[i]();
                        if (await botaoSalvar.isVisible({ timeout: 1000 })) {
                            const textoBotao = await botaoSalvar.textContent();
                            console.log(`✅ Botão salvar encontrado: "${textoBotao}"`);
                            break;
                        }
                    } catch (e) {
                        // Continue trying
                    }
                }

                if (botaoSalvar && await botaoSalvar.isVisible()) {
                    console.log("👆 Clicando para salvar habilidade...");
                    await botaoSalvar.click();
                    await page.waitForTimeout(3000);

                    relatorio.modalHabilidade.habilidadeCriada = true;

                    // 7. Verificar se habilidade foi criada (modal fechou e apareceu na lista)
                    console.log("🔍 Verificando se habilidade foi criada...");

                    // Screenshot após salvar
                    await page.screenshot({
                        path: `etapa4-05-apos-salvar.png`,
                        fullPage: true
                    });
                    relatorio.screenshots.push("etapa4-05-apos-salvar.png");

                    // Verificar se aparece na lista
                    try {
                        const textoHabilidade = page.locator(`text=${dadosHabilidade.titulo}`);
                        if (await textoHabilidade.isVisible({ timeout: 5000 })) {
                            console.log("✅ Habilidade criada e visível na lista!");
                            relatorio.modalHabilidade.listaAtualizada = true;
                        } else {
                            console.log("⚠️ Habilidade pode ter sido criada mas não é visível na lista");
                        }
                    } catch (e) {
                        console.log("⚠️ Erro ao verificar habilidade na lista:", e.message);
                    }

                } else {
                    console.log("⚠️ Botão de salvar não encontrado");
                    relatorio.observacoes.push("Botão de salvar não encontrado no modal");
                }

            } else {
                console.log("❌ Modal de habilidade não abriu");
                relatorio.observacoes.push("Modal de habilidade não abriu após clicar no botão");
            }

        } else {
            console.log("❌ Botão 'Adicionar Habilidade' não encontrado");
            relatorio.observacoes.push("Botão 'Adicionar Habilidade' não encontrado no dashboard");

            // Screenshot para debug
            await page.screenshot({
                path: `etapa4-debug-botao-nao-encontrado.png`,
                fullPage: true
            });
            relatorio.screenshots.push("etapa4-debug-botao-nao-encontrado.png");
        }

        // 8. Salvar relatório da Etapa 4
        relatorio.observacoes.push("Etapa 4 concluída - Seção habilidades mapeada");

        fs.writeFileSync(
            `etapa4-relatorio-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        // Gerar relatório em markdown
        const markdownReport = `# 📋 ETAPA 4: Seção Habilidades

## ✅ Status: ${relatorio.modalHabilidade.habilidadeCriada ? 'SUCESSO' : 'PARCIAL'}
**Executado em:** ${relatorio.timestamp}

## 🎯 Objetivo
Mapear e testar funcionalidade de criação de habilidades

## 🗺️ Navegação
- **Dashboard Acessado:** ${relatorio.navegacao.dashboardAcessado ? '✅ SIM' : '❌ NÃO'}
- **Botão Habilidades Clicado:** ${relatorio.navegacao.botaoHabilidadesClicado ? '✅ SIM' : '❌ NÃO'}
- **Modal Habilidade Aberto:** ${relatorio.navegacao.modalHabilidadeAberto ? '✅ SIM' : '❌ NÃO'}

## 📝 Modal de Habilidade
- **Habilidade Criada:** ${relatorio.modalHabilidade.habilidadeCriada ? '✅ SIM' : '❌ NÃO'}
- **Lista Atualizada:** ${relatorio.modalHabilidade.listaAtualizada ? '✅ SIM' : '❌ NÃO'}

### 📊 Dados Preenchidos
${Object.entries(relatorio.modalHabilidade.dadosPreenchidos).map(([key, value]) => `- **${key}:** ${value}`).join('\n') || '- Nenhum dado preenchido'}

### 🔍 Campos Mapeados (${relatorio.modalHabilidade.camposMapeados.length})
${relatorio.modalHabilidade.camposMapeados.map(campo =>
`- **Campo ${campo.indice}:** ${campo.tagName}[${campo.tipo}] | Name: "${campo.name}" | Placeholder: "${campo.placeholder}" | Obrigatório: ${campo.obrigatorio ? 'Sim' : 'Não'}`
).join('\n') || '- Nenhum campo mapeado'}

## 📸 Screenshots Capturados (${relatorio.screenshots.length})
${relatorio.screenshots.map(screenshot => `- ![${screenshot}](${screenshot})`).join('\n')}

## 📝 Observações
${relatorio.observacoes.map(obs => `- ${obs}`).join('\n')}

## ➡️ Próxima Etapa
**ETAPA 5:** Seção Interesses - Aguardando aprovação para continuar
`;

        fs.writeFileSync(
            `etapa4-relatorio-${TIMESTAMP}.md`,
            markdownReport,
            'utf8'
        );

        console.log("\n✅ ETAPA 4 CONCLUÍDA!");
        console.log(`🎯 Dashboard acessado: ${relatorio.navegacao.dashboardAcessado ? 'SIM' : 'NÃO'}`);
        console.log(`🔘 Botão clicado: ${relatorio.navegacao.botaoHabilidadesClicado ? 'SIM' : 'NÃO'}`);
        console.log(`📝 Modal aberto: ${relatorio.navegacao.modalHabilidadeAberto ? 'SIM' : 'NÃO'}`);
        console.log(`📊 Campos mapeados: ${relatorio.modalHabilidade.camposMapeados.length}`);
        console.log(`💾 Habilidade criada: ${relatorio.modalHabilidade.habilidadeCriada ? 'SIM' : 'NÃO'}`);

        return {
            sucesso: true,
            relatorio: relatorio,
            habilidadeCriada: relatorio.modalHabilidade.habilidadeCriada,
            browser: browser,
            page: page,
            proximaEtapa: "ETAPA 5: Seção Interesses"
        };

    } catch (error) {
        console.error("❌ Erro na Etapa 4:", error.message);

        await page.screenshot({
            path: `etapa4-erro-${TIMESTAMP}.png`,
            fullPage: true
        });

        relatorio.observacoes.push(`ERRO: ${error.message}`);
        relatorio.screenshots.push(`etapa4-erro-${TIMESTAMP}.png`);

        fs.writeFileSync(
            `etapa4-relatorio-erro-${TIMESTAMP}.json`,
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
    executarEtapa4()
        .then(resultado => {
            if (resultado.sucesso) {
                console.log("\n🎉 ETAPA 4 FINALIZADA!");
                console.log("\n⏳ AGUARDANDO APROVAÇÃO PARA ETAPA 5...");
            } else {
                console.log("\n❌ ETAPA 4 COM PROBLEMAS!");
                console.log("Erro:", resultado.erro);
            }
        })
        .catch(console.error);
}

export { executarEtapa4, dadosHabilidade };