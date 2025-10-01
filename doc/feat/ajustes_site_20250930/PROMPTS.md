# 📝 Prompts Utilizados - feat/ajustes_site_20250930

## Índice
- [Prompt Inicial (Contexto e Planejamento)](#prompt-inicial-contexto-e-planejamento)
- [Prompt de Refinamento (Segurança)](#prompt-de-refinamento-segurança)
- [Prompt de Implementação Final](#prompt-de-implementação-final)
- [Prompt de Fechamento](#prompt-de-fechamento)

---

## Prompt Inicial (Contexto e Planejamento)

```
planeje como podemos fazer edições apenas na home page desse projeto, de todas as
seções dela e funcionamentos dela, sem interferir em edições ou modificações de outros
elementos e páginas da plataforma. verifique como está a documentacao e como podemos
montar um agente do claude code para esse projeto para fazer essas alteracoes na home
page sem afetar outras funcionalidades, visual ou qq caracteristica do projeto. de
forma isolada para atuar apenas na home page e suas subseções e eventuais subpáginas.
acredito que vá precisar ter uma analise aprofundada de todos os elementos funcionais
e visuais que estão interligados com outras funções da plataforma. há uma inteção
desse isolamento completo no projeto, mas não sei em que nivel está isso de implantação
e garantia de que o que for desenvolvido de um lado nao vai interferir no outro (home
page e subpaginas institucionais, com plataforma) apesar da inteção ser de ambas
seguirem uma identidade visual consistente e unificada.

nao quero gerar mudanca alguma nesse momento nessa estrutura, minhas intencoes são
apenas modificar coisas na home page e suas seções garantindo que não vão interferir
nas demais telas da plataforma, tendo esses duas principais aplicações dentro desse
projeto, institucional com home page e seções e eventuais novas subpaginas e a plataforma
do outro lado. id visual unificada mas funcoes, base de dados fluxos e etc independentes.
nem que para isso haja uma duplicaçõa da parte de identidade visual para nao arriscar
mudancas que causem impactos.

nesse momento nao estamos priorizando essa eventual reestruturacao. precisamos apenas
mudar coisas na home page institucional, mas seria interessante nesse momento de
mapeamento geral termos essas informacoes de forma minuciosamente mapeadas e criado
um agente para desenvolvimento de coisas na home que já vai seguir todas essas diretrizes,
facilitando assim todas as futuras ediçòes bem como garantindo nao interferencia em
outras partes como "efeito colateral" como podemo fazer isso nesse momento?

para ter ideia do que precisamos alterar nesse momento, na montagem desse agente,
precisamos dessas demandas listadas abaixo. utilize elas como objeto de validacao,
pois a ideia nao eh alterar nesse momento e sim. ontar o plano de criacao desse agente
permanente no projeto para fazer esses tipos de edicoes.

pesquise online na documentação oficial da anthorpic sobre criacoes de agentes
permantens para projetos com o claude code e sonnet 4.5 e em outras fontes de peersuia
confiaveis e com bom engajamento sobre dicas de montagem de agentes para claude code
usando sonnet 4.5

demandas:

mudar botao juntem-se a nós para Junte-se a nós
fazer com que esse botão leve para a seção de "Como posso participar" como ancora
idem para o botão "Faça parte dessa missão" que deve levar para a seção Como posso ajudar
idem para o botão Resgiste-se e faça parte. mesmo comportamento dos anteriores
alterar link das redes sociais para links a serem especificados

outras demandas serão criadas no futuro para edicao de criacao de coisas nessa home
e parte institucional, por isso a criação desse agente.

consegue criar esse plano de criação do agente, orientação de como usar ele e toda
a estruturação tecnica dele fazendo um mapeamento completo da plataforma e sistema
como citado acima?

instale e use o mcp playwright caso ele ainda nao esteja ativo para navegar na site
e ter mais informacoes, e orinete o agente a utilizar fortemntete esse mcp sempre
para garantir as entregas
```

**Contexto**: Este foi o prompt inicial que deu origem ao ciclo de desenvolvimento.
O usuário identificou a necessidade de criar um agente especializado para edições
na home page com garantias de isolamento.

**Resultado**: Plano completo de criação do agente, mapeamento de dependências,
análise de isolamento e estrutura técnica.

---

## Prompt de Refinamento (Segurança)

```
achei tudo otimo. nao fiquei seguro se houve um mapeamento de se há outras paginas,
elementos ou funcoes da plataforma e sistema que utilizam o que será editado para a
home page institucional. ok ela usar coisas isoladas, mas há a garantia de que nada
em outro lugar no sistema utiliza esses mesmos elementos, sejam eles quais forem?

tenho receio de editar um botao que esta isolado na parte institucional, e ter outra
pagina utilizando ele como objeto na plataforma. usei o botao como exemplo, mas qq
outro elemento que a home page usa, esta sendo imprtado em outro lugar na plataforma?
tanto visual quanto funcional? esse mapeamento completo de "fora" para dentro, que
esteja sendo importado ou usado por outro lugar no projeto, é que nao fiquei muito
seguro. como garantir isso?

do mais está perfeito e pediria para nao mudar. apenas incrementar com essa seguranca.

como fica?
```

**Contexto**: Usuário solicitou validação adicional de segurança, pedindo mapeamento
completo de dependências reversas (verificar se a plataforma importa componentes institucionais).

**Resultado**:
- Análise completa de dependências reversas
- Mapeamento de componentes compartilhados (Chatbot, Auth)
- Identificação de assets compartilhados (logos)
- Criação de componentes UI isolados
- Criação de assets isolados
- Script de validação automática

---

## Prompt de Implementação Final

```
na etapa final, de implementar mudancas, certifique-se que ja esteja usando o agente
e que ele sera ativado sempre que solicitado de forma transparente, ou seja, foi
solitada qq edicao na home page ou parte institucional, ele eh quem deve ser solicitado
para fazer, mesmo que o usuario nao tenha explicitado. e ele deve se atualizar sempre
que perceber algo novo, seguindo as diretrizes, quando for utilizado. portanto quando
for executar as mudancas na etapa final, certifique-se que sera com esse jornada
transparente e que seja sempre ele a ser utilizado. e atualize o que for necessario
para que isso aconteca e certifiquese em seguida.
```

**Contexto**: Usuário solicitou que a invocação do agente fosse automática e transparente,
sem necessidade de chamada explícita.

**Resultado**:
- Atualização do agente com descrição expandida (gatilhos de invocação)
- Atualização do CLAUDE.md com seção de invocação automática
- Documentação de gatilhos e palavras-chave
- Implementação das 4 mudanças solicitadas via agente
- Validação de isolamento

**Mudanças Implementadas pelo Agente**:
1. ✅ Botão Hero: "Junte-se a nós" (singular)
2. ✅ Navegação Hero → #registration-cards
3. ✅ Navegação Objectives → #registration-cards
4. ✅ Navegação Activities → #registration-cards

---

## Prompt de Fechamento

```
agora vamos fazer um fluxo de fechamento de sessão seguindo a orientacao abaixo.

caso tenham coisas que nao sejam necessarias por ja terem sido feita, como atualizacao
do claude.md, pode ignorar.

**Objetivo**
Quero documentar este ciclo de desenvolvimento **antes de fazer o commit**, garantindo
que tudo que foi feito, aprendido e corrigido esteja registrado de forma organizada.
A saída deve contemplar documentação técnica, instruções práticas, histórico de
aprendizado e o comentário de commit (sem executar o commit).  Caso já existam
documentações ou os passos a seguir para essa branch, faça um update com o diferencial
para ela estar atualizada, mantendo o que foi documentado anteriormente sendo assim
uma atualização incremental da documentação

**Entregáveis**
1. **README.md (atualizado)**
   - Incrementar instruções de como levantar o projeto localmente.
   - Detalhar configurações necessárias para execução correta.
   - Referenciar a pasta `/docs` para documentação mais detalhada.

2. **Pasta `/docs` (na raiz do projeto)**
   - Criar uma **subpasta dentro de `/docs` com o nome da branch atual** (por exemplo:
     `/docs/nome-da-branch`).
   - Dentro dessa subpasta, criar o documento principal da sessão, contendo:
     - Objetivo do ciclo.
     - O que foi feito e implementado.
     - Problemas enfrentados e soluções aplicadas.
     - Passo a passo atualizado para executar o objetivo desta etapa (já com as correções).
     - Orientações ou links para etapas semelhantes em ciclos futuros.
   - Seção com os **prompts usados neste ciclo**, em sua íntegra, para formar uma base
     de conhecimento.
   - Seção extra com o **conteúdo sugerido para o comentário do commit** (não executar,
     apenas gerar).

3. **CLAUDE.md (atualizado)**
   - Adaptar com aprendizados e implantações desta etapa.
   - Orientações revisadas para o uso de prompts e interações no projeto.

**Instruções para geração**
- Estruturar a documentação de forma clara e organizada, com títulos e subtítulos.
- Ser objetivo, mas sem perder o contexto histórico (o que foi aprendido e por quê).
- Usar exemplos práticos sempre que possível (comandos, snippets de configuração,
  passos numerados).
- Garantir que qualquer desenvolvedor, ao ler a documentação, consiga:
  1. Reproduzir os resultados desta etapa.
  2. Entender os problemas e soluções aplicadas.
  3. Usar os aprendizados para acelerar ciclos futuros.
```

**Contexto**: Solicitação de documentação completa do ciclo antes do commit, seguindo
padrão estabelecido do projeto.

**Resultado**: Esta documentação que você está lendo!

---

## 📊 Análise dos Prompts

### Padrões Identificados

1. **Incremental**: Cada prompt refinava o anterior
2. **Validação**: Usuário sempre validava antes de prosseguir
3. **Segurança primeiro**: Foco em não quebrar o existente
4. **Documentação forte**: Pedido explícito de documentação completa
5. **Automação**: Busca por fluxos transparentes e automáticos

### Lições Aprendidas

1. **Planejamento antes de implementação**: Todos os prompts priorizaram planejamento
2. **Validação de dependências**: Mapeamento de dependências foi crucial
3. **Isolamento é rei**: Garantir isolamento foi requisito central
4. **Documentação como entregável**: Documentação tão importante quanto código
5. **Transparência para usuário**: Invocação automática melhora experiência

### Recomendações para Ciclos Futuros

#### Estrutura de Prompt Eficaz

```
1. Contexto claro
2. Objetivo específico
3. Restrições/limitações
4. Validações necessárias
5. Entregáveis esperados
```

#### Prompts de Planejamento

```
- Mapear antes de implementar
- Identificar dependências
- Validar isolamento
- Criar plano de ação
- Documentar riscos
```

#### Prompts de Implementação

```
- Referenciar plano anterior
- Validar cada etapa
- Testar isolamento
- Documentar mudanças
- Confirmar automações
```

#### Prompts de Fechamento

```
- Documentar tudo feito
- Capturar aprendizados
- Criar guias práticos
- Preparar commit message
- Orientar ciclos futuros
```

---

**Nota**: Estes prompts estão disponíveis como base de conhecimento para ciclos
futuros de desenvolvimento no projeto Madrilusa. Adapte conforme necessário, mas
mantenha a estrutura de planejamento → validação → implementação → documentação.
