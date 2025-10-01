# 🏠 Homepage Editor Agent - Guia Completo de Uso

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Invocação Automática](#invocação-automática)
- [Como Usar](#como-usar)
- [Arquitetura de Isolamento](#arquitetura-de-isolamento)
- [Validação de Segurança](#validação-de-segurança)
- [Casos de Uso Comuns](#casos-de-uso-comuns)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **Homepage Editor Agent** é um agente especializado do Claude Code criado para realizar edições **seguras e isoladas** na home page institucional do Madrilusa, garantindo **zero impacto** na plataforma logada.

### Características Principais
- ✅ **Invocação Automática**: Detecta automaticamente solicitações relacionadas à home
- ✅ **Isolamento Total**: Modificações não afetam a plataforma (`/src/app/`)
- ✅ **Validação Visual**: Usa MCP Playwright para confirmar mudanças
- ✅ **Auto-Atualização**: Mantém-se atualizado com novos componentes e padrões
- ✅ **Componentes UI Isolados**: Usa cópias exclusivas do shadcn/ui
- ✅ **Assets Separados**: Gerencia imagens e logos isolados

### Localização
```
.claude/agents/homepage-editor.md    # Configuração do agente
doc/agentes/HOMEPAGE_EDITOR_GUIDE.md # Este guia
```

---

## 🚀 Invocação Automática

O agente é **automaticamente invocado** quando você menciona:

### Gatilhos de Invocação

#### Componentes da Home
- `Hero`, `About`, `FAQ`, `Footer`, `Header`
- `RegistrationCards`, `Objectives`, `Activities`
- `Newsletter`, `Target`, `InstitutionalHeader`

#### Elementos Visuais
- Botões da home, links, âncoras
- Navegação por scroll
- Redes sociais, formulários
- Cores, fontes, espaçamento

#### Caminhos de Arquivo
- `/src/institutional/`
- `institutional-theme.css`
- `/public/institutional-assets/`

#### Palavras-Chave
- "home page", "landing page", "página institucional"
- "site institucional", "seção da home"
- Qualquer menção a componentes específicos acima

### Exemplo de Invocação Transparente

```bash
# Você digita:
"Alterar o texto do botão Hero para 'Junte-se a nós'"

# Claude detecta automaticamente e invoca:
[🏠 homepage-editor]: Iniciando edição no componente Hero...
                      Validando isolamento...
                      Aplicando mudança...
                      ✅ Concluído com sucesso!
```

**Você NÃO precisa** chamar o agente explicitamente! Ele é invocado automaticamente.

---

## 💻 Como Usar

### Uso Básico (Invocação Automática)

```bash
# Simplesmente faça sua solicitação:
"Mudar cor do botão principal da home para azul"
"Adicionar nova seção entre About e RegistrationCards"
"Configurar links de redes sociais no Footer"
"Atualizar FAQ com novas perguntas"
```

### Uso Explícito (Opcional)

Se preferir invocar manualmente:

```bash
/agent homepage-editor "sua solicitação aqui"
```

### Comandos Especiais

```bash
# Validar isolamento
./scripts/validate-isolation.sh

# Ver estrutura da home
ls -R src/institutional/components/

# Verificar âncoras de navegação
grep -r "getElementById\|scrollIntoView" src/institutional/
```

---

## 🔒 Arquitetura de Isolamento

### Separação Completa

```
Madrilusa Project
├── 🏠 Home Institucional (/src/institutional/)
│   ├── UI Framework: shadcn/ui (isolado)
│   ├── Estilos: institutional-theme.css
│   ├── Assets: /public/institutional-assets/
│   └── Rota: / (landing page)
│
└── 💻 Plataforma Logada (/src/app/)
    ├── UI Framework: Shards-React
    ├── Estilos: Componentes próprios
    ├── Assets: /public/logo_madrilusa/ (compartilhado)
    └── Rotas: /app/* (dashboard, perfis, etc.)
```

### Componentes UI Isolados

```
/src/institutional/components/ui/
├── button.tsx      # ✅ Cópia isolada
├── card.tsx        # ✅ Cópia isolada
├── input.tsx       # ✅ Cópia isolada
├── accordion.tsx   # ✅ Cópia isolada
├── dialog.tsx      # ✅ Cópia isolada
└── ... (9 componentes isolados)
```

**Sempre importar**: `import { Button } from "../components/ui/button"`
**Nunca importar**: `import { Button } from "@/components/ui/button"`

### Assets Isolados

```
/public/institutional-assets/
├── logo-madrilusa-home.png       # Logo exclusivo da home
├── barra-logos-home.png          # Parceiros exclusivo da home
└── logo-branco-home.png          # Variante branca
```

### Componentes Compartilhados (Cuidado!)

**Chatbot** (`/src/shared/components/Chatbot.tsx`)
- Usado na home E na plataforma
- **NÃO EDITAR** sem consultar impacto total

**Módulos de Auth** (`/src/modules/auth/`)
- LoginForm e RegisterForm usam shadcn/ui original
- **NÃO EDITAR** componentes UI base

---

## ✅ Validação de Segurança

### Script de Validação Automática

```bash
# Executar validação completa
./scripts/validate-isolation.sh
```

### O Que o Script Verifica

1. **Imports Reversos**: Plataforma importando código institucional
2. **Componentes UI Compartilhados**: Home usando @/components/ui
3. **Estilos Cruzados**: Plataforma usando classes institutional-*
4. **Assets Compartilhados**: Uso incorreto de assets
5. **Estrutura de Diretórios**: Existência de pastas isoladas
6. **Componentes Shared**: Lembra sobre cuidado ao editar

### Resultados Possíveis

✅ **Isolamento Perfeito**: Nenhum problema detectado
⚠️  **Isolamento OK com Avisos**: Recomendações de melhorias
❌ **Isolamento Comprometido**: Erros críticos que devem ser corrigidos

### Validação Manual

```bash
# Verificar imports reversos
grep -r "from.*institutional" src/app/

# Verificar uso de componentes UI isolados
grep -r "@/components/ui" src/institutional/

# Verificar estilos
grep -r "institutional-theme" src/app/
```

---

## 📝 Casos de Uso Comuns

### 1. Alterar Texto de Botão

**Solicitação**: "Mudar botão Hero de 'Juntem-se a nós' para 'Junte-se a nós'"

**Processo do Agente**:
1. ✅ Detecta gatilho "botão Hero"
2. 📖 Lê [Hero.tsx](../../src/institutional/components/Hero.tsx)
3. ✏️ Edita texto do botão
4. 🔍 Valida com Playwright
5. ✅ Confirma mudança

**Resultado**: Botão atualizado sem afetar plataforma

### 2. Configurar Âncoras de Navegação

**Solicitação**: "Fazer botão 'Junte-se a nós' levar para seção 'Como posso participar'"

**Processo do Agente**:
1. ✅ Detecta gatilho "navegação" e "âncora"
2. 📖 Lê Hero.tsx e RegistrationCards.tsx
3. 🔍 Identifica ID correto: `#como-participar`
4. ✏️ Adiciona onClick com scrollIntoView
5. 🌐 Testa navegação com Playwright
6. ✅ Confirma funcionamento

**Código Gerado**:
```tsx
<Button onClick={() =>
  document.getElementById('como-participar')?.scrollIntoView({
    behavior: 'smooth'
  })
}>
  Junte-se a nós
</Button>
```

### 3. Adicionar Nova Seção

**Solicitação**: "Criar seção de depoimentos entre Activities e FAQ"

**Processo do Agente**:
1. ✅ Detecta gatilho "nova seção"
2. 📁 Cria `Testimonials.tsx` em `/src/institutional/components/`
3. 🎨 Usa componentes UI isolados e estilos institutional
4. ✏️ Adiciona em LandingPage.tsx na ordem correta
5. 🔗 Adiciona âncora `#depoimentos`
6. 🔍 Valida layout com Playwright
7. 🔄 Auto-atualiza este guia com nova seção
8. ✅ Confirma adição

### 4. Modificar Estilos

**Solicitação**: "Mudar cor primária da home para tom mais escuro de laranja"

**Processo do Agente**:
1. ✅ Detecta gatilho "cor" e "home"
2. 📖 Lê institutional-theme.css
3. ✏️ Atualiza variável `--institutional-primary`
4. 🔍 Valida visualmente todos componentes
5. ✅ Confirma que plataforma não foi afetada

### 5. Configurar Redes Sociais

**Solicitação**: "Atualizar links de redes sociais no Footer"

**Processo do Agente**:
1. ✅ Detecta gatilho "Footer" e "redes sociais"
2. 📖 Lê Footer.tsx
3. ✏️ Atualiza URLs dos links
4. 🔗 Testa que links abrem corretamente
5. ✅ Confirma mudança

**Código Gerado**:
```tsx
<a href="https://facebook.com/madrilusa" target="_blank">
  <Facebook className="w-6 h-6" />
</a>
```

---

## 🎨 Estrutura da Home Page

### Componentes (Ordem de Renderização)

```
LandingPage.tsx
├── 1. InstitutionalHeader   (#home - sempre visível)
├── 2. Hero                  (#home - seção principal)
├── 3. About                 (#sobre - apresentação)
├── 4. RegistrationCards     (#como-participar - categorias)
├── 5. Objectives            (#como-ajudar - objetivos)
├── 6. Target                (#para-quem - público-alvo)
├── 7. Activities            (#actividades - ações)
├── 8. FAQ                   (#faq - perguntas)
├── 9. Newsletter            (#newsletter - inscrição)
├── 10. Footer               (#contactos - rodapé)
└── 11. Chatbot             (flutuante - compartilhado ⚠️)
```

### Âncoras de Navegação

| Âncora | Seção | Usado Por |
|--------|-------|-----------|
| `#home` | Hero | InstitutionalHeader |
| `#sobre` | About | InstitutionalHeader |
| `#como-participar` | RegistrationCards | Botão "Junte-se a nós" |
| `#como-ajudar` | Objectives | Botão "Faça parte desta missão" |
| `#para-quem` | Target | InstitutionalHeader |
| `#actividades` | Activities | InstitutionalHeader |
| `#faq` | FAQ | InstitutionalHeader, RegistrationCards |
| `#newsletter` | Newsletter | (scroll natural) |
| `#contactos` | Footer | InstitutionalHeader |

---

## 🛡️ Checklist de Segurança

Antes de confirmar qualquer mudança:

- [ ] Arquivo editado está em `/src/institutional/`?
- [ ] Não modifiquei componentes em `@/components/ui/`?
- [ ] Usei componentes UI de `/src/institutional/components/ui/`?
- [ ] Usei assets de `/public/institutional-assets/`?
- [ ] Executei `./scripts/validate-isolation.sh`?
- [ ] Validei visualmente com Playwright?
- [ ] Testei navegação por âncoras?
- [ ] Testei responsividade mobile?
- [ ] Mantive identidade visual Madrilusa?
- [ ] Documentei mudança se relevante?

---

## 🔧 Troubleshooting

### Problema: Agente não foi invocado automaticamente

**Sintoma**: Fiz solicitação sobre home mas agente não respondeu

**Solução**:
1. Verifique se usou palavras-chave dos gatilhos
2. Invoque manualmente: `/agent homepage-editor "sua solicitação"`
3. Verifique se arquivo `.claude/agents/homepage-editor.md` existe

### Problema: Mudança afetou a plataforma

**Sintoma**: Alterei home e sidebar da plataforma mudou

**Solução**:
1. Execute `./scripts/validate-isolation.sh`
2. Identifique o componente compartilhado modificado
3. Reverta mudança
4. Use componente UI isolado ao invés do compartilhado

### Problema: Playwright não carrega a página

**Sintoma**: Erro ao validar visualmente com MCP Playwright

**Solução**:
1. Verifique se servidor está rodando: `npm run dev`
2. Acesse manualmente: `http://localhost:8080`
3. Verifique console do navegador por erros
4. Execute `npm run type-check` para verificar erros TypeScript

### Problema: Botão não navega para âncora

**Sintoma**: Clique no botão não faz scroll

**Solução**:
1. Verifique se ID da âncora existe: `grep -r "id=\"como-participar\"" src/institutional/`
2. Confirme sintaxe do scrollIntoView:
   ```tsx
   onClick={() => document.getElementById('como-participar')?.scrollIntoView({
     behavior: 'smooth'
   })}
   ```
3. Teste no navegador: abra console e execute manualmente

### Problema: Estilos não aplicados

**Sintoma**: Mudanças em CSS não aparecem

**Solução**:
1. Limpe cache: Ctrl+Shift+R (ou Cmd+Shift+R no Mac)
2. Verifique import em LandingPage.tsx: `import "../styles/institutional-theme.css"`
3. Confirme que classe está no CSS
4. Inspecione elemento no navegador (F12)

---

## 📚 Recursos Adicionais

### Documentação Relacionada
- [README.md](../../README.md) - Visão geral do projeto
- [CLAUDE.md](../../CLAUDE.md) - Guia de desenvolvimento
- [Homepage Editor Agent](../../.claude/agents/homepage-editor.md) - Configuração do agente
- [Componentes UI Isolados](../../src/institutional/components/ui/README.md)
- [Assets Isolados](../../public/institutional-assets/README.md)

### Scripts Úteis
```bash
# Desenvolvimento
npm run dev              # Rodar frontend (porta 8080)
npm run dev:full         # Rodar frontend + backend

# Validação
npm run lint             # Verificar código
npm run type-check       # Verificar tipos TypeScript
./scripts/validate-isolation.sh  # Validar isolamento

# Análise
grep -r "institutional" src/   # Buscar referências
find src/institutional/ -name "*.tsx"  # Listar componentes
```

### Identidade Visual
- **Laranja Madrilusa**: `#F5A623` (`--institutional-primary`)
- **Azul Turquesa**: `#4A90A4` (`--institutional-secondary`)
- **Tipografia**: Open Sans, Helvetica Neue, sans-serif

### Suporte
- **Técnico**: madrilusa@adritem.pt
- **Documentação**: `/doc`
- **Issues**: (criar no repositório se aplicável)

---

## 🎉 Conclusão

O Homepage Editor Agent garante que você pode fazer edições na home page institucional com **total confiança** de que:

✅ Nenhuma modificação afetará a plataforma logada
✅ Identidade visual permanece consistente
✅ Componentes permanecem isolados
✅ Validações automáticas garantem qualidade

**Use livremente e com segurança!** 🚀

---

*Guia mantido automaticamente pelo Homepage Editor Agent*
*Última atualização: Janeiro 2025*
