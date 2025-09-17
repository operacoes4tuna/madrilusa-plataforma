import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

// Dados para o imigrante em sessão contínua
const dadosImigrante = {
    // Dados básicos (Etapa 1)
    nomeCompleto: "Maria Santos Oliveira",
    email: `maria.santos.${Date.now()}@madrilusa.demo`,
    senha: "MinhaSenh@123!",
    confirmarSenha: "MinhaSenh@123!",

    // Dados complementares (Etapa 2)
    pais: "Brasil",
    cidade: "São Paulo",
    dataManascimento: "1995-03-15",
    genero: "Feminino",
    estadoCivil: "Solteira",
    telefone: "+351912345678",
    morada: "Rua das Flores, 123, Lisboa"
};

async function executarEtapas1e2SessaoUnica() {
    console.log("🚀 Iniciando ETAPAS 1+2 em SESSÃO ÚNICA");

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
        sessao: "ETAPAS 1+2 - Sessão Única",
        timestamp: TIMESTAMP,
        etapa1: {
            dadosPreenchidos: {},
            camposMapeados: [],
            screenshots: [],
            observacoes: []
        },
        etapa2: {
            dadosPreenchidos: {},
            camposMapeados: [],
            screenshots: [],
            observacoes: []
        },
        fluxoCompleto: {
            screenshots: [],
            observacoes: []
        }
    };

    try {
        console.log("\n===== 🔸 ETAPA 1: DADOS BÁSICOS =====");

        // 1. Navegar para home page
        console.log("📍 Navegando para home page...");
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');

        // Screenshot inicial
        await page.screenshot({
            path: `sessao-01-home-inicial.png`,
            fullPage: true
        });
        relatorio.fluxoCompleto.screenshots.push("sessao-01-home-inicial.png");

        // 2. Localizar e clicar no botão "Registar-me" do card "Sou Imigrante"
        console.log("🔍 Localizando card 'Sou Imigrante' e botão 'Registar-me'...");

        const imigranteCard = await page.locator('text=Sou Imigrante').first();
        await imigranteCard.scrollIntoViewIfNeeded();

        const botaoRegistar = page.locator('text=Registar-me').first();

        if (await botaoRegistar.isVisible()) {
            console.log("✅ Botão 'Registar-me' encontrado");
            await botaoRegistar.click();
            await page.waitForTimeout(3000);
        } else {
            throw new Error("Botão 'Registar-me' não encontrado");
        }

        // 3. Aguardar modal abrir e mapear campos ETAPA 1
        console.log("📋 Mapeando campos do modal inicial...");
        const modalAtivo = await page.locator('[role="dialog"], .modal, [data-testid*="modal"]').first();
        await modalAtivo.waitFor({ state: 'visible', timeout: 10000 });

        // Screenshot do modal aberto
        await page.screenshot({
            path: `sessao-02-modal-inicial.png`,
            fullPage: true
        });
        relatorio.etapa1.screenshots.push("sessao-02-modal-inicial.png");

        // Mapear campos da ETAPA 1
        const campos1 = await page.locator('input, select, textarea').all();
        console.log(`🔍 ETAPA 1 - Encontrados ${campos1.length} campos`);

        for (let i = 0; i < campos1.length; i++) {
            try {
                const campo = campos1[i];
                const tagName = await campo.evaluate(el => el.tagName.toLowerCase());
                const tipo = await campo.getAttribute('type') || tagName;
                const name = await campo.getAttribute('name') || '';
                const placeholder = await campo.getAttribute('placeholder') || '';
                const id = await campo.getAttribute('id') || '';
                const required = await campo.getAttribute('required') !== null;

                const campoInfo = {
                    etapa: 1,
                    indice: i,
                    tagName: tagName,
                    tipo: tipo,
                    name: name,
                    id: id,
                    placeholder: placeholder,
                    obrigatorio: required,
                    visivel: await campo.isVisible()
                };

                relatorio.etapa1.camposMapeados.push(campoInfo);
                console.log(`  ETAPA1 Campo ${i}: ${tagName}[${tipo}] name="${name}" id="${id}"`);

            } catch (e) {
                console.log(`  ETAPA1 Campo ${i}: Erro - ${e.message}`);
            }
        }

        // 4. Preencher campos ETAPA 1
        console.log("✏️ ETAPA 1 - Preenchendo dados básicos...");

        // Nome
        try {
            const campoNome = page.locator('input[name="nomeCompleto"], input[placeholder*="nome"], input[id*="nome"]').first();
            if (await campoNome.isVisible()) {
                await campoNome.fill(dadosImigrante.nomeCompleto);
                relatorio.etapa1.dadosPreenchidos.nome = dadosImigrante.nomeCompleto;
                console.log(`  ✅ Nome: ${dadosImigrante.nomeCompleto}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro nome: ${e.message}`);
        }

        // Email
        try {
            const campoEmail = page.locator('input[type="email"][name="email"], input[name="email"]').first();
            if (await campoEmail.isVisible()) {
                await campoEmail.fill(dadosImigrante.email);
                relatorio.etapa1.dadosPreenchidos.email = dadosImigrante.email;
                console.log(`  ✅ Email: ${dadosImigrante.email}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro email: ${e.message}`);
        }

        // Telefone
        try {
            const campoTelefone = page.locator('input[name="telemovel"], input[placeholder*="telefone"]').first();
            if (await campoTelefone.isVisible()) {
                await campoTelefone.fill(dadosImigrante.telefone);
                relatorio.etapa1.dadosPreenchidos.telefone = dadosImigrante.telefone;
                console.log(`  ✅ Telefone: ${dadosImigrante.telefone}`);
            }
        } catch (e) {
            console.log(`  ❌ Erro telefone: ${e.message}`);
        }

        // Senha
        try {
            const campoSenha = page.locator('input[type="password"][name="senha"], input[name="senha"]').first();
            if (await campoSenha.isVisible()) {
                await campoSenha.fill(dadosImigrante.senha);
                relatorio.etapa1.dadosPreenchidos.senha = "[preenchida]";
                console.log(`  ✅ Senha preenchida`);
            }
        } catch (e) {
            console.log(`  ❌ Erro senha: ${e.message}`);
        }

        // Screenshot após preenchimento ETAPA 1
        await page.screenshot({
            path: `sessao-03-etapa1-preenchida.png`,
            fullPage: true
        });
        relatorio.etapa1.screenshots.push("sessao-03-etapa1-preenchida.png");

        console.log("\n===== 🔸 ETAPA 2: TENTATIVA DADOS COMPLEMENTARES =====");

        // 5. Procurar botão "Continuar" ou similar para próxima etapa
        console.log("🔍 Procurando botão para avançar...");

        let botaoProximo = null;
        const estrategias = [
            () => page.locator('button:has-text("Continuar")'),
            () => page.locator('button:has-text("Próximo")'),
            () => page.locator('button:has-text("Avançar")'),
            () => page.locator('button[type="submit"]'),
            () => page.locator('input[type="submit"]'),
            () => page.locator('button:has-text("Registrar")'),
            () => page.locator('button:has-text("Criar conta")')
        ];

        for (let i = 0; i < estrategias.length; i++) {
            try {
                botaoProximo = estrategias[i]();
                if (await botaoProximo.isVisible({ timeout: 1000 })) {
                    const texto = await botaoProximo.textContent();
                    console.log(`✅ Botão encontrado: "${texto}" (estratégia ${i + 1})`);
                    break;
                }
            } catch (e) {
                // Continuar tentando
            }
        }

        if (botaoProximo && await botaoProximo.isVisible()) {
            console.log("👆 Clicando no botão para avançar...");
            await botaoProximo.click();
            await page.waitForTimeout(3000);

            // Screenshot após clique
            await page.screenshot({
                path: `sessao-04-apos-avancar.png`,
                fullPage: true
            });
            relatorio.etapa2.screenshots.push("sessao-04-apos-avancar.png");

            // 6. Verificar se há novos campos ou se ainda é o mesmo modal
            console.log("📋 ETAPA 2 - Verificando novos campos...");

            const campos2 = await page.locator('input, select, textarea').all();
            console.log(`🔍 ETAPA 2 - Encontrados ${campos2.length} campos após avançar`);

            // Mapear todos os campos visíveis novamente
            for (let i = 0; i < campos2.length; i++) {
                try {
                    const campo = campos2[i];
                    const tagName = await campo.evaluate(el => el.tagName.toLowerCase());
                    const tipo = await campo.getAttribute('type') || tagName;
                    const name = await campo.getAttribute('name') || '';
                    const placeholder = await campo.getAttribute('placeholder') || '';
                    const id = await campo.getAttribute('id') || '';
                    const required = await campo.getAttribute('required') !== null;
                    const valor = await campo.inputValue().catch(() => '');

                    const campoInfo = {
                        etapa: 2,
                        indice: i,
                        tagName: tagName,
                        tipo: tipo,
                        name: name,
                        id: id,
                        placeholder: placeholder,
                        obrigatorio: required,
                        valorPreenchido: valor,
                        visivel: await campo.isVisible()
                    };

                    relatorio.etapa2.camposMapeados.push(campoInfo);
                    console.log(`  ETAPA2 Campo ${i}: ${tagName}[${tipo}] name="${name}" valor="${valor}"`);

                } catch (e) {
                    console.log(`  ETAPA2 Campo ${i}: Erro - ${e.message}`);
                }
            }

            // 7. Tentar preencher dados complementares se houver campos novos
            console.log("✏️ ETAPA 2 - Tentando preencher dados complementares...");

            // Verificar se há novos campos para dados complementares
            const camposComplementares = [
                {campo: 'input[name*="pais"], select[name*="pais"]', valor: dadosImigrante.pais, nome: "País"},
                {campo: 'input[name*="cidade"], input[placeholder*="cidade"]', valor: dadosImigrante.cidade, nome: "Cidade"},
                {campo: 'input[type="date"], input[name*="nascimento"]', valor: dadosImigrante.dataManascimento, nome: "Data Nascimento"},
                {campo: 'select[name*="genero"], input[name*="genero"]', valor: dadosImigrante.genero, nome: "Gênero"},
                {campo: 'select[name*="estado"], input[name*="civil"]', valor: dadosImigrante.estadoCivil, nome: "Estado Civil"},
                {campo: 'input[name*="morada"], textarea[name*="morada"]', valor: dadosImigrante.morada, nome: "Morada"}
            ];

            for (const item of camposComplementares) {
                try {
                    const elemento = page.locator(item.campo).first();
                    if (await elemento.isVisible()) {
                        if (await elemento.evaluate(el => el.tagName.toLowerCase()) === 'select') {
                            await elemento.selectOption(item.valor);
                        } else {
                            await elemento.fill(item.valor);
                        }
                        relatorio.etapa2.dadosPreenchidos[item.nome.toLowerCase()] = item.valor;
                        console.log(`  ✅ ${item.nome}: ${item.valor}`);
                    } else {
                        console.log(`  ⚠️ ${item.nome}: campo não encontrado`);
                    }
                } catch (e) {
                    console.log(`  ❌ ${item.nome}: erro - ${e.message}`);
                }
            }

            // Screenshot final da ETAPA 2
            await page.screenshot({
                path: `sessao-05-etapa2-final.png`,
                fullPage: true
            });
            relatorio.etapa2.screenshots.push("sessao-05-etapa2-final.png");

        } else {
            console.log("⚠️ Nenhum botão para avançar encontrado - pode ser fluxo de etapa única");
            relatorio.etapa2.observacoes.push("Botão para avançar não encontrado - fluxo pode ser de etapa única");
        }

        // 8. Salvar relatório consolidado
        relatorio.etapa1.observacoes.push("Etapa 1 executada em sessão contínua");
        relatorio.etapa2.observacoes.push("Etapa 2 executada em continuidade da sessão");
        relatorio.fluxoCompleto.observacoes.push("Sessão única mantida entre etapas 1 e 2");

        fs.writeFileSync(
            `etapas-1e2-sessao-unica-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        // Gerar relatório markdown consolidado
        const markdownReport = `# 📋 ETAPAS 1+2: Sessão Única - Registro Completo

## 🎯 Metodologia
**Sessão única mantida** para preservar estado do modal e mapear fluxo real

**Executado em:** ${relatorio.timestamp}

## 🔸 ETAPA 1: Dados Básicos

### 📊 Dados Preenchidos
${Object.entries(relatorio.etapa1.dadosPreenchidos).map(([key, value]) => `- **${key}:** ${value}`).join('\n')}

### 🔍 Campos Mapeados (${relatorio.etapa1.camposMapeados.length})
${relatorio.etapa1.camposMapeados.map(campo =>
`- **Campo ${campo.indice}:** ${campo.tagName}[${campo.tipo}] | Name: "${campo.name}" | ID: "${campo.id}" | Obrigatório: ${campo.obrigatorio ? 'Sim' : 'Não'}`
).join('\n')}

## 🔸 ETAPA 2: Dados Complementares

### 📊 Dados Preenchidos
${Object.entries(relatorio.etapa2.dadosPreenchidos).map(([key, value]) => `- **${key}:** ${value}`).join('\n') || "- Nenhum dado complementar preenchido"}

### 🔍 Campos Mapeados (${relatorio.etapa2.camposMapeados.length})
${relatorio.etapa2.camposMapeados.map(campo =>
`- **Campo ${campo.indice}:** ${campo.tagName}[${campo.tipo}] | Name: "${campo.name}" | Valor: "${campo.valorPreenchido}" | Obrigatório: ${campo.obrigatorio ? 'Sim' : 'Não'}`
).join('\n') || "- Nenhum campo adicional mapeado"}

## 📸 Screenshots Capturados
### Fluxo Completo:
${relatorio.fluxoCompleto.screenshots.map(img => `- ![${img}](${img})`).join('\n')}

### ETAPA 1:
${relatorio.etapa1.screenshots.map(img => `- ![${img}](${img})`).join('\n')}

### ETAPA 2:
${relatorio.etapa2.screenshots.map(img => `- ![${img}](${img})`).join('\n')}

## 📝 Observações e Descobertas

### ETAPA 1:
${relatorio.etapa1.observacoes.map(obs => `- ${obs}`).join('\n')}

### ETAPA 2:
${relatorio.etapa2.observacoes.map(obs => `- ${obs}`).join('\n')}

### Fluxo Completo:
${relatorio.fluxoCompleto.observacoes.map(obs => `- ${obs}`).join('\n')}

## ➡️ Próxima Etapa
**ETAPA 3:** Dashboard Inicial - Completar registro e verificar redirecionamento
`;

        fs.writeFileSync(
            `etapas-1e2-sessao-unica-${TIMESTAMP}.md`,
            markdownReport,
            'utf8'
        );

        console.log("\n✅ ETAPAS 1+2 CONCLUÍDAS EM SESSÃO ÚNICA!");
        console.log(`📊 Etapa 1 - Campos: ${relatorio.etapa1.camposMapeados.length}`);
        console.log(`📊 Etapa 2 - Campos: ${relatorio.etapa2.camposMapeados.length}`);
        console.log(`📸 Screenshots: ${relatorio.fluxoCompleto.screenshots.length + relatorio.etapa1.screenshots.length + relatorio.etapa2.screenshots.length}`);

        return {
            sucesso: true,
            relatorio: relatorio,
            browser: browser, // Retornar browser para próxima etapa
            page: page,       // Retornar page para próxima etapa
            proximaEtapa: "ETAPA 3: Dashboard Inicial"
        };

    } catch (error) {
        console.error("❌ Erro nas Etapas 1+2:", error.message);

        await page.screenshot({
            path: `sessao-erro-${TIMESTAMP}.png`,
            fullPage: true
        });

        relatorio.fluxoCompleto.observacoes.push(`ERRO: ${error.message}`);

        fs.writeFileSync(
            `etapas-1e2-erro-${TIMESTAMP}.json`,
            JSON.stringify(relatorio, null, 2),
            'utf8'
        );

        return {
            sucesso: false,
            erro: error.message,
            relatorio: relatorio
        };

    } finally {
        // NÃO fechar browser - manter para próxima etapa
        console.log("🔄 Browser mantido aberto para ETAPA 3...");
    }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    executarEtapas1e2SessaoUnica()
        .then(resultado => {
            if (resultado.sucesso) {
                console.log("\n🎉 ETAPAS 1+2 FINALIZADAS COM SUCESSO!");
                console.log("\n⏳ AGUARDANDO APROVAÇÃO PARA ETAPA 3...");
            } else {
                console.log("\n❌ ETAPAS 1+2 FINALIZADAS COM ERRO!");
                console.log("Erro:", resultado.erro);
            }
        })
        .catch(console.error);
}

export { executarEtapas1e2SessaoUnica, dadosImigrante };