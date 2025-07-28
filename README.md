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
- **OpenAI API** (chatbot inteligente)
- **React Hook Form + Zod** (validações)

### Backend (✅ Implementado)
- **Node.js + TypeScript**
- **Express.js** (API REST modular)
- **Prisma ORM** + **SQLite**
- **5 módulos completos** (30 endpoints)
- **Validações robustas** + **Testes automatizados**

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
- **[Metodologia Categoria Universal](doc/03_IMPLEMENTACAO_TECNICA/06_Metodologia_Categoria_Universal.md)** - ✅ **NOVO: Padrão revolucionário para implementar categorias**
- **[Sistema de Categorias](doc/03_IMPLEMENTACAO_TECNICA/04_Sistema_Categorias_Usuario.md)** - ✅ **Todas as 5 categorias implementadas**
- **[Status Implementação Completa](doc/status_implementacao/STATUS_Todas_Categorias_Implementadas.md)** - ✅ **Resultado final e métricas**
- **[Fluxo Técnico Completo](doc/03_IMPLEMENTACAO_TECNICA/01_Fluxo_Tecnico_Completo.md)** - ✅ **Arquitectura e fluxos implementados**
- **[Estrutura Separada](doc/03_IMPLEMENTACAO_TECNICA/03_Estrutura_Separada_Responsabilidades.md)** - Separação institucional vs aplicação
- **[Backend Modular](doc/03_IMPLEMENTACAO_TECNICA/02_Roadmap_Backend_Modular.md)** - ✅ **5 módulos implementados**
- **[Status Resumido](doc/status_implementacao/README_Status_Completo.md)** - ✅ **Resumo executivo completo**

### **📝 Política de Documentação**
> **🚨 IMPORTANTE:** Toda documentação (.md) deve ser criada APENAS na pasta `doc/`. Não criar arquivos .md na raiz do projeto para manter a organização.

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

#### **Backend API - TODAS AS 5 CATEGORIAS**
- **Sistema modular:** 5 módulos independentes  
- **30 endpoints funcionais:** 6 por categoria
- **5 categorias implementadas:** Imigrante, Empresa, Município, Academia, Família
- **Validações robustas:** TypeScript + Zod
- **Banco SQLite** com Prisma + migrações automáticas
- **Registro em 2 etapas** para todas as categorias
- **34+ campos específicos** por categoria

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
