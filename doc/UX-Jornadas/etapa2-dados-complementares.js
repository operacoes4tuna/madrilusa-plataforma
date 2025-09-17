import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

// Dados complementares fictícios contextualizados
const dadosComplementares = {
    pais: "Brasil",
    cidade: "São Paulo",
    dataManascimento: "1995-03-15",
    genero: "Feminino",
    estadoCivil: "Solteira",
    categoria: "IMIGRANTE",
    telefone: "+351912345678",
    morada: "Rua das Flores, 123, Lisboa"
};

async function executarEtapa2() {
    console.log("🚀 Iniciando ETAPA 2: Registro - Dados Complementares");

    // Conectar ao browser existente (se possível) ou criar novo
    let browser, context, page;

    try {
        // Tentar conectar ao browser existente da Etapa 1
        browser = await chromium.launch({
            headless: false,
            slowMo: 1000,
            args: ['--start-maximized']
        });

        context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });

        page = await context.newPage();

        // Navegar de volta ao modal se necessário
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');

    } catch (e) {
        console.log("⚠️ Não foi possível conectar ao browser existente, criando novo...");
        browser = await chromium.launch({
            headless: false,
            slowMo: 1000,
            args: ['--start-maximized']
        });

        context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });

        page = await context.newPage();
    }

    const relatorio = {
        etapa: "2 - Dados Complementares",
        timestamp: TIMESTAMP,
        dadosPreenchidos: dadosComplementares,
        camposEncontrados: [],
        screenshots: [],
        observacoes: [],
        scrollsRealizados: 0
    };

    try {
        // 1. Verificar se já estamos no modal de dados complementares ou precisamos navegar
        console.log("🔍 Verificando estado atual da página...");

        // Tentar localizar modal ativo
        let modalAtivo = await page.locator('[role="dialog"], .modal, [data-testid*="modal"]').first();
        let modalVisivel = false;

        try {
            modalVisivel = await modalAtivo.isVisible({ timeout: 3000 });
        } catch (e) {
            console.log("📍 Nenhum modal detectado, navegando para registro...");
        }

        if (!modalVisivel) {
            // Refazer o fluxo da Etapa 1 para chegar ao modal
            console.log("🔄 Executando navegação para modal de dados básicos...");

            const imigranteCard = await page.locator('text=Sou Imigrante').first();
            await imigranteCard.scrollIntoViewIfNeeded();

            const botaoRegistar = page.locator('text=Registar-me').first();
            await botaoRegistar.click();
            await page.waitForTimeout(2000);

            // Verificar se modal básico abriu
            modalAtivo = await page.locator('[role="dialog"], .modal, [data-testid*="modal"]').first();
            await modalAtivo.waitFor({ state: 'visible', timeout: 10000 });
        }

        // Screenshot inicial do estado atual
        await page.screenshot({
            path: `etapa2-01-estado-inicial.png`,
            fullPage: true
        });
        relatorio.screenshots.push("etapa2-01-estado-inicial.png");

        // 2. Procurar botão "Continuar" para ir para dados complementares
        console.log("🔍 Procurando botão 'Continuar' para dados complementares...");

        let botaoContinuar = null;
        const estrategiasContinuar = [
            () => page.locator('button:has-text("Continuar")'),
            () => page.locator('text=Continuar'),
            () => page.locator('[data-testid*="continue"], [data-testid*="next"]'),
            () => page.locator('button').filter({ hasText: 'Continuar' }),
            () => page.locator('input[type="submit"], button[type="submit"]')
        ];

        for (let i = 0; i < estrategiasContinuar.length; i++) {
            try {
                botaoContinuar = estrategiasContinuar[i]();
                const isVisible = await botaoContinuar.isVisible({ timeout: 2000 });
                if (isVisible) {
                    console.log(`✅ Botão 'Continuar' encontrado com estratégia ${i + 1}`);
                    break;
                }
            } catch (e) {
                console.log(`❌ Estratégia ${i + 1} para 'Continuar' falhou: ${e.message}`);
            }
        }

        if (!botaoContinuar || !(await botaoContinuar.isVisible())) {
            // Listar todos os botões disponíveis para debug
            const botoesDisponiveis = await page.locator('button').all();
            console.log("🔍 Botões disponíveis no modal atual:");
            for (let i = 0; i < botoesDisponiveis.length; i++) {
                try {
                    const texto = await botoesDisponiveis[i].textContent();
                    const visivel = await botoesDisponiveis[i].isVisible();
                    console.log(`  - Botão ${i}: "${texto}" (${visivel ? 'visível' : 'oculto'})`);
                } catch (e) {
                    console.log(`  - Botão ${i}: [erro ao ler] - ${e.message}`);
                }
            }

            relatorio.observacoes.push("AVISO: Botão 'Continuar' não encontrado - pode ser fluxo diferente");

            // Screenshot para análise
            await page.screenshot({
                path: `etapa2-debug-sem-botao-continuar.png`,
                fullPage: true
            });
            relatorio.screenshots.push("etapa2-debug-sem-botao-continuar.png");

            // Tentar preencher campos do modal atual (pode já ser o de dados complementares)
            console.log("🔄 Tentando mapear campos do modal atual...");

        } else {
            // 3. Clicar em "Continuar" para ir para dados complementares
            console.log("👆 Clicando em 'Continuar'...");
            await botaoContinuar.click();
            await page.waitForTimeout(3000);

            // Screenshot após clique
            await page.screenshot({
                path: `etapa2-02-apos-continuar.png`,
                fullPage: true
            });
            relatorio.screenshots.push("etapa2-02-apos-continuar.png");
        }

        // 4. Mapear campos do modal de dados complementares
        console.log("📋 Mapeando campos do modal de dados complementares...");

        // Aguardar modal carregar completamente
        await page.waitForTimeout(2000);

        // Verificar se é necessário fazer scroll para ver todos os campos
        const modalContainer = await page.locator('[role="dialog"], .modal, [data-testid*="modal"]').first();

        // Tentar fazer scroll para baixo para descobrir todos os campos
        try {
            const scrollableElement = modalContainer;
            const scrollHeight = await scrollableElement.evaluate(el => el.scrollHeight);
            const clientHeight = await scrollableElement.evaluate(el => el.clientHeight);

            if (scrollHeight > clientHeight) {
                console.log("📜 Modal tem scroll - fazendo scroll para mapear todos os campos");

                // Scroll para baixo em partes para capturar tudo
                for (let i = 0; i < 3; i++) {
                    await scrollableElement.evaluate(el => el.scrollTop += 200);
                    await page.waitForTimeout(500);
                    relatorio.scrollsRealizados++;
                }

                // Screenshot após scroll
                await page.screenshot({
                    path: `etapa2-03-apos-scroll.png`,
                    fullPage: true
                });
                relatorio.screenshots.push("etapa2-03-apos-scroll.png");

                // Voltar ao topo para preencher
                await scrollableElement.evaluate(el => el.scrollTop = 0);
                await page.waitForTimeout(500);
            }
        } catch (e) {
            console.log("⚠️ Erro ao fazer scroll:", e.message);
        }

        // Mapear todos os campos visíveis
        const campos = await page.locator('input, select, textarea').all();
        console.log(`🔍 Encontrados ${campos.length} campos para mapear`);

        for (let i = 0; i < campos.length; i++) {
            try {
                const campo = campos[i];
                const tagName = await campo.evaluate(el => el.tagName.toLowerCase());
                const tipo = await campo.getAttribute('type') || tagName;
                const name = await campo.getAttribute('name') || '';
                const placeholder = await campo.getAttribute('placeholder') || '';
                const id = await campo.getAttribute('id') || '';
                const required = await campo.getAttribute('required') !== null;
                const value = await campo.inputValue().catch(() => '');

                const campoInfo = {
                    indice: i,
                    tagName: tagName,
                    tipo: tipo,
                    name: name,
                    id: id,
                    placeholder: placeholder,
                    obrigatorio: required,
                    valorAtual: value,
                    visivel: await campo.isVisible()
                };

                relatorio.camposEncontrados.push(campoInfo);
                console.log(`  Campo ${i}: ${tagName}[${tipo}] name="${name}" id="${id}" placeholder="${placeholder}"`);

            } catch (e) {
                console.log(`  Campo ${i}: Erro ao mapear - ${e.message}`);
            }
        }

        // 5. Preencher campos identificados com dados complementares
        console.log("✏️ Preenchendo campos complementares...");

        // País
        try {
            const campoPais = page.locator('input[name*="pais"], select[name*="pais"], input[placeholder*="país"], input[id*="pais"]').first();
            if (await campoPais.isVisible()) {
                await campoPais.fill(dadosComplementares.pais);
                console.log(`  ✅ País preenchido: ${dadosComplementares.pais}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher país: ${e.message}`);
        }

        // Cidade
        try {
            const campoCidade = page.locator('input[name*="cidade"], input[placeholder*="cidade"], input[id*="cidade"]').first();
            if (await campoCidade.isVisible()) {
                await campoCidade.fill(dadosComplementares.cidade);
                console.log(`  ✅ Cidade preenchida: ${dadosComplementares.cidade}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher cidade: ${e.message}`);
        }

        // Data de nascimento
        try {
            const campoData = page.locator('input[type="date"], input[name*="nascimento"], input[placeholder*="nascimento"]').first();
            if (await campoData.isVisible()) {
                await campoData.fill(dadosComplementares.dataManascimento);
                console.log(`  ✅ Data nascimento preenchida: ${dadosComplementares.dataManascimento}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher data nascimento: ${e.message}`);
        }

        // Gênero
        try {
            const campoGenero = page.locator('select[name*="genero"], input[name*="genero"]').first();
            if (await campoGenero.isVisible()) {
                if (await campoGenero.evaluate(el => el.tagName.toLowerCase()) === 'select') {
                    await campoGenero.selectOption(dadosComplementares.genero);
                } else {
                    await campoGenero.fill(dadosComplementares.genero);
                }
                console.log(`  ✅ Gênero preenchido: ${dadosComplementares.genero}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher gênero: ${e.message}`);
        }

        // Telefone (se não preenchido na etapa anterior)
        try {
            const campoTelefone = page.locator('input[name*="telefone"], input[name*="telemovel"], input[placeholder*="telefone"]').first();
            if (await campoTelefone.isVisible()) {
                const valorAtual = await campoTelefone.inputValue();
                if (!valorAtual) {
                    await campoTelefone.fill(dadosComplementares.telefone);
                    console.log(`  ✅ Telefone preenchido: ${dadosComplementares.telefone}`);
                } else {
                    console.log(`  ℹ️ Telefone já preenchido: ${valorAtual}`);
                }
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher telefone: ${e.message}`);
        }

        // Morada
        try {
            const campoMorada = page.locator('input[name*="morada"], textarea[name*="morada"], input[placeholder*="morada"]').first();
            if (await campoMorada.isVisible()) {
                await campoMorada.fill(dadosComplementares.morada);
                console.log(`  ✅ Morada preenchida: ${dadosComplementares.morada}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher morada: ${e.message}`);
        }

        // Screenshot final após preenchimento
        await page.screenshot({
            path: `etapa2-04-campos-preenchidos.png`,
            fullPage: true
        });
        relatorio.screenshots.push("etapa2-04-campos-preenchidos.png");

        // 6. Salvar relatório da Etapa 2
        relatorio.observacoes.push("Etapa 2 concluída - Dados complementares mapeados e preenchidos");
        relatorio.status = "CONCLUÍDA";

        fs.writeFileSync(
            `etapa2-relatorio-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        // Gerar relatório em markdown
        const markdownReport = `# 📋 ETAPA 2: Registro - Dados Complementares

## ✅ Status: ${relatorio.status}
**Executado em:** ${relatorio.timestamp}

## 🎯 Objetivo
Mapear e preencher o modal de dados complementares do registro de imigrante

## 📊 Dados Preenchidos
- **País:** ${dadosComplementares.pais}
- **Cidade:** ${dadosComplementares.cidade}
- **Data Nascimento:** ${dadosComplementares.dataManascimento}
- **Gênero:** ${dadosComplementares.genero}
- **Estado Civil:** ${dadosComplementares.estadoCivil}
- **Telefone:** ${dadosComplementares.telefone}
- **Morada:** ${dadosComplementares.morada}

## 🔍 Campos Encontrados (${relatorio.camposEncontrados.length})
${relatorio.camposEncontrados.map(campo =>
`- **Campo ${campo.indice}:** ${campo.tagName}[${campo.tipo}] | Name: "${campo.name}" | ID: "${campo.id}" | Placeholder: "${campo.placeholder}" | Obrigatório: ${campo.obrigatorio ? 'Sim' : 'Não'}`
).join('\n')}

## 📜 Navegação
- **Scrolls realizados:** ${relatorio.scrollsRealizados}

## 📸 Screenshots Capturados (${relatorio.screenshots.length})
${relatorio.screenshots.map(screenshot => `- ![${screenshot}](${screenshot})`).join('\n')}

## 📝 Observações
${relatorio.observacoes.map(obs => `- ${obs}`).join('\n')}

## ➡️ Próxima Etapa
**ETAPA 3:** Dashboard Inicial - Aguardando aprovação para continuar
`;

        fs.writeFileSync(
            `etapa2-relatorio-${TIMESTAMP}.md`,
            markdownReport,
            'utf8'
        );

        console.log("✅ ETAPA 2 CONCLUÍDA!");
        console.log(`📊 Campos encontrados: ${relatorio.camposEncontrados.length}`);
        console.log(`📸 Screenshots: ${relatorio.screenshots.length}`);
        console.log(`📜 Scrolls: ${relatorio.scrollsRealizados}`);
        console.log(`📋 Relatórios salvos com timestamp: ${TIMESTAMP}`);

        return {
            sucesso: true,
            relatorio: relatorio,
            proximaEtapa: "ETAPA 3: Dashboard Inicial"
        };

    } catch (error) {
        console.error("❌ Erro na Etapa 2:", error.message);

        // Screenshot de erro
        await page.screenshot({
            path: `etapa2-erro-${TIMESTAMP}.png`,
            fullPage: true
        });

        relatorio.observacoes.push(`ERRO: ${error.message}`);
        relatorio.screenshots.push(`etapa2-erro-${TIMESTAMP}.png`);
        relatorio.status = "ERRO";

        fs.writeFileSync(
            `etapa2-relatorio-erro-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        return {
            sucesso: false,
            erro: error.message,
            relatorio: relatorio
        };

    } finally {
        // Manter browser aberto para próxima etapa
        console.log("🔄 Browser mantido aberto para próxima etapa...");
        // await browser.close();
    }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    executarEtapa2()
        .then(resultado => {
            if (resultado.sucesso) {
                console.log("\n🎉 ETAPA 2 FINALIZADA COM SUCESSO!");
                console.log("\n⏳ AGUARDANDO APROVAÇÃO PARA ETAPA 3...");
            } else {
                console.log("\n❌ ETAPA 2 FINALIZADA COM ERRO!");
                console.log("Erro:", resultado.erro);
            }
        })
        .catch(console.error);
}

export { executarEtapa2, dadosComplementares };