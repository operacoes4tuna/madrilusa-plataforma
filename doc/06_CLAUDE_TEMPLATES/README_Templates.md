# 📋 **TEMPLATES CLAUDE CODE - MADRILUSA**

Este diretório contém templates e recursos para desenvolvimento consistente com Claude Code no projeto Madrilusa.

## 📁 **ARQUIVOS DISPONÍVEIS**

### **📝 Templates de Desenvolvimento**
- **`TEMPLATE_Nova_Feature.md`** - Template completo para implementação de novas funcionalidades
- **`TEMPLATE_Bug_Fix.md`** - Template estruturado para correção de bugs
- **`CHECKLIST_Qualidade.md`** - Checklist abrangente de qualidade para desenvolvimento
- **`COMANDOS_Investigacao.md`** - Comandos úteis para análise e investigação do projeto

### **📊 Arquivo de Configuração**
- **`.claude-session`** (na raiz) - Configurações do projeto para Claude Code
- **`CLAUDE.md`** (na raiz) - Guia principal de desenvolvimento

---

## 🎯 **COMO USAR OS TEMPLATES**

### **Para Novas Features**
1. Copie o `TEMPLATE_Nova_Feature.md`
2. Renomeie para `FEATURE_[nome-da-feature].md`
3. Preencha todas as seções antes de começar a implementar
4. Use como guia durante o desenvolvimento
5. Marque itens conforme completa

### **Para Correção de Bugs**
1. Copie o `TEMPLATE_Bug_Fix.md`
2. Renomeie para `BUG_[descricao-do-bug].md`
3. Documente o problema detalhadamente
4. Siga as etapas de investigação e correção
5. Valide com os testes propostos

### **Para Controle de Qualidade**
1. Use `CHECKLIST_Qualidade.md` antes, durante e após desenvolvimento
2. Marque todos os itens aplicáveis
3. Não prossiga se houver itens críticos pendentes
4. Documente problemas encontrados

### **Para Investigação**
1. Consulte `COMANDOS_Investigacao.md` para comandos úteis
2. Execute comandos relevantes para sua tarefa
3. Use resultados para entender o projeto
4. Documente descobertas importantes

---

## 🚀 **WORKFLOW RECOMENDADO**

### **1. Início de Sessão**
```bash
# Ler contexto do projeto
cat CLAUDE.md

# Verificar configuração
cat .claude-session

# Validar ambiente
npm run check:claude
```

### **2. Análise do Projeto**
```bash
# Usar comandos de investigação
# Ver: doc/06_CLAUDE_TEMPLATES/COMANDOS_Investigacao.md

# Exemplo: Analisar estrutura
find src -type d | head -10
```

### **3. Planejamento**
- Escolher template apropriado
- Preencher informações básicas
- Usar TodoWrite para organizar tarefas
- Definir critérios de sucesso

### **4. Desenvolvimento**
- Seguir padrões estabelecidos no projeto
- Consultar CLAUDE.md para convenções
- Usar checklist de qualidade
- Testar incrementalmente

### **5. Validação**
```bash
# Executar validações
npm run validate
npm run check:claude

# Testes manuais por categoria de usuário
# (ver credenciais em CLAUDE.md)
```

---

## 📊 **ESTRUTURA DO PROJETO MADRILUSA**

### **Arquitetura Geral**
```
madrilusasite/
├── 📁 src/institutional/    # Marketing/Landing
├── 📁 src/app/             # Aplicação logada
├── 📁 backend/             # API modular
├── 📁 doc/                 # Documentação
└── 📁 public/             # Assets
```

### **Categorias de Usuário (100% Implementadas)**
- 🌍 **Imigrantes** (14 campos, 7 endpoints)
- 🏢 **Empresas** (4 campos, 6 endpoints)
- 🏛️ **Municípios** (7 campos, 6 endpoints)
- 🎓 **Academias** (9 campos, 6 endpoints)
- 👨‍👩‍👧‍👦 **Famílias** (5 campos, 6 endpoints)

### **Sistemas de IA Integrados**
1. **Contribuições** - Aprimoramento texto + sugestão tags
2. **SinergIA** - Matching inteligente entre categorias
3. **Chatbot** - Assistente virtual landing page

---

## 🎨 **PADRÕES VISUAIS**

### **Identidade Oficial**
- **Laranja Madrilusa**: `#F5A623`
- **Azul Turquesa**: `#4A90A4`
- **Tipografia**: Open Sans
- **Linguagem**: Português de Portugal

### **Componentes**
- **shadcn/ui** para componentes base
- **Tailwind CSS** para estilização
- **Classes específicas**: `.app-title-h1`, `.app-card`, `.app-button-primary`

---

## 🔧 **COMANDOS ESSENCIAIS**

### **Desenvolvimento**
```bash
npm run dev:full      # Frontend + Backend
npm run validate      # Lint + Type-check
npm run check:claude  # Validação completa
```

### **Base de Dados**
```bash
npm run db:studio     # Interface visual
npm run db:reset      # Reset completo
```

### **Login Rápido (Desenvolvimento)**
```
imigrante@madrilusa.com.pt / vcgvcg
empresa@madrilusa.com.pt / vcgvcg
admin@madrilusa.com.pt / vcgvcg
```

---

## 📚 **DOCUMENTAÇÃO RELACIONADA**

### **Documentos Principais**
- **README.md** - Visão geral completa
- **CLAUDE.md** - Guia de desenvolvimento
- **doc/status_implementacao/** - Status detalhados
- **doc/03_IMPLEMENTACAO_TECNICA/** - Guias técnicos

### **Documentação de IA**
- **doc/02-IA_DEFINICOES_FUNCIONAIS_IA/** - Dossiê completo IA
- Sistemas OpenAI GPT-4 integrados
- Rate limiting e segurança implementados

---

## 🎯 **OBJETIVOS DOS TEMPLATES**

### **Consistência**
- Padrões unificados entre sessões
- Qualidade técnica mantida
- Documentação sempre atualizada

### **Eficiência**
- Contexto rapidamente disponível
- Comandos prontos para uso
- Workflow otimizado

### **Qualidade**
- Checklists abrangentes
- Validações automáticas
- Testes estruturados

### **Escalabilidade**
- Templates reutilizáveis
- Metodologia documentada
- Padrões replicáveis

---

## 🚨 **ALERTAS IMPORTANTES**

### **Segurança**
- ⚠️ Chave OpenAI exposta em `/src/shared/components/Chatbot.tsx:41`
- ✅ Configuração correta em `backend/.env`
- 🔒 Dados sensíveis sempre sanitizados

### **Documentação**
- 📋 NUNCA criar arquivos .md na raiz (apenas em /doc)
- 📝 Sempre usar templates para consistência
- 🔄 Manter status atualizado após mudanças

### **Desenvolvimento**
- 🎯 Sempre seguir padrões TypeScript rigorosos
- 🎨 Aplicar identidade visual oficial
- 🇵🇹 Usar português de Portugal em toda interface

---

**🎉 COM ESTES TEMPLATES, O DESENVOLVIMENTO COM CLAUDE CODE SERÁ CONSISTENTE, EFICIENTE E DE ALTA QUALIDADE.**

---

*Templates criados para o projeto Madrilusa - Janeiro 2025*
*Plataforma de Integração Social para Jovens Imigrantes da CPLP*