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
- **5 públicos-alvo:** Imigrantes, Empresas, Municípios, Academia, Famílias

---

## 🛠️ Stack Tecnológica

### Frontend (Implementado)
- **React 18.3.1** + **TypeScript**
- **Vite 5.4.1** (build tool)
- **Tailwind CSS 3.4.11** + **shadcn/ui**
- **React Query** (estado global)
- **OpenAI API** (chatbot inteligente)

### Backend (Implementado)
- **Node.js + TypeScript**
- **Express.js** (API REST)
- **Prisma ORM** + **SQLite**
- **Autenticação básica** (evolui para JWT)

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
- **[Fluxo Técnico Completo](doc/FLUXO_TECNICO_COMPLETO.md)** - ✅ **Arquitectura e fluxos implementados**
- **[Estrutura Separada](doc/ESTRUTURA_SEPARADA.md)** - Documentação da separação institucional vs aplicação
- **[Guia para Equipes](doc/GUIA_EQUIPES.md)** - Como marketing e desenvolvimento devem trabalhar
- **[Status do Backend](doc/Status%20da%20Implementação%20-%20Backend%20Modular.md)** - Documentação do backend implementado
- **[Aplicação da Identidade Visual](doc/APLICACAO_IDENTIDADE_VISUAL.md)** - ✅ **Implementação da identidade visual oficial**
- **[Ajustes Finais Etapa 01](doc/AJUSTES_FINAIS_ETAPA_01.md)** - Simplificações da experiência do utilizador
- **[Organização de Arquivos](doc/ORGANIZACAO_ARQUIVOS.md)** - Diretrizes de organização do projeto

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

#### **Backend API**
- **Autenticação:** registro e login
- **CRUD de usuários** completo
- **Banco SQLite** com Prisma
- **8 endpoints** funcionais

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

### Para o Projeto Social
- **Jovens imigrantes:** Registe-se na plataforma
- **Empresas:** Ofereça oportunidades de emprego/estágio
- **Municípios:** Participe da revitalização territorial
- **Academia:** Contribua com programas educacionais
- **Famílias:** Ofereça apoio no acolhimento

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
