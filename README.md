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

### Backend (Não Implementado)
- Base de dados: **PostgreSQL** (recomendado)
- API: **Node.js/Express** (sugerido)
- Autenticação: **JWT**
- Email: **SendGrid/Mailgun**

---

## 🏗️ Estrutura do Projeto

```
madrilusasite/
├── 📁 doc/                   # 📋 DOCUMENTAÇÃO COMPLETA
│   ├── Guia Completo de Conteúdo e Seções do Madrilusa.md
│   ├── Manual de Identidade Visual e Comunicação - Madrilusa.md
│   └── Guia de Inscrições na Plataforma Madrilusa.md
├── 📁 src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # 47 componentes shadcn/ui
│   │   ├── Header.tsx      # Navegação
│   │   ├── Hero.tsx        # Seção principal
│   │   ├── RegistrationCards.tsx # 5 tipos de registro
│   │   ├── Chatbot.tsx     # IA conversacional
│   │   └── ...             # Outros componentes
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas da aplicação
│   └── assets/             # Imagens temáticas
├── 📁 public/
│   ├── logo_madrilusa/     # Logótipos oficiais
│   └── madrilusa_images/   # Imagens do projeto
└── ...                     # Configurações
```

## 📚 Documentação

### 📖 Documentação Principal
A documentação do projeto está organizada em 3 documentos especializados:

#### 1. **[Guia Completo de Conteúdo e Seções](./doc/Guia%20Completo%20de%20Conteúdo%20e%20Seções%20do%20Madrilusa.md)**
- **Conteúdo completo** de todas as seções
- **Estrutura técnica** e arquitetura
- **Funcionalidades** e componentes
- **Especificações de desenvolvimento**
- **Roadmap** e implementação

#### 2. **[Manual de Identidade Visual](./doc/Manual%20de%20Identidade%20Visual%20e%20Comunicação%20-%20Madrilusa.md)**
- **Paleta de cores** oficial
- **Tipografia** e hierarquia
- **Logótipos** e aplicações
- **Diretrizes** de comunicação
- **Ordenação das entidades**

#### 3. **[Guia de Inscrições](./doc/Guia%20de%20Inscrições%20na%20Plataforma%20Madrilusa.md)**
- **Campos específicos** por categoria
- **Validações** obrigatórias
- **Formulários** detalhados
- **Fluxos** de inscrição

---

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** (versão 18+)
- **npm** ou **yarn**

### Instalação
```bash
# Clone o repositório
git clone <YOUR_GIT_URL>
cd madrilusasite

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev       # Desenvolvimento local (porta 8080)
npm run build     # Build para produção
npm run preview   # Preview do build
npm run lint      # Linting TypeScript
```

---

## ⚡ Funcionalidades Principais

### ✅ Implementadas
- **Interface responsiva** completa
- **Sistema de registro** para 5 categorias
- **Chatbot inteligente** com OpenAI
- **Design system** consistente
- **47 componentes UI** reutilizáveis
- **Formulários específicos** por categoria
- **Painéis laterais** interactivos
- **Newsletter** funcional

### ⏳ Em Desenvolvimento
- Backend e base de dados
- Sistema de autenticação
- Dashboard por tipo de utilizador
- Sistema de matching inteligente
- Notificações por email

---

## 🎨 Design System

### Cores Principais
- **Primary:** Laranja Madrilusa `#F5A623`
- **Secondary:** Azul Turquesa `#4A90A4`
- **Gradientes temáticos** e **sombras elegantes**

### Componentes
- **shadcn/ui:** Biblioteca completa de componentes
- **Lucide React:** Ícones modernos
- **Layout responsivo** e acessível

---

## 🔮 Próximos Passos

### Prioridade Alta
1. **Backend MVP** (4-6 semanas)
   - API REST com Node.js/Express
   - Base de dados PostgreSQL
   - Sistema de autenticação

2. **Dashboard** (6-8 semanas)
   - Área personalizada por tipo de utilizador
   - Sistema de matching jovens ↔ oportunidades

### Prioridade Média
- Admin panel para gestão
- Sistema de notificações
- Relatórios e analytics
- Mobile app (React Native)

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
