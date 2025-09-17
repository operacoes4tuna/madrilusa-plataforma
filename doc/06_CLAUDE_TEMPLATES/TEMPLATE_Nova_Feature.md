# 🚀 **TEMPLATE: NOVA FEATURE**

## **📋 INFORMAÇÕES BÁSICAS**

### **Nome da Feature**
`[Inserir nome descritivo da feature]`

### **Categoria Afetada**
- [ ] 🌍 Imigrante
- [ ] 🏢 Empresa
- [ ] 🏛️ Município
- [ ] 🎓 Academia
- [ ] 👨‍👩‍👧‍👦 Família
- [ ] 🛡️ Admin
- [ ] 🔄 Todas as categorias

### **Tipo de Feature**
- [ ] 🆕 Nova funcionalidade
- [ ] 📊 Melhoria existente
- [ ] 🎨 Interface/UX
- [ ] 🤖 Integração IA
- [ ] 📡 API/Backend
- [ ] 🗄️ Base de dados

---

## **🎯 OBJETIVOS**

### **Problema a Resolver**
```
[Descrever o problema ou necessidade que esta feature resolve]
```

### **Resultado Esperado**
```
[Descrever como a feature deve funcionar quando concluída]
```

### **Impacto para o Usuário**
```
[Explicar como isto beneficia os usuários finais]
```

---

## **🏗️ ANÁLISE TÉCNICA**

### **Módulos Envolvidos**
- [ ] `backend/src/modules/auth/`
- [ ] `backend/src/modules/users/`
- [ ] `backend/src/modules/imigrantes/`
- [ ] `backend/src/modules/empresas/`
- [ ] `backend/src/modules/municipios/`
- [ ] `backend/src/modules/academias/`
- [ ] `backend/src/modules/familias/`
- [ ] `backend/src/modules/admin/`
- [ ] `backend/src/modules/contribuicoes/`
- [ ] `backend/src/modules/ai/`
- [ ] `backend/src/modules/sinergia/`
- [ ] `backend/src/modules/dados-profissionais/`
- [ ] `backend/src/modules/oportunidades-trabalho/`

### **Dependências Técnicas**
- [ ] OpenAI GPT-4
- [ ] Prisma ORM
- [ ] React Query
- [ ] shadcn/ui
- [ ] Zod validação
- [ ] TypeScript
- [ ] Outros: `[especificar]`

---

## **📁 ARQUIVOS MODIFICADOS**

### **Backend**
```
backend/src/modules/[modulo]/
├── [ ] [modulo].controller.ts    # Adicionar/modificar endpoints
├── [ ] [modulo].service.ts       # Lógica de negócio
├── [ ] [modulo].routes.ts        # Novas rotas
├── [ ] [modulo].types.ts         # Interfaces TypeScript
└── [ ] [modulo].validation.ts    # Validações (se necessário)
```

### **Frontend**
```
src/app/
├── [ ] components/[categoria]/[NomeComponente].tsx
├── [ ] pages/[NomePagina].tsx
├── [ ] hooks/use[NomeHook].ts
└── [ ] services/[nome].api.ts
```

### **Tipos**
```
src/types/
└── [ ] [nome-feature].types.ts   # Interfaces compartilhadas
```

### **Base de Dados**
```
backend/prisma/
├── [ ] schema.prisma             # Modificações no schema
└── [ ] migrations/               # Nova migration (se necessário)
```

---

## **🔧 IMPLEMENTAÇÃO**

### **Etapa 1: Backend**
- [ ] Criar/modificar interfaces TypeScript
- [ ] Implementar service com lógica de negócio
- [ ] Criar controller para endpoints
- [ ] Definir rotas HTTP
- [ ] Adicionar validações necessárias
- [ ] Testar endpoints com Prisma Studio

### **Etapa 2: Frontend**
- [ ] Criar componentes necessários
- [ ] Implementar hooks para API
- [ ] Adicionar páginas se necessário
- [ ] Integrar com React Query
- [ ] Aplicar estilos conforme identidade visual

### **Etapa 3: Integração**
- [ ] Testar fluxo completo
- [ ] Validar UX/UI
- [ ] Verificar responsividade
- [ ] Testar com diferentes categorias de usuário

### **Etapa 4: IA (se aplicável)**
- [ ] Configurar prompts OpenAI
- [ ] Implementar rate limiting
- [ ] Adicionar sanitização de dados
- [ ] Testar diferentes cenários

---

## **✅ VALIDAÇÃO**

### **Testes Funcionais**
- [ ] Feature funciona conforme especificado
- [ ] Integração com sistema existente
- [ ] Diferentes categorias de usuário (se aplicável)
- [ ] Casos edge/erro tratados adequadamente

### **Testes Técnicos**
- [ ] `npm run lint` sem erros
- [ ] `npm run type-check` sem erros
- [ ] `npm run dev:full` inicia sem problemas
- [ ] Base de dados mantém integridade

### **Testes de UX**
- [ ] Interface intuitiva e consistente
- [ ] Português de Portugal correto
- [ ] Responsividade mobile
- [ ] Acessibilidade básica

---

## **📝 DOCUMENTAÇÃO**

### **Atualizações Necessárias**
- [ ] README.md (se funcionalidade principal)
- [ ] CLAUDE.md (se afeta desenvolvimento)
- [ ] Documentação técnica em `doc/03_IMPLEMENTACAO_TECNICA/`
- [ ] Status de implementação em `doc/status_implementacao/`

### **Novas Documentações**
- [ ] Guia específico da feature (se complexa)
- [ ] Exemplos de uso
- [ ] Troubleshooting comum

---

## **📊 MÉTRICAS DE SUCESSO**

### **KPIs Técnicos**
- [ ] Performance: `< [X]ms` tempo de resposta
- [ ] Usabilidade: `< [X]` cliques para completar ação
- [ ] Erro: `< [X]%` taxa de erro

### **KPIs de Negócio**
- [ ] Adoção: `[X]%` dos usuários utilizam
- [ ] Engagement: `+[X]%` tempo na plataforma
- [ ] Satisfação: `[X]/5` rating médio

---

## **🚨 RISCOS E CONSIDERAÇÕES**

### **Riscos Técnicos**
- [ ] Breaking changes em código existente
- [ ] Performance impact
- [ ] Compatibilidade entre versões
- [ ] Segurança e privacidade

### **Riscos de Negócio**
- [ ] Confusão dos usuários existentes
- [ ] Sobrecarga de features
- [ ] Manutenção futura

---

## **📅 CRONOGRAMA**

### **Estimativas**
- **Análise e Design**: `[X]` horas
- **Implementação Backend**: `[X]` horas
- **Implementação Frontend**: `[X]` horas
- **Testes e Validação**: `[X]` horas
- **Documentação**: `[X]` horas
- **Total**: `[X]` horas

### **Milestones**
- [ ] `[Data]` - Análise concluída
- [ ] `[Data]` - Backend implementado
- [ ] `[Data]` - Frontend implementado
- [ ] `[Data]` - Testes concluídos
- [ ] `[Data]` - Feature em produção

---

## **💬 NOTAS E OBSERVAÇÕES**

```
[Espaço para anotações durante o desenvolvimento, decisões tomadas,
dificuldades encontradas, etc.]
```

---

**🎯 Esta feature está alinhada com a missão do Madrilusa de promover a integração social de jovens imigrantes em Portugal.**

---

*Template criado para desenvolvimento consistente com Claude Code*
*Projeto Madrilusa - Janeiro 2025*