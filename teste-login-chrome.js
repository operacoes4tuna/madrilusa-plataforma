import { chromium, firefox, webkit } from 'playwright';

// Credenciais para teste
const credenciais = {
    email: "imigrante@madrilusa.com.pt",
    senha: "vcgvcg"
};

async function testeLoginChrome() {
    console.log('🚀 TESTE DE LOGIN COM CHROME');
    console.log('============================');

    // Tentar usar Chrome instalado no sistema
    let browser;
    try {
        // Usar Chrome do sistema (não Chromium)
        browser = await chromium.launch({
            headless: false,
            slowMo: 1000,
            channel: 'chrome', // Usar Chrome real
            args: [
                '--start-maximized',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        });
        console.log('✅ Chrome iniciado com sucesso');
    } catch (erro) {
        console.log('⚠️ Chrome não encontrado, tentando Chromium...');
        browser = await chromium.launch({
            headless: false,
            slowMo: 1000,
            args: ['--start-maximized']
        });
    }

    try {
        const page = await browser.newPage();

        console.log('\n📍 1. Navegando para a página inicial...');
        await page.goto('http://localhost:8081/', {
            waitUntil: 'networkidle',
            timeout: 15000
        });

        console.log('✅ Página carregada:', page.url());

        // Screenshot inicial
        await page.screenshot({
            path: 'teste-01-inicial.png',
            fullPage: true
        });
        console.log('📸 Screenshot inicial capturada');

        console.log('\n🔐 2. Procurando botão de login...');

        // Aguardar um pouco para page carregar completamente
        await page.waitForTimeout(2000);

        // Tentar fechar qualquer modal que possa estar aberto
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);

        // Procurar botão de login com diferentes estratégias
        let botaoLogin = null;
        const seletoresLogin = [
            'button:has-text("Login")',
            'a:has-text("Login")',
            '[data-login-button="true"]',
            'button:text("Login")',
            '.login-btn',
            'button[type="button"]:has-text("Login")'
        ];

        for (const seletor of seletoresLogin) {
            try {
                await page.waitForSelector(seletor, { timeout: 2000 });
                botaoLogin = seletor;
                console.log(`✅ Botão de login encontrado: ${seletor}`);
                break;
            } catch {
                console.log(`❌ Seletor não encontrado: ${seletor}`);
            }
        }

        if (!botaoLogin) {
            throw new Error('Nenhum botão de login encontrado');
        }

        console.log('\n🎯 3. Clicando no botão de login...');
        await page.click(botaoLogin);
        await page.waitForTimeout(2000);

        // Screenshot do modal
        await page.screenshot({
            path: 'teste-02-modal-login.png',
            fullPage: true
        });
        console.log('📸 Screenshot do modal capturada');

        console.log('\n📝 4. Preenchendo campos de login...');

        // Aguardar campos de login aparecerem
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });
        await page.waitForSelector('input[type="password"]', { timeout: 5000 });

        // Preencher email
        await page.fill('input[type="email"]', credenciais.email);
        console.log(`✅ Email preenchido: ${credenciais.email}`);
        await page.waitForTimeout(500);

        // Preencher senha
        await page.fill('input[type="password"]', credenciais.senha);
        console.log(`✅ Senha preenchida`);
        await page.waitForTimeout(500);

        // Screenshot dos campos preenchidos
        await page.screenshot({
            path: 'teste-03-campos-preenchidos.png',
            fullPage: true
        });
        console.log('📸 Screenshot dos campos preenchidos');

        console.log('\n🚀 5. Submetendo formulário...');

        // Tentar submeter o formulário
        const estrategiasSubmit = [
            async () => {
                await page.click('button[type="submit"]');
                console.log('🎯 Tentativa 1: button[type="submit"]');
            },
            async () => {
                await page.click('button:has-text("Entrar")');
                console.log('🎯 Tentativa 2: button com texto "Entrar"');
            },
            async () => {
                await page.press('input[type="password"]', 'Enter');
                console.log('🎯 Tentativa 3: Enter no campo senha');
            },
            async () => {
                // Procurar qualquer botão no modal e clicar
                const botoes = await page.locator('button').all();
                for (let i = 0; i < botoes.length; i++) {
                    const texto = await botoes[i].textContent();
                    if (texto && (texto.includes('Entrar') || texto.includes('Login') || texto.includes('Submeter'))) {
                        await botoes[i].click();
                        console.log(`🎯 Tentativa 4: Botão encontrado com texto "${texto}"`);
                        break;
                    }
                }
            }
        ];

        let submitSucesso = false;
        for (let i = 0; i < estrategiasSubmit.length; i++) {
            try {
                await estrategiasSubmit[i]();
                await page.waitForTimeout(2000);

                // Verificar se houve mudança na URL
                const urlAtual = page.url();
                console.log(`📍 URL após tentativa ${i + 1}: ${urlAtual}`);

                if (urlAtual.includes('/app') || urlAtual !== 'http://localhost:8081/') {
                    submitSucesso = true;
                    break;
                }
            } catch (erro) {
                console.log(`❌ Estratégia ${i + 1} falhou: ${erro.message}`);
            }
        }

        // Aguardar possível redirecionamento
        await page.waitForTimeout(3000);

        const urlFinal = page.url();
        console.log(`\n📍 URL final: ${urlFinal}`);

        // Screenshot final
        await page.screenshot({
            path: 'teste-04-resultado-final.png',
            fullPage: true
        });
        console.log('📸 Screenshot final capturada');

        // Verificar resultado
        if (urlFinal.includes('/app')) {
            console.log('\n🎉 SUCESSO! Login realizado com êxito!');
            console.log(`✅ Redirecionado para: ${urlFinal}`);

            // Tentar capturar informações da página logada
            const titulo = await page.title();
            console.log(`📄 Título da página: ${titulo}`);

            return true;
        } else {
            console.log('\n❌ FALHA! Login não foi bem-sucedido');
            console.log(`❌ Permaneceu em: ${urlFinal}`);

            // Verificar se há mensagens de erro
            try {
                const erros = await page.locator('.error, .alert, .message').allTextContents();
                if (erros.length > 0) {
                    console.log('⚠️ Mensagens de erro encontradas:');
                    erros.forEach(erro => console.log(`   - ${erro}`));
                }
            } catch {}

            return false;
        }

    } catch (erro) {
        console.log(`\n💥 ERRO DURANTE O TESTE: ${erro.message}`);

        try {
            await page.screenshot({
                path: 'teste-99-erro.png',
                fullPage: true
            });
            console.log('📸 Screenshot do erro capturada');
        } catch {}

        return false;
    } finally {
        console.log('\n🔚 Fechando navegador...');
        await browser.close();
    }
}

// Executar teste
console.log('🧪 Iniciando teste de login simples...');
testeLoginChrome()
    .then(sucesso => {
        console.log('\n' + '='.repeat(40));
        if (sucesso) {
            console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!');
            console.log('✅ Login funcionou corretamente');
        } else {
            console.log('❌ TESTE FALHOU');
            console.log('❌ Login não funcionou como esperado');
        }
        console.log('📸 Screenshots salvos como teste-*.png');
        console.log('='.repeat(40));
    })
    .catch(erro => {
        console.log('\n💥 ERRO FATAL:', erro.message);
    });