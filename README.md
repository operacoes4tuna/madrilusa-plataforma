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
1. Consulte `doc/project-mapping.md` para contexto completo
2. Fork o repositório
3. Crie uma branch para sua feature
4. Faça commit das mudanças
5. Abra um Pull Request

### Para o Projeto Social
- **Jovens imigrantes:** Registe-se na plataforma
- **Empresas:** Ofereça oportunidades de emprego/estágio
- **Municípios:** Participe da revitalização territorial
- **Academia:** Contribua com programas educacionais
- **Famílias:** Ofereça apoio no acolhimento

---

## 📞 Contactos

### Entidades Promotoras
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
*ADRITEM • Federação Minha Terra • CoraNE • ADRACES*
