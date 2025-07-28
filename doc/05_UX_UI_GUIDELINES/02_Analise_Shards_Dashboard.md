# Análise do Shards Dashboard - Elementos Observados

## Layout Principal
- **Sidebar lateral esquerda**: Navegação principal com ícones e labels
- **Header superior**: Barra de busca, notificações e perfil do usuário
- **Área principal**: Grid de cards e componentes organizados

## Cores Identificadas
- **Azul primário**: Usado no logo e elementos principais
- **Cores dos cards de métricas**: Verde, azul claro, laranja, rosa, roxo
- **Background**: Cinza claro (#f8f9fa aproximadamente)
- **Sidebar**: Fundo branco com bordas sutis

## Componentes Principais Observados
1. **Cards de Métricas**: 
   - Números grandes centralizados
   - Pequenos gráficos de linha
   - Indicadores de porcentagem com cores (verde/vermelho)
   - Labels descritivos

2. **Gráficos**:
   - Gráfico de linha para "Users Overview"
   - Gráfico de pizza para "Users by device"
   - Cores consistentes (azul predominante)

3. **Sidebar Navigation**:
   - Ícones Material Design
   - Cores diferentes para cada item
   - Estado ativo destacado

4. **Cards de Conteúdo**:
   - "New Draft" com input de texto
   - "Discussions" com lista de comentários
   - "Top Referrals" com lista numerada

## Tipografia
- Títulos em cinza escuro
- Números de métricas em destaque
- Texto secundário em cinza médio



## Padrões de Design Detalhados

### Sistema de Cores
**Cores Primárias:**
- Azul: #007bff (Primary)
- Cinza: #6c757d (Secondary)
- Verde: #28a745 (Success)
- Vermelho: #dc3545 (Danger)
- Amarelo: #ffc107 (Warning)
- Azul claro: #17a2b8 (Info)
- Escuro: #343a40 (Dark)
- Claro: #f8f9fa (Light)

**Aplicação das Cores:**
- Cards de métricas: Cada card tem uma cor de destaque diferente
- Botões: Sistema completo de cores para diferentes estados
- Indicadores: Verde para positivo, vermelho para negativo
- Background: Cinza muito claro (#f8f9fa)

### Layout e Grid System
**Estrutura Principal:**
- Sidebar fixa à esquerda (aproximadamente 250px)
- Header fixo no topo
- Área de conteúdo responsiva
- Grid de cards flexível (2-5 colunas dependendo do conteúdo)

**Espaçamento:**
- Padding interno dos cards: 1.5rem
- Margin entre cards: 1rem
- Espaçamento vertical entre seções: 2rem

### Componentes Identificados

#### 1. Cards de Métricas
- **Estrutura**: Número grande + label + gráfico pequeno + indicador de mudança
- **Tamanhos**: Números principais em ~2.5rem
- **Cores**: Bordas coloridas no topo ou ícones coloridos
- **Estados**: Indicadores de crescimento/declínio com cores

#### 2. Sidebar Navigation
- **Ícones**: Material Design Icons
- **Estados**: Ativo, hover, normal
- **Cores**: Cada item tem cor própria
- **Estrutura**: Ícone + texto

#### 3. Botões
- **Variações**: Solid, outline, small, normal
- **Estados**: Normal, hover, active, disabled
- **Cores**: Sistema completo de 8 cores
- **Bordas**: Radius de ~0.25rem

#### 4. Formulários
- **Inputs**: Bordas sutis, focus com cor primária
- **Labels**: Posicionamento acima dos campos
- **Validação**: Estados de sucesso/erro com cores e mensagens
- **Grupos**: Inputs agrupados com prefixos/sufixos

#### 5. Cards de Conteúdo
- **Blog Posts**: Imagem + categoria + título + excerpt + autor + data
- **Discussions**: Avatar + nome + conteúdo + ações
- **Estrutura**: Padding consistente, sombras sutis

### Tipografia
**Hierarquia:**
- H1: ~2rem, peso 600
- H2: ~1.5rem, peso 600  
- H3: ~1.25rem, peso 600
- Body: ~1rem, peso 400
- Small: ~0.875rem, peso 400

**Cores de Texto:**
- Títulos: #495057 (cinza escuro)
- Texto normal: #6c757d (cinza médio)
- Texto secundário: #adb5bd (cinza claro)
- Links: #007bff (azul primário)

### Elementos Visuais
**Sombras:**
- Cards: box-shadow sutil (0 0.125rem 0.25rem rgba(0,0,0,0.075))
- Hover: Sombra mais pronunciada
- Modais: Sombra mais forte

**Bordas:**
- Radius padrão: 0.25rem
- Bordas sutis: 1px solid #dee2e6

**Gráficos:**
- Cores consistentes com o sistema
- Linhas suaves
- Grid sutil
- Tooltips informativos

