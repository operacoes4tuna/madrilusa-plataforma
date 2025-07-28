# 🎯 SISTEMA DE CATEGORIAS DE USUÁRIO - MADRILUSA

**Data:** Janeiro 2025  
**Status:** 📋 **PLANEJAMENTO APROVADO**  
**Fase Atual:** Implementação Fase 1 (Imigrante)  
**Objectivo:** Expandir sistema de usuários para 5 categorias específicas

---

## 📋 **VISÃO GERAL DO SISTEMA**

### **Contexto**
O projeto Madrilusa atende 5 tipos distintos de usuários, cada um com necessidades e informações específicas. O sistema atual possui apenas dados básicos de usuário (nome, email, telemóvel, senha, foto), sendo necessário expandir para suportar perfis específicos por categoria.

### **5 Categorias de Usuário**
1. **🌍 Imigrante** - Jovens em busca de integração
2. **🏢 Empresa** - Organizações oferecendo oportunidades  
3. **🏛️ Município** - Administrações locais parceiras
4. **🎓 Academia** - Instituições de ensino e formação
5. **👨‍👩‍👧‍👦 Família de Acolhimento** - Famílias oferecendo suporte

### **Estratégia de Implementação**
- **Abordagem faseada:** 1 categoria por vez
- **Não invasiva:** Preservar sistema básico existente
- **Escalável:** Estrutura preparada para todas as categorias
- **UX simplificada:** Registro em 2 etapas

---

## 🗄️ **ARQUITETURA DE BANCO DE DADOS**

### **Princípios de Design**
- **Separação clara:** Dados básicos vs. específicos da categoria
- **Relações 1:1:** Cada usuário tem apenas um perfil específico
- **Cascata:** Deletar usuário remove perfil específico
- **Extensibilidade:** Fácil adição de novas categorias

### **Schema Completo (Prisma)**
```prisma
// ✅ Manter User existente
model User {
  id           String   @id @default(cuid())
  nomeCompleto String
  email        String   @unique
  senha        String
  telemovel    String?
  foto         String?
  categoria    UserCategory? // ✨ NOVO CAMPO
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // 🔗 Relações com perfis específicos
  perfilImigrante PerfilImigrante?
  perfilEmpresa PerfilEmpresa?
  perfilMunicipio PerfilMunicipio?
  perfilAcademia PerfilAcademia?
  perfilFamilia PerfilFamilia?
  
  @@map("users")
}

// ✨ NOVO: Enum para categorias
enum UserCategory {
  IMIGRANTE
  EMPRESA
  MUNICIPIO
  ACADEMIA
  FAMILIA_ACOLHIMENTO
  
  @@map("user_categories")
}

// 🌍 FASE 1: Perfil específico de Imigrante
model PerfilImigrante {
  id                    String   @id @default(cuid())
  userId                String   @unique
  nacionalidade         String
  dataNascimento        DateTime
  objetivoEmprego       String?  // Descrição do objetivo
  objetivoFormacao      String?  // Descrição do objetivo
  objetivoRegularizacao String?  // Descrição do objetivo
  objetivoOutros        String?  // Descrição do objetivo
  mensagem              String?  // Campo opcional adicional
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  // 🔗 Relação com User
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("perfis_imigrante")
}

// 🔮 FUTURAS FASES: Outros perfis específicos
model PerfilEmpresa {
  id                String   @id @default(cuid())
  userId            String   @unique
  nomeEmpresa       String
  pessoaContacto    String?
  morada            String?
  observacoes       String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("perfis_empresa")
}

model PerfilMunicipio {
  id                String   @id @default(cuid())
  userId            String   @unique
  nomeMunicipio     String?
  distrito          String?
  pessoaContacto    String?
  funcaoCargo       String?
  projetosExistentes String?
  disponibilidade   String?
  observacoes       String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("perfis_municipio")
}

model PerfilAcademia {
  id              String   @id @default(cuid())
  userId          String   @unique
  nomeInstituicao String
  tipoAcademia    String?
  regiaoAtuacao   String?
  pessoaContacto  String?
  ofertaFormativa String?
  website         String?
  observacoes     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("perfis_academia")
}

model PerfilFamilia {
  id                 String   @id @default(cuid())
  userId             String   @unique
  moradaCompleta     String
  quantasPessoas     String?
  tipoAcolhimento    String[] // Array para seleção múltipla
  duracaoAcolhimento String[] // Array para seleção múltipla
  observacoes        String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("perfis_familia")
}
```

---

## 🔧 **IMPLEMENTAÇÃO BACKEND**

### **Estrutura Modular Expandida**
```
backend/src/modules/
├── 📁 auth/                 # ✅ Existente - base
├── 📁 users/                # ✅ Existente - base
├── 📁 imigrantes/          # 🎯 FASE 1 - em implementação
│   ├── imigrante.controller.ts
│   ├── imigrante.service.ts
│   ├── imigrante.routes.ts
│   └── imigrante.types.ts
├── 📁 empresas/            # 🔮 Fase 2
├── 📁 municipios/          # 🔮 Fase 3
├── 📁 academias/           # 🔮 Fase 4
└── 📁 familias/            # 🔮 Fase 5
```

### **Endpoints API - Fase 1 (Imigrante)**
```typescript
// ✨ Perfil de Imigrante
GET    /api/imigrantes/perfil/:userId     // Buscar perfil específico
POST   /api/imigrantes/perfil            // Criar perfil específico
PUT    /api/imigrantes/perfil/:userId     // Atualizar perfil específico
DELETE /api/imigrantes/perfil/:userId     // Deletar perfil específico

// ✨ Registro em 2 etapas (modificação do auth existente)
POST   /api/auth/register-basic           // Etapa 1: dados básicos + categoria
POST   /api/auth/register-complete        // Etapa 2: dados específicos da categoria

// ✅ Endpoints existentes (mantidos)
GET    /health                            // Health check
POST   /api/auth/register                 // Registro básico original
POST   /api/auth/login                    // Login
GET    /api/users/:id                     // CRUD de usuários
PUT    /api/users/:id
DELETE /api/users/:id
```

### **Fluxo de Registro em 2 Etapas**
```typescript
// 📋 ETAPA 1: Dados básicos + categoria
POST /api/auth/register-basic
{
  nomeCompleto: string;
  email: string;
  telemovel?: string;
  senha: string;
  categoria: 'IMIGRANTE' | 'EMPRESA' | 'MUNICIPIO' | 'ACADEMIA' | 'FAMILIA_ACOLHIMENTO';
}
// 📤 Resposta: { userId: string, tempToken: string, categoria: string }

// 📋 ETAPA 2: Dados específicos da categoria
POST /api/imigrantes/perfil
{
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
}
// 📤 Resposta: { success: boolean, data: PerfilImigrante }
```

---

## 💻 **IMPLEMENTAÇÃO FRONTEND**

### **Estrutura de Componentes**
```
src/
├── 📁 institutional/               # 🎨 MARKETING
│   ├── components/
│   │   ├── ✅ InstitutionalHeader.tsx    # Modificar botão "Inscreva-se"
│   │   ├── ✅ RegistrationCards.tsx      # Modificar onClick dos cards
│   │   └── ✨ RegistrationModal.tsx      # NOVO: Modal em 2 etapas
│   └── ...
├── 📁 app/                        # 💻 DESENVOLVIMENTO
│   ├── pages/
│   │   ├── ✅ Dashboard.tsx              # Existente
│   │   ├── ✅ Profile.tsx                # Existente - dados básicos
│   │   └── ✨ PerfilImigrante.tsx        # NOVO: dados específicos
│   ├── components/layout/
│   │   └── ✅ MainSidebar.tsx            # Modificar: menu condicional
│   └── ...
└── 📁 modules/                    # 🔐 MÓDULOS
    ├── auth/
    │   ├── components/
    │   │   └── ✨ CategoryRegistrationModal.tsx  # NOVO
    │   └── ...
    └── ...
```

### **Fluxo UX Completo**
```mermaid
graph TD
    A[Usuário acessa /] --> B[Clica "Inscreva-se" no header]
    B --> C[Scroll para seção "Faça parte do projeto"]
    C --> D[Clica card "Sou imigrante"]
    D --> E[Abre modal de registro]
    
    E --> F[ETAPA 1: Dados básicos]
    F --> G[Nome, Email, Telemóvel, Senha]
    G --> H[Submete etapa 1]
    
    H --> I[ETAPA 2: Dados específicos]
    I --> J[Nacionalidade, Data nascimento, Objetivos]
    J --> K[Submete etapa 2]
    
    K --> L[Conta criada com sucesso]
    L --> M[Redirecionamento para /app/dashboard]
    
    M --> N[Dashboard com menus:]
    N --> O["Perfil do Utilizador" - dados básicos]
    N --> P["Perfil de Imigrante" - dados específicos]
```

### **Modificações nos Componentes Existentes**

#### **1. InstitutionalHeader.tsx**
```typescript
// ALTERAR: Comportamento do botão "Inscreva-se"
const handleInscrevaSeClick = () => {
  const registrationSection = document.getElementById('registration-cards');
  registrationSection?.scrollIntoView({ behavior: 'smooth' });
};

// REMOVER: Abertura direta do AuthModal
// ADICIONAR: Scroll suave para seção de escolha
```

#### **2. RegistrationCards.tsx**
```typescript
// ALTERAR: Card "Sou imigrante"
const handleImigranteClick = () => {
  setSelectedCategory('IMIGRANTE');
  setShowCategoryRegistrationModal(true);
};

// Adicionar estado para modal de categoria específica
// Manter design existente dos cards
```

#### **3. MainSidebar.tsx**
```typescript
// ADICIONAR: Menu condicional baseado na categoria
const sidebarNavItems = [
  // ... itens existentes
  ...(user?.categoria === 'IMIGRANTE' ? [{
    title: 'Perfil de Imigrante',
    to: '/app/perfil-imigrante',
    iconClass: 'person_outline',
    htmlAfter: ''
  }] : []),
  ...(user?.categoria === 'EMPRESA' ? [{
    title: 'Perfil de Empresa',
    to: '/app/perfil-empresa',
    iconClass: 'business',
    htmlAfter: ''
  }] : []),
  // ... outras categorias futuras
];
```

### **Novos Componentes**

#### **4. CategoryRegistrationModal.tsx**
```typescript
interface Props {
  category: UserCategory;
  isOpen: boolean;
  onClose: () => void;
}

// Modal em 2 etapas:
// Step 1: BasicInfoForm (nome, email, telemóvel, senha)
// Step 2: CategorySpecificForm (baseado na categoria)
```

#### **5. PerfilImigrante.tsx**
```typescript
// Página completa para gestão do perfil específico
// Formulário com campos do guia de inscrições:
// - Nacionalidade (dropdown com países)
// - Data de Nascimento (date picker)
// - 4 Objetivos (textareas opcionais)
// - Mensagem (textarea opcional)
```

---

## 📊 **TIPOS TYPESCRIPT ATUALIZADOS**

### **shared-types/api.types.ts**
```typescript
// ✨ NOVOS TIPOS
export type UserCategory = 
  | 'IMIGRANTE' 
  | 'EMPRESA' 
  | 'MUNICIPIO' 
  | 'ACADEMIA' 
  | 'FAMILIA_ACOLHIMENTO';

// ✨ User expandido
export interface User {
  id: string;
  nomeCompleto: string;
  email: string;
  telemovel?: string;
  foto?: string;
  categoria?: UserCategory; // NOVO CAMPO
  createdAt: Date;
  updatedAt: Date;
}

// ✨ Perfil específico de Imigrante
export interface PerfilImigrante {
  id: string;
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✨ Requests para perfil de Imigrante
export interface CreatePerfilImigranteRequest {
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
}

export interface UpdatePerfilImigranteRequest {
  nacionalidade?: string;
  dataNascimento?: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
}

// ✨ Registro em 2 etapas
export interface RegisterBasicRequest {
  nomeCompleto: string;
  email: string;
  telemovel?: string;
  senha: string;
  categoria: UserCategory;
}

export interface RegisterBasicResponse {
  userId: string;
  tempToken: string;
  categoria: UserCategory;
}

// ✨ Registro completo de Imigrante
export interface RegisterImigranteCompleteRequest {
  userId: string;
  nacionalidade: string;
  dataNascimento: Date;
  objetivoEmprego?: string;
  objetivoFormacao?: string;
  objetivoRegularizacao?: string;
  objetivoOutros?: string;
  mensagem?: string;
}

// ✅ Tipos existentes mantidos
export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## 🚀 **PLANO DE IMPLEMENTAÇÃO**

### **📋 FASE 1A: Backend (Imigrante)**
**Duração estimada:** 2-3 dias

1. **✅ Atualizar Schema Prisma**
   ```bash
   # Adicionar UserCategory enum e PerfilImigrante model
   # Adicionar campo categoria ao User
   npx prisma db push
   ```

2. **✅ Criar Módulo Imigrantes**
   ```
   backend/src/modules/imigrantes/
   ├── imigrante.controller.ts
   ├── imigrante.service.ts  
   ├── imigrante.routes.ts
   └── imigrante.types.ts
   ```

3. **✅ Implementar CRUD de Perfil**
   - Service: criar, buscar, atualizar, deletar
   - Controller: validações e responses
   - Routes: endpoints RESTful

4. **✅ Modificar Auth Service**
   - Adicionar registro em 2 etapas
   - Suportar campo categoria no User
   - Manter compatibilidade com sistema atual

5. **✅ Atualizar Types Compartilhados**
   - shared-types/api.types.ts
   - Interfaces para perfil e requests

### **📋 FASE 1B: Frontend (Imigrante)**
**Duração estimada:** 3-4 dias

1. **✅ Atualizar Types Frontend**
   - Importar novos tipos do shared-types
   - Atualizar interfaces existentes

2. **✅ Modificar Fluxo de Registro**
   - Alterar botão "Inscreva-se" do header
   - Modificar RegistrationCards onClick
   - Criar CategoryRegistrationModal

3. **✅ Criar Modal de 2 Etapas**
   - Step 1: BasicInfoForm
   - Step 2: ImigranteSpecificForm
   - Validações com React Hook Form + Zod
   - Integração com API em 2 etapas

4. **✅ Criar Página PerfilImigrante**
   - Formulário completo de edição
   - Integração com API de perfil
   - Aplicar identidade visual oficial

5. **✅ Atualizar Navegação**
   - MainSidebar com menu condicional
   - Routing para /app/perfil-imigrante
   - ProtectedRoute verificando categoria

### **📋 FASE 1C: Testes e Validação**
**Duração estimada:** 1-2 dias

1. **✅ Testes de Fluxo Completo**
   - Registro em 2 etapas
   - CRUD de perfil de imigrante
   - Navegação condicional no dashboard

2. **✅ Validação UX**
   - Fluxo intuitivo de registro
   - Separação clara entre dados básicos e específicos
   - Responsividade em dispositivos móveis

3. **✅ Documentação**
   - Atualizar documentação técnica
   - Screenshots do fluxo implementado
   - Guia para próximas categorias

---

## 🔮 **PRÓXIMAS FASES (ROADMAP)**

### **Fase 2: Empresa** (após Imigrante)
- Perfil com: nome empresa, pessoa contacto, morada, observações
- Formulário específico conforme guia de inscrições
- Menu "Perfil de Empresa" no dashboard

### **Fase 3: Município** 
- Perfil com: nome município, distrito, pessoa contacto, projetos existentes
- Formulário com campos específicos municipais
- Menu "Perfil de Município" no dashboard

### **Fase 4: Academia**
- Perfil com: nome instituição, tipo academia, oferta formativa
- Formulário educacional específico
- Menu "Perfil de Academia" no dashboard

### **Fase 5: Família de Acolhimento**
- Perfil com: morada, capacidade, tipo acolhimento, duração
- Formulário familiar específico
- Menu "Perfil de Família" no dashboard

---

## 💡 **VANTAGENS DESTA ARQUITETURA**

### **🛡️ Robustez**
- **Não invasiva:** Sistema atual não é afetado
- **Retrocompatibilidade:** Usuários existentes continuam funcionando
- **Isolamento:** Falha em uma categoria não afeta outras

### **📈 Escalabilidade**
- **Padrão consistente:** Mesma estrutura para todas as categorias
- **Fácil expansão:** Adicionar nova categoria = criar novo módulo
- **Performance:** Queries otimizadas com relações específicas

### **🎨 UX/UI**
- **Fluxo intuitivo:** 2 etapas simplificam o processo
- **Organização clara:** Separação entre dados básicos e específicos
- **Dashboard limpo:** Menus condicionais evitam confusão

### **🔧 Manutenibilidade**
- **Código limpo:** Responsabilidades bem separadas
- **Modular:** Cada categoria tem seu próprio módulo
- **Tipagem forte:** TypeScript reduz bugs e melhora DX

---

## 📋 **CHECKLIST DE APROVAÇÃO**

### **✅ Arquitetura**
- [ ] Schema de banco com User + PerfilImigrante aprovado
- [ ] Relação 1:1 com cascade delete aprovada
- [ ] Enum UserCategory com 5 opções aprovado

### **✅ Backend**
- [ ] Estrutura modular em modules/imigrantes/ aprovada
- [ ] Endpoints RESTful para perfil de imigrante aprovados
- [ ] Fluxo de registro em 2 etapas aprovado

### **✅ Frontend**
- [ ] Modificação do botão "Inscreva-se" aprovada
- [ ] Modal de categoria específica em 2 etapas aprovado
- [ ] Página PerfilImigrante no dashboard aprovada
- [ ] Menu condicional na sidebar aprovado

### **✅ UX/UI**
- [ ] Fluxo: header → escolha categoria → modal 2 etapas aprovado
- [ ] Separação "Perfil do Utilizador" vs "Perfil de Imigrante" aprovada
- [ ] Ordem de implementação (backend → frontend → testes) aprovada

---

## 📞 **PRÓXIMOS PASSOS**

1. **✅ Aprovação do plano** pelo stakeholder
2. **🔧 Implementação Fase 1A** (Backend)
3. **💻 Implementação Fase 1B** (Frontend)
4. **🧪 Testes e validação**
5. **📚 Documentação atualizada**
6. **🔄 Preparação para Fase 2** (Empresa)

---

**Este plano garante implementação eficiente, escalável e não invasiva do sistema de categorias de usuário, começando pela categoria Imigrante e preparando a base para as demais categorias do projeto Madrilusa.**

---

*Plano técnico elaborado em Janeiro 2025*  
*Base para implementação faseada do sistema de categorias*  
*Estrutura modular preparada para escalabilidade* 