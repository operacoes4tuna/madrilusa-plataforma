# 🚀 CLAUDE DEVELOPMENT GUIDE - MADRILUSA

## 📋 **INFORMAÇÕES ESSENCIAIS**

### **Contexto do Projeto**
- **Nome**: Madrilusa - Plataforma de Integração Social
- **Missão**: Integração de jovens imigrantes da CPLP em territórios rurais portugueses
- **Stack**: React 18.3.1 + Node.js + TypeScript + Prisma + OpenAI GPT-4
- **Status**: 100% implementado - 5 categorias de usuários funcionais
- **IA**: 3 sistemas integrados (Contribuições, SinergIA, Chatbot)

### **Entidades Promotoras**
- **Federação Minha Terra** (principal): mariaclarabraga@minhaterra.pt
- **ADRITEM**: madrilusa@adritem.pt | (+351) 937 342 173
- **ADRACES**: apoio-imigrantes@adraces.pt
- **CoraNE**: terrafria@corane.pt

---

## ⚡ **COMANDOS ESSENCIAIS**

### **Desenvolvimento**
```bash
# Rodar projeto completo (frontend + backend)
npm run dev:full

# Rodar apenas frontend (porta 8080)
npm run dev

# Rodar apenas backend (porta 3001)
npm run dev:backend

# Setup inicial do projeto
npm run setup

# Validação completa do código
npm run lint
npm run type-check
```

### **Base de Dados**
```bash
# Interface visual do banco (porta 5555)
cd backend && npx prisma studio

# Sincronizar schema
cd backend && npx prisma db push

# Reset completo do banco
cd backend && npx prisma db push --force-reset
```

---

## 🔐 **LOGIN RÁPIDO (DESENVOLVIMENTO)**

```bash
# Acesse: http://localhost:8080
# Clique em "Login" e use as credenciais:

🌍 Imigrante:  imigrante@madrilusa.com.pt  / vcgvcg
🏢 Empresa:    empresa@madrilusa.com.pt    / vcgvcg
🏛️ Município:  municipio@madrilusa.com.pt  / vcgvcg
🎓 Academia:   academia@madrilusa.com.pt   / vcgvcg
👨‍👩‍👧‍👦 Família:    familia@madrilusa.com.pt    / vcgvcg
🛡️ Admin:      admin@madrilusa.com.pt      / vcgvcg

# Credenciais originais do admin:
Admin: admin@madrilusa.com / madrilusa1234tuna
```

---

## 🏗️ **ESTRUTURA CRÍTICA DO PROJETO**

### **Responsabilidades por Diretório**
```
madrilusasite/
├── 📁 src/institutional/    # 🎨 MARKETING - Landing page
├── 📁 src/app/             # 💻 APLICAÇÃO - Sistema logado
├── 📁 backend/             # 🔧 API - Backend modular
├── 📁 doc/                 # 📋 DOCUMENTAÇÃO - NUNCA criar .md na raiz
└── 📁 public/             # 🎨 ASSETS - Identidade visual
```

### **URLs da Aplicação**
- **`/`** - Página institucional (marketing)
- **`/app/*`** - Aplicação logada (desenvolvimento)

---

## 📊 **ESTADO ATUAL COMPLETO**

### **✅ Categorias Implementadas (100%)**
| Categoria | Campos | Endpoints | Interface | Status |
|-----------|--------|-----------|-----------|---------|
| **🌍 Imigrantes** | 14 campos | 7 endpoints | ✅ Completa | 100% |
| **🏢 Empresas** | 4 campos | 6 endpoints | ✅ Completa | 100% |
| **🏛️ Municípios** | 7 campos | 6 endpoints | ✅ Completa | 100% |
| **🎓 Academias** | 9 campos | 6 endpoints | ✅ Completa | 100% |
| **👨‍👩‍👧‍👦 Famílias** | 5 campos | 6 endpoints | ✅ Completa | 100% |

### **🤖 Sistemas de IA Operacionais**
1. **Sistema de Contribuições**: Aprimoramento de texto + sugestão de tags
2. **SinergIA Madrilusa**: Matching inteligente entre categorias
3. **Chatbot Assistente**: Suporte interativo na landing page

### **📡 APIs Disponíveis (60+ Endpoints)**
```
/api/auth/*               # Autenticação
/api/users/*              # Gestão usuários
/api/imigrantes/*         # 7 endpoints específicos
/api/empresas/*           # 6 endpoints específicos
/api/municipios/*         # 6 endpoints específicos
/api/academias/*          # 6 endpoints específicos
/api/familias/*           # 6 endpoints específicos
/api/admin/*              # 6 endpoints administrativos
/api/contribuicoes/*      # Sistema contribuições
/api/dados-profissionais/* # Dados estruturados
/api/oportunidades-trabalho/* # Oportunidades emprego
/api/ai/*                 # 3 endpoints IA
/api/sinergia/*           # Matching V1
/api/sinergia-v2/*        # Matching V2
/api/sinergia-config/*    # Configuração IA
/api/system/*             # Monitoramento
```

---

## 🎯 **PADRÕES DE DESENVOLVIMENTO**

### **Convenções de Nomenclatura**
```typescript
// ✅ CORRETO
src/app/components/user-profile/ImigranteDetails.tsx
src/app/pages/PerfilImigrante.tsx
backend/src/modules/imigrantes/imigrante.service.ts

// ❌ EVITAR
src/components/imigrante.tsx
backend/modules/ImigranteService.ts
```

### **Estrutura Padrão Backend (Módulos)**
```
backend/src/modules/[categoria]/
├── [categoria].controller.ts    # Controlador HTTP
├── [categoria].service.ts       # Lógica de negócio
├── [categoria].routes.ts        # Definição de rotas
├── [categoria].types.ts         # Interfaces TypeScript
└── [categoria].validation.ts    # Validações (quando existir)
```

### **Padrões TypeScript**
```typescript
// ✅ Sempre usar tipagem rigorosa
interface NovaCategoria extends BaseUserCategory {
  campoEspecifico: string;
  campoOpcional?: number;
}

// ✅ Hooks com prefixo "use"
const useUserProfile = () => { ... }

// ✅ Componentes em PascalCase
export const UserProfileCard = ({ user }: Props) => { ... }

// ✅ Services com sufixo ".service.ts"
export class ImigranteService { ... }
```

---

## 🔍 **COMANDOS DE INVESTIGAÇÃO**

### **Análise de Estrutura**
```bash
# Encontrar componentes por tipo
find src -name "*.tsx" | grep -E "(Perfil|User|Admin)"

# Verificar padrões de API
grep -r "POST\|GET\|PUT\|DELETE" backend/src/modules/

# Encontrar implementações de hooks
grep -r "useState\|useEffect\|useAuth" src/app/

# Verificar tipos existentes
find src/types -name "*.types.ts"
```

### **Investigação de IA**
```bash
# Verificar integração OpenAI
grep -r "openai\|OpenAI" src/ backend/

# Endpoints de IA
grep -r "/api/ai\|/api/sinergia" backend/src/

# Configurações sensíveis
find . -name ".env*" | grep -v node_modules
```

### **Análise de Base de Dados**
```bash
# Ver schema atual
cat backend/prisma/schema.prisma

# Migrations disponíveis
ls backend/prisma/migrations/
```

---

## 🎨 **IDENTIDADE VISUAL OFICIAL**

### **Paleta de Cores**
- **Laranja Madrilusa**: `#F5A623` (RGB: 245, 166, 35)
- **Azul Turquesa**: `#4A90A4` (RGB: 74, 144, 164)
- **Cinzento Escuro**: `#333333` (texto corpo)
- **Cinzento Claro**: `#F5F5F5` (fundos alternativos)

### **Tipografia**
- **Família**: Open Sans, Helvetica Neue, sans-serif
- **H1**: 32px, bold, Azul Turquesa
- **H2**: 24px, semibold, Azul Turquesa
- **Corpo**: 16px, regular, Cinzento Escuro

### **Classes CSS Específicas**
```css
.app-title-h1      # Títulos principais da aplicação
.app-card          # Cards padrão da aplicação
.app-button-primary # Botões primários laranja
```

---

## 🛡️ **SEGURANÇA E CONFIGURAÇÕES**

### **⚠️ IMPORTANTE - Configurações Sensíveis**
- **OpenAI API Key**: Configurada em `backend/.env` (OPENAI_API_KEY)
- **Database**: SQLite local em `backend/dev.db`
- **CORS**: Configurado para desenvolvimento (8080, 5173) e produção

### **Rate Limiting de IA**
- **IA Geral**: 20 requests/15 minutos
- **SinergIA**: 10 análises/5 minutos
- **Chatbot**: Sem limite (frontend direto)

---

## 📚 **DOCUMENTAÇÃO DISPONÍVEL**

### **Documentos-Chave**
```
README.md                     # Visão geral completa (390+ linhas)
doc/status_implementacao/     # 20 documentos de status
doc/03_IMPLEMENTACAO_TECNICA/ # 16 guias técnicos
doc/02-IA_DEFINICOES_FUNCIONAIS_IA/ # Dossiê completo de IA
```

### **🚨 POLÍTICA DE DOCUMENTAÇÃO**
> **IMPORTANTE**: Toda documentação (.md) deve ser criada APENAS na pasta `doc/`.
> NUNCA criar arquivos .md na raiz do projeto para manter organização.

---

## 🚀 **FLUXOS PRINCIPAIS**

### **1. Fluxo de Registro**
1. Landing page → Modal categoria
2. Registro básico (nome, email, senha, categoria)
3. Perfil específico (campos por categoria)
4. Dashboard personalizado

### **2. Fluxo de Contribuições**
1. Menu dinâmico por categoria
2. Formulário com orientações IA
3. Aprimoramento opcional (GPT-4)
4. Tags sugeridas pela IA
5. Publicação no sistema

### **3. Fluxo SinergIA**
1. Análise perfil completo
2. Busca compatibilidades outras categorias
3. Processamento IA (GPT-4)
4. Resultados com scores
5. Solicitação de contacto

---

## 🎯 **METODOLOGIA DE TRABALHO**

### **⚠️ IMPORTANTE: Uso Automático de Agentes Especializados**

**SEMPRE** que receber solicitação relacionada à **home page institucional**, você DEVE:
1. **Invocar automaticamente** o agente `homepage-editor`
2. **NÃO** fazer edições diretas em `/src/institutional/`
3. **Deixar o agente** realizar todas as modificações com isolamento garantido

#### Gatilhos para Invocação Automática do homepage-editor:
- Menções a: home page, landing page, página institucional, site institucional
- Componentes: Hero, About, FAQ, Footer, Header, RegistrationCards, Objectives, Activities, Newsletter, Target, InstitutionalHeader
- Elementos: botões da home, links, âncoras, navegação, redes sociais, formulários
- Edições em: `/src/institutional/`, `institutional-theme.css`, `/public/institutional-assets/`
- Qualquer modificação visual ou funcional da landing page

#### Exemplo de Uso Automático:
```
Usuário: "Alterar o texto do botão Hero"
Você: [Detecta gatilho "botão Hero" → Invoca homepage-editor automaticamente]
      O agente homepage-editor foi invocado para realizar esta alteração com isolamento total...
```

### **Workflow Consistente**
1. **📖 Análise**: Ler README.md e documentação relevante
2. **🤖 Delegação**: Invocar agentes especializados quando apropriado (OBRIGATÓRIO para home page)
3. **📋 Planejamento**: Usar TodoWrite para organizar tarefas
4. **🔍 Investigação**: Verificar padrões existentes no código
5. **⚙️ Implementação**: Seguir convenções estabelecidas (ou delegar ao agente)
6. **✅ Validação**: Executar lint + type-check + testes manuais
7. **📝 Documentação**: Atualizar status quando necessário

### **Checklist Essencial**
- [ ] Li o contexto em README.md ou CLAUDE.md
- [ ] Verifiquei padrões similares no código
- [ ] Usei TodoWrite para organizar tarefas
- [ ] Segui convenções de nomenclatura
- [ ] Executei `npm run lint` sem erros
- [ ] Executei `npm run type-check` sem erros
- [ ] Testei funcionalidade manualmente

---

## 💡 **DICAS ESPECÍFICAS CLAUDE CODE**

### **Ferramentas Eficientes**
```typescript
// ✅ Task para buscas complexas
"Encontrar todos os componentes de formulário de categorias"

// ✅ Grep para padrões específicos
pattern: "useAuth|useUser" glob: "*.ts*"

// ✅ Read para entender implementações
Read: src/app/components/user-profile/ImigranteDetails.tsx

// ✅ Glob para encontrar arquivos por padrão
pattern: "**/*Profile*.tsx"
```

### **Estratégia de Análise**
1. **Contexto Global**: README.md + CLAUDE.md
2. **Padrões**: Buscar implementações similares
3. **Estrutura**: Entender responsabilidades por pasta
4. **Tipos**: Verificar interfaces TypeScript
5. **Documentação**: Consultar `/doc` para especificações

---

## 📊 **MÉTRICAS ATUAIS**

### **Sistema Operacional**
- **39+ campos específicos** por categoria
- **60+ endpoints** funcionais
- **27 usuários** no sistema
- **18 contribuições** ativas
- **55 tags** compartilhadas
- **9 tipos** de contribuição configurados

### **Performance**
- **< 100ms**: Resposta média endpoints
- **< 2s**: Carregamento páginas
- **100%**: Responsivo mobile
- **0 bugs**: Reportados

---

## 🎉 **PRÓXIMOS FOCOS**

### **Áreas de Expansão**
- Sistema de notificações
- Mobile app (React Native)
- Geolocalização avançada
- Analytics e relatórios
- API pública para integrações

### **Otimizações IA**
- Cache Redis para respostas
- Fine-tuning do modelo
- Análise de sentimento
- Tradução automática

---

## 🏠 **HOME PAGE INSTITUCIONAL - ISOLAMENTO GARANTIDO**

### 🎯 **Agente Especializado Disponível**
```bash
# Para edições na home page, use o agente especializado:
/agent homepage-editor "sua solicitação aqui"
```

### 🔒 **ARQUITETURA DE ISOLAMENTO**

O projeto possui **duas aplicações distintas** com isolamento garantido:

#### **1. Home Page Institucional** (`/src/institutional/`)
- **Propósito**: Marketing e apresentação do projeto
- **Rota**: `/` (landing page)
- **UI Framework**: shadcn/ui (isolado)
- **Estilos**: `institutional-theme.css` com variáveis `--institutional-*`
- **Assets**: `/public/institutional-assets/`

#### **2. Plataforma Logada** (`/src/app/`)
- **Propósito**: Sistema completo para usuários registrados
- **Rotas**: `/app/*` (dashboard, perfis, contribuições, etc.)
- **UI Framework**: Shards-React
- **Estilos**: Componentes próprios
- **Assets**: `/public/logo_madrilusa/` (compartilhado)

### ⚠️ **REGRAS DE SEGURANÇA PARA HOME PAGE**

#### **✅ PODE EDITAR (Áreas Seguras)**
- `/src/institutional/components/` - Todos os componentes da home
- `/src/institutional/styles/` - Estilos exclusivos institucionais
- `/src/institutional/pages/` - Páginas institucionais
- `/src/institutional/components/ui/` - Componentes UI isolados
- `/public/institutional-assets/` - Assets exclusivos da home

#### **❌ NUNCA EDITAR (Áreas Proibidas)**
- `/src/app/` - Plataforma logada
- `/src/modules/` - Módulos da aplicação
- `/src/components/ui/` - Componentes UI compartilhados (afeta auth e chatbot)
- `/src/shared/` - Componentes compartilhados (exceto análise)
- `backend/` - Backend da aplicação

### 📊 **ANÁLISE DE DEPENDÊNCIAS REALIZADA**

#### **Componentes Compartilhados (Cuidado)**
1. **Chatbot** (`/src/shared/components/Chatbot.tsx`)
   - Usado tanto na home quanto na plataforma
   - Usa componentes UI originais de `@/components/ui/`
   - **Não editar** - componente genuinamente compartilhado

2. **Módulos de Auth** (`/src/modules/auth/`)
   - LoginForm e RegisterForm usam `@/components/ui/`
   - **Não editar** componentes UI originais

3. **Assets de Logo** (Cuidado Especial)
   - `/public/logo_madrilusa/` - Usado pela plataforma (sidebar)
   - `/public/institutional-assets/` - Uso exclusivo da home (isolado)

### 🛡️ **COMPONENTES UI ISOLADOS**

Para garantir zero impacto, a home institucional possui **cópias isoladas** dos componentes shadcn/ui:

```
/src/institutional/components/ui/
├── button.tsx         # ✅ Isolado
├── card.tsx          # ✅ Isolado
├── input.tsx         # ✅ Isolado
├── accordion.tsx     # ✅ Isolado
├── dialog.tsx        # ✅ Isolado
├── select.tsx        # ✅ Isolado
├── checkbox.tsx      # ✅ Isolado
├── textarea.tsx      # ✅ Isolado
└── label.tsx         # ✅ Isolado
```

**Sempre importar** de caminhos relativos: `import { Button } from "../components/ui/button"`

### 📍 **ESTRUTURA DA HOME PAGE**

```
LandingPage.tsx (componente principal)
├── InstitutionalHeader    # Navegação superior
├── Hero                   # Seção principal com CTA
├── About                  # "Bem-vindos ao Madrilusa"
├── RegistrationCards      # Cards de categorias (#como-participar)
├── Objectives             # Objetivos principais (#como-ajudar)
├── Target                 # "A quem se destina?"
├── Activities             # Ações do projeto
├── FAQ                    # Perguntas frequentes
├── Newsletter             # Formulário de inscrição
├── Footer                 # Rodapé e contactos (#contactos)
└── Chatbot               # Assistente (compartilhado - não editar)
```

### 🔗 **Âncoras de Navegação**
- `#home` - Hero section
- `#sobre` - About section
- `#como-participar` - RegistrationCards (target para "Junte-se a nós")
- `#como-ajudar` - Objectives (target para "Faça parte desta missão")
- `#para-quem` - Target section
- `#actividades` - Activities section
- `#faq` - FAQ section
- `#newsletter` - Newsletter section
- `#contactos` - Footer section

### ✅ **VALIDAÇÃO DE ISOLAMENTO**

```bash
# Script de validação automática
./scripts/validate-isolation.sh

# Validação manual
grep -r "from.*institutional" src/app/        # Deve retornar vazio
grep -r "@/components/ui" src/institutional/   # Deve usar UI isolado
```

### 📝 **CHECKLIST DE SEGURANÇA PARA EDIÇÕES**

Antes de confirmar qualquer mudança na home:
- [ ] Arquivo editado está em `/src/institutional/`?
- [ ] Não modifiquei componentes em `@/components/ui/`?
- [ ] Usei componentes UI de `/src/institutional/components/ui/`?
- [ ] Validei visualmente com Playwright?
- [ ] Testei navegação/interações?
- [ ] Mantive identidade visual Madrilusa?
- [ ] Executei script de validação?

### 🎨 **IDENTIDADE VISUAL UNIFICADA**

Apesar do isolamento, ambas as aplicações seguem a mesma identidade visual:
- **Laranja Madrilusa**: `#F5A623`
- **Azul Turquesa**: `#4A90A4`
- **Tipografia**: Open Sans, Helvetica Neue
- **Logos**: Mesma identidade (assets duplicados para segurança)

### 📚 **DOCUMENTAÇÃO ADICIONAL**

- **Agente Homepage**: `.claude/agents/homepage-editor.md`
- **Componentes UI Isolados**: `src/institutional/components/ui/README.md`
- **Assets Isolados**: `public/institutional-assets/README.md`
- **Guia Completo**: `doc/agentes/HOMEPAGE_EDITOR_GUIDE.md`

---

**📞 SUPORTE**: Para questões técnicas, consultar a documentação em `/doc` ou contactar ADRITEM: madrilusa@adritem.pt

---

*Este guia mantém-se atualizado com o estado atual do projeto Madrilusa.*
*Última atualização: Janeiro 2025*