# Madrilusa - Projeto de Inovação e Empreendedorismo Social

**Plataforma web para integração de jovens imigrantes em territórios rurais portugueses**

## 🚀 Sobre o Projeto

O **Madrilusa** é uma iniciativa de Inovação e Empreendedorismo Social (IIES) que promove a integração de jovens imigrantes da CPLP em Portugal, com foco na revitalização de territórios rurais. 

### 🎯 Missão
Conectar jovens imigrantes a oportunidades em territórios rurais, criando soluções inovadoras para:
- Exclusão social de jovens imigrantes
- Despovoamento de zonas rurais
- Escassez de mão-de-obra especializada
- Desenvolvimento territorial sustentável

### 🏢 Entidades Promotoras
- **Federação Minha Terra** (principal)
- **ADRITEM**
- **ADRACES**
- **CoraNE**

### 📊 Metas
- **2.400 jovens** atendidos
- **36 meses** de duração
- **5 públicos-alvo:** ✅ **TODOS IMPLEMENTADOS** - Imigrantes, Empresas, Municípios, Academia, Famílias

---

## 🛠️ Stack Tecnológica

### Frontend (✅ Implementado)
- **React 18.3.1** + **TypeScript**
- **Vite 5.4.1** (build tool)
- **Tailwind CSS 3.4.11** + **shadcn/ui**
- **React Query** (estado global)
- **OpenAI API** (chatbot + **IA de contribuições**)
- **React Hook Form + Zod** (validações)

### Backend (✅ Implementado)
- **Node.js + TypeScript**
- **Express.js** (API REST modular)
- **Prisma ORM** + **SQLite**
- **9 módulos completos** (46 endpoints + **4 endpoints IA** + **5 endpoints SinergIA**)
- **OpenAI GPT-4** (aprimoramento de contribuições + **matching inteligente**)
- **Validações robustas** + **Rate limiting IA**

---

## 🏗️ Estrutura do Projeto

### **📁 ESTRUTURA SEPARADA IMPLEMENTADA**
```
madrilusasite/
├── 📁 src/
│   ├── 📁 institutional/    # 🎨 MARKETING
│   │   ├── components/      # Componentes da landing page
│   │   ├── pages/          # LandingPage.tsx
│   │   └── styles/         # institutional-theme.css
│   ├── 📁 app/             # 💻 DESENVOLVIMENTO  
│   │   ├── layouts/        # AppLayout.tsx (✅ identidade visual)
│   │   ├── pages/          # Dashboard, Profile (✅ identidade aplicada)
│   │   ├── components/     # Componentes da aplicação
│   │   └── styles/         # app-theme.css (✅ identidade oficial)
│   ├── 📁 modules/         # 🔐 MÓDULOS (auth, etc.)
│   └── 📁 shared/          # 🤝 COMPARTILHADO
├── 📁 backend/             # 💻 API COMPLETA
│   ├── src/modules/        # auth, users, entities
│   ├── prisma/            # Schema e migrations
│   └── ...                # Express + TypeScript
├── 📁 doc/                # 📋 DOCUMENTAÇÃO COMPLETA
└── 📁 public/             # Assets estáticos + identidade visual
```

### **🌐 URLs**
- **`/`** - Página institucional (marketing)
- **`/app/*`** - Aplicação logada (desenvolvimento)

## 📚 Documentação

### **📋 Documentação do Projeto**
- **[Guia Completo de Conteúdo](doc/Guia%20Completo%20de%20Conteúdo%20e%20Seções%20do%20Madrilusa.md)** - Estrutura e conteúdo de todas as seções
- **[Manual de Identidade Visual](doc/Manual%20de%20Identidade%20Visual%20e%20Comunicação%20-%20Madrilusa.md)** - Guidelines de design e comunicação
- **[Guia de Inscrições](doc/Guia%20de%20Inscrições%20na%20Plataforma%20Madrilusa.md)** - Processo de registro por categoria

### **🏗️ Documentação Técnica**
- **[Sistema SinergIA Completo](doc/03_IMPLEMENTACAO_TECNICA/14_Sistema_SinergIA_Matching_Completo.md)** - ✅ **NOVO: Matching IA revolucionário entre categorias**
- **[Status SinergIA](doc/status_implementacao/STATUS_SinergIA_Implementado.md)** - ✅ **NOVO: Jornada feat/sinergIA-madrilusa**
- **[Sistema de IA Completo](doc/03_IMPLEMENTACAO_TECNICA/12_Sistema_IA_Contribuicoes_Completo.md)** - ✅ **IA integrada para aprimoramento de contribuições**
- **[Status Sistema IA](doc/status_implementacao/STATUS_Sistema_IA_Implementado.md)** - ✅ **Jornada completa de implementação IA**
- **[Metodologia Categoria Universal](doc/03_IMPLEMENTACAO_TECNICA/06_Metodologia_Categoria_Universal.md)** - ✅ **Padrão revolucionário para implementar categorias**
- **[Sistema de Categorias](doc/03_IMPLEMENTACAO_TECNICA/04_Sistema_Categorias_Usuario.md)** - ✅ **Todas as 5 categorias implementadas**
- **[Sistema de Contribuições Completo](doc/03_IMPLEMENTACAO_TECNICA/10_Sistema_Contribuicoes_Completo.md)** - ✅ **Sistema completo de contribuições por categoria**
- **[Funções de Login e Testes](doc/03_IMPLEMENTACAO_TECNICA/09_Funcoes_Logins_Testes.md)** - ✅ **Login rápido para desenvolvimento**
- **[Status Implementação Completa](doc/status_implementacao/STATUS_Todas_Categorias_Implementadas.md)** - ✅ **Resultado final e métricas**
- **[Status Sistema Contribuições](doc/status_implementacao/STATUS_Sistema_Contribuicoes_Implementado.md)** - ✅ **Jornada completa de implementação**
- **[Fluxo Técnico Completo](doc/03_IMPLEMENTACAO_TECNICA/01_Fluxo_Tecnico_Completo.md)** - ✅ **Arquitectura e fluxos implementados**
- **[Estrutura Separada](doc/03_IMPLEMENTACAO_TECNICA/03_Estrutura_Separada_Responsabilidades.md)** - Separação institucional vs aplicação
- **[Backend Modular](doc/03_IMPLEMENTACAO_TECNICA/02_Roadmap_Backend_Modular.md)** - ✅ **8 módulos implementados**
- **[Status Resumido](doc/status_implementacao/README_Status_Completo.md)** - ✅ **Resumo executivo completo**

### **📝 Política de Documentação**
> **🚨 IMPORTANTE:** Toda documentação (.md) deve ser criada APENAS na pasta `doc/`. Não criar arquivos .md na raiz do projeto para manter a organização.

### **🤖 Agentes Especializados Claude Code**

O projeto conta com agentes especializados para tarefas específicas:

#### **Homepage Editor Agent** (`homepage-editor`)
- **Invocação Automática**: Detecta automaticamente edições na home page institucional
- **Isolamento Total**: Garante que mudanças na home não afetam a plataforma
- **Validação Visual**: Usa MCP Playwright para confirmar alterações
- **Documentação**: [Guia Completo](doc/agentes/HOMEPAGE_EDITOR_GUIDE.md)

**Como usar:**
```bash
# Automático - apenas solicite:
"Alterar texto do botão Hero"
"Configurar links de redes sociais"
"Adicionar nova seção na home"

# Ou explicitamente:
/agent homepage-editor "sua solicitação"

# Validar isolamento:
./scripts/validate-isolation.sh
```

**Áreas de atuação:**
- ✅ `/src/institutional/` - Componentes da home
- ✅ `/src/institutional/components/ui/` - Componentes UI isolados
- ✅ `/public/institutional-assets/` - Assets exclusivos
- ❌ `/src/app/` - Plataforma (NUNCA edita)

---

## 🚀 Como Executar

### **Desenvolvimento Full-Stack**
```bash
# Instalar dependências (raiz + backend)
npm install
npm run setup

# Rodar frontend + backend simultaneamente
npm run dev:full

# Ou separadamente:
npm run dev              # Frontend (porta 8080)
npm run dev:backend      # Backend (porta 3001)
```

### **Login Rápido para Desenvolvimento**
```bash
# Acesse: http://localhost:8080
# Clique em "Login" e use os botões coloridos:

🌍 Imigrante:  imigrante@madrilusa.com.pt  / vcgvcg
🏢 Empresa:    empresa@madrilusa.com.pt    / vcgvcg  
🏛️ Município:  municipio@madrilusa.com.pt  / vcgvcg
🎓 Academia:   academia@madrilusa.com.pt   / vcgvcg
👨‍👩‍👧‍👦 Família:    familia@madrilusa.com.pt    / vcgvcg
🛡️ Admin:      admin@madrilusa.com.pt      / vcgvcg

# Ou credenciais originais:
Admin: admin@madrilusa.com / madrilusa1234tuna
```

### **🤖 Como Usar a IA**
```bash
# A IA está integrada no sistema de contribuições:

1. Faça login com qualquer usuário
2. Vá para o menu da sua categoria (ex: "Habilidades", "Oportunidades")
3. Clique "Adicionar [Tipo]"
4. Digite sua contribuição (mínimo 20 caracteres)
5. Use "✨ Aprimorar com IA" para melhorar o texto
6. Use "🏷️ Sugerir com IA" para obter tags relevantes
7. Acesse "SinergIA Madrilusa" no menu para encontrar compatibilidades

# Configuração OpenAI:
# A chave da API está configurada no backend/.env
# OPENAI_API_KEY=sk-proj-...
```

### **Scripts Disponíveis**
```bash
npm run dev:full      # Frontend + Backend juntos
npm run dev          # Frontend apenas
npm run dev:backend  # Backend apenas
npm run build        # Build para produção
npm run setup        # Setup inicial do backend
```

### **Banco de Dados**
```bash
cd backend
npx prisma studio    # Interface visual (porta 5555)
npx prisma db push   # Sincronizar schema
```

---

## ⚡ Funcionalidades Principais

### ✅ Funcionalidades Implementadas

#### **Página Institucional** (`/`)
- **Landing page completa** com todos os componentes
- **Modal de autenticação** (cadastro + login)
- **Chatbot inteligente** com OpenAI
- **Design system** consistente
- **47 componentes UI** reutilizáveis

#### **Aplicação** (`/app/*`)
- **Dashboard de utilizador** com boas-vindas (identidade visual aplicada)
- **Sistema de autenticação** completo
- **Edição de perfil** com formulários organizados
- **Rotas protegidas** por autenticação
- **Layout com sidebar** e navegação consistente
- **Identidade visual oficial** aplicada em todas as páginas
- **Português de Portugal** implementado em toda interface

#### **Sistema de Contribuições** (`/app/contribuicoes/*`)
- **Menu dinâmico** por categoria (ex: "Minhas Habilidades", "Minhas Oportunidades")
- **Páginas específicas** para cada tipo de contribuição
- **Formulários inteligentes** com orientações e tags sugeridas
- **Sistema de tags** compartilhado com contadores automáticos
- **18 contribuições** ativas de exemplo
- **Login rápido** para desenvolvimento (6 usuários pré-configurados)

#### **Backend API - TODAS AS 5 CATEGORIAS**
- **Sistema modular:** 5 módulos independentes  
- **30 endpoints funcionais:** 6 por categoria
- **5 categorias implementadas:** Imigrante, Empresa, Município, Academia, Família
- **Validações robustas:** TypeScript + Zod
- **Banco SQLite** com Prisma + migrações automáticas
- **Registro em 2 etapas** para todas as categorias
- **34+ campos específicos** por categoria

#### **Sistema de Contribuições - ✅ IMPLEMENTADO**
- **Sistema completo** de contribuições por categoria de usuário
- **9 tipos configurados:** Habilidades, Oportunidades, Cursos, Eventos, Notícias, Projetos, Suporte
- **Menu dinâmico:** Cada categoria vê apenas seus tipos específicos
- **18 contribuições** ativas de exemplo
- **55 tags inteligentes** com sistema compartilhado
- **Interface admin** para moderação e gestão completa
- **Login rápido** para desenvolvimento (6 usuários pré-configurados)

---

## 🎨 Design System & Identidade Visual

### **✅ Identidade Visual Oficial Aplicada**
Baseada no **Manual de Identidade Visual e Comunicação - Madrilusa**:

#### **🎨 Paleta de Cores Oficial**
- **Laranja Madrilusa:** `#F5A623` (RGB: 245, 166, 35)
- **Azul Turquesa:** `#4A90A4` (RGB: 74, 144, 164)
- **Cinzento Escuro:** `#333333` (texto corpo)
- **Cinzento Claro:** `#F5F5F5` (fundos alternativos)

#### **✍️ Tipografia Conforme Manual**
- **Família:** Open Sans, Helvetica Neue, sans-serif
- **H1:** 32px, bold, Azul Turquesa (títulos principais)
- **H2:** 24px, semibold, Azul Turquesa (subtítulos)
- **Corpo:** 16px, regular, Cinzento Escuro
- **Secundário:** 14px, Cinzento Médio

#### **🏗️ Sistema de Layout**
- **Espaçamentos:** múltiplos de 8px (8, 16, 24, 32, 48px)
- **Container:** máximo 1200px
- **Grelha modular** baseada no manual oficial

### **📱 Componentes e Páginas**
- **shadcn/ui:** Biblioteca completa de componentes
- **Classes CSS específicas:** `.app-title-h1`, `.app-card`, `.app-button-primary`
- **Páginas da aplicação:** Dashboard, Profile, AppLayout com identidade aplicada
- **Português de Portugal:** terminologia oficial implementada
- **Layout responsivo** e acessível

### **📋 Conformidade**
- ✅ **Cores oficiais** aplicadas em toda aplicação
- ✅ **Tipografia hierárquica** conforme especificação
- ✅ **Linguagem portuguesa** de Portugal
- ✅ **Sistema modular** implementado

---

## 📋 Política de Roadmaps

**IMPORTANTE:** Esta documentação não inclui roadmaps, próximos passos ou planos de desenvolvimento. Estes elementos devem ser definidos separadamente conforme necessidades específicas e não devem ser incluídos na documentação a menos que explicitamente solicitado.

---

## 🤝 Como Contribuir

### Para Desenvolvedores
1. Consulte o **[Guia Completo de Conteúdo e Seções](./doc/Guia%20Completo%20de%20Conteúdo%20e%20Seções%20do%20Madrilusa.md)** para contexto técnico
2. Consulte o **[Manual de Identidade Visual](./doc/Manual%20de%20Identidade%20Visual%20e%20Comunicação%20-%20Madrilusa.md)** para diretrizes visuais
3. Fork o repositório
4. Crie uma branch para sua feature
5. Faça commit das mudanças
6. Abra um Pull Request

### Para o Projeto Social - ✅ TODAS AS CATEGORIAS ATIVAS
- **🌍 Jovens imigrantes:** Registe-se na plataforma (9 campos específicos)
- **🏢 Empresas:** Ofereça oportunidades de emprego/estágio (4 campos específicos)
- **🏛️ Municípios:** Participe da revitalização territorial (7 campos específicos)
- **🎓 Academia:** Contribua com programas educacionais (9 campos específicos)
- **👨‍👩‍👧‍👦 Famílias:** Ofereça apoio no acolhimento (5 campos específicos)

**📊 Sistema completo:** 30 endpoints, 5 dashboards, registro em 2 etapas para todas

### **🎯 Sistema de Contribuições**

#### **Conceito**
Cada categoria de usuário pode criar múltiplas **contribuições específicas** ao seu perfil:
- **Imigrantes:** Habilidades profissionais e pessoais
- **Empresas:** Oportunidades de emprego e estágios  
- **Municípios:** Projetos, eventos e notícias locais
- **Academias:** Cursos e eventos educacionais
- **Famílias:** Tipos de suporte oferecidos

#### **Funcionalidades**
- **Menu dinâmico:** Cada categoria vê apenas seus tipos (ex: "Habilidades", "Oportunidades")
- **Páginas específicas:** Uma página dedicada para cada tipo de contribuição
- **Sistema de tags:** Tags compartilhadas entre todas as contribuições com contadores automáticos
- **Moderação admin:** Visualização, despublicar e excluir contribuições
- **Filtros visuais:** Interface admin com cores específicas por categoria
- **🤖 IA Integrada:** Aprimoramento inteligente de texto e sugestão de tags

#### **🤖 Funcionalidades de IA**
- **Aprimoramento de texto:** IA melhora clareza, gramática e impacto das contribuições
- **Sugestão de tags:** IA sugere tags relevantes baseadas no conteúdo e contexto
- **SinergIA Madrilusa:** IA encontra compatibilidades entre contribuições de diferentes categorias
- **Matching inteligente:** Sistema de sinergia que conecta imigrantes, empresas, municípios, academias e famílias
- **Contextualização:** IA adapta sugestões por categoria de usuário e tipo de contribuição
- **Português de Portugal:** IA especializada em linguagem portuguesa europeia
- **Rate limiting:** Proteção contra abuso (IA geral: 20/15min, SinergIA: 10/5min)

#### **Dados Atuais**
- **9 tipos** de contribuição configurados
- **18 contribuições** ativas de exemplo
- **55 tags** no sistema (51 em uso)
- **27 usuários** incluindo 6 de desenvolvimento
- **🤖 IA GPT-4** integrada e operacional

### **🧠 SinergIA Madrilusa**

#### **Conceito**
Sistema revolucionário de matching inteligente que utiliza IA para encontrar compatibilidades entre contribuições de diferentes categorias de usuários.

#### **Como Funciona**
- **Análise IA:** GPT-4 compara contribuições do usuário com todas as outras categorias
- **Matching contextual:** Considera complementaridade, competências e relevância social
- **Resultados organizados:** Apresenta sinergias por categoria com porcentagens
- **Informações detalhadas:** Modal com dados completos para demonstração admin

#### **Categorias de Matching**
- **🌍 Imigrantes** ↔ 🏢 Empresas, 🎓 Academias, 👨‍👩‍👧‍👦 Famílias
- **🏢 Empresas** ↔ 🌍 Imigrantes, 🏛️ Municípios, 🎓 Academias  
- **🏛️ Municípios** ↔ 🌍 Imigrantes, 🏢 Empresas, 🎓 Academias
- **🎓 Academias** ↔ 🌍 Imigrantes, 🏢 Empresas, 🏛️ Municípios
- **👨‍👩‍👧‍👦 Famílias** ↔ 🌍 Imigrantes

#### **Funcionalidades**
- **Processamento IA:** Análise contextual usando GPT-4
- **Scores de sinergia:** Porcentagens de 30% a 100%
- **Explicações contextuais:** IA explica o motivo de cada match
- **Tags em comum:** Identificação automática de compatibilidades
- **Mode demonstração:** Dados completos visíveis para administradores

---

## 📞 Contactos

### Entidades Promotoras (ordem institucional)
- **Federação Minha Terra:** mariaclarabraga@minhaterra.pt | (+351) 913 196 839
- **Adritem:** madrilusa@adritem.pt | (+351) 937 342 173  
- **Adraces:** apoio-imigrantes@adraces.pt | (+351) 272 540 200
- **CoraNE:** terrafria@corane.pt | (+351) 273 332 925

### Website
- **Site oficial:** [madrilusa.com](https://madrilusa.com)

---

## 📄 Licença e Tecnologia

### Tecnologias Utilizadas
Este projeto é construído com:
- **Vite** - Build tool moderna
- **TypeScript** - Tipagem estática
- **React** - Framework frontend
- **shadcn-ui** - Componentes UI
- **Tailwind CSS** - Framework CSS

### Como Editar

**Desenvolvimento Local**
1. Clone este repositório
2. Execute `npm install`
3. Execute `npm run dev`
4. Faça suas alterações
5. Teste localmente
6. Faça commit das mudanças

### Deploy
O projeto pode ser deployado em qualquer plataforma que suporte aplicações React/Vite:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- Qualquer servidor web estático

---

**Projeto desenvolvido com ❤️ para promover integração social e desenvolvimento sustentável**

*Projecto de Inovação e Empreendedorismo Social*  
*Federação Minha Terra • ADRITEM • ADRACES • CoraNE*
