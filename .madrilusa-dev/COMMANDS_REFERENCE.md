# 🚀 MADRILUSA - REFERÊNCIA RÁPIDA DE COMANDOS

## 📦 **COMANDOS NPM MADRILUSA**

### **Setup e Instalação**
```bash
# Setup completo automatizado (RECOMENDADO)
npm run madrilusa:setup

# Reinstalação completa do zero
npm run madrilusa:fresh-install

# Restaurar apenas configurações (sem instalar)
npm run madrilusa:restore-dev
```

### **Backup e Recuperação**
```bash
# Criar backup do estado atual
npm run madrilusa:backup-current

# Listar backups disponíveis
ls -la backups/
```

### **Desenvolvimento**
```bash
# Iniciar projeto completo (frontend + backend)
npm run dev:full

# Apenas frontend (porta 8080)
npm run dev

# Apenas backend (porta 3001)
npm run dev:backend
```

### **Validação e Qualidade**
```bash
# Validação completa (lint + type-check)
npm run validate

# Validação específica Claude Code
npm run check:claude

# Lint apenas
npm run lint

# Type-check apenas
npm run type-check
```

### **Base de Dados**
```bash
# Prisma Studio (interface visual)
npm run db:studio

# Reset completo do banco
npm run db:reset

# Seed banco com dados de teste
npm run db:seed
```

---

## 🔧 **COMANDOS DIRETOS**

### **Scripts Standalone**
```bash
# Setup automatizado
./.madrilusa-dev/quick-start.sh

# Backup via script direto
node .madrilusa-dev/backup-current.cjs
```

### **Prisma (diretório backend/)**
```bash
cd backend

# Gerar Prisma Client
npx prisma generate

# Aplicar mudanças do schema
npx prisma db push

# Interface visual do banco
npx prisma studio

# Reset forçado
npx prisma db push --force-reset
```

### **Resolução de Problemas**
```bash
# Verificar portas ocupadas
lsof -i :3001
lsof -i :8080

# Encerrar processos
kill -9 <PID>

# Verificar status dos processos em background
ps aux | grep node
```

---

## 🌐 **URLs DE ACESSO**

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/system/health
- **Prisma Studio:** http://localhost:5555

---

## 🔐 **CREDENCIAIS DE DESENVOLVIMENTO**

### **Admin Principal**
- Email: `admin@madrilusa.com.pt`
- Senha: `vcgvcg`

### **Usuários por Categoria**
- 🌍 **Imigrante:** `imigrante@madrilusa.com.pt` / `vcgvcg`
- 🏢 **Empresa:** `empresa@madrilusa.com.pt` / `vcgvcg`
- 🏛️ **Município:** `municipio@madrilusa.com.pt` / `vcgvcg`
- 🎓 **Academia:** `academia@madrilusa.com.pt` / `vcgvcg`
- 👨‍👩‍👧‍👦 **Família:** `familia@madrilusa.com.pt` / `vcgvcg`

---

## 📁 **ESTRUTURA DE ARQUIVOS**

### **Configuração (.madrilusa-dev/)**
- `.env.development` - Configuração completa para desenvolvimento
- `.env.template` - Template limpo sem chaves
- `dev-seed.db` - Banco populado (253KB - 27 usuários)
- `quick-start.sh` - Script de setup automatizado
- `backup-current.cjs` - Script de backup
- `setup-instructions.md` - Documentação detalhada

### **Arquivos Ativos (backend/)**
- `.env` - Arquivo de ambiente ativo
- `dev.db` - Banco principal (sincronizado)
- `prisma/dev.db` - Banco Prisma (cópia sincronizada)

### **Backups (backups/)**
- `backup_YYYYMMDD_HHMMSS_*.db` - Backups timestamped
- `.env_YYYYMMDD_HHMMSS` - Backups de configuração

---

## ⚡ **FLUXO RECOMENDADO**

### **1. Setup Inicial**
```bash
git clone <repositorio>
cd madrilusasite
npm run madrilusa:setup
```

### **2. Desenvolvimento Diário**
```bash
npm run dev:full
# Trabalhar...
npm run validate
```

### **3. Backup Antes de Mudanças**
```bash
npm run madrilusa:backup-current
# Fazer mudanças...
npm run validate
```

### **4. Resolução de Problemas**
```bash
npm run madrilusa:restore-dev
npm run validate
npm run dev:full
```

---

## 🚨 **TROUBLESHOOTING RÁPIDO**

| Problema | Solução |
|----------|---------|
| Porta ocupada | `lsof -i :3001` → `kill -9 <PID>` |
| Banco vazio | `npm run madrilusa:restore-dev` |
| Admin não loga | Verificar se banco tem dados no Prisma Studio |
| Import errors | `npm run validate` |
| Dependências | `npm install --legacy-peer-deps` |
| Prisma issues | `cd backend && npx prisma generate` |

---

**💡 Dica:** Marque esta página para referência rápida durante o desenvolvimento!