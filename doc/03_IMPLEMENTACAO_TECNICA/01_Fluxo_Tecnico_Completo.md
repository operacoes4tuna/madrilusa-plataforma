# 🔧 FLUXO TÉCNICO COMPLETO - MADRILUSA

**Data:** Janeiro 2025  
**Status:** ✅ **IMPLEMENTADO E DOCUMENTADO**  
**Objectivo:** Documentar todo o fluxo técnico implementado para orientar desenvolvimentos futuros

---

## 📋 **VISÃO GERAL TÉCNICA**

### **🎯 O que foi implementado:**
- ✅ **Frontend completo** com React + TypeScript
- ✅ **Backend modular** com Node.js + Express + Prisma
- ✅ **Autenticação básica** (registro/login)
- ✅ **Separação de responsabilidades** (institucional vs aplicação)
- ✅ **Identidade visual oficial** aplicada
- ✅ **Base de dados** SQLite (desenvolvimento)

---

## 🏗️ **ARQUITECTURA IMPLEMENTADA**

### **📱 Frontend - Estrutura Separada**
```
src/
├── institutional/          # 🎨 EQUIPA MARKETING
│   ├── components/         # Componentes da landing page
│   ├── pages/             # LandingPage.tsx
│   └── styles/            # institutional-theme.css
├── app/                   # 💻 EQUIPA DESENVOLVIMENTO
│   ├── layouts/           # AppLayout.tsx
│   ├── pages/             # Dashboard.tsx, Profile.tsx
│   ├── components/        # Componentes internos
│   └── styles/            # app-theme.css (identidade oficial)
├── modules/               # 🔐 MÓDULOS FUNCIONAIS
│   └── auth/              # Autenticação (hooks, services, components)
└── shared/                # 🤝 PARTILHADO
    ├── components/        # Componentes reutilizáveis
    ├── hooks/             # Hooks personalizados
    └── types/             # Tipos TypeScript
```

### **⚙️ Backend - Estrutura Modular**
```
backend/
├── src/
│   ├── modules/           # 📦 MÓDULOS DE NEGÓCIO
│   │   ├── auth/          # Autenticação (registro/login)
│   │   └── users/         # Gestão de utilizadores
│   ├── shared/            # 🤝 PARTILHADO
│   │   ├── database/      # Prisma client singleton
│   │   ├── middleware/    # CORS, errorHandler
│   │   └── types/         # Interfaces TypeScript
│   ├── app.ts             # Configuração Express
│   └── server.ts          # Entry point
├── prisma/
│   └── schema.prisma      # Schema da base de dados
└── .env                   # Variáveis de ambiente
```

---

## 🔄 **FLUXO DE AUTENTICAÇÃO**

### **📋 Processo Completo:**

#### **1. Página Institucional (`/`)**
```typescript
// Utilizador acede à landing page
InstitutionalHeader.tsx → botão "Inscreva-se" / "Login"
↓
AuthModal.tsx → componente unificado (toggle entre registro/login)
├── RegisterForm.tsx → formulário de registo
└── LoginForm.tsx → formulário de login
```

#### **2. Submissão do Formulário**
```typescript
// Frontend
RegisterForm / LoginForm → useAuth hook → authApi.ts
↓
// API Request
POST /api/auth/register ou /api/auth/login
↓
// Backend
auth.routes.ts → auth.controller.ts → auth.service.ts
↓
// Base de Dados
Prisma → SQLite → users table
```

#### **3. Resposta e Redirecionamento**
```typescript
// Sucesso
Backend retorna: { success: true, data: user }
↓
// Frontend atualiza estado
useAuth → setUser → localStorage.setItem('user')
↓
// Redirecionamento automático
AuthModal fecha → navigate('/app/dashboard')
```

#### **4. Páginas Protegidas**
```typescript
// Todas as rotas /app/*
ProtectedRoute.tsx → verifica isAuthenticated
├── ✅ Autenticado → renderiza AppLayout + página
└── ❌ Não autenticado → redirect para '/'
```

---

## 🎨 **SISTEMA DE IDENTIDADE VISUAL**

### **📋 Implementação Técnica:**

#### **1. Variáveis CSS Centralizadas**
```css
/* src/app/styles/app-theme.css */
.app-layout {
  /* Cores oficiais Madrilusa */
  --app-primary: #F5A623;          /* Laranja Madrilusa */
  --app-secondary: #4A90A4;        /* Azul Turquesa */
  --app-foreground: #333333;       /* Cinzento Escuro */
  
  /* Tipografia conforme manual */
  --app-font-family: 'Open Sans', 'Helvetica Neue', sans-serif;
  --app-font-size-h1: 32px;
  --app-font-size-h2: 24px;
  --app-font-size-body: 16px;
  
  /* Sistema de espaçamento (múltiplos de 8px) */
  --app-spacing-xs: 8px;
  --app-spacing-sm: 16px;
  --app-spacing-md: 24px;
  --app-spacing-lg: 32px;
}
```

#### **2. Classes Reutilizáveis**
```css
/* Tipografia */
.app-title-h1      /* H1: 32px, bold, Azul Turquesa */
.app-title-h2      /* H2: 24px, semibold, Azul Turquesa */
.app-text-body     /* Corpo: 16px, regular, Cinzento Escuro */
.app-text-secondary /* Secundário: 14px, Cinzento Médio */

/* Componentes */
.app-card          /* Cards com espaçamento padronizado */
.app-button-primary /* Botões com cores oficiais */
.app-sidebar-item   /* Navegação com micro-interações */
```

#### **3. Aplicação nos Componentes**
```typescript
// Dashboard.tsx
<div className="app-layout">
  <div className="app-card app-card-large">
    <h1 className="app-title-h1">Bem-vindo(a)!</h1>
    <p className="app-text-body">Portal Madrilusa...</p>
  </div>
</div>

// Profile.tsx
<h1 className="app-title-h1">Editar Perfil</h1>
<form className="app-form-section">
  <Label className="app-label">Nome Completo</Label>
  <Button className="app-button-primary">Guardar</Button>
</form>
```

---

## 💾 **BASE DE DADOS**

### **📊 Schema Actual (SQLite)**
```prisma
// prisma/schema.prisma
model User {
  id           String   @id @default(cuid())
  nomeCompleto String
  email        String   @unique
  senha        String   // Sem hash (desenvolvimento)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@map("users")
}
```

### **🔗 Endpoints API Disponíveis**
```typescript
// Autenticação
POST /api/auth/register  // Registo de utilizador
POST /api/auth/login     // Login de utilizador

// Utilizadores
GET  /api/users/:id      // Obter utilizador por ID
PUT  /api/users/:id      // Actualizar utilizador
DELETE /api/users/:id    // Eliminar utilizador

// Sistema
GET  /health             // Health check da API
```

---

## 🌐 **ROUTING E NAVEGAÇÃO**

### **📍 Estrutura de Rotas**
```typescript
// App.tsx
<Routes>
  {/* Página Institucional */}
  <Route path="/" element={<LandingPage />} />
  
  {/* Aplicação Protegida */}
  <Route path="/app" element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="profile" element={<Profile />} />
  </Route>
  
  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### **🎯 URLs Implementadas**
- **`/`** - Landing page institucional
- **`/app`** - Redirect para `/app/dashboard`
- **`/app/dashboard`** - Dashboard do utilizador
- **`/app/profile`** - Edição de perfil

---

## 🚀 **SCRIPTS DE DESENVOLVIMENTO**

### **📋 Scripts Disponíveis**
```json
// package.json (raiz)
{
  "dev": "vite",                    // Frontend apenas
  "dev:full": "concurrently ...",   // Frontend + Backend
  "dev:backend": "cd backend && npm run dev",
  "build": "vite build",
  "setup": "cd backend && npm install && npx prisma generate"
}

// backend/package.json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "db:push": "npx prisma db push",
  "db:studio": "npx prisma studio"
}
```

### **🏃‍♂️ Comando de Desenvolvimento**
```bash
# Desenvolvimento completo (recomendado)
npm run dev:full

# Portas utilizadas:
# Frontend: 8080 (ou próxima disponível)
# Backend: 3001
# Prisma Studio: 5555
```

---

## 🔧 **FERRAMENTAS E MIDDLEWARE**

### **📦 Dependências Frontend**
```json
{
  "react": "^18.3.1",
  "typescript": "^5.6.2",
  "vite": "^5.4.1",
  "@tanstack/react-query": "^5.8.4",
  "react-hook-form": "^7.43.9",
  "zod": "^3.21.4",
  "react-router-dom": "^6.20.1"
}
```

### **📦 Dependências Backend**
```json
{
  "express": "^4.18.2",
  "prisma": "^5.7.0",
  "@prisma/client": "^5.7.0",
  "cors": "^2.8.5",
  "zod": "^3.21.4",
  "tsx": "^4.6.1"
}
```

### **⚙️ Middleware Configurado**
```typescript
// backend/src/app.ts
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);    // CORS configurado
app.use(errorHandler);      // Tratamento centralizado de erros
```

---

## 🌍 **LINGUAGEM E LOCALIZAÇÃO**

### **📝 Português de Portugal Implementado**
```typescript
// Adaptações realizadas em toda aplicação:
"gerir" (não "gerenciar")
"guardar" (não "salvar")
"eliminar" (não "deletar")
"utilizador" (não "usuário")
"actualização" (não "atualização")
"acção" (não "ação")
```

### **🎯 Contextos Aplicados**
- ✅ Interface da aplicação
- ✅ Mensagens de erro/sucesso
- ✅ Labels de formulários
- ✅ Botões e navegação
- ✅ Documentação técnica

---

## 📊 **ESTADO DA APLICAÇÃO**

### **🔄 Gestão de Estado**
```typescript
// React Query para dados remotos
const { user, isLoading } = useAuth();

// localStorage para persistência
localStorage.setItem('user', JSON.stringify(user));

// Estado local para formulários
const [formData, setFormData] = useState({
  nomeCompleto: '',
  email: '',
  senha: ''
});
```

### **⚡ Performance**
- ✅ **Lazy loading** das rotas
- ✅ **React Query** para cache automático
- ✅ **Vite** para desenvolvimento rápido
- ✅ **TypeScript** para detecção de erros

---

## 🎯 **PRÓXIMOS DESENVOLVIMENTOS**

### **📋 Base Técnica Preparada Para:**
- **Módulos de entidades** (Empresas, Academias, etc.)
- **Sistema de roles** e permissões
- **Upload de ficheiros** e documentos
- **Notificações** em tempo real
- **Dashboard avançado** com métricas
- **API expandida** com novos endpoints

### **🏗️ Estrutura Modular Pronta**
- **Backend:** `src/modules/` para novos módulos
- **Frontend:** `src/app/pages/` para novas páginas
- **Base de dados:** Schema preparado para expansão
- **Autenticação:** Base para JWT e roles
- **Styles:** Sistema CSS reutilizável

---

## 📋 **GUIA DE DESENVOLVIMENTO**

### **🔧 Para Adicionar Nova Funcionalidade:**
1. **Backend:** Criar módulo em `backend/src/modules/`
2. **Tipos:** Definir interfaces em `shared-types/`
3. **Frontend:** Criar página em `src/app/pages/`
4. **Estilos:** Usar classes `.app-*` existentes
5. **Rotas:** Adicionar em `App.tsx`
6. **Documentação:** Actualizar `doc/`

### **⚠️ Regras Importantes:**
- ✅ **Sempre** usar português de Portugal
- ✅ **Sempre** aplicar identidade visual oficial
- ✅ **Sempre** seguir estrutura modular
- ✅ **Sempre** documentar em `doc/`
- ✅ **Sempre** testar autenticação em rotas protegidas

---

## 🏆 **RESULTADO FINAL**

**✅ Fluxo técnico completo implementado:**
- **Frontend** React com TypeScript
- **Backend** Node.js modular 
- **Base de dados** SQLite com Prisma
- **Autenticação** completa e funcional
- **Identidade visual** oficial aplicada
- **Documentação** técnica detalhada

**✅ Base sólida para expansão:**
- Arquitectura modular escalável
- Padrões de código estabelecidos
- Sistema de design implementado
- Equipas com responsabilidades separadas

---

**🔧 Todo o fluxo técnico está documentado e pronto para futuros desenvolvimentos!**

---

*Fluxo técnico documentado em Janeiro 2025*  
*Base sólida para desenvolvimento de novas funcionalidades*  
*Arquitectura modular e escalável implementada* 