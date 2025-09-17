# 🐛 **TEMPLATE: CORREÇÃO DE BUG**

## **📋 INFORMAÇÕES DO BUG**

### **Título do Bug**
`[Descrição concisa do problema]`

### **Severidade**
- [ ] 🔴 **Crítica** - Sistema não funciona/dados corrompidos
- [ ] 🟠 **Alta** - Funcionalidade principal afetada
- [ ] 🟡 **Média** - Funcionalidade secundária afetada
- [ ] 🟢 **Baixa** - Problema cosmético/melhoria

### **Categoria Afetada**
- [ ] 🌍 Imigrante
- [ ] 🏢 Empresa
- [ ] 🏛️ Município
- [ ] 🎓 Academia
- [ ] 👨‍👩‍👧‍👦 Família
- [ ] 🛡️ Admin
- [ ] 🔄 Todas as categorias
- [ ] 📱 Geral (sistema)

---

## **🔍 DESCRIÇÃO DO PROBLEMA**

### **Comportamento Atual**
```
[Descrever exatamente o que está acontecendo de errado]
```

### **Comportamento Esperado**
```
[Descrever como deveria funcionar corretamente]
```

### **Passos para Reproduzir**
1. `[Passo 1]`
2. `[Passo 2]`
3. `[Passo 3]`
4. `[Observar o problema]`

### **Frequência**
- [ ] ⚡ Sempre reproduz
- [ ] 🔄 Frequentemente (>50%)
- [ ] 🎲 Esporadicamente (<50%)
- [ ] 🌙 Raro/Uma vez

---

## **🔧 ANÁLISE TÉCNICA**

### **Localização do Problema**
```
Arquivo: [caminho/arquivo.ts:linha]
Função: [nomeFuncao()]
Componente: [NomeComponente]
Endpoint: [GET/POST /api/rota]
```

### **Erro Específico**
```
[Colar mensagem de erro completa, se houver]
```

### **Logs/Console**
```
[Colar logs relevantes]
```

### **Causa Raiz Identificada**
```
[Explicar a causa técnica do problema]
```

---

## **🔍 INVESTIGAÇÃO**

### **Módulos Relacionados**
- [ ] `backend/src/modules/auth/`
- [ ] `backend/src/modules/users/`
- [ ] `backend/src/modules/[categoria]/`
- [ ] `backend/src/modules/contribuicoes/`
- [ ] `backend/src/modules/ai/`
- [ ] `backend/src/modules/sinergia/`
- [ ] `src/app/components/`
- [ ] `src/app/pages/`
- [ ] `src/types/`

### **Dependências Envolvidas**
- [ ] Prisma ORM
- [ ] OpenAI API
- [ ] React Query
- [ ] shadcn/ui
- [ ] React Hook Form
- [ ] Zod validação
- [ ] Outros: `[especificar]`

---

## **💡 SOLUÇÃO PROPOSTA**

### **Estratégia de Correção**
- [ ] 🔄 **Refactor** - Reescrever lógica problemática
- [ ] 🩹 **Patch** - Correção pontual
- [ ] 🛡️ **Validação** - Adicionar checks de segurança
- [ ] 📝 **Documentação** - Melhorar documentação
- [ ] 🧪 **Teste** - Adicionar testes para prevenir regressão

### **Impacto da Correção**
- [ ] 🎯 **Sem side effects** - Correção isolada
- [ ] ⚠️ **Possível impacto** - Outras funcionalidades podem ser afetadas
- [ ] 🔄 **Breaking change** - Requer atualizações em outros módulos

---

## **📁 ARQUIVOS MODIFICADOS**

### **Correções Principais**
```
[ ] [arquivo1.ts] - [descrição da modificação]
[ ] [arquivo2.tsx] - [descrição da modificação]
[ ] [arquivo3.service.ts] - [descrição da modificação]
```

### **Arquivos de Teste (se aplicável)**
```
[ ] [arquivo.test.ts] - [novo teste para prevenir regressão]
```

### **Documentação Atualizada**
```
[ ] README.md - [se impacta uso geral]
[ ] CLAUDE.md - [se impacta desenvolvimento]
[ ] doc/[documento-especifico].md
```

---

## **🔧 IMPLEMENTAÇÃO DA CORREÇÃO**

### **Etapa 1: Preparação**
- [ ] Reproduzir bug consistentemente
- [ ] Identificar todos os pontos afetados
- [ ] Criar branch específica para correção
- [ ] Backup de dados (se necessário)

### **Etapa 2: Correção**
- [ ] Implementar fix principal
- [ ] Adicionar validações preventivas
- [ ] Atualizar tipos TypeScript (se necessário)
- [ ] Corrigir documentação inline

### **Etapa 3: Validação**
- [ ] Verificar que bug foi corrigido
- [ ] Executar `npm run lint` sem erros
- [ ] Executar `npm run type-check` sem erros
- [ ] Testar cenários relacionados

### **Etapa 4: Teste de Regressão**
- [ ] Testar funcionalidades relacionadas
- [ ] Verificar diferentes categorias de usuário
- [ ] Testar casos edge
- [ ] Confirmar integração com APIs

---

## **✅ VALIDAÇÃO DA CORREÇÃO**

### **Checklist de Testes**
- [ ] ✅ Bug original não reproduz mais
- [ ] ✅ Funcionalidade funciona conforme esperado
- [ ] ✅ Não quebrou outras funcionalidades
- [ ] ✅ Performance mantida
- [ ] ✅ UX não foi degradada

### **Testes Específicos**
```
1. [Teste específico 1]
   Resultado: [✅ Pass / ❌ Fail]

2. [Teste específico 2]
   Resultado: [✅ Pass / ❌ Fail]

3. [Teste específico 3]
   Resultado: [✅ Pass / ❌ Fail]
```

### **Testes de Diferentes Usuários**
- [ ] 🌍 Imigrante: `[resultado]`
- [ ] 🏢 Empresa: `[resultado]`
- [ ] 🏛️ Município: `[resultado]`
- [ ] 🎓 Academia: `[resultado]`
- [ ] 👨‍👩‍👧‍👦 Família: `[resultado]`
- [ ] 🛡️ Admin: `[resultado]`

---

## **📊 MÉTRICAS DE VALIDAÇÃO**

### **Performance**
- **Antes**: `[X]ms` tempo de resposta
- **Depois**: `[X]ms` tempo de resposta
- **Melhoria**: `[X]%` / `Mantido` / `Degradado [X]%`

### **Usabilidade**
- **Erro rate antes**: `[X]%`
- **Erro rate depois**: `[X]%`
- **Melhoria**: `[X]%`

---

## **🚨 PREVENÇÃO DE REGRESSÃO**

### **Medidas Preventivas Implementadas**
- [ ] Validação adicional no backend
- [ ] Verificação no frontend
- [ ] Logs de debug adicionados
- [ ] Documentação melhorada
- [ ] Teste automatizado (se aplicável)

### **Monitoramento Pós-Correção**
- [ ] Verificar logs de erro
- [ ] Monitorar métricas de uso
- [ ] Feedback dos usuários
- [ ] Performance da aplicação

---

## **📝 DOCUMENTAÇÃO**

### **Changelog**
```
## [Versão] - [Data]
### Fixed
- Corrigido [descrição do bug] que afetava [categoria/funcionalidade]
```

### **Atualização de Documentos**
- [ ] README.md (se aplicável)
- [ ] CLAUDE.md (se impacta desenvolvimento)
- [ ] Documentação técnica específica
- [ ] Comentários no código

---

## **🔍 LIÇÕES APRENDIDAS**

### **Causa Raiz**
```
[Explicar por que o bug aconteceu e como evitar similar no futuro]
```

### **Melhorias Sugeridas**
- [ ] `[Melhoria 1]`
- [ ] `[Melhoria 2]`
- [ ] `[Melhoria 3]`

### **Padrões a Seguir**
```
[Documentar padrões que previnem este tipo de problema]
```

---

## **📅 CRONOGRAMA**

### **Estimativas**
- **Investigação**: `[X]` horas
- **Implementação**: `[X]` horas
- **Testes**: `[X]` horas
- **Documentação**: `[X]` horas
- **Total**: `[X]` horas

### **Timeline**
- [ ] `[Data/Hora]` - Bug reportado
- [ ] `[Data/Hora]` - Investigação iniciada
- [ ] `[Data/Hora]` - Causa identificada
- [ ] `[Data/Hora]` - Correção implementada
- [ ] `[Data/Hora]` - Fix validado
- [ ] `[Data/Hora]` - Deploy realizado

---

## **💬 NOTAS ADICIONAIS**

```
[Observações durante a correção, decisões técnicas tomadas,
dificuldades encontradas, comunicação com stakeholders, etc.]
```

---

## **🔗 REFERÊNCIAS**

- **Issue/Ticket**: `[Link ou número]`
- **Pull Request**: `[Link]`
- **Documentação Relacionada**: `[Links]`
- **Discussões Técnicas**: `[Links ou referências]`

---

**🎯 Correção alinhada com os padrões de qualidade do projeto Madrilusa.**

---

*Template criado para desenvolvimento consistente com Claude Code*
*Projeto Madrilusa - Janeiro 2025*