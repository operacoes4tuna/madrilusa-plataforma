#!/bin/bash

# 🔄 SCRIPT DE RESTART PARA MADRILUSA
# Reinicia os containers da aplicação

set -e

# ===========================
# CONFIGURAÇÕES
# ===========================
REMOTE_USER="madrilusa"
REMOTE_HOST="167.99.203.215"
SSH_KEY="env/digital-ocean-tuninho-a4tunados"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# ===========================
# RESTART
# ===========================
log "Reiniciando aplicação Madrilusa..."

ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST << 'EOF'
cd /home/madrilusa/madrilusa

echo "🔄 Reiniciando containers..."

# Verificar status atual
echo "📊 Status atual dos containers:"
docker-compose ps

# Restart dos containers
echo ""
echo "🛑 Parando containers..."
docker-compose down

echo "🚀 Iniciando containers..."
docker-compose up -d

echo "⏳ Aguardando containers ficarem prontos..."
sleep 20

echo "📊 Novo status dos containers:"
docker-compose ps

echo "🏥 Verificando health checks..."
sleep 10

# Verificar backend
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend: Online"
else
    echo "❌ Backend: Offline"
fi

# Verificar frontend
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Frontend: Online"
else
    echo "❌ Frontend: Offline"
fi

echo ""
echo "✅ Restart concluído!"
EOF

success "Restart da aplicação concluído"

# Verificação externa rápida
log "Verificando acesso externo..."
sleep 5

if curl -s -f http://$REMOTE_HOST:3001/health > /dev/null 2>&1; then
    success "Backend acessível externamente"
else
    warning "Backend pode não estar acessível externamente"
fi

if curl -s -f http://$REMOTE_HOST:8080 > /dev/null 2>&1; then
    success "Frontend acessível externamente"
else
    warning "Frontend pode não estar acessível externamente"
fi