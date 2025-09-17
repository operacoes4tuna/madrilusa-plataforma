# 🔍 **COMANDOS ÚTEIS PARA INVESTIGAÇÃO - CLAUDE CODE**

## **📋 ANÁLISE GERAL DO PROJETO**

### **Estrutura e Organização**
```bash
# Visão geral da estrutura de diretórios
find . -type d -name "src" -o -name "backend" -o -name "doc" | head -10

# Listar todos os módulos backend
ls -la backend/src/modules/

# Verificar estrutura frontend
find src -type d | grep -E "(app|institutional|components|pages)"

# Contar arquivos por tipo
find . -name "*.tsx" | wc -l  # Componentes React
find . -name "*.ts" | wc -l   # Arquivos TypeScript
find . -name "*.md" | wc -l   # Documentação
```

### **Análise de Configurações**
```bash
# Verificar package.json e scripts disponíveis
cat package.json | grep -A 20 "scripts"

# Verificar backend package.json
cat backend/package.json | grep -A 15 "scripts"

# Listar arquivos de configuração
find . -name "*.config.*" -o -name "*.json" | grep -v node_modules

# Verificar tsconfig
find . -name "tsconfig*.json"
```

---

## **🏗️ ANÁLISE DE CÓDIGO**

### **Componentes Frontend**
```bash
# Encontrar componentes por categoria
find src -name "*Perfil*.tsx"
find src -name "*User*.tsx"
find src -name "*Admin*.tsx"

# Buscar hooks personalizados
find src -name "use*.ts"

# Componentes de formulário
find src -name "*Form*.tsx"

# Páginas principais
find src/app/pages -name "*.tsx"

# Verificar estrutura de componentes
find src/app/components -type d
```

### **Backend e APIs**
```bash
# Listar todos os controllers
find backend/src/modules -name "*.controller.ts"

# Verificar rotas disponíveis
find backend/src/modules -name "*.routes.ts"

# Buscar services
find backend/src/modules -name "*.service.ts"

# Verificar tipos/interfaces
find backend/src/modules -name "*.types.ts"

# Middleware personalizado
find backend/src/shared/middleware -name "*.ts"
```

### **Tipos TypeScript**
```bash
# Verificar todos os tipos
find src/types -name "*.types.ts"

# Buscar interfaces específicas
find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "interface.*User"

# Verificar tipos compartilhados
ls -la src/types/
ls -la shared-types/ 2>/dev/null || echo "Pasta shared-types não existe"
```

---

## **🤖 ANÁLISE DE SISTEMAS DE IA**

### **Integração OpenAI**
```bash
# Buscar todas as referências à OpenAI
grep -r "openai\|OpenAI" src/ backend/ --include="*.ts" --include="*.tsx"

# Verificar configurações de IA
find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "OPENAI_API_KEY"

# Buscar prompts e contextos de IA
grep -r "prompt\|context" backend/src/modules/ai/ 2>/dev/null

# Verificar endpoints de IA
grep -r "/api/ai\|/api/sinergia" backend/src/
```

### **Sistema de Contribuições com IA**
```bash
# Componentes de IA no frontend
find src -name "*AI*.tsx" -o -name "*ai*.tsx"

# Hooks relacionados a IA
find src -name "*AI*.ts" -o -name "*ai*.ts"

# Verificar sistema de contribuições
find backend/src/modules/contribuicoes -name "*.ts" 2>/dev/null

# Sistema SinergIA
find backend/src/modules/sinergia -name "*.ts" 2>/dev/null
```

### **Chatbot**
```bash
# Encontrar componente do chatbot
find src -name "*Chatbot*" -o -name "*chatbot*"

# Verificar integração do chatbot
grep -r "chatbot\|Chatbot" src/ --include="*.tsx"
```

---

## **🗄️ ANÁLISE DE BASE DE DADOS**

### **Schema Prisma**
```bash
# Verificar schema atual
cat backend/prisma/schema.prisma

# Listar migrations
ls -la backend/prisma/migrations/ 2>/dev/null

# Verificar modelos no schema
grep -E "^model " backend/prisma/schema.prisma

# Buscar relações
grep -E "@relation\|references\|fields" backend/prisma/schema.prisma
```

### **Uso do Prisma no Código**
```bash
# Verificar uso do Prisma
grep -r "prisma\." backend/src/ --include="*.ts"

# Queries específicas
grep -r "findMany\|findUnique\|create\|update\|delete" backend/src/ --include="*.ts"

# Verificar configuração do Prisma
find backend -name "index.ts" | xargs grep -l "PrismaClient"
```

---

## **📡 ANÁLISE DE APIS E ENDPOINTS**

### **Mapear Endpoints**
```bash
# Buscar definições de rotas
grep -r "router\.\(get\|post\|put\|delete\)" backend/src/modules/

# Verificar padrões de endpoint
grep -r "\/api\/" backend/src/ --include="*.ts"

# Buscar middlewares
grep -r "middleware" backend/src/ --include="*.ts"

# Verificar CORS
grep -r "cors" backend/src/ --include="*.ts"
```

### **Controllers e Services**
```bash
# Listar todos os controllers
find backend/src/modules -name "*.controller.ts" -exec basename {} \;

# Verificar padrões de resposta
grep -r "res\.json\|res\.status" backend/src/ --include="*.ts"

# Buscar validações
grep -r "validate\|validation" backend/src/ --include="*.ts"
```

---

## **🎨 ANÁLISE DE INTERFACE E UX**

### **Componentes UI**
```bash
# Componentes shadcn/ui
grep -r "@/components/ui" src/ --include="*.tsx"

# Buscar estilos customizados
find src -name "*.css" -o -name "*.scss"

# Verificar identidade visual
grep -r "#F5A623\|#4A90A4" src/ --include="*.css" --include="*.tsx"

# Classes CSS específicas do projeto
grep -r "app-\|madrilusa-" src/ --include="*.tsx" --include="*.css"
```

### **Responsividade e Acessibilidade**
```bash
# Verificar classes responsivas
grep -r "sm:\|md:\|lg:\|xl:" src/ --include="*.tsx"

# Buscar atributos de acessibilidade
grep -r "aria-\|role=" src/ --include="*.tsx"

# Verificar alt text em imagens
grep -r "alt=" src/ --include="*.tsx"
```

---

## **🔐 ANÁLISE DE SEGURANÇA**

### **Configurações Sensíveis**
```bash
# ⚠️ CUIDADO: Buscar possíveis exposições de chaves
grep -r "sk-\|secret\|password\|key" src/ --include="*.ts" --include="*.tsx"

# Verificar .env no gitignore
grep -E "\.env|secret|key" .gitignore

# Buscar validações de segurança
grep -r "sanitize\|validate\|escape" backend/src/ --include="*.ts"
```

### **Autenticação e Autorização**
```bash
# Sistema de autenticação
find backend/src/modules/auth -name "*.ts" 2>/dev/null

# Middleware de autenticação
find backend/src/shared/middleware -name "*auth*" 2>/dev/null

# Verificar proteção de rotas
grep -r "ProtectedRoute\|auth" src/ --include="*.tsx"
```

---

## **📊 ANÁLISE DE CATEGORIAS DE USUÁRIO**

### **Sistema de Categorias**
```bash
# Buscar implementações por categoria
for cat in imigrantes empresas municipios academias familias; do
  echo "=== $cat ==="
  find backend/src/modules/$cat -name "*.ts" 2>/dev/null | head -5
done

# Verificar perfis específicos
grep -r "Perfil\(Imigrante\|Empresa\|Municipio\|Academia\|Familia\)" backend/prisma/schema.prisma

# Páginas por categoria
find src/app/pages -name "Perfil*.tsx"
```

### **Componentes por Categoria**
```bash
# Componentes específicos de categoria
find src/app/components -type d | grep -E "(imigrante|empresa|municipio|academia|familia)"

# Formulários por categoria
find src -name "*Details.tsx"

# Verificar menus condicionais
grep -r "categoria\|category" src/app/components/ --include="*.tsx"
```

---

## **📚 ANÁLISE DE DOCUMENTAÇÃO**

### **Estrutura de Documentação**
```bash
# Listar toda documentação
find doc -name "*.md" | sort

# Verificar status de implementação
ls -la doc/status_implementacao/

# Documentação técnica
ls -la doc/03_IMPLEMENTACAO_TECNICA/

# Templates Claude
ls -la doc/06_CLAUDE_TEMPLATES/ 2>/dev/null
```

### **README e Guias**
```bash
# Verificar READMEs
find . -name "README*.md" | grep -v node_modules

# Buscar guias específicos
find doc -name "*Guia*" -o -name "*GUIDE*"

# Verificar CLAUDE.md
ls -la CLAUDE.md 2>/dev/null || echo "CLAUDE.md não existe ainda"
```

---

## **🔄 ANÁLISE DE FLUXOS E INTEGRAÇÃO**

### **React Query e Estado**
```bash
# Verificar hooks de query
grep -r "useQuery\|useMutation" src/ --include="*.ts" --include="*.tsx"

# Services de API
find src -name "*.api.ts"

# Context providers
grep -r "Provider\|Context" src/ --include="*.tsx"
```

### **Roteamento**
```bash
# Verificar rotas React
grep -r "Route\|useNavigate\|Link" src/App.tsx

# Verificar proteção de rotas
grep -r "ProtectedRoute" src/ --include="*.tsx"

# Menus e navegação
find src -name "*Menu*" -o -name "*Nav*"
```

---

## **🚀 COMANDOS DE DESENVOLVIMENTO**

### **Validação Rápida**
```bash
# Verificar se projeto compila
npm run type-check

# Verificar linting
npm run lint

# Validação completa Claude
npm run check:claude 2>/dev/null || echo "Script check:claude não configurado"

# Verificar se serviços iniciam
timeout 10s npm run dev:full && echo "Serviços iniciam OK" || echo "Problema na inicialização"
```

### **Base de Dados**
```bash
# Verificar conexão com banco
cd backend && npx prisma db push --preview-feature 2>/dev/null && echo "DB OK" || echo "DB com problemas"

# Visualizar dados
echo "Prisma Studio: cd backend && npx prisma studio"

# Verificar models
cd backend && npx prisma generate && echo "Models gerados OK" || echo "Problema nos models"
```

---

## **📈 ANÁLISE DE MÉTRICAS ATUAIS**

### **Contadores de Arquivos**
```bash
# Contar componentes por tipo
echo "Components: $(find src -name "*.tsx" | wc -l)"
echo "TypeScript: $(find . -name "*.ts" | grep -v node_modules | wc -l)"
echo "Modules: $(ls backend/src/modules/ | wc -l)"
echo "Docs: $(find doc -name "*.md" | wc -l)"

# APIs por módulo
for module in $(ls backend/src/modules/ 2>/dev/null); do
  routes=$(find backend/src/modules/$module -name "*.routes.ts" 2>/dev/null | wc -l)
  echo "$module: $routes route files"
done
```

### **Complexidade do Código**
```bash
# Linhas de código por tipo
echo "Frontend LoC: $(find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | tail -1)"
echo "Backend LoC: $(find backend/src -name "*.ts" | xargs wc -l | tail -1)"

# Verificar imports
grep -r "import.*from" src/ --include="*.ts" --include="*.tsx" | wc -l
```

---

## **🔧 COMANDOS DE TROUBLESHOOTING**

### **Problemas Comuns**
```bash
# Verificar dependências
npm ls --depth=0 | grep MISSING || echo "Dependencies OK"

# Verificar ports em uso
lsof -i :8080 2>/dev/null || echo "Port 8080 livre"
lsof -i :3001 2>/dev/null || echo "Port 3001 livre"

# Verificar espaço em disco
df -h | grep -E "/$|/home"

# Log de erros recentes
tail -50 logs/* 2>/dev/null || echo "Sem logs encontrados"
```

### **Reset do Ambiente**
```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json && npm install

# Reset do backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Reset da base de dados
cd backend && npx prisma db push --force-reset
```

---

**💡 DICA:** Execute estes comandos no diretório raiz do projeto Madrilusa para obter informações completas sobre o estado atual do sistema.

**🎯 Para desenvolvimento eficiente com Claude Code, sempre comece com comandos de análise geral antes de focar em áreas específicas.**

---

*Comandos organizados para investigação sistemática com Claude Code*
*Projeto Madrilusa - Janeiro 2025*