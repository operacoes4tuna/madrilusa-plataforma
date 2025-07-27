# Dossiê Completo - Projeto Madrilusa

**Data da Análise:** Janeiro 2025  
**Versão:** 1.0  
**Analista:** Mapeamento Completo da Estrutura

---

## **Resumo Executivo**

O **Madrilusa** é uma plataforma web moderna desenvolvida em React/TypeScript que promove a integração social de jovens imigrantes em territórios rurais portugueses. É um projeto de Inovação e Empreendedorismo Social (IIES) com foco em 5 públicos distintos: imigrantes, empresas, municípios, academia e famílias de acolhimento.

**Status Atual:** Frontend completo e funcional, backend não implementado.

---

## **1. Arquitetura e Tecnologias**

### **Stack Principal**
```json
{
  "frontend": {
    "framework": "React 18.3.1 + TypeScript",
    "buildTool": "Vite 5.4.1 + SWC",
    "styling": "Tailwind CSS 3.4.11 + shadcn/ui",
    "animations": "Framer Motion 12.23.6",
    "routing": "React Router DOM 6.26.2",
    "state": "React Query (TanStack) 5.56.2",
    "forms": "React Hook Form 7.53.0 + Zod 3.23.8",
    "ai": "OpenAI API 5.10.2"
  },
  "backend": "NÃO IMPLEMENTADO",
  "database": "NÃO IMPLEMENTADO",
  "deployment": "NÃO CONFIGURADO"
}
```

### **Estrutura de Arquivos**
```
madrilusasite/
├── public/                    # Assets estáticos (favicon, robots.txt)
├── src/
│   ├── components/           # Componentes React organizados
│   │   ├── ui/              # 47 componentes shadcn/ui
│   │   ├── Header.tsx       # Navegação principal
│   │   ├── Hero.tsx         # Seção hero com parallax
│   │   ├── About.tsx        # Informações do projeto
│   │   ├── RegistrationCards.tsx # 5 cards de registro
│   │   ├── RegistrationModal.tsx # Modal dinâmico
│   │   ├── Objectives.tsx   # 4 objetivos principais
│   │   ├── Target.tsx       # Público-alvo
│   │   ├── Activities.tsx   # Atividades oferecidas
│   │   ├── FAQ.tsx          # Perguntas frequentes
│   │   ├── Footer.tsx       # Rodapé
│   │   └── Chatbot.tsx      # IA conversacional
│   ├── hooks/               # Custom hooks (useParallax, useToast, useMobile)
│   ├── lib/                 # Utilitários (utils.ts)
│   ├── pages/               # Index.tsx, NotFound.tsx
│   └── assets/              # 6 imagens temáticas
├── doc/                     # 📁 DOCUMENTAÇÃO DO PROJETO
├── tailwind.config.ts       # Design system customizado
├── vite.config.ts          # Configuração de build
└── package.json            # 50+ dependências
```

---

## **2. Design System e Identidade Visual**

### **Paleta de Cores Madrilusa**
```css
/* Cores principais */
--primary: 31 95% 53%           /* Laranja Madrilusa (#F59E0B) */
--primary-glow: 31 100% 65%     /* Laranja brilhante para efeitos */
--secondary: 210 65% 20%        /* Azul escuro para headers */

/* Gradientes temáticos */
--gradient-hero: linear-gradient(135deg, secondary → secondary-variant)
--gradient-primary: linear-gradient(135deg, primary → primary-glow)
--gradient-subtle: linear-gradient(180deg, background → light-variant)

/* Sombras especiais */
--shadow-elegant: 0 10px 30px -10px primary/0.2
--shadow-glow: 0 0 40px primary-glow/0.3
--shadow-card: 0 4px 6px -1px secondary/0.1
```

### **Sistema de Animações**
- **Parallax personalizado:** 3 velocidades (slow: 0.5x, medium: 0.3x, fast: 0.8x)
- **Framer Motion:** Animações de entrada escalonadas
- **Hover effects:** Transform + scale com transitions suaves
- **Scroll-based:** Animações triggered por viewport

---

## **3. Componentes e Funcionalidades Detalhadas**

### **3.1 Sistema de Navegação**
**Header.tsx (109 linhas)**
- Navegação fixa com backdrop blur
- 7 links de ancoragem internos
- Menu hamburger responsivo
- CTAs: "Inscreva-se" e "Login" (não funcionais)
- Animações de hover com underline

### **3.2 Seção Hero**
**Hero.tsx (105 linhas)**
- Background parallax com imagem hero-image.jpg
- Grid 2 colunas (conteúdo + imagem)
- Animações escalonadas de entrada
- Scroll indicator animado infinito
- CTA principal "Juntes-se a Nós"

### **3.3 Sistema de Registro**
**RegistrationCards.tsx (113 linhas) + RegistrationModal.tsx (298 linhas)**

**5 Categorias de Registro:**
1. **Imigrante** - Jovens < 30 anos (campos: idade, nacionalidade, experiência)
2. **Empresa** - Empregadores (campos: organização, cargo)
3. **Município** - Câmaras municipais (campos: município, departamento)
4. **Academia** - Instituições educacionais (campos: instituição, cargo)
5. **Família** - Acolhimento (campos: disponibilidade, experiência)

**Funcionalidades:**
- Modal dinâmico com campos específicos por categoria
- Validação com React Hook Form + Zod
- Toast notifications para feedback
- **⚠️ SIMULAÇÃO APENAS** - não persiste dados

### **3.4 Conteúdo Informativo**

**About.tsx (65 linhas)**
- Contexto completo do projeto
- Parcerias: ADRITEM, Federação Minha Terra, CoraNE, ADRACES
- Problemáticas abordadas: exclusão social, despovoamento rural, escassez de mão-de-obra

**Objectives.tsx (93 linhas)**
- 4 objetivos com ícones Lucide React:
  - 🌍 Promover integração social
  - 👥 Valorizar competências
  - ❤️ Combater exclusão social
  - 🤝 Criar redes de apoio

**Target.tsx (62 linhas)**
- Público-alvo detalhado
- Meta: **2.400 jovens em 36 meses**
- Territórios rurais portugueses

**Activities.tsx (99 linhas)**
- Programas oferecidos
- Luso Academia
- Programa +Futuro
- Rede de apoio e integração

**FAQ.tsx (109 linhas)**
- Accordion com 6 perguntas principais
- Respostas sobre participação, custos, duração
- CTA para contato direto

### **3.5 Chatbot Inteligente**
**Chatbot.tsx (304 linhas) - Funcionalidade Avançada**

**Características:**
```typescript
// Integração OpenAI GPT-4.1-2025-04-14
const systemPrompt = contexto_completo_madrilusa;
const userMessage = pergunta_usuario;
const response = await openai.chat.completions.create({
  model: "gpt-4.1-2025-04-14",
  messages: [system, user],
  max_tokens: 300,
  temperature: 0.7
});
```

**Funcionalidades:**
- Interface conversacional moderna
- Botão flutuante persistente
- Contexto específico do projeto (não responde fora do escopo)
- Histórico de conversação
- Indicador de digitação animado
- **⚠️ API KEY EXPOSTA** - necessita environment variables

---

## **4. Hooks Customizados e Utilitários**

### **useParallax.ts (29 linhas)**
```typescript
// Sistema parallax baseado em scroll
const handleScroll = () => {
  const scrolled = window.pageYOffset;
  // Aplica diferentes velocidades para elementos com classes:
  // .parallax-slow (0.5x), .parallax-medium (0.3x), .parallax-fast (0.8x)
};
```

### **Outros Hooks**
- `useToast` - Sistema de notificações
- `useMobile` - Detecção de dispositivos móveis

---

## **5. Configurações e Build**

### **Vite Configuration**
```typescript
// vite.config.ts
server: { host: "::", port: 8080 }
plugins: [react(), componentTagger()]
resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
```

### **Scripts Disponíveis**
```json
{
  "dev": "vite",                    // Desenvolvimento local
  "build": "vite build",            // Build produção
  "build:dev": "vite build --mode development",
  "lint": "eslint .",               // Linting TypeScript
  "preview": "vite preview"         // Preview local do build
}
```

---

## **6. Assets e Recursos**

### **Imagens Temáticas (src/assets/)**
- `hero-image.jpg` - Imagem principal do hero
- `academia.png` - Card academia
- `empresa.png` - Card empresa
- `familia.png` - Card família
- `imigrante.png` - Card imigrante
- `municipio.png` - Card município

### **Ícones**
- Lucide React (biblioteca completa)
- Ícones temáticos por seção

---

## **7. Informações do Projeto Social**

### **Entidades Promotoras**
- **ADRITEM** (principal)
- **Federação Minha Terra**
- **CoraNE**
- **ADRACES**

### **Metas e Objetivos**
- **Duração:** 36 meses
- **Meta:** 2.400 jovens atendidos
- **Foco:** Territórios rurais portugueses
- **Custo:** Participação 100% gratuita

### **Problemas Abordados**
1. Exclusão social de jovens imigrantes CPLP
2. Barreiras culturais, linguísticas e económicas
3. Despovoamento e envelhecimento rural
4. Escassez de mão-de-obra em setores essenciais
5. Crise habitacional para grupos vulneráveis

### **Soluções Propostas**
1. Integração social e profissional
2. Fixação em territórios rurais
3. Revitalização territorial
4. Capacitação e acompanhamento
5. Diálogo intercultural e solidariedade

---

## **8. Status Técnico e Gaps**

### **✅ Implementado e Funcional**
- Interface completa e responsiva
- Design system consistente
- Animações e efeitos visuais
- Sistema de registro (frontend)
- Chatbot com IA funcional
- Navegação e roteamento
- Componentes reutilizáveis

### **⚠️ Simulações/Mockups**
- Formulários de registro (não persistem)
- CTAs de Login/Inscreva-se (não funcionais)
- Links de contato (não conectados)

### **❌ Não Implementado**
- **Backend/API** - Nenhum endpoint
- **Base de dados** - Nenhuma persistência
- **Autenticação** - Sistema de login
- **Dashboard** - Área de utilizador
- **Email** - Sistema de notificações
- **Admin panel** - Gestão de utilizadores
- **Matching system** - Conectar jovens↔oportunidades

### **🔧 Melhorias Técnicas Necessárias**
1. **Segurança:** Mover API key OpenAI para env vars
2. **Performance:** Otimizar imagens (converter para WebP/AVIF)
3. **SEO:** Meta tags, structured data
4. **Acessibilidade:** ARIA labels, keyboard navigation
5. **Testing:** Jest + Testing Library
6. **CI/CD:** Pipeline de deployment
7. **Monitoring:** Analytics e error tracking
8. **PWA:** Service workers, offline support

---

## **9. Roadmap Sugerido**

### **Fase 1: Backend Essencial (4-6 semanas)**
1. Setup Node.js/Express + PostgreSQL
2. API de autenticação (JWT)
3. CRUD de utilizadores
4. Endpoints para formulários
5. Sistema de email (SendGrid/Mailgun)

### **Fase 2: Funcionalidades Core (6-8 semanas)**
1. Dashboard por tipo de utilizador
2. Sistema de matching inteligente
3. Chat interno entre utilizadores
4. Notificações push/email
5. Admin panel básico

### **Fase 3: Escalabilidade (4-6 semanas)**
1. Sistema de aprovação de registos
2. Relatórios e analytics
3. Integração com sistemas externos
4. API para mobile app
5. Otimizações de performance

### **Fase 4: Expansão (ongoing)**
1. Machine learning para matching
2. Gamificação
3. Marketplace de oportunidades
4. Integração com redes sociais
5. Multi-idiomas

---

## **10. Considerações Finais**

### **Pontos Fortes**
- ✅ Arquitetura moderna e escalável
- ✅ Design system bem estruturado
- ✅ Código TypeScript bem tipado
- ✅ Componentes reutilizáveis
- ✅ UX/UI profissional
- ✅ Funcionalidade de IA inovadora

### **Pontos de Atenção**
- ⚠️ Nenhuma persistência de dados
- ⚠️ API key exposta no frontend
- ⚠️ Falta de validação backend
- ⚠️ Ausência de testes automatizados
- ⚠️ Sem estratégia de deployment

### **Recomendação Estratégica**
O projeto possui uma **base frontend excelente** e está pronto para receber o desenvolvimento backend. A prioridade deve ser:

1. **Implementar backend mínimo** para tornar funcional
2. **Configurar base de dados** para persistência
3. **Desenvolver dashboard** diferenciado por público
4. **Criar sistema de matching** como diferencial competitivo

**Estimativa total para MVP funcional completo: 14-20 semanas**

---

**Documento gerado automaticamente via análise de código**  
**Última atualização:** Janeiro 2025  
**Próxima revisão recomendada:** Após implementação do backend 