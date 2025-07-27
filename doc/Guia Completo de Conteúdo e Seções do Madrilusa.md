# Guia Completo de Conteúdo e Seções do Madrilusa

**Data da Análise:** Janeiro 2025  
**Versão:** 2.0  
**Documento Unificado:** Mapeamento + Desenvolvimento

> **Nota sobre Identidade Visual:** Todas as especificações de cores, tipografia, logótipos e elementos visuais estão detalhadas no documento "Manual de Identidade Visual e Comunicação - Madrilusa.md" localizado nesta mesma pasta `doc/`.

---

## **1. VISÃO GERAL DO PROJETO**

### **1.1 Resumo Executivo**

O **Madrilusa** é uma plataforma web moderna que promove a integração social de jovens imigrantes em territórios rurais portugueses. É um projeto de Inovação e Empreendedorismo Social (IIES) com foco em 5 públicos distintos: imigrantes, empresas, municípios, academia e famílias de acolhimento.

**Entidades Promotoras:**
- **ADRITEM** (principal)
- **Federação Minha Terra**
- **CoraNE**
- **ADRACES**

**Metas do Projeto:**
- **Duração:** 36 meses
- **Meta:** 2.400 jovens atendidos
- **Foco:** Territórios rurais portugueses
- **Participação:** 100% gratuita

### **1.2 Problemas Abordados**
1. Exclusão social de jovens imigrantes CPLP
2. Barreiras culturais, linguísticas e económicas
3. Despovoamento e envelhecimento rural
4. Escassez de mão-de-obra em setores essenciais
5. Crise habitacional para grupos vulneráveis

### **1.3 Soluções Propostas**
1. Integração social e profissional
2. Fixação em territórios rurais
3. Revitalização territorial
4. Capacitação e acompanhamento
5. Diálogo intercultural e solidariedade

---

## **2. ARQUITETURA E ESTRUTURA TÉCNICA**

### **2.1 Stack Tecnológica Atual**

**Frontend (Implementado):**
- React 18.3.1 + TypeScript
- Vite 5.4.1 (build tool)
- Tailwind CSS 3.4.11 + shadcn/ui
- React Query (TanStack) 5.56.2
- React Hook Form 7.53.0 + Zod 3.23.8
- OpenAI API 5.10.2 (chatbot)

**Backend:** NÃO IMPLEMENTADO
**Database:** NÃO IMPLEMENTADO

### **2.2 Estrutura de Arquivos**

```
madrilusasite/
├── public/                    # Assets estáticos
│   ├── logo_madrilusa/       # Logótipos oficiais
│   ├── madrilusa_images/     # Imagens temáticas
│   ├── favicon.png           # Ícone do site
│   └── robots.txt           # SEO
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # 47 componentes shadcn/ui
│   │   ├── Header.tsx      # Navegação principal
│   │   ├── Hero.tsx        # Seção hero
│   │   ├── About.tsx       # Informações do projeto
│   │   ├── RegistrationCards.tsx # 5 cards de registro
│   │   ├── RegistrationModal.tsx # Modal dinâmico
│   │   ├── Objectives.tsx  # 4 objetivos principais
│   │   ├── Target.tsx      # Público-alvo
│   │   ├── Activities.tsx  # Atividades oferecidas
│   │   ├── FAQ.tsx         # Perguntas frequentes
│   │   ├── Newsletter.tsx  # Newsletter
│   │   ├── Footer.tsx      # Rodapé com contactos
│   │   └── Chatbot.tsx     # IA conversacional
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilitários
│   ├── pages/              # Páginas principais
│   └── assets/             # 6 imagens temáticas
└── doc/                    # 📁 DOCUMENTAÇÃO
```

### **2.3 Tipo de Site**

**Arquitetura:** Single Page Application (SPA) com secções âncora
**URL Principal:** madrilusa.com
**Navegação:** Scroll suave entre secções

---

## **3. ESTRUTURA DE NAVEGAÇÃO E SEÇÕES**

### **3.1 Menu de Navegação (Header)**

**Posicionamento:** Fixo no topo
**Comportamento:** Menu responsivo com scroll suave

**Elementos do Menu:**
1. **Logótipo Madrilusa** (canto superior esquerdo)
2. **Menu horizontal:**
   - Home (âncora para topo)
   - Sobre (âncora para secção + painel lateral)
   - Para quem (âncora para secção específica)
   - FAQ (âncora + painel lateral)
   - Contactos (âncora para footer)
   - **Inscreva-se** (botão destacado)
   - **Login** (botão secundário)

### **3.2 Ordem das Seções na Página**

**Sequência obrigatória:**
1. Hero Section
2. Bem vindo ao Madrilusa (Sobre)
3. Faça parte do projecto (Registos)
4. Principais Objectivos
5. A quem se destina? (Target)
6. As acções do projecto incluem (Atividades)
7. Perguntas frequentes (FAQ)
8. Newsletter
9. Footer/Contactos

---

## **4. CONTEÚDOS DETALHADOS POR SEÇÃO**

### **4.1 Hero Section**

**Layout:** Split-screen (60% texto / 40% imagem)

**Conteúdo Textual:**
- **Título Principal:** "Inovação e empreendedorismo social para jovens imigrantes"
- **Subtítulo:** "Jovens imigrantes em início de vida, famílias com espaço no coração e empresas que abrem portas"
- **CTA Principal:** Botão "Juntem-se a nós"

**Elementos Visuais:**
- **Imagem:** Grupo de jovens diversos sorrindo (lado direito)

### **4.2 Secção "Bem vindo ao Madrilusa" (Sobre)**

**Conteúdo Principal:**
```
O projecto Madrilusa é uma iniciativa de Inovação e Empreendedorismo Social promovida em parceria entre a ADRITEM com a Federação Minha Terra, a CoraNE e a ADRACES.

A proposta busca enfrentar a exclusão social de jovens imigrantes em Portugal, associando o seu potencial às necessidades de zonas rurais afectadas pelo despovoamento e envelhecimento.

Diante da escassez de mão-de-obra e da crise habitacional que atinge especialmente os mais vulneráveis, o projecto promove a fixação desses jovens em territórios rurais como estratégia de revitalização e inclusão.

Por meio de metodologias inovadoras de acolhimento, capacitação e acompanhamento, Madrilusa incentiva o diálogo intercultural, a solidariedade entre gerações e o desenvolvimento sustentável, com o objectivo de construir comunidades mais inclusivas e resilientes.
```

**Funcionalidade:**
- Botão "Sabe Mais" que abre painel lateral com conteúdo expandido

### **4.3 Painel Lateral "Sobre" (Conteúdo Expandido)**

**Activação:** Clique em "Sabe Mais"
**Layout:** Painel deslizante da direita

**Conteúdo Adicional:**
```
Descrição Detalhada do Projecto:
- Iniciativa de Inovação e Empreendedorismo Social
- Missão: apoiar a integração de jovens imigrantes em Portugal
- Foco especial na Região Norte
- Abordagem próxima, inclusiva e participada
- Objectivo: criar oportunidades reais de participação cívica, empregabilidade e valorização intercultural

Três Eixos Principais:
1. Empreendedorismo e Emprego
2. Cultura e Arte
3. Acolhimento e Integração

Metodologia:
- Aposta no talento, competências e histórias de vida de jovens com menos de 30 anos
- Oriundos de diversos países
- Mais do que intervenção social: rede de partilha, capacitação e envolvimento comunitário
- Os próprios jovens são convidados a ser protagonistas da mudança

Parcerias e Apoios:
- Parceiros locais, autarquias, associações e empresas
- Promoção de oficinas, estágios, espaços culturais
- Acções de mentoria e momentos de convívio intercultural
- Objectivo: inclusão quando todos têm lugar à mesa
- Abertura de portas e janelas para um futuro mais justo, diverso e digno
```

### **4.4 Secção "Faça parte do projecto" (Registos)**

**Layout:** Grid de 5 cartões horizontais

**5 Categorias de Inscrição:**

1. **Sou imigrante**
   - Público: Jovens imigrantes interessados no programa
   - Descrição: "Integre-se na nossa comunidade e descubra oportunidades de crescimento pessoal e profissional em Portugal. O Madrilusa está aqui para o apoiar na sua jornada de integração, oferecendo formação, estágios e uma rede de apoio dedicada."
   - Link para formulário de pré-inscrição

2. **Empresa**
   - Público: Empresas que querem contratar ou oferecer estágios
   - Descrição: "Torne-se parceira do Madrilusa e aceda a jovens talentos motivados e em busca de oportunidades. Ofereça estágios, empregos ou programas de formação e contribua para a inclusão social enquanto encontra os colaboradores de que precisa."
   - Link para formulário empresarial

3. **Município**
   - Público: Câmaras municipais interessadas em parcerias
   - Descrição: "Una-se a nós na revitalização dos territórios rurais. O Madrilusa oferece soluções inovadoras para combater o despovoamento, atraindo jovens imigrantes que podem contribuir para o desenvolvimento local e dinamizar a sua comunidade."
   - Link para formulário municipal

4. **Academia**
   - Público: Instituições educacionais
   - Descrição: "Estabeleça parcerias educacionais que fazem a diferença. Através do Madrilusa, a sua instituição pode oferecer formações especializadas, cursos de línguas e programas académicos que preparam jovens imigrantes para o mercado de trabalho português."
   - Link para formulário académico

5. **Família de acolhimento**
   - Público: Famílias interessadas em acolhimento
   - Descrição: "Abra as portas do seu lar e do seu coração. Torne-se uma família de acolhimento e ajude jovens imigrantes na sua integração, oferecendo não apenas um tecto, mas também apoio emocional e cultural numa fase crucial das suas vidas."
   - Link para formulário familiar

### **4.5 Secção "Principais Objectivos"**

**Layout:** Grid 2x2 com ícones e texto

**4 Objectivos:**

1. **Promover a integração social**
   - Ícone: Mundo/globo
   - Texto: "Promovemos a integração de jovens imigrantes em Portugal, valorizando os seus talentos e colocando-os ao serviço das necessidades dos territórios rurais. Através de iniciativas inovadoras, impulsionamos a inclusão social, o desenvolvimento sustentável e a revitalização das comunidades."

2. **Valorizar as competências**
   - Texto: "O Madrilusa valoriza as competências, os talentos e a cultura de origem dos jovens imigrantes, promovendo a sua integração em territórios rurais. A iniciativa reforça identidades, dinamiza o desenvolvimento local e contribui para a construção de comunidades mais inclusivas e diversificadas."

3. **Combater a exclusão social**
   - Texto: "Combatemos a exclusão social e promovemos a empregabilidade de jovens imigrantes, articulando as suas competências com as necessidades dos territórios rurais. A iniciativa cria oportunidades concretas, reforçando a inclusão e promovendo o desenvolvimento sustentável das comunidades locais."

4. **Criar redes de apoio**
   - Texto: "O Madrilusa cria redes de apoio para o acolhimento e integração de jovens imigrantes, reforçando a cooperação entre comunidades e instituições. Esta articulação promove a inclusão social, garante um acompanhamento contínuo e contribui para o desenvolvimento de ambientes acolhedores e sustentáveis nos territórios rurais."

**CTA Final:** Botão "Juntem-se a nós" direcionando para a secção de registos

### **4.6 Secção "A quem se destina?" (Target)**

**Layout:** Texto + imagem lateral

**Conteúdo:**
```
A IIES Madrilusa tem como missão apoiar a integração de jovens imigrantes, ajudando-os a desenvolver competências pessoais e sociais para que sejam bem recebidos e reconhecidos pelas comunidades onde vivem.

A iniciativa é dirigida a jovens imigrantes com menos de 30 anos, em Portugal ou no estrangeiro, e pretende envolver cerca de 2.400 participantes ao longo de três anos.
```

**Elementos Destacados:**
- **2.400 jovens** atendidos
- **36 meses** de duração
- **< 30 anos** faixa etária
- **Territórios rurais** foco geográfico

### **4.7 Secção "As acções do projecto incluem" (Atividades)**

**Layout:** Grid 2x2 com imagens e descrições

**4 Acções:**

1. **Desenvolvimento de competências para o mercado de trabalho (+Futuro)**
   - Formação orientada para as necessidades do mercado
   - Preparação para a entrada no mundo profissional
   - Inserção no mercado de trabalho
   - Inserido no Programa +Futuro

2. **Criação da Luso Academia**
   - Espaço educativo para capacitação dos jovens em diversas áreas
   - Para fomentar talentos
   - Partilhar saberes culturais
   - Cursos, workshops e atividades formativas

3. **Rede de Apoio ao Acolhimento e Integração**
   - Envolvimento de famílias e comunidades locais para acolher jovens imigrantes
   - Apoio psicológico e social durante o processo de integração
   - Actividades de capacitação em economia doméstica
   - Cidadania e participação cívica

4. **Estágios de verão e trabalhos temporários**
   - Oportunidade de ganhar experiência prática em empresas e instituições parceiras
   - Realização de estágios de verão e trabalhos temporários para os jovens

**Outras atividades mencionadas:**
5. Formação em competências digitais e profissionais
6. Apoio psicológico e social
7. Networking entre jovens, empresas e instituições

### **4.8 Secção "Perguntas frequentes" (FAQ)**

**Layout:** Sistema de tabs/separadores

**Funcionalidade:**
- Clique no menu FAQ abre painel lateral
- Conteúdo específico por categoria
- Perguntas numeradas

**4 Categorias de FAQ:**
1. **FAMÍLIAS DE ACOLHIMENTO**
2. **JOVENS IMIGRANTES**
3. **GERAIS**
4. **PARA EMPRESAS**

**Exemplo de Conteúdo (Painel FAQ - Jovens Imigrantes):**
```
Título: "Através das sessões +Futuro e o Incentivo à inserção no mercado de trabalho"

Público-alvo: "Chegaste recentemente a Portugal e quer trabalhar ou estudar?"

Serviços oferecidos em sessões individuais ou pequenos grupos:

1. Apoio na elaboração do currículo
   - Candidatura a ofertas de emprego
   - Preparação para entrevistas

2. Orientação académica
   - Reconhecimento de habilitações académicas (equivalência escolar)

3. Apoio na procura de formações
   - Estágios de verão
   - Trabalhos temporários

4. Acompanhamento no ensino superior
   - Processo de candidatura ao ensino superior

Call-to-Action:
"Se tens interesse, faz o teu registo e entra em contacto connosco, por território."
```

### **4.9 Secção Newsletter**

**Layout:** Split-screen (imagem + formulário)

**Elementos:**
- **Título:** "Subscreve a nossa Newsletter"
- **Imagem:** Grupo de jovens diversos sorrindo ao ar livre (lado esquerdo)
- **Formulário:** (lado direito)
  - Campo: "Vosso e-mail" (input de email)
  - Botão: "Subscrever"
- **Funcionalidade:** Integração com sistema de email marketing

### **4.10 Footer/Contactos**

**Layout:** Multi-coluna organizada por entidade

**Elementos Principais:**
- **Logótipo Madrilusa** (centralizado no topo)
- **Redes Sociais:** Facebook, LinkedIn, Instagram
- **Contactos das 4 Entidades Parceiras** (em ordem específica)
- **Barra de Logos dos Parceiros** (imagem unificada)
- **Copyright:** Informações de desenvolvimento

**Contactos das Entidades (ordem obrigatória):**

1. **Federação Minha Terra:**
   - Email: mariaclarabraga@minhaterra.pt
   - Telefone: (+351) 913 196 839

2. **Adritem:**
   - Email: madrilusa@adritem.pt
   - Telefone: (+351) 937 342 173

3. **Adraces:**
   - Email: apoio-imigrantes@adraces.pt
   - Telefone: (+351) 272 540 200

4. **CoraNE:**
   - Email: terrafria@corane.pt
   - Telefone: (+351) 273 332 925

**Barra de Logos:**
- Uso da imagem `barradelogosmadrilusa.png`
- Inclui todos os parceiros e financiadores
- Tamanho otimizado para evitar pixelização

---

## **5. SISTEMA DE FORMULÁRIOS E FUNCIONALIDADES**

### **5.1 Visão Geral dos Formulários**

**Plataforma:** Modal/popup integrado no site principal
**Validação:** React Hook Form + Zod
**Feedback:** Toast notifications

### **5.2 Campos Específicos por Categoria**

#### **5.2.1 Formulário "Sou Imigrante" (Pré-inscrição)**

**Campos Obrigatórios:**
1. **Nome completo** (text input)
2. **Nacionalidade** (dropdown)
3. **Data de Nascimento** (date picker, formato mm/dd/yyyy)
4. **Email** (email input)
5. **Telemóvel (WhatsApp)** (dropdown país + número)
6. **Objectivos** (checkboxes: Emprego, Formação, Regularização, Outros)
7. **Política de dados** (checkbox obrigatório)

**Campos Opcionais:**
- **Mensagem** (textarea)

**Países disponíveis:** Portugal, Brasil, Angola, Moçambique, Cabo Verde, Guiné-Bissau, São Tomé e Príncipe, Timor-Leste, Macau, Alemanha, Áustria, Bélgica, Bulgária, Chipre, Croácia, Dinamarca, Eslováquia, Eslovênia, Espanha, Estados Unidos

#### **5.2.2 Formulário "Empresa"**

**Campos Obrigatórios:**
1. Nome da organização
2. Sector de atividade
3. Nome de contacto
4. Cargo/função
5. Email
6. Telefone
7. Localização
8. Tipo de oportunidade (emprego/estágio/formação)
9. Política de dados (checkbox)

#### **5.2.3 Formulário "Município"**

**Campos Obrigatórios:**
1. Nome do município
2. Departamento/setor
3. Nome de contacto
4. Cargo/função
5. Email
6. Telefone
7. Áreas de interesse (habitação/emprego/integração)
8. Política de dados (checkbox)

#### **5.2.4 Formulário "Academia"**

**Campos Obrigatórios:**
1. Nome da instituição
2. Tipo de instituição
3. Nome de contacto
4. Cargo/função
5. Email
6. Telefone
7. Programas disponíveis
8. Política de dados (checkbox)

#### **5.2.5 Formulário "Família de Acolhimento"**

**Campos Obrigatórios:**
1. Nome(s) responsável(eis)
2. Composição familiar
3. Email
4. Telefone
5. Localização
6. Disponibilidade
7. Experiência anterior
8. Motivação
9. Política de dados (checkbox)

### **5.3 Funcionalidades Interativas**

**Painéis Laterais:**
- Activados por cliques em "Sabe Mais" e "FAQ"
- Deslizam da direita para a esquerda
- Overlay escuro sobre conteúdo principal
- Botão de fechar (X) no canto superior direito

**Navegação Suave:**
- Scroll automático entre secções
- Transições suaves
- Menu fixo com destaque da secção ativa

**Chatbot Inteligente:**
- Integração OpenAI GPT-4
- Contexto específico do projeto Madrilusa
- Interface conversacional moderna
- Botão flutuante persistente
- Formatação Markdown nas respostas
- Histórico de conversação

---

## **6. COMPONENTES TÉCNICOS DETALHADOS**

### **6.1 Status de Implementação**

#### **✅ Implementado e Funcional**
- Interface completa e responsiva
- Todos os 9 componentes principais
- Sistema de registro para 5 categorias
- Chatbot com IA funcional
- Navegação e smooth scrolling
- 47 componentes shadcn/ui reutilizáveis
- Painéis laterais interativos
- Newsletter funcional
- Sistema de formulários com validação

#### **⚠️ Simulações/Mockups**
- Formulários de registro (frontend apenas, não persistem)
- CTAs de Login/Inscreva-se (não funcionais)
- Newsletter (frontend apenas)

#### **❌ Não Implementado**
- **Backend/API** - Nenhum endpoint
- **Base de dados** - Nenhuma persistência
- **Autenticação** - Sistema de login
- **Dashboard** - Área de utilizador
- **Sistema de email** - Notificações automáticas
- **Admin panel** - Gestão de utilizadores
- **Matching system** - Conectar jovens ↔ oportunidades

### **6.2 Hooks Customizados**

**Hooks Implementados:**
- `useToast` - Sistema de notificações
- `useMobile` - Detecção de dispositivos móveis

**Hooks Removidos:**
- `useParallax` - Removido junto com animações

### **6.3 Sistema de Design**

**Componentes UI (shadcn/ui):**
- Button, Card, Input, Label, Select, Textarea
- Accordion, Dialog, ScrollArea, Checkbox, Toast
- 47 componentes total disponíveis

**Funcionalidades de UX:**
- Interface responsiva completa
- Animações removidas conforme solicitado
- Hover effects com transitions suaves
- Sistema de notificações integrado

---

## **7. ESPECIFICAÇÕES TÉCNICAS PARA DESENVOLVIMENTO**

### **7.1 Performance e Otimização**

**Recomendações:**
- Lazy loading para imagens
- Minificação de CSS/JS
- Compressão de imagens (WebP quando possível)
- CDN para assets estáticos

### **7.2 SEO e Acessibilidade**

**SEO:**
- Meta tags optimizadas
- Structured data (Schema markup)
- Sitemap.xml
- Robots.txt configurado

**Acessibilidade:**
- Contraste adequado (WCAG 2.1)
- Navegação por teclado
- Alt text em todas as imagens
- Screen reader friendly

### **7.3 Responsividade**

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Funcionalidades Móveis:**
- Menu hamburger
- Cards adaptativas
- Formulários otimizados para touch
- Painéis laterais responsivos

---

## **8. ROADMAP DE DESENVOLVIMENTO**

### **8.1 Prioridades Técnicas Imediatas**

**Fase 1: Backend Essencial (4-6 semanas)**
1. Setup Node.js/Express + PostgreSQL
2. API de autenticação (JWT)
3. CRUD de utilizadores por categoria
4. Endpoints para formulários
5. Sistema de email (SendGrid/Mailgun)
6. Migração de API key OpenAI para env vars

**Fase 2: Funcionalidades Core (6-8 semanas)**
1. Dashboard diferenciado por tipo de utilizador
2. Sistema de matching inteligente jovens ↔ oportunidades
3. Chat interno entre utilizadores
4. Sistema de notificações (push/email)
5. Admin panel para gestão

**Fase 3: Escalabilidade (4-6 semanas)**
1. Sistema de aprovação de registos
2. Relatórios e analytics avançados
3. Integração com sistemas externos
4. API para futura mobile app
5. Otimizações de performance

### **8.2 Funcionalidades Futuras**

**Expansão Técnica:**
- Machine learning para matching
- Sistema de gamificação
- Marketplace de oportunidades
- Integração com redes sociais
- Multi-idiomas (PT, EN, outros)
- PWA (Progressive Web App)

---

## **9. CONSIDERAÇÕES ESPECIAIS**

### **9.1 Multilíngue (Preparação)**

**Estrutura Recomendada:**
- Português (principal)
- Inglês (internacional)
- Outros idiomas CPLP conforme demanda

### **9.2 GDPR e Privacidade**

**Implementação Obrigatória:**
- Cookie consent banner
- Política de privacidade detalhada
- Direito ao esquecimento
- Encriptação de dados pessoais
- Termos e condições específicos

### **9.3 Analytics e Monitorização**

**Ferramentas Recomendadas:**
- Google Analytics 4
- Google Tag Manager
- Search Console
- Uptime monitoring
- Error tracking

---

## **10. CHECKLIST DE QUALIDADE**

### **10.1 Pré-Launch**

**Conteúdo:**
- [ ] Todos os textos revistos conforme este guia
- [ ] Imagens otimizadas e com alt text
- [ ] Links funcionais testados
- [ ] Formulários validados
- [ ] Ordenação correta das seções

**Técnico:**
- [ ] Site responsivo em todos os dispositivos
- [ ] Performance score > 90 (PageSpeed)
- [ ] SSL configurado
- [ ] Backup automático
- [ ] Chatbot funcional

**SEO:**
- [ ] Meta tags completas
- [ ] Sitemap.xml gerado
- [ ] Robots.txt configurado
- [ ] Schema markup implementado

### **10.2 Pós-Launch**

**Monitorização:**
- [ ] Analytics configurado
- [ ] Error tracking ativo
- [ ] Performance monitoring
- [ ] Relatórios de utilização

---

## **11. RECURSOS E CONTACTOS**

### **11.1 Stakeholders do Projeto**

**Aprovação de Conteúdos:**
- Federação Minha Terra: mariaclarabraga@minhaterra.pt
- Adritem: madrilusa@adritem.pt
- Adraces: apoio-imigrantes@adraces.pt
- CoraNE: terrafria@corane.pt

### **11.2 Documentação Relacionada**

**Documentos na pasta `doc/`:**
- `Manual de Identidade Visual e Comunicação - Madrilusa.md` (cores, tipografia, logos)
- `Guia de Inscrições na Plataforma Madrilusa.md` (campos de formulários)

### **11.3 Assets Disponíveis**

**Localização:** `public/logo_madrilusa/`
- Logo colorido: `logo madrilusa.png`
- Logo branco: `logo branco.png`
- Barra de logos: `barradelogosmadrilusa.png`
- Logo vetorial: `logo madrilusa.ai`

---

## **CONCLUSÃO**

Este guia unificado fornece todas as especificações de conteúdo, estrutura e funcionalidades para o desenvolvimento e manutenção do site Madrilusa. A implementação deve manter fidelidade aos conteúdos aqui especificados, utilizando as orientações visuais do Manual de Identidade Visual.

**Princípios-chave:**
- Manter exatamente os conteúdos e ordem das seções
- Implementar todas as funcionalidades interativas
- Garantir responsividade e acessibilidade
- Focar na experiência do utilizador
- Preparar para escalabilidade futura

**Para orientações visuais (cores, tipografia, logos):** Consultar o "Manual de Identidade Visual e Comunicação - Madrilusa.md"

---

*Guia Completo de Conteúdo e Seções do Madrilusa - Versão 2.0*  
*Documento Unificado - Janeiro 2025*  
*Para atualizações: madrilusa@adritem.pt* 