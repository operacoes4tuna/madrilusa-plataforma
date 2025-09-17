# 🔧 MADRILUSA - CONFIGURAÇÃO RÁPIDA PARA DESENVOLVIMENTO

> **Última atualização:** Setembro 2025
> **Versão:** 2.0 - Sistema Zero-Friction
> **Tempo estimado:** 3-5 minutos

## 🚀 **CONFIGURAÇÃO AUTOMÁTICA (RECOMENDADO)**

### **1. Setup Completo - Um Comando**
```bash
npm run madrilusa:setup
```

Este comando executa:
- ✅ Instalação de dependências (frontend + backend)
- ✅ Configuração automática do .env com chaves funcionais
- ✅ Restauração do banco de dados com dados de desenvolvimento
- ✅ Geração do Prisma Client
- ✅ Verificações de integridade

### **2. Iniciar Projeto**
```bash
npm run dev:full
```

### **3. Verificar Funcionamento**
- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:3001/api/system/health
- **Prisma Studio:** `npm run db:studio` → http://localhost:5555

---

## 🛠️ **CONFIGURAÇÃO MANUAL (SE NECESSÁRIO)**

### **Opção A: Restauração Rápida**
```bash
# 1. Instalar dependências
npm install
cd backend && npm install

# 2. Restaurar configurações
npm run madrilusa:restore-dev

# 3. Gerar Prisma Client
cd backend && npx prisma generate

# 4. Iniciar projeto
npm run dev:full
```

### **Opção B: Passo a Passo**
```bash
# 1. Configurar ambiente
cp .madrilusa-dev/.env.development backend/.env

# 2. Configurar banco de dados
cp .madrilusa-dev/dev-seed.db backend/dev.db
cp .madrilusa-dev/dev-seed.db backend/prisma/dev.db

# 3. Instalar e gerar
cd backend
npm install
npx prisma generate

# 4. Voltar para raiz e iniciar
cd ..
npm install
npm run dev:full
```

---

## 🔐 **CREDENCIAIS DE TESTE**

### **Login Administrativo**
- **Email:** `admin@madrilusa.com.pt`
- **Senha:** `vcgvcg`

### **Logins por Categoria** (Login rápido disponível)
- **🌍 Imigrante:** `imigrante@madrilusa.com.pt` / `vcgvcg`
- **🏢 Empresa:** `empresa@madrilusa.com.pt` / `vcgvcg`
- **🏛️ Município:** `municipio@madrilusa.com.pt` / `vcgvcg`
- **🎓 Academia:** `academia@madrilusa.com.pt` / `vcgvcg`
- **👨‍👩‍👧‍👦 Família:** `familia@madrilusa.com.pt` / `vcgvcg`

---

## ⚡ **COMANDOS ÚTEIS**

### **Gestão do Projeto**
```bash
# Validação completa (lint + type-check)
npm run validate

# Criar backup do estado atual
npm run madrilusa:backup-current

# Reinstalação completa
npm run madrilusa:fresh-install

# Reset completo do banco
npm run db:reset
```

### **Desenvolvimento Avançado**
```bash
# Prisma Studio (interface visual DB)
npm run db:studio

# Gerar tipos após mudanças no schema
cd backend && npx prisma generate

# Aplicar mudanças no schema ao DB
cd backend && npx prisma db push
```

---

## 🛡️ **RESOLUÇÃO DE PROBLEMAS**

### **❌ Problema: Porta ocupada (3001/8080)**
```bash
# Verificar processos
lsof -i :3001
lsof -i :8080

# Encerrar processos
kill -9 <PID>
```

### **❌ Problema: Banco de dados vazio**
```bash
# Restaurar banco do backup
npm run madrilusa:restore-dev
cd backend && npx prisma generate
```

### **❌ Problema: Imports TypeScript**
```bash
# Verificar se shared-types está acessível
ls shared-types/

# Regenerar tipos
npm run validate
```

### **❌ Problema: Admin não loga**
```bash
# Verificar se banco tem dados
cd backend && npx prisma studio
# Verificar tabela 'users' - deve ter admin@madrilusa.com.pt
```

### **❌ Problema: Environment missing**
```bash
# Verificar se .env existe
ls backend/.env

# Recriar se necessário
cp .madrilusa-dev/.env.development backend/.env
```

---

## 📁 **ESTRUTURA DOS ARQUIVOS**

### **Arquivos de Configuração**
```
.madrilusa-dev/
├── .env.template          # Template limpo (sem chaves)
├── .env.development       # Configuração completa para dev
├── dev-seed.db           # Banco populado (27 usuários)
├── setup-instructions.md # Este arquivo
├── quick-start.sh        # Script de setup automático
└── backup-current.js     # Script de backup
```

### **Localização dos Arquivos Ativos**
```
backend/
├── .env                  # Copiado de .madrilusa-dev/
├── dev.db               # Banco principal
└── prisma/
    └── dev.db           # Banco Prisma (sincronizado)
```

---

## 🎯 **VERIFICAÇÃO DE SUCESSO**

### **Checklist Pós-Setup**
- [ ] Frontend carrega em http://localhost:8080
- [ ] Backend responde em http://localhost:3001
- [ ] Login admin funciona (admin@madrilusa.com.pt / vcgvcg)
- [ ] Dashboard carrega com dados
- [ ] Sistema de contribuições acessível
- [ ] SinergIA disponível no menu

### **Indicadores de Problema**
- ❌ Página branca no frontend
- ❌ 500 Internal Server Error
- ❌ "Cannot connect to database"
- ❌ "Module not found" errors
- ❌ Login retorna 401 Unauthorized

---

## 🚀 **PRÓXIMOS PASSOS APÓS SETUP**

1. **Explorar o Sistema:** Navegar pelas diferentes categorias de usuário
2. **Testar Contribuições:** Sistema de IA para aprimoramento de texto
3. **Experimentar SinergIA:** Matching inteligente entre categorias
4. **Verificar Documentação:** Consultar `/doc` para especificações detalhadas

---

## 📞 **SUPORTE**

Em caso de dificuldades:
1. Consultar este documento primeiro
2. Verificar documentação em `/doc`
3. Contactar ADRITEM: `madrilusa@adritem.pt`

---

**✨ Sistema desenvolvido para máxima facilidade de redeploy.**
**Tempo médio de setup: 3-5 minutos (vs. 15-20 minutos anteriormente)**