# Roadmap - Estruturação Modular do Backend Madrilusa

**Data de Criação:** Janeiro 2025  
**Status:** Aprovado para Implementação  
**Objetivo:** Estruturar backend modular para cadastro de usuários e futuras entidades

---

## 🎯 **OBJETIVO GERAL**

Criar uma estrutura backend modular que permita:
- Cadastro básico de usuários (nome completo, email, senha)
- Preparação para módulos futuros (Empresa, Academia, Município, Família de Acolhimento)
- Arquitetura escalável e manutenível
- Desenvolvimento inicial simples, sem validações complexas

---

## 🏗️ **ARQUITETURA MODULAR DEFINIDA**

### **📁 Estrutura de Pastas**

```
madrilusasite/
├── 📁 frontend/ (atual src/ renomeado)
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── components/ (LoginForm, RegisterForm)
│   │   │   ├── hooks/ (useAuth, useRegister)
│   │   │   ├── services/ (authApi.ts)
│   │   │   └── types/ (auth.types.ts)
│   │   ├── users/
│   │   │   ├── components/ (UserProfile, UserList)
│   │   │   ├── hooks/ (useUser, useUsers)
│   │   │   ├── services/ (userApi.ts)
│   │   │   └── types/ (user.types.ts)
│   │   └── entities/ (futuro)
│   │       ├── empresas/
│   │       ├── academias/
│   │       ├── municipios/
│   │       └── familias/
│   ├── shared/ (componentes comuns)
│   ├── lib/ (utilitários globais)
│   └── types/ (tipos globais)
├── 📁 backend/ (novo)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.types.ts
│   │   │   ├── users/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   └── user.types.ts
│   │   │   └── entities/ (futuro)
│   │   ├── shared/
│   │   │   ├── database/ (prisma config)
│   │   │   ├── middleware/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── package.json
└── 📁 shared-types/ (tipos compartilhados)
    └── api.types.ts
```

### **🛠️ Stack Tecnológico**

```json
{
  "runtime": "Node.js + TypeScript",
  "framework": "Express.js",
  "database": "SQLite (desenvolvimento) → PostgreSQL (produção)",
  "orm": "Prisma ORM",
  "validacao": "Zod (futuramente)",
  "cors": "cors middleware",
  "ambiente": "dotenv"
}
```

---

## 🗄️ **SCHEMA DE BANCO INICIAL**

### **Modelo User (Prisma)**
```prisma
model User {
  id           String   @id @default(cuid())
  nomeCompleto String
  email        String   @unique
  senha        String   // Hash será implementado futuramente
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Futuras relações com entidades
  // empresas Empresa[]
  // academias Academia[]
  // municipios Municipio[]
  // familias FamiliaAcolhimento[]
  
  @@map("users")
}
```

---

## 📋 **FASES DE IMPLEMENTAÇÃO**

### **Fase 1: Setup e Infraestrutura (1-2 dias)**
- [ ] Criar estrutura de pastas backend
- [ ] Configurar package.json com dependências
- [ ] Setup Prisma com SQLite
- [ ] Configurar TypeScript e scripts de desenvolvimento
- [ ] Testar conexão com banco

### **Fase 2: Módulo Users Base (1-2 dias)**
- [ ] Implementar User model no Prisma
- [ ] Criar user.service.ts (CRUD básico)
- [ ] Implementar user.controller.ts
- [ ] Configurar user.routes.ts
- [ ] Testar endpoints básicos

### **Fase 3: Módulo Auth Base (1-2 dias)**
- [ ] Implementar auth.service.ts (register/login simples)
- [ ] Criar auth.controller.ts
- [ ] Configurar auth.routes.ts
- [ ] Integrar com User service
- [ ] Testar fluxo de registro/login

### **Fase 4: Integração Frontend (2-3 dias)**
- [ ] Configurar proxy Vite para backend
- [ ] Reorganizar frontend em estrutura modular
- [ ] Implementar authApi service
- [ ] Criar hooks useAuth
- [ ] Desenvolver formulários de registro/login
- [ ] Testar integração completa

### **Fase 5: Refinamentos (1 dia)**
- [ ] Middleware de error handling
- [ ] Configuração CORS adequada
- [ ] Scripts de desenvolvimento otimizados
- [ ] Documentação básica da API

---

## 🔧 **CONFIGURAÇÕES TÉCNICAS**

### **Dependências Backend**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsx": "^3.12.0",
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13"
  }
}
```

### **Scripts de Desenvolvimento**
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

### **Variáveis de Ambiente**
```bash
# backend/.env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
```

---

## 🌟 **FUNCIONALIDADES INICIAIS**

### **Endpoints Auth**
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login de usuário (sem JWT inicialmente)

### **Endpoints Users**
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### **Dados Mínimos para Cadastro**
- Nome Completo (string, obrigatório)
- Email (string, único, obrigatório)
- Senha (string, obrigatório, sem hash inicialmente)

---

## 🔮 **EVOLUTAÇÃO FUTURA PLANEJADA**

### **Segurança (Fase 6)**
- Hash de senhas (bcrypt)
- Validação de dados (Zod)
- JWT para autenticação
- Rate limiting

### **Módulos de Entidades (Fases 7-10)**
- Módulo Empresas
- Módulo Academias  
- Módulo Municípios
- Módulo Famílias de Acolhimento

### **Funcionalidades Avançadas (Fases 11+)**
- Sistema de perfis diferenciados
- Matching entre usuários e entidades
- Dashboard personalizado
- Sistema de notificações

---

## ⚠️ **LIMITAÇÕES INICIAIS INTENCIONAIS**

### **Sem Implementar na Fase Inicial:**
- ❌ Validação de email
- ❌ Validação de força de senha
- ❌ Hash de senhas
- ❌ JWT/tokens de autenticação
- ❌ Validação de dados com Zod
- ❌ Testes automatizados
- ❌ Autenticação social
- ❌ Reset de senha

### **Motivo:** 
Manter implementação simples para estabelecer base sólida da arquitetura modular antes de adicionar complexidades de segurança.

---

## 📊 **CRITÉRIOS DE SUCESSO**

### **Fase 1-5 Concluída Quando:**
- [ ] Backend rodando em desenvolvimento (porta 3001)
- [ ] Frontend integrado via proxy (porta 8080)
- [ ] Usuário consegue se cadastrar via formulário
- [ ] Usuário consegue fazer login via formulário
- [ ] Dados persistem no SQLite
- [ ] Prisma Studio funcional para visualizar dados
- [ ] Estrutura modular estabelecida e documentada

---

## 🚀 **COMANDOS PARA INICIAR DESENVOLVIMENTO**

```bash
# 1. Setup do backend
cd backend
npm install
npx prisma db push
npm run dev

# 2. Setup do frontend (terminal separado)
cd ../
npm run dev

# 3. Visualizar banco (terminal separado)
cd backend
npx prisma studio
```

---

## 📞 **RESPONSABILIDADES**

### **Desenvolvimento**
- Implementação seguindo exatamente esta estrutura
- Testes manuais de cada fase antes de prosseguir
- Documentação de endpoints implementados

### **Review**
- Validação da estrutura modular
- Teste de funcionalidades básicas
- Aprovação para próximas fases

---

**Este roadmap estabelece a base técnica sólida para toda a evolução futura da plataforma Madrilusa, mantendo simplicidade inicial com arquitetura preparada para crescimento.**

---

*Roadmap criado em Janeiro 2025 - Projeto Madrilusa*  
*Para dúvidas técnicas: madrilusa@adritem.pt* 