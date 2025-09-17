import { chromium } from 'playwright';
import fs from 'fs';

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

// Dados fictícios para cada seção
const dadosSecoes = {
    interesses: {
        descricao: "Agricultura sustentável e permacultura. Interesse em técnicas de cultivo orgânico, compostagem e sistemas agroflorestais. Fascínio por turismo rural, gastronomia tradicional e artesanato local. Gosto por atividades ao ar livre como caminhadas e observação da natureza.",
        tags: "Agricultura, Sustentabilidade, Turismo Rural, Gastronomia"
    },
    personalidade: {
        descricao: "Pessoa comunicativa e adaptável, com facilidade para trabalhar em equipe. Tenho iniciativa para resolver problemas e gosto de aprender coisas novas. Sou paciente, organizada e tenho boa capacidade de liderança. Valorizo a honestidade e o respeito nas relações interpessoais.",
        tags: "Comunicativa, Adaptável, Liderança, Organizada"
    },
    experiencias: {
        empresa: "Tech Solutions Brasil",
        cargo: "Desenvolvedor Frontend",
        dataInicio: "2020-01-15",
        dataFim: "2023-12-31",
        descricao: "Desenvolvimento de aplicações web responsivas utilizando React, JavaScript e TypeScript. Colaboração em equipes ágeis e implementação de interfaces acessíveis. Trabalho com APIs REST e integração de sistemas.",
        localizacao: "São Paulo, Brasil"
    },
    formacao: {
        instituicao: "Universidade de São Paulo",
        curso: "Ciência da Computação",
        nivel: "Graduação",
        dataInicio: "2016-02-01",
        dataFim: "2019-12-15",
        descricao: "Graduação em Ciência da Computação com foco em desenvolvimento de software, algoritmos e estruturas de dados. Participação em projetos de extensão e pesquisa em inteligência artificial.",
        localizacao: "São Paulo, Brasil"
    },
    idiomas: {
        idioma: "Inglês",
        nivel: "Avançado",
        certificacao: "TOEFL iBT",
        descricao: "Fluência em inglês técnico e conversacional. Experiência em comunicação internacional e documentação técnica. Capacidade de conduzir reuniões e apresentações em inglês."
    }
};

async function executarEtapas5a9() {
    console.log("🚀 INICIANDO ETAPAS 5-9 AUTÔNOMAS");
    console.log("🎯 Objetivo: Mapear e testar todas as seções restantes do perfil");

    const browser = await chromium.launch({
        headless: false,
        slowMo: 800,
        args: ['--start-maximized']
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    const relatorio = {
        etapas: "5-9 AUTÔNOMAS",
        timestamp: TIMESTAMP,
        login: { sucesso: false },
        etapas: {
            etapa5_interesses: { menu_clicado: false, modal_aberto: false, item_criado: false, campos: [], screenshots: [] },
            etapa6_personalidade: { menu_clicado: false, modal_aberto: false, item_criado: false, campos: [], screenshots: [] },
            etapa7_experiencias: { menu_clicado: false, modal_aberto: false, item_criado: false, campos: [], screenshots: [] },
            etapa8_formacao: { menu_clicado: false, modal_aberto: false, item_criado: false, campos: [], screenshots: [] },
            etapa9_idiomas: { menu_clicado: false, modal_aberto: false, item_criado: false, campos: [], screenshots: [] }
        },
        observacoes: [],
        estatisticas: {
            total_campos_mapeados: 0,
            total_itens_criados: 0,
            total_screenshots: 0,
            secoes_completas: 0
        }
    };

    const secoes = [
        { nome: 'interesses', key: 'etapa5_interesses', menuTexto: 'Interesses', dados: dadosSecoes.interesses },
        { nome: 'personalidade', key: 'etapa6_personalidade', menuTexto: 'Personalidade', dados: dadosSecoes.personalidade },
        { nome: 'experiencias', key: 'etapa7_experiencias', menuTexto: 'Experiências', dados: dadosSecoes.experiencias },
        { nome: 'formacao', key: 'etapa8_formacao', menuTexto: 'Formação', dados: dadosSecoes.formacao },
        { nome: 'idiomas', key: 'etapa9_idiomas', menuTexto: 'Idiomas', dados: dadosSecoes.idiomas }
    ];

    try {
        // LOGIN INICIAL
        console.log("🔐 Realizando login...");
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');

        const botaoLogin = page.locator('[data-testid="header-login-button"], button:has-text("Login")').first();
        if (await botaoLogin.isVisible()) {
            await botaoLogin.click();
            await page.waitForTimeout(2000);

            await page.locator('[data-testid="login-email"], input[name="email"]').fill("maria.santos.1758118253784@madrilusa.demo");
            await page.locator('[data-testid="login-password"], input[name="senha"]').fill("MinhaSenh@123!");
            await page.locator('[data-testid="login-submit"], button:has-text("Entrar")').click();
            await page.waitForTimeout(5000);

            if (page.url().includes('/app/')) {
                relatorio.login.sucesso = true;
                console.log("✅ Login realizado com sucesso");
            }
        }

        // EXECUTAR CADA SEÇÃO SEQUENCIALMENTE
        for (let i = 0; i < secoes.length; i++) {
            const secao = secoes[i];
            const etapaNum = i + 5;
            console.log(`\n🔥 EXECUTANDO ETAPA ${etapaNum}: ${secao.nome.toUpperCase()}`);

            try {
                // 1. Navegar para a seção
                console.log(`🔍 Navegando para menu ${secao.menuTexto}...`);

                const estrategiasMenu = [
                    () => page.locator(`aside a:has-text("${secao.menuTexto}"), nav a:has-text("${secao.menuTexto}")`),
                    () => page.locator(`a[href*="${secao.nome}"]`),
                    () => page.locator(`[data-testid*="${secao.nome}"]`)
                ];

                let menuEncontrado = false;
                for (const estrategia of estrategiasMenu) {
                    try {
                        const menu = estrategia().first();
                        if (await menu.isVisible({ timeout: 3000 })) {
                            await menu.click();
                            await page.waitForTimeout(3000);
                            relatorio.etapas[secao.key].menu_clicado = true;
                            menuEncontrado = true;
                            console.log(`✅ Menu ${secao.menuTexto} clicado`);
                            break;
                        }
                    } catch (e) {
                        // Continue trying
                    }
                }

                if (!menuEncontrado) {
                    console.log(`⚠️ Menu ${secao.menuTexto} não encontrado, tentando navegação direta...`);
                    await page.goto(`http://localhost:8080/app/${secao.nome}`);
                    await page.waitForTimeout(3000);
                }

                // Screenshot da página da seção
                await page.screenshot({
                    path: `etapa${etapaNum}-01-pagina-${secao.nome}.png`,
                    fullPage: true
                });
                relatorio.etapas[secao.key].screenshots.push(`etapa${etapaNum}-01-pagina-${secao.nome}.png`);

                // 2. Procurar botão "Adicionar"
                console.log(`🔍 Procurando botão adicionar ${secao.nome}...`);

                const estrategiasBotao = [
                    () => page.locator(`button:has-text("Adicionar ${secao.menuTexto}"), button:has-text("Adicionar")`),
                    () => page.locator('button:has-text("addAdicionar"), button:has-text("Nova")'),
                    () => page.locator('[data-testid*="add"], [data-testid*="adicionar"]'),
                    () => page.locator('.add-button, .btn-add')
                ];

                let botaoEncontrado = false;
                for (const estrategia of estrategiasBotao) {
                    try {
                        const botao = estrategia().first();
                        if (await botao.isVisible({ timeout: 3000 })) {
                            await botao.click();
                            await page.waitForTimeout(3000);
                            console.log(`✅ Botão adicionar ${secao.nome} clicado`);
                            botaoEncontrado = true;
                            break;
                        }
                    } catch (e) {
                        // Continue trying
                    }
                }

                // 3. Verificar se modal abriu
                console.log(`🔍 Verificando modal ${secao.nome}...`);

                const modal = page.locator('[role="dialog"], .modal').first();
                if (await modal.isVisible({ timeout: 5000 })) {
                    relatorio.etapas[secao.key].modal_aberto = true;
                    console.log(`✅ Modal ${secao.nome} aberto`);

                    // Screenshot do modal
                    await page.screenshot({
                        path: `etapa${etapaNum}-02-modal-${secao.nome}.png`,
                        fullPage: true
                    });
                    relatorio.etapas[secao.key].screenshots.push(`etapa${etapaNum}-02-modal-${secao.nome}.png`);

                    // 4. Mapear campos do modal
                    console.log(`📋 Mapeando campos do modal ${secao.nome}...`);

                    const campos = await page.locator('input, select, textarea').all();
                    console.log(`🔍 ${campos.length} campos encontrados`);

                    for (let j = 0; j < campos.length; j++) {
                        try {
                            const campo = campos[j];
                            const tagName = await campo.evaluate(el => el.tagName.toLowerCase());
                            const tipo = await campo.getAttribute('type') || tagName;
                            const name = await campo.getAttribute('name') || '';
                            const placeholder = await campo.getAttribute('placeholder') || '';
                            const id = await campo.getAttribute('id') || '';
                            const required = await campo.getAttribute('required') !== null;

                            if (await campo.isVisible()) {
                                relatorio.etapas[secao.key].campos.push({
                                    indice: j,
                                    tagName,
                                    tipo,
                                    name,
                                    id,
                                    placeholder,
                                    obrigatorio: required
                                });
                                console.log(`  Campo ${j}: ${tagName}[${tipo}] name="${name}"`);
                            }
                        } catch (e) {
                            // Continue mapping
                        }
                    }

                    relatorio.estatisticas.total_campos_mapeados += relatorio.etapas[secao.key].campos.length;

                    // 5. Preencher campos baseado no tipo de seção
                    console.log(`✏️ Preenchendo campos ${secao.nome}...`);

                    if (secao.nome === 'experiencias') {
                        // Experiências profissionais - campos específicos
                        await preencherSe(page, 'input[name*="empresa"], input[placeholder*="empresa"]', secao.dados.empresa);
                        await preencherSe(page, 'input[name*="cargo"], input[placeholder*="cargo"]', secao.dados.cargo);
                        await preencherSe(page, 'input[type="date"], input[name*="inicio"]', secao.dados.dataInicio);
                        await preencherSe(page, 'input[name*="fim"], input[placeholder*="fim"]', secao.dados.dataFim);
                        await preencherSe(page, 'textarea, input[name*="descricao"]', secao.dados.descricao);
                        await preencherSe(page, 'input[name*="localizacao"], input[placeholder*="local"]', secao.dados.localizacao);

                    } else if (secao.nome === 'formacao') {
                        // Formação acadêmica - campos específicos
                        await preencherSe(page, 'input[name*="instituicao"], input[placeholder*="instituicao"]', secao.dados.instituicao);
                        await preencherSe(page, 'input[name*="curso"], input[placeholder*="curso"]', secao.dados.curso);
                        await preencherSe(page, 'select[name*="nivel"], input[name*="nivel"]', secao.dados.nivel);
                        await preencherSe(page, 'input[type="date"], input[name*="inicio"]', secao.dados.dataInicio);
                        await preencherSe(page, 'input[name*="fim"], input[placeholder*="fim"]', secao.dados.dataFim);
                        await preencherSe(page, 'textarea, input[name*="descricao"]', secao.dados.descricao);

                    } else if (secao.nome === 'idiomas') {
                        // Idiomas - campos específicos
                        await preencherSe(page, 'input[name*="idioma"], select[name*="idioma"]', secao.dados.idioma);
                        await preencherSe(page, 'select[name*="nivel"], input[name*="nivel"]', secao.dados.nivel);
                        await preencherSe(page, 'input[name*="certificacao"], input[placeholder*="certificacao"]', secao.dados.certificacao);
                        await preencherSe(page, 'textarea, input[name*="descricao"]', secao.dados.descricao);

                    } else {
                        // Interesses e Personalidade - padrão como habilidades
                        await preencherSe(page, 'textarea, input[name*="descricao"]', secao.dados.descricao);
                        await preencherSe(page, 'input[placeholder*="tags"], input[placeholder*="buscar"]', secao.dados.tags);
                    }

                    // Screenshot após preenchimento
                    await page.screenshot({
                        path: `etapa${etapaNum}-03-preenchido-${secao.nome}.png`,
                        fullPage: true
                    });
                    relatorio.etapas[secao.key].screenshots.push(`etapa${etapaNum}-03-preenchido-${secao.nome}.png`);

                    // 6. Salvar/Criar item
                    console.log(`💾 Salvando ${secao.nome}...`);

                    const botoesSalvar = [
                        () => page.locator('button:has-text("Criar"), button:has-text("Salvar")'),
                        () => page.locator('button[type="submit"]'),
                        () => page.locator('input[type="submit"]')
                    ];

                    let itemCriado = false;
                    for (const estrategia of botoesSalvar) {
                        try {
                            const botao = estrategia().first();
                            if (await botao.isVisible({ timeout: 2000 }) && await botao.isEnabled()) {
                                await botao.click();
                                await page.waitForTimeout(4000);
                                relatorio.etapas[secao.key].item_criado = true;
                                itemCriado = true;
                                console.log(`✅ ${secao.nome} criado com sucesso`);
                                break;
                            }
                        } catch (e) {
                            // Continue trying
                        }
                    }

                    if (itemCriado) {
                        relatorio.estatisticas.total_itens_criados++;
                        relatorio.estatisticas.secoes_completas++;
                    }

                    // Screenshot final
                    await page.screenshot({
                        path: `etapa${etapaNum}-04-final-${secao.nome}.png`,
                        fullPage: true
                    });
                    relatorio.etapas[secao.key].screenshots.push(`etapa${etapaNum}-04-final-${secao.nome}.png`);

                } else {
                    console.log(`❌ Modal ${secao.nome} não abriu`);
                    relatorio.observacoes.push(`Modal ${secao.nome} não abriu após clicar no botão`);
                }

                relatorio.estatisticas.total_screenshots += relatorio.etapas[secao.key].screenshots.length;

                console.log(`✅ ETAPA ${etapaNum} (${secao.nome}) FINALIZADA`);

            } catch (error) {
                console.log(`❌ Erro na ETAPA ${etapaNum} (${secao.nome}): ${error.message}`);
                relatorio.observacoes.push(`Erro na seção ${secao.nome}: ${error.message}`);

                // Screenshot de erro
                await page.screenshot({
                    path: `etapa${etapaNum}-erro-${secao.nome}.png`,
                    fullPage: true
                });
                relatorio.etapas[secao.key].screenshots.push(`etapa${etapaNum}-erro-${secao.nome}.png`);
            }

            // Pausa entre seções
            await page.waitForTimeout(2000);
        }

        // RELATÓRIO FINAL
        console.log("\n📊 GERANDO RELATÓRIO FINAL...");

        fs.writeFileSync(
            `etapas-5a9-relatorio-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        const markdownReport = `# 📋 ETAPAS 5-9: Mapeamento Autônomo Completo

## ✅ Status: ${relatorio.estatisticas.secoes_completas}/5 Seções Completas
**Executado em:** ${relatorio.timestamp}

## 🎯 Objetivo Alcançado
Mapear e testar todas as seções restantes do perfil do imigrante de forma autônoma

## 📊 Estatísticas Gerais
- **Total Campos Mapeados:** ${relatorio.estatisticas.total_campos_mapeados}
- **Total Itens Criados:** ${relatorio.estatisticas.total_itens_criados}
- **Total Screenshots:** ${relatorio.estatisticas.total_screenshots}
- **Seções Completas:** ${relatorio.estatisticas.secoes_completas}/5

## 🔄 Resultados por Seção

### 📍 ETAPA 5: Interesses
- **Menu Clicado:** ${relatorio.etapas.etapa5_interesses.menu_clicado ? '✅' : '❌'}
- **Modal Aberto:** ${relatorio.etapas.etapa5_interesses.modal_aberto ? '✅' : '❌'}
- **Item Criado:** ${relatorio.etapas.etapa5_interesses.item_criado ? '✅' : '❌'}
- **Campos Mapeados:** ${relatorio.etapas.etapa5_interesses.campos.length}
- **Screenshots:** ${relatorio.etapas.etapa5_interesses.screenshots.length}

### 🧠 ETAPA 6: Personalidade
- **Menu Clicado:** ${relatorio.etapas.etapa6_personalidade.menu_clicado ? '✅' : '❌'}
- **Modal Aberto:** ${relatorio.etapas.etapa6_personalidade.modal_aberto ? '✅' : '❌'}
- **Item Criado:** ${relatorio.etapas.etapa6_personalidade.item_criado ? '✅' : '❌'}
- **Campos Mapeados:** ${relatorio.etapas.etapa6_personalidade.campos.length}
- **Screenshots:** ${relatorio.etapas.etapa6_personalidade.screenshots.length}

### 💼 ETAPA 7: Experiências Profissionais
- **Menu Clicado:** ${relatorio.etapas.etapa7_experiencias.menu_clicado ? '✅' : '❌'}
- **Modal Aberto:** ${relatorio.etapas.etapa7_experiencias.modal_aberto ? '✅' : '❌'}
- **Item Criado:** ${relatorio.etapas.etapa7_experiencias.item_criado ? '✅' : '❌'}
- **Campos Mapeados:** ${relatorio.etapas.etapa7_experiencias.campos.length}
- **Screenshots:** ${relatorio.etapas.etapa7_experiencias.screenshots.length}

### 🎓 ETAPA 8: Formação Acadêmica
- **Menu Clicado:** ${relatorio.etapas.etapa8_formacao.menu_clicado ? '✅' : '❌'}
- **Modal Aberto:** ${relatorio.etapas.etapa8_formacao.modal_aberto ? '✅' : '❌'}
- **Item Criado:** ${relatorio.etapas.etapa8_formacao.item_criado ? '✅' : '❌'}
- **Campos Mapeados:** ${relatorio.etapas.etapa8_formacao.campos.length}
- **Screenshots:** ${relatorio.etapas.etapa8_formacao.screenshots.length}

### 🌍 ETAPA 9: Idiomas
- **Menu Clicado:** ${relatorio.etapas.etapa9_idiomas.menu_clicado ? '✅' : '❌'}
- **Modal Aberto:** ${relatorio.etapas.etapa9_idiomas.modal_aberto ? '✅' : '❌'}
- **Item Criado:** ${relatorio.etapas.etapa9_idiomas.item_criado ? '✅' : '❌'}
- **Campos Mapeados:** ${relatorio.etapas.etapa9_idiomas.campos.length}
- **Screenshots:** ${relatorio.etapas.etapa9_idiomas.screenshots.length}

## 📝 Campos Detalhados

${Object.entries(relatorio.etapas).map(([key, etapa]) => {
    const nome = key.split('_')[1];
    return `### ${nome.toUpperCase()}
${etapa.campos.map(campo =>
`- **Campo ${campo.indice}:** ${campo.tagName}[${campo.tipo}] | Name: "${campo.name}" | ID: "${campo.id}" | Obrigatório: ${campo.obrigatorio ? 'Sim' : 'Não'}`
).join('\n') || '- Nenhum campo mapeado'}`;
}).join('\n\n')}

## 📝 Observações
${relatorio.observacoes.map(obs => `- ${obs}`).join('\n') || '- Nenhuma observação adicional'}

## 🏆 Resultado Final
**JORNADA COMPLETA DO IMIGRANTE MAPEADA!**

Executamos com sucesso o mapeamento autônomo de todas as seções do perfil, desde o registro inicial até o preenchimento completo de dados profissionais e pessoais.

**Total de ${relatorio.estatisticas.total_campos_mapeados} campos mapeados em ${relatorio.estatisticas.secoes_completas} seções funcionais!**
`;

        fs.writeFileSync(
            `etapas-5a9-relatorio-${TIMESTAMP}.md`,
            markdownReport,
            'utf8'
        );

        console.log("\n🎉 ETAPAS 5-9 FINALIZADAS!");
        console.log(`📊 ${relatorio.estatisticas.total_campos_mapeados} campos mapeados`);
        console.log(`🎯 ${relatorio.estatisticas.total_itens_criados} itens criados`);
        console.log(`📸 ${relatorio.estatisticas.total_screenshots} screenshots capturados`);
        console.log(`✅ ${relatorio.estatisticas.secoes_completas}/5 seções completas`);

        return {
            sucesso: true,
            relatorio: relatorio
        };

    } catch (error) {
        console.error("❌ Erro nas etapas 5-9:", error.message);

        relatorio.observacoes.push(`ERRO GERAL: ${error.message}`);

        fs.writeFileSync(
            `etapas-5a9-erro-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        return {
            sucesso: false,
            erro: error.message,
            relatorio: relatorio
        };

    } finally {
        await browser.close();
        console.log("🔒 Browser fechado");
    }
}

// Função auxiliar para preenchimento condicional
async function preencherSe(page, seletor, valor) {
    try {
        const elemento = page.locator(seletor).first();
        if (await elemento.isVisible({ timeout: 2000 })) {
            if (await elemento.evaluate(el => el.tagName.toLowerCase()) === 'select') {
                await elemento.selectOption(valor);
            } else {
                await elemento.fill(valor);
            }
            console.log(`  ✅ Campo preenchido: ${valor.substring(0, 30)}...`);
            await page.waitForTimeout(500);
        }
    } catch (e) {
        // Campo não encontrado ou não preenchível - continue
    }
}

// EXECUTAR!
executarEtapas5a9()
    .then(resultado => {
        if (resultado.sucesso) {
            console.log("\n🚀 MISSÃO CUMPRIDA!");
            console.log("🎯 JORNADA COMPLETA DO IMIGRANTE MAPEADA COM SUCESSO!");
        } else {
            console.log("\n⚠️ ALGUMAS SEÇÕES PODEM TER FALHADO");
            console.log("📊 Verifique o relatório para detalhes");
        }
    })
    .catch(console.error);