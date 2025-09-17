import { chromium } from 'playwright';

// Credenciais para teste
const credenciais = {
    email: "imigrante@madrilusa.com.pt",
    senha: "vcgvcg"
};

async function testeLoginCorrigido() {
    console.log('🚀 TESTE DE LOGIN COM CORREÇÕES APLICADAS');
    console.log('==========================================');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 800,
        channel: 'chrome', // Usar Chrome se disponível
        args: ['--start-maximized']
    });

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
            path: 'corrigido-01-inicial.png',
            fullPage: false
        });
        console.log('📸 Screenshot inicial');

        console.log('\n🔐 2. Clicando no botão de login usando data-testid...');

        // Aguardar página carregar completamente
        await page.waitForTimeout(2000);

        // Usar o novo data-testid do botão de login
        await page.waitForSelector('[data-testid="header-login-button"]', { timeout: 5000 });
        console.log('✅ Botão de login encontrado com data-testid');

        await page.click('[data-testid="header-login-button"]');
        await page.waitForTimeout(2000);

        // Screenshot do modal
        await page.screenshot({
            path: 'corrigido-02-modal-aberto.png',
            fullPage: false
        });
        console.log('📸 Screenshot do modal');

        console.log('\n📝 3. Preenchendo formulário usando data-testid...');

        // Aguardar formulário aparecer usando data-testid
        await page.waitForSelector('[data-testid="login-form"]', { timeout: 5000 });
        console.log('✅ Formulário de login encontrado');

        // Preencher email usando data-testid
        await page.waitForSelector('[data-testid="login-email"]', { timeout: 5000 });
        await page.fill('[data-testid="login-email"]', credenciais.email);
        console.log(`✅ Email preenchido: ${credenciais.email}`);

        await page.waitForTimeout(500);

        // Preencher senha usando data-testid
        await page.waitForSelector('[data-testid="login-password"]', { timeout: 5000 });
        await page.fill('[data-testid="login-password"]', credenciais.senha);
        console.log('✅ Senha preenchida');

        await page.waitForTimeout(500);

        // Screenshot dos campos preenchidos
        await page.screenshot({
            path: 'corrigido-03-preenchido.png',
            fullPage: false
        });
        console.log('📸 Screenshot dos campos preenchidos');

        console.log('\n🚀 4. Submetendo formulário usando data-testid...');

        // Usar o botão de submit com data-testid
        await page.waitForSelector('[data-testid="login-submit"]', { timeout: 5000 });
        console.log('✅ Botão de submit encontrado');

        // Clicar no botão de submit
        await page.click('[data-testid="login-submit"]');
        console.log('🎯 Clique no botão de submit executado');

        // Aguardar processamento e redirecionamento
        console.log('⏳ Aguardando processamento...');
        await page.waitForTimeout(5000);

        // Verificar se houve redirecionamento
        const urlFinal = page.url();
        console.log(`📍 URL final: ${urlFinal}`);

        // Screenshot final
        await page.screenshot({
            path: 'corrigido-04-resultado.png',
            fullPage: false
        });
        console.log('📸 Screenshot final');

        // Verificar se o login foi bem-sucedido
        if (urlFinal.includes('/app')) {
            console.log('\n🎉 SUCESSO! Login funcionou!');
            console.log(`✅ Redirecionado para: ${urlFinal}`);

            // Capturar título da página logada
            const titulo = await page.title();
            console.log(`📄 Título: ${titulo}`);

            // Verificar se há elementos indicando que está logado
            try {
                const userInfo = await page.textContent('h1, .user-name, [data-testid="user-info"]');
                if (userInfo) {
                    console.log(`👤 Informações do usuário: ${userInfo}`);
                }
            } catch {}

            return true;

        } else {
            console.log('\n❌ FALHA! Login não redirecionou');
            console.log(`❌ Ainda em: ${urlFinal}`);

            // Verificar se há mensagens de erro específicas
            try {
                const errorMessages = await page.locator('.error, .alert-error, [role="alert"]').allTextContents();
                if (errorMessages.length > 0) {
                    console.log('⚠️ Mensagens de erro:');
                    errorMessages.forEach(msg => console.log(`   - ${msg}`));
                }
            } catch {}

            // Verificar se ainda está no modal
            const modalVisible = await page.isVisible('[data-testid="login-form"]');
            console.log(`🔍 Modal ainda visível: ${modalVisible}`);

            return false;
        }

    } catch (erro) {
        console.log(`\n💥 ERRO: ${erro.message}`);

        // Screenshot do erro
        try {
            await page.screenshot({
                path: 'corrigido-99-erro.png',
                fullPage: false
            });
            console.log('📸 Screenshot do erro');
        } catch {}

        // Verificar qual elemento causou o erro
        if (erro.message.includes('data-testid')) {
            console.log('❌ Problema com data-testid - verificar se as correções foram aplicadas');
        } else if (erro.message.includes('timeout')) {
            console.log('❌ Timeout - elemento não encontrado ou página não carregou');
        } else {
            console.log('❌ Erro inesperado');
        }

        return false;

    } finally {
        console.log('\n🔚 Fechando navegador...');
        await browser.close();
    }
}

// Função auxiliar para verificar se as correções foram aplicadas
async function verificarCorrecoes() {
    console.log('\n🔍 VERIFICANDO SE AS CORREÇÕES FORAM APLICADAS...');

    const arquivos = [
        '/Users/vcg/development/ADRITEM/madrilusasite/src/components/ui/dialog.tsx',
        '/Users/vcg/development/ADRITEM/madrilusasite/src/modules/auth/components/LoginForm.tsx',
        '/Users/vcg/development/ADRITEM/madrilusasite/src/institutional/components/InstitutionalHeader.tsx'
    ];

    for (const arquivo of arquivos) {
        try {
            const fs = await import('fs');
            const conteudo = fs.readFileSync(arquivo, 'utf8');

            console.log(`\n📁 ${arquivo.split('/').pop()}:`);

            if (arquivo.includes('dialog.tsx')) {
                if (conteudo.includes('pointer-events-none data-[state=open]:pointer-events-auto')) {
                    console.log('✅ Correção do overlay aplicada');
                } else {
                    console.log('❌ Correção do overlay NÃO aplicada');
                }
            }

            if (arquivo.includes('LoginForm.tsx')) {
                const testids = ['data-testid="login-form"', 'data-testid="login-email"', 'data-testid="login-password"', 'data-testid="login-submit"'];
                const aplicados = testids.filter(id => conteudo.includes(id));
                console.log(`✅ ${aplicados.length}/${testids.length} data-testid aplicados`);
            }

            if (arquivo.includes('InstitutionalHeader.tsx')) {
                if (conteudo.includes('data-testid="header-login-button"')) {
                    console.log('✅ data-testid do botão header aplicado');
                } else {
                    console.log('❌ data-testid do botão header NÃO aplicado');
                }
            }

        } catch (erro) {
            console.log(`❌ Erro ao verificar ${arquivo}: ${erro.message}`);
        }
    }
}

// Executar verificação e teste
console.log('🧪 INICIANDO TESTE DE LOGIN CORRIGIDO...');

verificarCorrecoes()
    .then(() => testeLoginCorrigido())
    .then(sucesso => {
        console.log('\n' + '='.repeat(50));
        if (sucesso) {
            console.log('🎉 TESTE PASSOU! As correções funcionaram!');
            console.log('✅ Login foi bem-sucedido');
            console.log('✅ Automação agora funciona corretamente');
        } else {
            console.log('❌ TESTE FALHOU');
            console.log('⚠️ Pode ser necessário ajustes adicionais');
        }
        console.log('📸 Screenshots: corrigido-*.png');
        console.log('='.repeat(50));
    })
    .catch(erro => {
        console.log('\n💥 ERRO FATAL:', erro.message);
    });