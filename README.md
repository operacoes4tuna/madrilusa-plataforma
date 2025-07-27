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
- **ADRITEM** (principal)
- **Federação Minha Terra**
- **CoraNE** 
- **ADRACES**

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
- **Framer Motion** (animações)
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
│   └── project-mapping.md    # Mapeamento detalhado do projeto
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
└── ...                     # Configurações
```

## 📚 Documentação

### 📖 Documentação Completa
Para informações detalhadas sobre arquitetura, funcionalidades e roadmap, consulte:
**[doc/project-mapping.md](./doc/project-mapping.md)**

Este documento contém:
- Análise técnica completa
- Mapeamento de componentes
- Status de implementação
- Roadmap de desenvolvimento
- Considerações arquiteturais

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
- **Animações avançadas** (parallax, framer-motion)
- **Design system** consistente
- **47 componentes UI** reutilizáveis

### ⏳ Em Desenvolvimento
- Backend e base de dados
- Sistema de autenticação
- Dashboard por tipo de utilizador
- Sistema de matching inteligente
- Notificações por email

---

## 🎨 Design System

### Cores Principais
- **Primary:** Laranja Madrilusa `#F59E0B`
- **Secondary:** Azul escuro `#1e3a8a`
- **Gradientes temáticos** e **sombras elegantes**

### Componentes
- **shadcn/ui:** Biblioteca completa de componentes
- **Lucide React:** Ícones modernos
- **Framer Motion:** Animações fluidas

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
1. Consulte `doc/project-mapping.md` para contexto completo
2. Fork o repositório
3. Crie uma branch para sua feature
4. Faça commit das mudanças
5. Abra um Pull Request

### Para o Projeto Social
- **Jovens imigrantes:** Registre-se na plataforma
- **Empresas:** Ofereça oportunidades de emprego/estágio
- **Municípios:** Participe da revitalização territorial
- **Academia:** Contribua com programas educacionais
- **Famílias:** Ofereça apoio no acolhimento

---

## 📞 Contato

- **Email:** madrilusa@adritem.pt
- **Website:** [Lovable Project](https://lovable.dev/projects/b4d18a08-d6ae-4a9b-91f5-34834c17ca6b)

---

## 📄 Licença e Deploy

### Deploy Automático
Este projeto está configurado com **Lovable** para deploy contínuo:

**URL**: https://lovable.dev/projects/b4d18a08-d6ae-4a9b-91f5-34834c17ca6b

### Como Editar

**Use Lovable (Recomendado)**
Visite o [Lovable Project](https://lovable.dev/projects/b4d18a08-d6ae-4a9b-91f5-34834c17ca6b) e comece a prompting. As mudanças são commitadas automaticamente.

**Use seu IDE preferido**
Clone este repo e faça push das mudanças. As mudanças também serão refletidas no Lovable.

**Use GitHub Codespaces**
- Clique em "Code" → "Codespaces" → "New codespace"
- Edite diretamente no navegador

### Deploy Personalizado
Para conectar domínio customizado:
1. Abra Lovable → Project → Settings → Domains
2. Clique em "Connect Domain"
3. Siga as instruções de [configuração de domínio](https://docs.lovable.dev/tips-tricks/custom-domain)

---

**Projeto desenvolvido com ❤️ para promover integração social e desenvolvimento sustentável**
