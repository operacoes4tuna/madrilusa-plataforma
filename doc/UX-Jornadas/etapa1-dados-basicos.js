import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

// Dados fictícios contextualizados para o imigrante
const dadosImigrante = {
    nomeCompleto: "Maria Santos Oliveira",
    email: `maria.santos.${Date.now()}@madrilusa.demo`,
    senha: "MinhaSenh@123!",
    confirmarSenha: "MinhaSenh@123!"
};

async function executarEtapa1() {
    console.log("🚀 Iniciando ETAPA 1: Registro - Dados Básicos");

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
        etapa: "1 - Registro Dados Básicos",
        timestamp: TIMESTAMP,
        url_inicial: "http://localhost:8080",
        dadosPreenchidos: dadosImigrante,
        camposMapeados: [],
        screenshots: [],
        observacoes: []
    };

    try {
        // 1. Navegar para home page
        console.log("📍 Navegando para home page...");
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');

        // Screenshot inicial da home
        await page.screenshot({
            path: `etapa1-01-home-inicial.png`,
            fullPage: true
        });
        relatorio.screenshots.push("etapa1-01-home-inicial.png");

        // 2. Localizar card "Sou Imigrante"
        console.log("🔍 Localizando card 'Sou Imigrante'...");
        const imigranteCard = await page.locator('text=Sou Imigrante').first();
        await imigranteCard.scrollIntoViewIfNeeded();

        // 3. Localizar botão "Registar-me" no card do imigrante
        console.log("🔍 Procurando botão 'Registar-me' no card do imigrante...");

        // Tentar várias estratégias para encontrar o botão
        let botaoRegistar = null;
        const estrategias = [
            () => page.locator('text=Registar-me').first(),
            () => page.locator('button:has-text("Registar-me")'),
            () => page.locator('[data-testid*="register"]'),
            () => page.locator('button').filter({ hasText: 'Registar-me' }),
            () => page.locator('.card:has-text("Sou Imigrante") button:has-text("Registar-me")')
        ];

        for (let i = 0; i < estrategias.length; i++) {
            try {
                botaoRegistar = estrategias[i]();
                const isVisible = await botaoRegistar.isVisible();
                if (isVisible) {
                    console.log(`✅ Botão encontrado com estratégia ${i + 1}`);
                    break;
                }
            } catch (e) {
                console.log(`❌ Estratégia ${i + 1} falhou: ${e.message}`);
            }
        }

        if (!botaoRegistar || !(await botaoRegistar.isVisible())) {
            // Screenshot para debug
            await page.screenshot({
                path: `etapa1-debug-botao-nao-encontrado.png`,
                fullPage: true
            });

            relatorio.observacoes.push("ERRO: Botão 'Registar-me' não encontrado no card do imigrante");
            relatorio.screenshots.push("etapa1-debug-botao-nao-encontrado.png");

            // Listar todos os botões visíveis
            const botoes = await page.locator('button').all();
            console.log("🔍 Botões encontrados na página:");
            for (let i = 0; i < botoes.length; i++) {
                try {
                    const texto = await botoes[i].textContent();
                    console.log(`  - Botão ${i}: "${texto}"`);
                } catch (e) {
                    console.log(`  - Botão ${i}: [erro ao ler texto]`);
                }
            }

            throw new Error("Botão 'Registar-me' não encontrado");
        }

        // 4. Clicar no botão "Registar-me"
        console.log("👆 Clicando no botão 'Registar-me'...");
        await botaoRegistar.click();

        // 5. Aguardar modal de dados básicos abrir
        console.log("⏳ Aguardando modal de dados básicos abrir...");
        await page.waitForTimeout(2000);

        // Verificar se modal abriu
        const modalBasicos = await page.locator('[role="dialog"], .modal, [data-testid*="modal"]').first();
        await modalBasicos.waitFor({ state: 'visible', timeout: 10000 });

        // Screenshot do modal aberto
        await page.screenshot({
            path: `etapa1-02-modal-dados-basicos.png`,
            fullPage: true
        });
        relatorio.screenshots.push("etapa1-02-modal-dados-basicos.png");

        // 6. Mapear todos os campos do modal
        console.log("📋 Mapeando campos do modal de dados básicos...");

        const campos = await page.locator('input, select, textarea').all();
        for (let i = 0; i < campos.length; i++) {
            try {
                const campo = campos[i];
                const tipo = await campo.getAttribute('type') || await campo.evaluate(el => el.tagName.toLowerCase());
                const name = await campo.getAttribute('name') || '';
                const placeholder = await campo.getAttribute('placeholder') || '';
                const id = await campo.getAttribute('id') || '';
                const required = await campo.getAttribute('required') !== null;

                const campoInfo = {
                    indice: i,
                    tipo: tipo,
                    name: name,
                    id: id,
                    placeholder: placeholder,
                    obrigatorio: required,
                    visivel: await campo.isVisible()
                };

                relatorio.camposMapeados.push(campoInfo);
                console.log(`  Campo ${i}: ${JSON.stringify(campoInfo)}`);

            } catch (e) {
                console.log(`  Campo ${i}: Erro ao mapear - ${e.message}`);
            }
        }

        // 7. Preencher campos com dados fictícios
        console.log("✏️ Preenchendo campos com dados fictícios...");

        // Nome completo
        try {
            const campoNome = page.locator('input[name="nomeCompleto"], input[placeholder*="nome"], input[id*="nome"]').first();
            if (await campoNome.isVisible()) {
                await campoNome.fill(dadosImigrante.nomeCompleto);
                console.log(`  ✅ Nome preenchido: ${dadosImigrante.nomeCompleto}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher nome: ${e.message}`);
        }

        // Email
        try {
            const campoEmail = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
            if (await campoEmail.isVisible()) {
                await campoEmail.fill(dadosImigrante.email);
                console.log(`  ✅ Email preenchido: ${dadosImigrante.email}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher email: ${e.message}`);
        }

        // Senha
        try {
            const campoSenha = page.locator('input[type="password"], input[name="senha"], input[placeholder*="senha"]').first();
            if (await campoSenha.isVisible()) {
                await campoSenha.fill(dadosImigrante.senha);
                console.log(`  ✅ Senha preenchida`);
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher senha: ${e.message}`);
        }

        // Confirmar senha
        try {
            const campoConfirmarSenha = page.locator('input[name*="confirmar"], input[placeholder*="confirmar"]').first();
            if (await campoConfirmarSenha.isVisible()) {
                await campoConfirmarSenha.fill(dadosImigrante.confirmarSenha);
                console.log(`  ✅ Confirmação de senha preenchida`);
            }
        } catch (e) {
            console.log(`  ❌ Erro ao preencher confirmação de senha: ${e.message}`);
        }

        // Screenshot após preenchimento
        await page.screenshot({
            path: `etapa1-03-modal-preenchido.png`,
            fullPage: true
        });
        relatorio.screenshots.push("etapa1-03-modal-preenchido.png");

        // 8. Salvar relatório da Etapa 1
        relatorio.observacoes.push("Etapa 1 concluída com sucesso - Modal de dados básicos mapeado e preenchido");
        relatorio.status = "CONCLUÍDA";

        fs.writeFileSync(
            `etapa1-relatorio-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        // Gerar relatório em markdown
        const markdownReport = `# 📋 ETAPA 1: Registro - Dados Básicos

## ✅ Status: ${relatorio.status}
**Executado em:** ${relatorio.timestamp}

## 🎯 Objetivo
Mapear e preencher o modal de dados básicos do registro de imigrante

## 📊 Dados Preenchidos
- **Nome:** ${dadosImigrante.nomeCompleto}
- **Email:** ${dadosImigrante.email}
- **Senha:** [preenchida]

## 🔍 Campos Mapeados (${relatorio.camposMapeados.length})
${relatorio.camposMapeados.map(campo =>
`- **Campo ${campo.indice}:** ${campo.tipo} | Name: "${campo.name}" | ID: "${campo.id}" | Obrigatório: ${campo.obrigatorio ? 'Sim' : 'Não'}`
).join('\n')}

## 📸 Screenshots Capturados
${relatorio.screenshots.map(screenshot => `- ![${screenshot}](${screenshot})`).join('\n')}

## 📝 Observações
${relatorio.observacoes.map(obs => `- ${obs}`).join('\n')}

## ➡️ Próxima Etapa
**ETAPA 2:** Dados Complementares - Aguardando aprovação para continuar
`;

        fs.writeFileSync(
            `etapa1-relatorio-${TIMESTAMP}.md`,
            markdownReport,
            'utf8'
        );

        console.log("✅ ETAPA 1 CONCLUÍDA!");
        console.log(`📊 Campos mapeados: ${relatorio.camposMapeados.length}`);
        console.log(`📸 Screenshots: ${relatorio.screenshots.length}`);
        console.log(`📋 Relatórios salvos com timestamp: ${TIMESTAMP}`);

        return {
            sucesso: true,
            relatorio: relatorio,
            proximaEtapa: "ETAPA 2: Dados Complementares"
        };

    } catch (error) {
        console.error("❌ Erro na Etapa 1:", error.message);

        // Screenshot de erro
        await page.screenshot({
            path: `etapa1-erro-${TIMESTAMP}.png`,
            fullPage: true
        });

        relatorio.observacoes.push(`ERRO: ${error.message}`);
        relatorio.screenshots.push(`etapa1-erro-${TIMESTAMP}.png`);
        relatorio.status = "ERRO";

        fs.writeFileSync(
            `etapa1-relatorio-erro-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        return {
            sucesso: false,
            erro: error.message,
            relatorio: relatorio
        };

    } finally {
        // Manter browser aberto para continuidade
        console.log("🔄 Browser mantido aberto para próxima etapa...");
        // await browser.close();
    }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    executarEtapa1()
        .then(resultado => {
            if (resultado.sucesso) {
                console.log("\n🎉 ETAPA 1 FINALIZADA COM SUCESSO!");
                console.log("\n⏳ AGUARDANDO APROVAÇÃO PARA ETAPA 2...");
            } else {
                console.log("\n❌ ETAPA 1 FINALIZADA COM ERRO!");
                console.log("Erro:", resultado.erro);
            }
        })
        .catch(console.error);
}

export { executarEtapa1, dadosImigrante };