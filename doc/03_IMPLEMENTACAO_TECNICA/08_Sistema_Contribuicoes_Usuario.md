# 📋 PLANO COMPLETO: SISTEMA DE CONTRIBUIÇÕES - MADRILUSA

## 🎯 **VISÃO GERAL DA FUNCIONALIDADE**

### **Conceito Central**
Implementar um sistema de **Contribuições** que permite:
- **Admin:** Cadastrar tipos de contribuições por categoria de perfil
- **Usuários:** Adicionar múltiplas contribuições específicas ao seu perfil
- **Sistema:** Gerenciar tags compartilhadas entre todas as contribuições

### **Hierarquia Estrutural Proposta**
```
User (nível 1)
├── Perfil Específico (nível 2) - existente
└── Contribuições (nível 3) - NOVO
    ├── Tipos de Contribuição (configuração admin)
    └── Contribuições do Usuário (dados específicos)
```

---

## 🗄️ **MAPEAMENTO DE ESTRUTURA DO BANCO**

### **Nova Tabela 1: `tipos_contribuicao`**
```prisma
model TipoContribuicao {
  id              String   @id @default(cuid())
  titulo          String   // Ex: "Habilidades", "Oportunidades"
  categoria       String   // IMIGRANTE, EMPRESA, etc.
  contextoIA      String?  // Orientações para IA
  textoModelo     String?  // Exemplo de descrição
  tagsModelo      String?  // Tags sugeridas (JSON array)
  perguntasModelo String?  // Texto orientativo
  ativo           Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relação 1:N com contribuições dos usuários
  contribuicoes Contribuicao[]
  
  @@map("tipos_contribuicao")
}
```

### **Nova Tabela 2: `contribuicoes`**
```prisma
model Contribuicao {
  id                  String   @id @default(cuid())
  userId              String   // FK para User
  tipoContribuicaoId  String   // FK para TipoContribuicao
  descricao           String   // Conteúdo preenchido pelo usuário
  tags                String?  // Tags selecionadas (JSON array)
  ativo               Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  // Relações
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  tipoContribuicao TipoContribuicao @relation(fields: [tipoContribuicaoId], references: [id])
  
  @@map("contribuicoes")
}
```

### **Nova Tabela 3: `tags_sistema`**
```prisma
model TagSistema {
  id        String   @id @default(cuid())
  nome      String   @unique // Ex: "JavaScript", "Atendimento", "Marketing"
  cor       String?  // Cor hex para UI
  categoria String?  // Categoria opcional para organização
  usos      Int      @default(0) // Contador de uso
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("tags_sistema")
}
```

### **Alteração: Tabela `users`**
```prisma
model User {
  // ... campos existentes
  
  // Nova relação 1:N
  contribuicoes Contribuicao[]
}
```

---

## 🎯 **MAPEAMENTO DE TIPOS DE CONTRIBUIÇÃO POR PERFIL**

### **Dados Iniciais (Seed)**
```typescript
const tiposContribuicaoIniciais = [
  {
    titulo: "Habilidades",
    categoria: "IMIGRANTE",
    contextoIA: "Habilidades profissionais e pessoais de jovens imigrantes buscando integração no mercado português",
    textoModelo: "Tenho experiência em desenvolvimento web com React e Node.js, trabalhei 3 anos em startup de tecnologia...",
    tagsModelo: ["JavaScript", "React", "Node.js", "Tecnologia", "Startup"],
    perguntasModelo: "Descreva suas principais habilidades profissionais, experiências anteriores e competências que podem contribuir para o mercado português."
  },
  {
    titulo: "Oportunidades",
    categoria: "EMPRESA",
    contextoIA: "Oportunidades de emprego, estágios e parcerias oferecidas por empresas para jovens imigrantes",
    textoModelo: "Procuramos desenvolvedor junior para nossa equipe de tecnologia. Oferecemos formação, ambiente multicultural...",
    tagsModelo: ["Emprego", "Tecnologia", "Junior", "Formação", "Multicultural"],
    perguntasModelo: "Descreva a oportunidade oferecida, requisitos, benefícios e como os candidatos podem se candidatar."
  },
  // ... outros tipos
];
```

---

## 🔐 **ESTRUTURA DE PERMISSÕES**

### **Permissões por Categoria de Usuário**
```yaml
ADMIN:
  - Criar/Editar/Remover tipos de contribuição
  - Visualizar todas as contribuições
  - Gerenciar tags do sistema
  - Relatórios e estatísticas

USUÁRIO COMUM (qualquer perfil):
  - Visualizar tipos disponíveis para seu perfil
  - Criar/Editar/Remover suas próprias contribuições
  - Usar tags existentes
  - Sugerir novas tags (aprovação admin)

VISUALIZAÇÃO PÚBLICA:
  - Listar contribuições ativas (sem dados pessoais)
  - Filtrar por tags
  - Buscar por categoria
```

---

## 🌐 **MAPEAMENTO DE ENDPOINTS NECESSÁRIOS**

### **APIs Admin (6 novos endpoints)**
```yaml
# Gestão de Tipos de Contribuição
GET    /api/admin/tipos-contribuicao          # Listar todos os tipos
POST   /api/admin/tipos-contribuicao          # Criar novo tipo
PUT    /api/admin/tipos-contribuicao/:id      # Editar tipo
DELETE /api/admin/tipos-contribuicao/:id      # Remover tipo

# Gestão de Tags
GET    /api/admin/tags                        # Listar todas as tags
POST   /api/admin/tags                        # Criar nova tag
PUT    /api/admin/tags/:id                    # Editar tag
DELETE /api/admin/tags/:id                    # Remover tag

# Relatórios
GET    /api/admin/contribuicoes/stats          # Estatísticas
GET    /api/admin/contribuicoes/todas          # Todas as contribuições
```

### **APIs Usuário (8 novos endpoints)**
```yaml
# Contribuições do Usuário
GET    /api/contribuicoes/minhas              # Listar minhas contribuições
POST   /api/contribuicoes                     # Criar nova contribuição
PUT    /api/contribuicoes/:id                 # Editar minha contribuição
DELETE /api/contribuicoes/:id                 # Remover minha contribuição

# Tipos Disponíveis
GET    /api/contribuicoes/tipos-disponiveis   # Tipos para meu perfil

# Tags
GET    /api/contribuicoes/tags                # Listar tags disponíveis
POST   /api/contribuicoes/tags/sugerir        # Sugerir nova tag

# Públicas
GET    /api/contribuicoes/publicas            # Listar contribuições públicas
```

---

## 🎨 **MAPEAMENTO DE PÁGINAS E COMPONENTES FRONTEND**

### **Páginas Admin (2 novas)**
```typescript
// src/app/pages/admin/
├── TiposContribuicaoManagement.tsx    # Gestão de tipos
└── TagsManagement.tsx                 # Gestão de tags
```

### **Páginas Usuário (1 nova por perfil)**
```typescript
// src/app/pages/
├── MinhasContribuicoes.tsx            # Lista minhas contribuições
└── ContribuicaoForm.tsx               # Formulário criar/editar
```

### **Componentes Reutilizáveis (5 novos)**
```typescript
// src/app/components/contribuicoes/
├── ContribuicaoCard.tsx               # Card individual
├── ContribuicaoModal.tsx              # Modal criar/editar
├── TagSelector.tsx                    # Seletor de tags
├── TipoContribuicaoForm.tsx           # Form admin tipos
└── ContribuicoesList.tsx              # Lista com filtros
```

### **Alterações em Componentes Existentes**
```yaml
MainSidebar.tsx:
  - Adicionar menu "Minhas [Tipo]" para cada perfil
  - Adicionar menus admin para gestão

Dashboard páginas:
  - Seção resumo das contribuições
  - Links rápidos para adicionar

AdminDashboard.tsx:
  - Totalizadores de contribuições
  - Estatísticas por tipo
```

---

## ⚖️ **ANÁLISE DE RISCOS E IMPACTOS**

### **Riscos Técnicos**
```yaml
ALTO:
  - Migração do banco sem perda de dados
  - Performance com múltiplas relações
  - Sincronização de tags entre usuários

MÉDIO:
  - Validações complexas no frontend
  - Estados de loading em listas grandes
  - Cache de tags para performance

BAIXO:
  - Compatibilidade com código existente
  - Estilização consistente
```

### **Impactos em Funcionalidades Existentes**
```yaml
ZERO IMPACTO:
  - Sistema de autenticação
  - Perfis existentes
  - Interface administrativa atual

IMPACTO MÍNIMO:
  - Dashboards (adicionar seções)
  - Navegação (novos menus)
  - APIs existentes (sem alteração)

IMPACTO CONTROLADO:
  - Schema do banco (nova migration)
  - Tipos TypeScript (extensões)
  - Rotas (novas rotas apenas)
```

---

## 📅 **PLANO DE EXECUÇÃO EM ETAPAS**

### **ETAPA 1: ESTRUTURA BASE (4 horas)**
#### **1.1 Backend - Banco e Modelos (2h)**
- [ ] Criar migration para 3 novas tabelas
- [ ] Atualizar schema Prisma
- [ ] Executar migration e testar
- [ ] Criar seed para tipos iniciais
- [ ] Testar integridade referencial

#### **1.2 Backend - Tipos e Validações (1h)**
- [ ] Atualizar `shared-types/api.types.ts`
- [ ] Criar interfaces para contribuições
- [ ] Criar schemas Zod para validações
- [ ] Testar tipagem end-to-end

#### **1.3 Backend - Módulo Base (1h)**
- [ ] Criar `modules/contribuicoes/`
- [ ] Implementar service básico
- [ ] Implementar controller básico
- [ ] Integrar rotas no app.ts

**Checkpoint Etapa 1:** Banco funcionando + APIs básicas

---

### **ETAPA 2: FUNCIONALIDADES ADMIN (3 horas)**
#### **2.1 Backend Admin (1.5h)**
- [ ] Implementar endpoints admin completos
- [ ] Validações e permissões admin
- [ ] Testes com curl dos endpoints
- [ ] Seed com dados de exemplo

#### **2.2 Frontend Admin (1.5h)**
- [ ] Página `TiposContribuicaoManagement.tsx`
- [ ] Página `TagsManagement.tsx`
- [ ] Componente `TipoContribuicaoForm.tsx`
- [ ] Integrar no menu admin

**Checkpoint Etapa 2:** Admin pode cadastrar tipos e tags

---

### **ETAPA 3: FUNCIONALIDADES USUÁRIO (4 horas)**
#### **3.1 Backend Usuário (1.5h)**
- [ ] Endpoints para contribuições do usuário
- [ ] Validações por categoria de perfil
- [ ] Filtros e buscas
- [ ] Testes de permissões

#### **3.2 Frontend Base (1.5h)**
- [ ] Página `MinhasContribuicoes.tsx`
- [ ] Componente `ContribuicaoCard.tsx`
- [ ] Componente `ContribuicoesList.tsx`
- [ ] Estados de loading/erro

#### **3.3 Frontend Formulário (1h)**
- [ ] Componente `ContribuicaoModal.tsx`
- [ ] Componente `TagSelector.tsx`
- [ ] Validações frontend
- [ ] UX de criação/edição

**Checkpoint Etapa 3:** Usuários podem criar contribuições

---

### **ETAPA 4: INTEGRAÇÃO E UX (2 horas)**
#### **4.1 Integração com Dashboards (1h)**
- [ ] Seção contribuições em cada dashboard
- [ ] Links rápidos e estatísticas
- [ ] Totalizadores no admin
- [ ] Navegação atualizada

#### **4.2 Polimento e Testes (1h)**
- [ ] Responsividade mobile
- [ ] Estados vazios e carregamento
- [ ] Mensagens de erro/sucesso
- [ ] Testes de fluxo completo

**Checkpoint Etapa 4:** Sistema integrado e polido

---

### **ETAPA 5: OTIMIZAÇÕES E DOCUMENTAÇÃO (1 hora)**
#### **5.1 Performance (30min)**
- [ ] Cache de tags no frontend
- [ ] Otimização de queries
- [ ] Lazy loading de listas
- [ ] Debounce em buscas

#### **5.2 Documentação (30min)**
- [ ] Atualizar README com novas funcionalidades
- [ ] Documentar novos endpoints
- [ ] Atualizar status de implementação
- [ ] Testes finais completos

**Checkpoint Final:** Sistema completo e documentado

---

## 🧪 **ESTRATÉGIA DE TESTES POR ETAPA**

### **Testes Automáticos (curl)**
```bash
# Etapa 1
curl -X POST /api/admin/tipos-contribuicao -d '{...}'
curl /api/contribuicoes/tipos-disponiveis

# Etapa 2
curl /api/admin/tipos-contribuicao
curl /api/admin/tags

# Etapa 3
curl -X POST /api/contribuicoes -d '{...}'
curl /api/contribuicoes/minhas
```

### **Testes Manuais (interface)**
```yaml
Etapa 2:
  - Login admin → Gestão tipos → Criar tipo
  - Verificar tipos por categoria
  - Gestão de tags → Criar/editar

Etapa 3:
  - Login usuário → Ver tipos disponíveis
  - Criar contribuição → Preencher form
  - Editar/remover contribuição

Etapa 4:
  - Dashboard → Ver seção contribuições
  - Navegação → Menus funcionais
  - Mobile → Responsividade OK
```

---

## 📊 **MÉTRICAS DE SUCESSO**

### **Métricas Técnicas**
- ✅ **3 novas tabelas** criadas sem conflitos
- ✅ **16 novos endpoints** funcionais
- ✅ **Zero quebras** em funcionalidades existentes
- ✅ **< 200ms** resposta média das APIs
- ✅ **100% responsivo** em mobile

### **Métricas Funcionais**
- ✅ **Admin pode cadastrar** 5+ tipos iniciais
- ✅ **Usuários podem criar** contribuições
- ✅ **Tags compartilhadas** funcionando
- ✅ **Filtros e buscas** operacionais
- ✅ **UX consistente** com plataforma

---

## 🎯 **RESULTADO ESPERADO**

### **Funcionalidades Entregues**
1. **Sistema Admin:** Gestão completa de tipos e tags
2. **Sistema Usuário:** CRUD de contribuições próprias
3. **Tags Inteligentes:** Sistema compartilhado e incremental
4. **UX Integrada:** Navegação e dashboards atualizados
5. **Performance:** APIs otimizadas e responsivas

### **Estrutura Final**
```
User (21 usuários existentes)
├── Perfis (19 perfis completos)
└── Contribuições (NOVO)
    ├── 5 tipos configurados (admin)
    ├── N contribuições por usuário
    └── Tags compartilhadas
```

---

**📋 PLANO COMPLETO ESTRUTURADO EM 5 ETAPAS**  
*Total: 14 horas de implementação*  
*Resultado: Sistema de Contribuições 100% funcional e integrado*  
*Risco: Baixo (extensão modular da arquitetura existente)*

**🚀 PRONTO PARA EXECUÇÃO CONTROLADA E MONITORADA**