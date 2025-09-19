# 🚀 Deploy Completo Madrilusa no Digital Ocean

## 📋 Visão Geral

Este documento detalha o processo completo de deploy da plataforma Madrilusa no Digital Ocean, incluindo containerização com Docker, configuração de servidor, e setup de produção.

## 🎯 Objetivo

Implementar a plataforma Madrilusa (React + Node.js + SQLite + IA) no droplet Digital Ocean IP `167.99.203.215` com alta disponibilidade, segurança e monitoramento.

---

## 🔧 ETAPAS DE IMPLEMENTAÇÃO

### **1. PREPARAÇÃO DO SERVIDOR**

#### 1.1 Conexão SSH
```bash
# Conectar usando a chave privada
ssh -i env/digital-ocean-tuninho-a4tunados root@167.99.203.215
```

#### 1.2 Instalação de Dependências
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Instalar Docker e Docker Compose
apt install -y docker.io docker-compose

# Instalar nginx
apt install -y nginx

# Instalar certbot para SSL
apt install -y certbot python3-certbot-nginx

# Configurar firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
```

#### 1.3 Configuração de Usuário
```bash
# Criar usuário madrilusa
adduser madrilusa
usermod -aG docker madrilusa
usermod -aG sudo madrilusa
```

### **2. PREPARAÇÃO DO CÓDIGO**

#### 2.1 Dockerfile Frontend
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2.2 Dockerfile Backend
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar dependências
COPY backend/package*.json ./
RUN npm install

# Copiar código
COPY backend/ .

# Gerar Prisma Client
RUN npx prisma generate

# Expor porta
EXPOSE 3001

# Comando de inicialização
CMD ["npm", "start"]
```

#### 2.3 Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    volumes:
      - ./data:/app/data
      - ./backend/.env:/app/.env
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./data/prod.db

volumes:
  data:
```

### **3. CONFIGURAÇÃO DE AMBIENTE**

#### 3.1 Arquivo .env.production
```bash
# Database
DATABASE_URL="file:./data/prod.db"

# OpenAI API Key
OPENAI_API_KEY="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"

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Origins (substitua pelo domínio real)
CORS_ORIGINS="https://madrilusa.com,https://www.madrilusa.com"
```

#### 3.2 Configuração Vite para Produção
```typescript
// vite.config.production.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### **4. CONFIGURAÇÃO NGINX**

#### 4.1 nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        server_name madrilusa.com www.madrilusa.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name madrilusa.com www.madrilusa.com;

        # SSL Configuration
        ssl_certificate /etc/letsencrypt/live/madrilusa.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/madrilusa.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Frontend
        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_timeout 30s;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
}
```

### **5. SCRIPTS DE DEPLOY**

#### 5.1 Script de Deploy (deploy.sh)
```bash
#!/bin/bash

echo "🚀 Iniciando deploy Madrilusa..."

# Variáveis
REMOTE_USER="madrilusa"
REMOTE_HOST="167.99.203.215"
REMOTE_PATH="/home/madrilusa/madrilusa"
SSH_KEY="env/digital-ocean-tuninho-a4tunados"

# Fazer backup do banco atual
echo "📦 Fazendo backup do banco..."
ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && cp data/prod.db data/backup-$(date +%Y%m%d-%H%M%S).db"

# Upload do código
echo "📤 Enviando código..."
rsync -avz --exclude=node_modules --exclude=.git --exclude=backend/dev.db -e "ssh -i $SSH_KEY" . $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

# Build e deploy
echo "🔨 Fazendo build e deploy..."
ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST << 'EOF'
cd /home/madrilusa/madrilusa

# Parar containers existentes
docker-compose down

# Rebuild e iniciar
docker-compose up -d --build

# Verificar status
docker-compose ps
EOF

echo "✅ Deploy concluído!"
```

#### 5.2 Script de Setup Inicial (setup-server.sh)
```bash
#!/bin/bash

echo "🔧 Configurando servidor inicial..."

REMOTE_USER="madrilusa"
REMOTE_HOST="167.99.203.215"
SSH_KEY="env/digital-ocean-tuninho-a4tunados"

# Criar estrutura de pastas
ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST << 'EOF'
mkdir -p /home/madrilusa/madrilusa/data
mkdir -p /home/madrilusa/madrilusa/logs
mkdir -p /home/madrilusa/madrilusa/backups

# Configurar cron para backups
(crontab -l 2>/dev/null; echo "0 2 * * * cp /home/madrilusa/madrilusa/data/prod.db /home/madrilusa/madrilusa/backups/backup-\$(date +\%Y\%m\%d).db") | crontab -
EOF

# Upload arquivos de configuração
scp -i $SSH_KEY docker-compose.yml $REMOTE_USER@$REMOTE_HOST:/home/madrilusa/madrilusa/
scp -i $SSH_KEY backend/.env.production $REMOTE_USER@$REMOTE_HOST:/home/madrilusa/madrilusa/backend/.env

echo "✅ Setup inicial concluído!"
```

### **6. MONITORAMENTO E LOGS**

#### 6.1 Script de Monitoramento (monitor.sh)
```bash
#!/bin/bash

# Verificar status dos containers
docker-compose ps

# Logs recentes
echo "📋 Logs do Backend:"
docker-compose logs --tail=50 backend

echo "📋 Logs do Frontend:"
docker-compose logs --tail=50 frontend

# Verificar espaço em disco
echo "💾 Espaço em disco:"
df -h

# Verificar uso de memória
echo "🧠 Uso de memória:"
free -h
```

#### 6.2 Health Check
```bash
#!/bin/bash

# Verificar se serviços estão respondendo
curl -f http://localhost:3001/health || echo "❌ Backend não está respondendo"
curl -f http://localhost:8080 || echo "❌ Frontend não está respondendo"

# Verificar SSL
curl -f https://madrilusa.com || echo "❌ SSL não está funcionando"
```

### **7. CONFIGURAÇÃO DE DOMÍNIO E SSL**

#### 7.1 Configurar DNS
```bash
# No painel do DNS provider, configurar:
# A record: madrilusa.com -> 167.99.203.215
# CNAME: www.madrilusa.com -> madrilusa.com
```

#### 7.2 Configurar SSL
```bash
# Obter certificados SSL
certbot --nginx -d madrilusa.com -d www.madrilusa.com

# Renovação automática
crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🎯 RESULTADO FINAL

### ✅ Funcionalidades Implementadas
- **Frontend React**: Servido via nginx com gzip e cache
- **Backend Node.js**: API REST com proxy reverso
- **Base de dados SQLite**: Persistente com backups automáticos
- **IA OpenAI**: Totalmente funcional em produção
- **SSL/TLS**: Certificados automáticos via Let's Encrypt
- **Monitoramento**: Scripts de health check e logs
- **Segurança**: Firewall, rate limiting, headers de segurança

### 🔗 URLs de Acesso
- **Frontend**: https://madrilusa.com
- **API**: https://madrilusa.com/api
- **Health Check**: https://madrilusa.com/api/health

### 📊 Comandos de Gestão
```bash
# Deploy completo
./scripts/deploy.sh

# Monitoramento
./scripts/monitor.sh

# Backup manual
./scripts/backup.sh

# Logs em tempo real
docker-compose logs -f

# Restart serviços
docker-compose restart

# Atualizar apenas backend
docker-compose up -d --build backend
```

---

## 🔒 Considerações de Segurança

### ✅ Implementadas
- **Firewall**: Apenas portas 22, 80, 443 abertas
- **SSL/TLS**: Certificados válidos e renovação automática
- **Rate Limiting**: API protegida contra abuse
- **Headers de Segurança**: XSS, CSRF, Content-Type protection
- **Variáveis Sensíveis**: Isoladas em arquivos .env protegidos
- **Backups**: Automáticos e versionados
- **Logs de Auditoria**: Completos e estruturados

### 🛡️ Monitoramento
- **Health Checks**: Automatizados para frontend e backend
- **Alertas**: Configurados para falhas de serviço
- **Métricas**: CPU, memória, disco monitorados
- **Logs Centralizados**: Estruturados e pesquisáveis

---

## 📞 Suporte e Manutenção

### 🔧 Comandos Essenciais
```bash
# Verificar status geral
docker-compose ps && docker-compose logs --tail=20

# Backup de emergência
cp data/prod.db backups/emergency-$(date +%Y%m%d-%H%M%S).db

# Restart completo
docker-compose down && docker-compose up -d

# Verificar logs de erro
docker-compose logs backend | grep -i error

# Atualizar certificados SSL
certbot renew
```

### 📧 Contactos de Suporte
- **ADRITEM**: madrilusa@adritem.pt | (+351) 937 342 173
- **Federação Minha Terra**: mariaclarabraga@minhaterra.pt

---

**Deploy implementado com ❤️ para a plataforma Madrilusa**

*Projeto de Inovação e Empreendedorismo Social*
*Federação Minha Terra • ADRITEM • ADRACES • CoraNE*