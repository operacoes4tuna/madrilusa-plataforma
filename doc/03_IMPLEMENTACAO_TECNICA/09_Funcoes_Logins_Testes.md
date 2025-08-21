# 📋 MAPEAMENTO: SISTEMA DE LOGIN RÁPIDO PARA DESENVOLVIMENTO

## 🎯 **OBJETIVO**
Criar atalhos de login para facilitar testes durante desenvolvimento, permitindo login rápido como cada categoria de usuário através de:
1. **Botões de atalho** no modal de login
2. **Usuários pré-definidos** com credenciais padronizadas
3. **Compatibilidade** com sistema de login atual

---

## 🗄️ **MAPEAMENTO DO SISTEMA ATUAL DE AUTENTICAÇÃO**

### **Fluxo Atual de Login**
```typescript
// Frontend: src/modules/auth/
├── components/
│   ├── AuthModal.tsx          # Modal principal (toggle login/register)
│   ├── LoginForm.tsx         # Formulário de login atual
│   └── RegisterForm.tsx      # Formulário de registro
├── hooks/
│   └── useAuth.ts            # Hook de autenticação
├── services/
│   └── authApi.ts            # Comunicação com API
└── types/
    └── auth.types.ts         # Tipos TypeScript
```

### **Backend: Endpoints de Autenticação**
```typescript
// backend/src/modules/auth/
├── auth.service.ts           # Lógica de negócio
├── auth.controller.ts        # Controladores HTTP
└── auth.routes.ts           # Rotas /api/auth/*

// Endpoints ativos:
POST /api/auth/login          # Login atual
POST /api/auth/register       # Registro atual
POST /api/auth/register-basic # Registro em 2 etapas
```

### **Validação Atual**
```typescript
// auth.service.ts - método login()
1. Buscar usuário por email
2. Verificar senha (texto simples)
3. Retornar usuário sem senha
4. Frontend armazena em localStorage
5. Redirecionamento baseado em categoria
```

---

## 👥 **USUÁRIOS DE DESENVOLVIMENTO NECESSÁRIOS**

### **Usuários a Criar**
```yaml
1. Empresa:
   email: empresa@madrilusa.com.pt
   senha: vcgvcg
   categoria: EMPRESA
   nomeCompleto: "Empresa de Desenvolvimento"

2. Imigrante:
   email: imigrante@madrilusa.com.pt
   senha: vcgvcg
   categoria: IMIGRANTE
   nomeCompleto: "Imigrante de Desenvolvimento"

3. Município:
   email: municipio@madrilusa.com.pt
   senha: vcgvcg
   categoria: MUNICIPIO
   nomeCompleto: "Município de Desenvolvimento"

4. Família:
   email: familia@madrilusa.com.pt
   senha: vcgvcg
   categoria: FAMILIA_ACOLHIMENTO
   nomeCompleto: "Família de Desenvolvimento"

5. Admin:
   email: admin@madrilusa.com.pt
   senha: vcgvcg
   categoria: ADMIN
   nomeCompleto: "Admin de Desenvolvimento"
```

### **Perfis Específicos Necessários**
Cada usuário precisará de perfil completo para testar funcionalidades:
- **Empresa:** PerfilEmpresa com dados básicos
- **Imigrante:** PerfilImigrante com nacionalidade/data
- **Município:** PerfilMunicipio com dados municipais
- **Família:** PerfilFamilia com endereço
- **Admin:** Sem perfil específico

---

## 🎨 **ALTERAÇÕES NO FRONTEND**

### **1. LoginForm.tsx - Adicionar Botões de Atalho**
```typescript
// Localização: src/modules/auth/components/LoginForm.tsx
// Alterações necessárias:

interface QuickLoginButton {
  categoria: string;
  email: string;
  label: string;
  icon: string;
  color: string;
}

const quickLoginButtons: QuickLoginButton[] = [
  {
    categoria: 'IMIGRANTE',
    email: 'imigrante@madrilusa.com.pt',
    label: 'Imigrante',
    icon: 'language',
    color: '#28a745'
  },
  {
    categoria: 'EMPRESA', 
    email: 'empresa@madrilusa.com.pt',
    label: 'Empresa',
    icon: 'business',
    color: '#007bff'
  },
  // ... outros botões
];

// Seção a adicionar no formulário:
{process.env.NODE_ENV === 'development' && (
  <div className="quick-login-section">
    <small className="text-muted">Login Rápido (Desenvolvimento):</small>
    <div className="d-flex flex-wrap mt-2">
      {quickLoginButtons.map(button => (
        <Button
          key={button.categoria}
          size="sm"
          style={{ backgroundColor: button.color }}
          onClick={() => handleQuickLogin(button.email)}
          className="mr-1 mb-1"
        >
          <i className="material-icons mr-1">{button.icon}</i>
          {button.label}
        </Button>
      ))}
    </div>
  </div>
)}
```

### **2. useAuth.ts - Adicionar Função de Login Rápido**
```typescript
// Localização: src/modules/auth/hooks/useAuth.ts
// Função a adicionar:

const quickLoginMutation = useMutation({
  mutationFn: (email: string) => authApi.login({
    email,
    senha: 'vcgvcg'
  }),
  onSuccess: (data) => {
    // Mesmo fluxo do login normal
    const userData = data.data as User;
    setUser(userData);
    localStorage.setItem('madrilusa_user', JSON.stringify(userData));
    
    toast({
      title: "Login rápido realizado!",
      description: `Logado como ${userData.categoria}`,
    });
    
    navigate('/app/dashboard');
  },
  onError: (error: Error) => {
    toast({
      title: "Erro no login rápido",
      description: error.message,
      variant: "destructive",
    });
  }
});

// Função a exportar:
const quickLogin = (email: string) => {
  quickLoginMutation.mutate(email);
};

return {
  // ... exports existentes
  quickLogin,
  isQuickLogging: quickLoginMutation.isPending
};
```

### **3. AuthModal.tsx - Indicador Visual**
```typescript
// Localização: src/modules/auth/components/AuthModal.tsx
// Alteração necessária:

// Adicionar indicador quando for ambiente de desenvolvimento
{process.env.NODE_ENV === 'development' && (
  <div className="alert alert-info small">
    <i className="material-icons mr-1">info</i>
    Modo desenvolvimento - Login rápido disponível
  </div>
)}
```

---

## 🔧 **ALTERAÇÕES NO BACKEND**

### **1. Seed de Usuários de Desenvolvimento**
```typescript
// Arquivo: backend/prisma/seed-dev-users.ts
// Função principal:

async function createDevUsers() {
  const devUsers = [
    {
      nomeCompleto: "Empresa de Desenvolvimento",
      email: "empresa@madrilusa.com.pt",
      senha: "vcgvcg",
      categoria: "EMPRESA",
      perfil: {
        nomeEmpresa: "Empresa Tech Madrilusa",
        pessoaContacto: "João Silva",
        morada: "Lisboa, Portugal",
        observacoes: "Empresa de tecnologia focada em inovação social"
      }
    },
    {
      nomeCompleto: "Imigrante de Desenvolvimento", 
      email: "imigrante@madrilusa.com.pt",
      senha: "vcgvcg",
      categoria: "IMIGRANTE",
      perfil: {
        nacionalidade: "Brasileira",
        dataNascimento: new Date('1995-06-15'),
        objetivos: JSON.stringify(["Emprego", "Formação"]),
        mensagem: "Busco oportunidades de integração em Portugal",
        aceitaNotificacoes: true
      }
    }
    // ... outros usuários
  ];

  // Lógica de criação com perfis completos
}
```

### **2. Script de Setup Desenvolvimento**
```typescript
// Arquivo: backend/package.json
// Script a adicionar:

"scripts": {
  // ... scripts existentes
  "dev:seed": "tsx prisma/seed-dev-users.ts",
  "dev:reset": "npx prisma db push --force-reset && npm run dev:seed"
}
```

### **3. Validação de Ambiente**
```typescript
// Localização: backend/src/modules/auth/auth.service.ts
// Função a adicionar:

async function isDevEnvironment(): Promise<boolean> {
  return process.env.NODE_ENV === 'development';
}

// Modificação no método login para aceitar credenciais dev:
async login(data: LoginRequest) {
  const user = await userService.getUserByEmail(data.email);
  
  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // Verificar senha normal ou dev
  const isValidPassword = user.senha === data.senha;
  const isDevLogin = await isDevEnvironment() && 
                     data.senha === 'vcgvcg' && 
                     user.email.endsWith('@madrilusa.com.pt');

  if (!isValidPassword && !isDevLogin) {
    throw new Error('Credenciais inválidas');
  }

  // ... resto da lógica
}
```

---

## 🔄 **FLUXO DE IMPLEMENTAÇÃO**

### **Etapa 1: Backend (30 min)**
1. **Criar seed de usuários dev** (15 min)
   - Script `seed-dev-users.ts`
   - 5 usuários com perfis completos
   - Contribuições de exemplo

2. **Modificar validação de login** (10 min)
   - Aceitar senha 'vcgvcg' em desenvolvimento
   - Validar emails @madrilusa.com.pt
   - Manter segurança para outros usuários

3. **Executar seed** (5 min)
   - Criar usuários no banco
   - Verificar perfis criados
   - Testar login via API

### **Etapa 2: Frontend (45 min)**
1. **Modificar LoginForm.tsx** (20 min)
   - Adicionar botões de atalho
   - Styling responsivo
   - Condição de desenvolvimento

2. **Estender useAuth.ts** (15 min)
   - Função quickLogin
   - Estados de loading
   - Tratamento de erros

3. **Atualizar AuthModal.tsx** (10 min)
   - Indicador de modo dev
   - Ajustes de layout
   - Testes de usabilidade

### **Etapa 3: Testes e Validação (15 min)**
1. **Testar cada usuário** (10 min)
   - Login manual com credenciais
   - Login via botões de atalho
   - Verificar redirecionamentos

2. **Validar funcionalidades** (5 min)
   - Dashboards específicos
   - Contribuições por categoria
   - Menu lateral correto

---

## ⚠️ **RISCOS E CONSIDERAÇÕES**

### **Riscos de Segurança**
- ✅ **Mitigado:** Funcionalidade apenas em desenvolvimento
- ✅ **Mitigado:** Validação de ambiente NODE_ENV
- ✅ **Mitigado:** Emails específicos @madrilusa.com.pt
- ⚠️ **Atenção:** Remover em produção

### **Impactos no Sistema Atual**
- ✅ **Zero impacto:** Login normal continua funcionando
- ✅ **Zero impacto:** Usuários existentes inalterados
- ✅ **Zero impacto:** APIs de produção intactas
- ✅ **Compatível:** Com sistema de categorias atual

### **Dependências**
- ✅ **Sistema de categorias** - Já implementado
- ✅ **Criação de perfis** - APIs existentes funcionais
- ✅ **Validação de login** - Estrutura existente
- ✅ **Redirecionamento** - Baseado em categoria

---

## 📊 **ESTRUTURA DE DADOS NECESSÁRIA**

### **Usuários Base (Tabela users)**
```sql
INSERT INTO users (nomeCompleto, email, senha, categoria) VALUES
('Empresa de Desenvolvimento', 'empresa@madrilusa.com.pt', 'vcgvcg', 'EMPRESA'),
('Imigrante de Desenvolvimento', 'imigrante@madrilusa.com.pt', 'vcgvcg', 'IMIGRANTE'),
('Município de Desenvolvimento', 'municipio@madrilusa.com.pt', 'vcgvcg', 'MUNICIPIO'),
('Família de Desenvolvimento', 'familia@madrilusa.com.pt', 'vcgvcg', 'FAMILIA_ACOLHIMENTO'),
('Admin de Desenvolvimento', 'admin@madrilusa.com.pt', 'vcgvcg', 'ADMIN');
```

### **Perfis Específicos Necessários**
```sql
-- PerfilEmpresa
INSERT INTO perfis_empresa (userId, nomeEmpresa, pessoaContacto, morada, observacoes)

-- PerfilImigrante  
INSERT INTO perfis_imigrante (userId, nacionalidade, dataNascimento, objetivos, mensagem)

-- PerfilMunicipio
INSERT INTO perfis_municipio (userId, nomeMunicipio, distrito, pessoaContacto, funcaoCargo)

-- PerfilFamilia
INSERT INTO perfis_familia (userId, moradaCompleta, quantidadePessoas, tiposAcolhimento)
```

### **Contribuições de Exemplo**
```sql
-- 2-3 contribuições por usuário para testar funcionalidades
-- Usando tipos existentes configurados pelo admin
-- Tags variadas para testar sistema de tags
```

---

## 🎨 **COMPONENTES FRONTEND A MODIFICAR**

### **1. LoginForm.tsx**
```typescript
// Localização: src/modules/auth/components/LoginForm.tsx
// Linhas aproximadas: 80-120

// ADICIONAR após o botão "Entrar":
{process.env.NODE_ENV === 'development' && (
  <>
    <hr className="my-3" />
    <div className="text-center">
      <small className="text-muted d-block mb-2">
        <i className="material-icons mr-1" style={{fontSize: '14px'}}>
          developer_mode
        </i>
        Login Rápido - Desenvolvimento
      </small>
      <div className="d-flex flex-wrap justify-content-center">
        {/* Botões de atalho aqui */}
      </div>
    </div>
  </>
)}
```

### **2. useAuth.ts**
```typescript
// Localização: src/modules/auth/hooks/useAuth.ts
// Linhas aproximadas: 100-108

// ADICIONAR nova função:
const quickLogin = (email: string) => {
  loginMutation.mutate({
    email,
    senha: 'vcgvcg'
  });
};

// ADICIONAR no return:
return {
  // ... exports existentes
  quickLogin,
  isLoading: loginMutation.isPending || registerMutation.isPending
};
```

### **3. AuthModal.tsx**
```typescript
// Localização: src/modules/auth/components/AuthModal.tsx
// Linha aproximada: 50-60

// ADICIONAR indicador de desenvolvimento:
{process.env.NODE_ENV === 'development' && (
  <div className="alert alert-info alert-sm">
    <i className="material-icons mr-1">info</i>
    <small>Modo desenvolvimento ativo - Login rápido disponível</small>
  </div>
)}
```

---

## 🔧 **ARQUIVOS BACKEND A MODIFICAR**

### **1. Novo Arquivo: seed-dev-users.ts**
```typescript
// Localização: backend/prisma/seed-dev-users.ts
// Tamanho estimado: ~200 linhas

// Funcionalidades:
- Criar 5 usuários de desenvolvimento
- Criar perfis específicos completos
- Criar 2-3 contribuições por usuário
- Usar tipos e tags existentes
- Verificar duplicatas antes de criar
```

### **2. Modificar: auth.service.ts**
```typescript
// Localização: backend/src/modules/auth/auth.service.ts
// Método: login() - linhas 88-104

// ADICIONAR validação de desenvolvimento:
const isDevLogin = process.env.NODE_ENV === 'development' && 
                   data.senha === 'vcgvcg' && 
                   user.email.endsWith('@madrilusa.com.pt');

if (!isValidPassword && !isDevLogin) {
  throw new Error('Credenciais inválidas');
}
```

### **3. Atualizar: package.json**
```json
// Localização: backend/package.json
// Scripts a adicionar:

"scripts": {
  "dev:seed-users": "tsx prisma/seed-dev-users.ts",
  "dev:reset-db": "npx prisma db push --force-reset && npm run dev:seed-users"
}
```

---

## 🧪 **ESTRATÉGIA DE TESTES**

### **Testes Backend**
```bash
# 1. Criar usuários
npm run dev:seed-users

# 2. Testar login via API
curl -X POST /api/auth/login -d '{"email":"empresa@madrilusa.com.pt","senha":"vcgvcg"}'
curl -X POST /api/auth/login -d '{"email":"imigrante@madrilusa.com.pt","senha":"vcgvcg"}'

# 3. Verificar perfis
curl /api/empresas/perfil/{userId}
curl /api/imigrantes/perfil/{userId}
```

### **Testes Frontend**
```yaml
1. Modal de login:
   - Verificar botões de atalho aparecem
   - Testar clique em cada botão
   - Verificar redirecionamento correto

2. Funcionalidades por categoria:
   - Dashboard específico carrega
   - Menu lateral correto
   - Contribuições específicas visíveis

3. Responsividade:
   - Botões adaptam em mobile
   - Layout não quebra
   - Indicadores visíveis
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **Backend**
- [ ] Criar arquivo `seed-dev-users.ts`
- [ ] Implementar criação de 5 usuários + perfis
- [ ] Modificar `auth.service.ts` para aceitar login dev
- [ ] Adicionar scripts npm para desenvolvimento
- [ ] Executar seed e testar APIs

### **Frontend**
- [ ] Modificar `LoginForm.tsx` com botões de atalho
- [ ] Estender `useAuth.ts` com função quickLogin
- [ ] Atualizar `AuthModal.tsx` com indicador dev
- [ ] Testar responsividade em mobile
- [ ] Validar fluxo completo de login

### **Testes**
- [ ] Login manual com cada usuário dev
- [ ] Login via botões de atalho
- [ ] Verificar dashboards específicos
- [ ] Testar contribuições por categoria
- [ ] Validar menu lateral correto

---

## 🎯 **RESULTADO ESPERADO**

### **UX de Desenvolvimento Otimizada**
- **5 botões coloridos** no modal de login
- **Login em 1 clique** para cada categoria
- **Indicador visual** de modo desenvolvimento
- **Usuários completos** com dados realistas
- **Contribuições de exemplo** para testar

### **Compatibilidade Total**
- ✅ **Login normal** continua funcionando
- ✅ **Usuários existentes** inalterados  
- ✅ **Produção segura** (apenas em development)
- ✅ **APIs intactas** sem quebras

### **Facilidade de Testes**
- ✅ **Troca rápida** entre categorias
- ✅ **Dados realistas** para validação
- ✅ **Perfis completos** para testar funcionalidades
- ✅ **Contribuições variadas** para sistema de tags

---

**📋 PLANO COMPLETO MAPEADO E PRONTO PARA EXECUÇÃO**  
*Tempo estimado: 1h30min*  
*Impacto: Zero em funcionalidades existentes*  
*Benefício: Desenvolvimento 10x mais rápido*  

**🚀 AGUARDANDO APROVAÇÃO PARA IMPLEMENTAÇÃO**