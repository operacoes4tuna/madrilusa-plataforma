# Madrilusa Backend API

Backend modular para a plataforma Madrilusa com arquitetura baseada em módulos.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma generate
npx prisma db push

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📡 Endpoints Disponíveis

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "service": "Madrilusa Backend API"
}
```

### 🔐 Autenticação

#### Registrar Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "nomeCompleto": "João Silva",
  "email": "joao@example.com",
  "senha": "123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "nomeCompleto": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2025-01-20T10:30:00.000Z",
    "updatedAt": "2025-01-20T10:30:00.000Z"
  },
  "message": "Usuário registrado com sucesso"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "senha": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "nomeCompleto": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2025-01-20T10:30:00.000Z",
    "updatedAt": "2025-01-20T10:30:00.000Z"
  },
  "message": "Login realizado com sucesso"
}
```

### 👥 Usuários

#### Listar Usuários
```http
GET /api/users
```

#### Buscar Usuário por ID
```http
GET /api/users/:id
```

#### Criar Usuário
```http
POST /api/users
Content-Type: application/json

{
  "nomeCompleto": "Maria Santos",
  "email": "maria@example.com",
  "senha": "123456"
}
```

#### Atualizar Usuário
```http
PUT /api/users/:id
Content-Type: application/json

{
  "nomeCompleto": "Maria Santos Silva"
}
```

#### Deletar Usuário
```http
DELETE /api/users/:id
```

## 🛠️ Stack Técnico

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **ORM:** Prisma
- **Validation:** Básica (evolui para Zod)

## 📁 Estrutura Modular

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Autenticação
│   │   └── users/         # Gestão de usuários
│   ├── shared/
│   │   ├── database/      # Configuração Prisma
│   │   └── middleware/    # CORS, Error handling
│   ├── app.ts            # Configuração Express
│   └── server.ts         # Servidor principal
├── prisma/
│   └── schema.prisma     # Schema do banco
└── package.json
```

## 🔒 Limitações Atuais (Intencionais)

- **Sem hash de senhas** - Implementação simples inicial
- **Sem JWT** - Login básico sem tokens
- **Sem validação avançada** - Apenas validações básicas
- **Sem testes** - Foco na arquitetura primeiro

## 🗄️ Banco de Dados

### Modelo User
```prisma
model User {
  id           String   @id @default(cuid())
  nomeCompleto String
  email        String   @unique
  senha        String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@map("users")
}
```

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm run start      # Produção
npm run db:push    # Sincronizar schema
npm run db:studio  # Interface visual do banco
```

## 🌐 CORS Configuration

Configurado para aceitar requests de:
- `http://localhost:8080` (frontend dev)
- `http://localhost:5173` (vite dev)
- `https://madrilusa.com` (produção)

## 📝 Logs e Debugging

O servidor registra:
- ✅ Conexão com banco
- ❌ Erros de aplicação
- 📡 Requests da API
- 🛑 Graceful shutdown

---

*Backend desenvolvido seguindo o roadmap de estruturação modular do projeto Madrilusa.* 