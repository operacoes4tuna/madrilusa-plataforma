# Guia Completo para Desenvolvimento do Novo Site Madrilusa

## Visão Geral

Este guia fornece todas as especificações necessárias para desenvolver um novo site baseado na estrutura, conteúdos e funcionalidades do madrilusa.com actual. O objectivo é recriar fielmente a experiência do utilizador, mantendo todos os elementos aprovados.

---

## 1. ARQUITECTURA E NAVEGAÇÃO

### 1.1 Estrutura Principal

**Tipo de Site:** Single Page Application (SPA) com secções âncora
**URL Principal:** madrilusa.com

### 1.2 Menu de Navegação (Header)

**Posicionamento:** Fixo no topo
**Elementos:**
1. **Logótipo Madrilusa** (canto superior esquerdo)
2. **Menu horizontal:**
   - Home (âncora para topo)
   - Sobre (âncora para secção + painel lateral)
   - Para quem (âncora para secção específica)
   - FAQ (âncora + painel lateral)
   - Contactos (âncora para footer)
   - **Inscreva-se** (botão destacado em laranja)
   - **Login** (botão azul escuro)

**Comportamento:**
- Menu responsivo para dispositivos móveis
- Scroll suave entre secções
- Destaque visual do item activo

### 1.3 Estrutura de Secções

**Ordem das secções na página:**
1. Hero Section
2. Bem vindo ao Madrilusa
3. Faça parte do projecto
4. Principais Objectivos
5. A quem se destina?
6. As acções do projecto incluem
7. Perguntas frequentes
8. Newsletter
9. Footer/Contactos

---

## 2. CONTEÚDOS DETALHADOS POR SECÇÃO

### 2.1 Hero Section

**Layout:** Split-screen (60% texto / 40% imagem)

**Conteúdo Textual:**
- **Título Principal:** "Inovação e empreendedorismo social para jovens imigrantes"
- **Subtítulo:** "Jovens imigrantes em início de vida, famílias com espaço no coração e empresas que abrem portas"
- **CTA Principal:** Botão "Juntem-se a nós" (laranja)

**Elementos Visuais:**
- **Imagem:** Grupo de jovens diversos sorrindo (lado direito)
- **Fundo:** Gradiente azul claro
- **Tipografia:** Títulos em azul escuro, CTA em branco sobre laranja

### 2.2 Secção "Bem vindo ao Madrilusa"

**Fundo:** Azul escuro (#1a365d)
**Texto:** Branco

**Conteúdo:**
```
O projecto Madrilusa é uma iniciativa de Inovação e Empreendedorismo Social promovida em parceria entre a ADRITEM com a Federação Minha Terra, a CoraNE e a ADRACES.

A proposta busca enfrentar a exclusão social de jovens imigrantes em Portugal, associando o seu potencial às necessidades de zonas rurais afectadas pelo despovoamento e envelhecimento.

Diante da escassez de mão-de-obra e da crise habitacional que atinge especialmente os mais vulneráveis, o projecto promove a fixação desses jovens em territórios rurais como estratégia de revitalização e inclusão.

Por meio de metodologias inovadoras de acolhimento, capacitação e acompanhamento, Madrilusa incentiva o diálogo intercultural, a solidariedade entre gerações e o desenvolvimento sustentável, com o objectivo de construir comunidades mais inclusivas e resilientes.
```

**Funcionalidade:**
- Botão "Sabe Mais" que abre painel lateral com conteúdo expandido

### 2.3 Painel Lateral "Sobre" (Conteúdo Expandido)

**Activação:** Clique em "Sabe Mais"
**Layout:** Painel deslizante da direita
**Fundo:** Azul escuro com overlay

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

**Elementos Visuais:**
- Rede de conexões com fotografias de pessoas diversas
- Representação visual da colaboração e networking
- Design que sugere interconexão e comunidade

### 2.4 Secção "Faça parte do projecto"

**Layout:** Grid de 5 cartões horizontais

**Elementos Visuais:**
- Rede de pessoas conectadas (fundo azul escuro)
- Fotografias circulares de pessoas diversas
- Linhas pontilhadas conectando as pessoas

**5 Categorias de Inscrição:**

1. **Sou imigrante**
   - Imagem: Jovem com bandeira de Portugal
   - Cor de destaque: Verde
   - Link para formulário de pré-inscrição

2. **Empresa**
   - Imagem: Sala de reuniões moderna
   - Cor de destaque: Azul
   - Link para formulário empresarial

3. **Município**
   - Imagem: Edifício histórico/câmara municipal
   - Cor de destaque: Laranja
   - Link para formulário municipal

4. **Academia**
   - Imagem: Biblioteca com estudantes
   - Cor de destaque: Roxo
   - Link para formulário académico

5. **Família de acolhimento**
   - Imagem: Família diversa reunida
   - Cor de destaque: Cinzento
   - Link para formulário familiar

### 2.5 Secção "Principais Objectivos"

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

### 2.6 Secção "A quem se destina?"

**Layout:** Texto + imagem lateral

**Conteúdo:**
```
A IIES Madrilusa tem como missão apoiar a integração de jovens imigrantes, ajudando-os a desenvolver competências pessoais e sociais para que sejam bem recebidos e reconhecidos pelas comunidades onde vivem.

A iniciativa é dirigida a jovens imigrantes com menos de 30 anos, em Portugal ou no estrangeiro, e pretende envolver cerca de 2.400 participantes ao longo de três anos.
```

**Imagem:** Três jovens de diferentes etnias abraçados, sorrindo

### 2.7 Secção "As acções do projecto incluem"

**Layout:** Grid 2x2 com imagens e descrições

**4 Acções:**

1. **Desenvolvimento de competências**
   - Inserção no mercado de trabalho
   - Inserido no Programa +Futuro
   - Imagem: Pessoas trabalhando em computadores

2. **Criação da Luso Academia**
   - Para fomentar talentos
   - Partilhar saberes culturais
   - Imagem: Arte/cultura com vinil e elementos artísticos

3. **Rede de Apoio**
   - Ao Acolhimento e Integração
   - Actividades de capacitação em economia doméstica
   - Cidadania e participação cívica
   - Imagem: Mãos oferecendo um coração

4. **Realização de estágios**
   - De verão e trabalhos temporários para os jovens
   - Imagem: Jovem trabalhando no computador


### 2.8 Secção "Perguntas frequentes"

**Layout:** Sistema de tabs/separadores

**4 Categorias de FAQ:**
1. **FAMÍLIAS DE ACOLHIMENTO** (destacado em laranja)
2. **JOVENS IMIGRANTES**
3. **GERAIS**
4. **PARA EMPRESAS**

**Funcionalidade:**
- Clique no menu FAQ abre painel lateral
- Conteúdo específico por categoria
- Perguntas numeradas (ex: 03, 04)

**Exemplo de Conteúdo (Painel FAQ):**
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
"Se tens interesse, faz o teu registo e entra em contacto connosco, por território:"

Contactos por Território:
- Minha Terra: minhaterra@minhaterra.pt | (+351) 2178 197 230
- Adritem: madrilusa@adritem.pt
```

### 2.9 Secção Newsletter

**Layout:** Split-screen (imagem + formulário)
**Fundo:** Laranja (cor da marca)

**Elementos:**
- **Título:** "Subscreve a nossa Newsletter"
- **Imagem:** Grupo de jovens diversos sorrindo ao ar livre (lado esquerdo)
- **Formulário:** (lado direito)
  - Campo: "Vosso e-mail" (input de email)
  - Botão: "Subscrever" (azul escuro)

### 2.10 Footer/Contactos

**Fundo:** Cinzento claro
**Layout:** Multi-coluna organizada por entidade

**Elementos Principais:**
- **Logótipo Madrilusa** (centralizado no topo)
- **Redes Sociais:** Facebook, LinkedIn, Instagram
- **Contactos das 4 Entidades Parceiras**
- **Logótipos dos Parceiros** (2 linhas)
- **Copyright:** "2025 desenvolvido por 4tuna"

**Contactos das Entidades:**

**Minha Terra:**
- Email: minhaterra@minhaterra.pt
- Telefone: (+351) 2178 197 230
- Cor: Roxo

**Adritem:**
- Email: madrilusa@adritem.pt
- Telefone: (+351) 937 342 173
- Cor: Azul

**Adraces:**
- Email: apoio-imigrantes@adraces.pt
- Telefone: (+351) 272 540 200
- Cor: Rosa

**CoraNE:**
- Email: terrafria@corane.pt
- Telefone: (+351) 273 332 925
- Cor: Verde

**Logótipos dos Parceiros:**

*Primeira linha:*
- Minha Terra
- Adritem
- Adraces
- CoraNE

*Segunda linha:*
- Portugal Inovação Social
- Centro 2020
- Norte 2020
- Portugal 2030
- Cofinanciado pela União Europeia

---

## 3. FORMULÁRIOS E FUNCIONALIDADES INTERACTIVAS

### 3.1 Sistema de Formulários

**Plataforma:** Subdomínio separado (plataforma.madrilusa.com)
**Tipo:** Modal/popup que abre sobre o site principal

### 3.2 Formulário "Sou Imigrante" (Pré-inscrição)

**URL:** https://plataforma.madrilusa.com/public-profile
**Título:** "Pré-inscrição"

**Campos Obrigatórios:**

1. **Nome completo**
   - Tipo: Text input
   - Validação: Obrigatório

2. **Nacionalidade**
   - Tipo: Dropdown
   - Placeholder: "Nacionalidade"
   - Validação: Obrigatório

3. **Data de Nascimento**
   - Tipo: Date picker
   - Formato: mm/dd/yyyy
   - Ícone: Calendário
   - Validação: Obrigatório

4. **Email**
   - Tipo: Email input
   - Validação: Obrigatório + formato email

5. **Telemóvel (WhatsApp)**
   - Tipo: Dropdown país + input número
   - Países disponíveis: Portugal, Brasil, Angola, Moçambique, Cabo Verde, Guiné-Bissau, São Tomé e Príncipe, Timor-Leste, Macau, Alemanha, Áustria, Bélgica, Bulgária, Chipre, Croácia, Dinamarca, Eslováquia, Eslovênia, Espanha, Estados Unidos
   - Placeholder: "Digite o número"
   - Validação: Obrigatório

**Objectivos (Checkboxes):**
- Emprego
- Formação
- Regularização
- Outros

**Campos Opcionais:**

6. **Mensagem**
   - Tipo: Textarea
   - Placeholder: "Escreva uma mensagem..."

**Políticas:**

7. **Concordo com a política de dados e privacidade e política de cookies**
   - Tipo: Checkbox
   - Links: "política de dados e privacidade" e "política de cookies"
   - Validação: Obrigatório

**Acção:**
- Botão "Enviar pré-inscrição" (azul, texto branco)

### 3.3 Outros Formulários

**Nota:** Os formulários para Empresa, Município, Academia e Família de acolhimento seguem estrutura similar, mas com campos específicos para cada categoria (conforme mapeamento anterior do utilizador).

### 3.4 Funcionalidades Interactivas

**Painéis Laterais:**
- Activados por cliques em "Sabe Mais" e "FAQ"
- Deslizam da direita para a esquerda
- Overlay escuro sobre conteúdo principal
- Botão de fechar (X) no canto superior direito

**Navegação Suave:**
- Scroll automático entre secções
- Transições suaves
- Menu fixo com destaque da secção activa

**Responsividade:**
- Layout adaptativo para desktop, tablet e mobile
- Menu hamburger em dispositivos móveis
- Imagens optimizadas para diferentes resoluções

---

## 4. ESPECIFICAÇÕES TÉCNICAS

### 4.1 Tecnologias Recomendadas

**Frontend:**
- HTML5 semântico
- CSS3 com Flexbox/Grid
- JavaScript ES6+ (ou framework como React/Vue)
- SCSS para organização de estilos

**Backend:**
- Node.js + Express (ou PHP/Python)
- Base de dados: PostgreSQL ou MySQL
- API RESTful para formulários

**Hosting:**
- CDN para imagens e assets
- SSL obrigatório
- Backup automático

### 4.2 Performance e SEO

**Optimizações:**
- Lazy loading para imagens
- Minificação de CSS/JS
- Compressão de imagens (WebP quando possível)
- Meta tags optimizadas
- Schema markup para SEO

**Acessibilidade:**
- Contraste adequado (WCAG 2.1)
- Navegação por teclado
- Alt text em todas as imagens
- Estrutura semântica correcta

### 4.3 Integração com Identidade Visual

**Paleta de Cores:**
- Laranja Madrilusa: #F5A623
- Azul Turquesa: #4A90A4
- Branco: #FFFFFF
- Cinzento Escuro: #333333
- Cinzento Claro: #F5F5F5

**Tipografia:**
- Fonte principal: Open Sans (Google Fonts)
- Hierarquia clara de títulos
- Line-height adequado para legibilidade

**Elementos Visuais:**
- Ícones consistentes
- Fotografias de alta qualidade
- Layout modular e limpo
- Espaçamento generoso

---


## 5. ESTRUTURA DE FICHEIROS E ORGANIZAÇÃO

### 5.1 Estrutura de Directórios Recomendada

```
madrilusa-website/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── categories/
│   │   ├── actions/
│   │   ├── partners/
│   │   └── people/
│   ├── icons/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Categories/
│   │   ├── Objectives/
│   │   ├── Actions/
│   │   ├── FAQ/
│   │   ├── Newsletter/
│   │   └── Footer/
│   ├── styles/
│   │   ├── globals.scss
│   │   ├── variables.scss
│   │   └── components/
│   ├── utils/
│   └── data/
├── forms/
│   ├── immigrant/
│   ├── company/
│   ├── municipality/
│   ├── academy/
│   └── family/
└── docs/
```

### 5.2 Assets Necessários

**Imagens Principais:**
- Hero: Grupo de jovens diversos (1920x1080)
- Categorias: 5 imagens específicas (600x400)
- Acções: 4 imagens de actividades (500x300)
- Newsletter: Jovens ao ar livre (800x600)
- Rede de pessoas: 10+ fotografias circulares (200x200)

**Ícones:**
- Redes sociais (Facebook, LinkedIn, Instagram)
- Objectivos (mundo, competências, apoio, rede)
- Interface (calendário, fechar, menu)

**Logótipos:**
- Madrilusa (versões colorida, branca, preta)
- 4 entidades parceiras
- 5 logótipos de financiadores

### 5.3 Funcionalidades por Prioridade

**Fase 1 - Essencial:**
- Estrutura HTML completa
- CSS responsivo
- Navegação entre secções
- Formulário de imigrantes funcional

**Fase 2 - Interactividade:**
- Painéis laterais (Sobre, FAQ)
- Formulários restantes
- Newsletter funcional
- Animações suaves

**Fase 3 - Optimização:**
- Performance optimizada
- SEO completo
- Testes de acessibilidade
- Analytics integrado

---

## 6. CONTEÚDOS PARA COPYWRITING

### 6.1 Textos Aprovados (Usar Exactamente)

**Hero Section:**
- Título: "Inovação e empreendedorismo social para jovens imigrantes"
- Subtítulo: "Jovens imigrantes em início de vida, famílias com espaço no coração e empresas que abrem portas"

**Sobre o Projecto:**
[Usar texto completo da secção 2.2]

**Objectivos:**
[Usar textos completos da secção 2.5]

**Público-alvo:**
[Usar texto completo da secção 2.6]

**Acções:**
[Usar descrições completas da secção 2.7]

### 6.2 Metadados SEO

**Title:** "Madrilusa - Inovação e Empreendedorismo Social para Jovens Imigrantes"

**Description:** "O projecto Madrilusa promove a integração de jovens imigrantes em Portugal através de iniciativas inovadoras de acolhimento, capacitação e desenvolvimento sustentável em territórios rurais."

**Keywords:** "imigrantes, integração social, empreendedorismo social, Portugal, jovens, territórios rurais, inclusão, diversidade"

---

## 7. CRONOGRAMA DE DESENVOLVIMENTO

### 7.1 Fases de Desenvolvimento

**Semana 1-2: Planeamento e Setup**
- Configuração do ambiente de desenvolvimento
- Criação da estrutura de ficheiros
- Setup do sistema de versionamento
- Preparação dos assets

**Semana 3-4: Desenvolvimento Frontend**
- HTML semântico completo
- CSS responsivo
- Implementação das secções principais
- Navegação básica

**Semana 5-6: Funcionalidades Interactivas**
- Painéis laterais
- Formulários básicos
- Integração com backend
- Testes de funcionalidade

**Semana 7-8: Optimização e Testes**
- Performance optimization
- Testes de responsividade
- Validação de acessibilidade
- Testes de utilizador

**Semana 9-10: Deploy e Ajustes**
- Configuração do hosting
- Deploy em produção
- Testes finais
- Ajustes baseados em feedback

### 7.2 Marcos de Entrega

**Marco 1:** Protótipo estático funcional
**Marco 2:** Versão interactiva completa
**Marco 3:** Site optimizado e testado
**Marco 4:** Deploy em produção

---

## 8. CONSIDERAÇÕES ESPECIAIS

### 8.1 Multilíngue (Futuro)

**Preparação para:**
- Português (principal)
- Inglês (internacional)
- Outros idiomas conforme necessidade

**Implementação:**
- Estrutura de ficheiros preparada
- Sistema de tradução
- URLs localizados

### 8.2 Acessibilidade

**Requisitos WCAG 2.1:**
- Contraste mínimo 4.5:1
- Navegação por teclado
- Screen reader friendly
- Texto alternativo em imagens

### 8.3 GDPR e Privacidade

**Implementar:**
- Cookie consent
- Política de privacidade
- Direito ao esquecimento
- Encriptação de dados pessoais

### 8.4 Analytics e Tracking

**Ferramentas Recomendadas:**
- Google Analytics 4
- Google Tag Manager
- Hotjar (heatmaps)
- Search Console

---

## 9. CHECKLIST DE QUALIDADE

### 9.1 Antes do Launch

**Conteúdo:**
- [ ] Todos os textos revistos e aprovados
- [ ] Imagens optimizadas e com alt text
- [ ] Links funcionais
- [ ] Formulários testados

**Técnico:**
- [ ] Site responsivo em todos os dispositivos
- [ ] Performance score > 90 (PageSpeed)
- [ ] SSL configurado
- [ ] Backup automático configurado

**SEO:**
- [ ] Meta tags completas
- [ ] Sitemap.xml gerado
- [ ] Robots.txt configurado
- [ ] Schema markup implementado

**Acessibilidade:**
- [ ] Teste com screen reader
- [ ] Navegação por teclado
- [ ] Contraste validado
- [ ] Formulários acessíveis

### 9.2 Pós-Launch

**Monitorização:**
- [ ] Analytics configurado
- [ ] Uptime monitoring
- [ ] Error tracking
- [ ] Performance monitoring

**Manutenção:**
- [ ] Backups regulares
- [ ] Updates de segurança
- [ ] Optimização contínua
- [ ] Relatórios mensais

---

## 10. CONTACTOS E SUPORTE

### 10.1 Stakeholders do Projecto

**Aprovação de Conteúdos:**
- Federação Minha Terra: mariaclarabraga@minhaterra.pt
- Adritem: madrilusa@adritem.pt

**Suporte Técnico:**
- Adraces: apoio-imigrantes@adraces.pt
- CoraNE: terrafria@corane.pt

### 10.2 Recursos Adicionais

**Documentação:**
- Manual de identidade visual (referência)
- Guia de inscrições (campos obrigatórios)
- Especificações técnicas detalhadas

**Assets:**
- Biblioteca de imagens aprovadas
- Logótipos em diferentes formatos
- Ícones e elementos gráficos

---

## CONCLUSÃO

Este guia fornece todas as especificações necessárias para desenvolver um novo site Madrilusa que mantenha a fidelidade ao design e funcionalidades aprovadas. A implementação deve seguir as melhores práticas de desenvolvimento web, garantindo performance, acessibilidade e experiência de utilizador optimizada.

**Pontos-chave a recordar:**
- Manter exactamente os conteúdos aprovados
- Seguir a identidade visual estabelecida
- Implementar todas as funcionalidades interactivas
- Garantir responsividade e acessibilidade
- Optimizar para performance e SEO

Para dúvidas ou esclarecimentos adicionais, contactar as entidades parceiras listadas na secção de contactos.

---

*Guia de Desenvolvimento Site Madrilusa - Versão 1.0*  
*Baseado no mapeamento completo do site actual - Julho 2025*  
*Para actualizações: madrilusa@adritem.pt*

