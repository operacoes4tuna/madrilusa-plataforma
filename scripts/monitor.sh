#!/bin/bash

# 📊 SCRIPT DE MONITORAMENTO REMOTO PARA MADRILUSA
# Verifica status da aplicação e recursos do servidor

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
}

# ===========================
# MONITORAMENTO
# ===========================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 MONITORAMENTO MADRILUSA - $(date)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

log "Conectando ao servidor $REMOTE_HOST..."

ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST << 'EOF'
cd /home/madrilusa/madrilusa

echo "🖥️  INFORMAÇÕES DO SISTEMA"
echo "=========================="
echo "• Hostname: $(hostname)"
echo "• Uptime: $(uptime -p)"
echo "• Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo ""

echo "💾 USO DE DISCO"
echo "==============="
df -h | grep -E "Filesystem|/dev/"
echo ""

echo "🧠 USO DE MEMÓRIA"
echo "=================="
free -h
echo ""

echo "🐳 STATUS DOS CONTAINERS"
echo "========================"
if docker-compose ps &>/dev/null; then
    docker-compose ps
else
    echo "❌ Docker Compose não está rodando"
fi
echo ""

echo "📊 ESTATÍSTICAS DOS CONTAINERS"
echo "=============================="
if docker stats --no-stream &>/dev/null; then
    docker stats --no-stream
else
    echo "❌ Nenhum container rodando"
fi
echo ""

echo "🌐 VERIFICAÇÃO DE CONECTIVIDADE"
echo "==============================="
# Backend
if curl -s -f http://localhost:3001/health > /dev/null; then
    echo "✅ Backend: Online (http://localhost:3001/health)"
else
    echo "❌ Backend: Offline"
fi

# Frontend
if curl -s -f http://localhost:8080 > /dev/null; then
    echo "✅ Frontend: Online (http://localhost:8080)"
else
    echo "❌ Frontend: Offline"
fi

# HTTPS (se configurado)
if curl -s -f https://localhost > /dev/null 2>&1; then
    echo "✅ HTTPS: Configurado"
elif curl -s -f https://madrilusa.com > /dev/null 2>&1; then
    echo "✅ HTTPS: Online (https://madrilusa.com)"
else
    echo "⚠️  HTTPS: Não configurado ou offline"
fi
echo ""

echo "📋 LOGS RECENTES DO BACKEND"
echo "==========================="
if docker-compose logs --tail=10 backend 2>/dev/null; then
    echo "✅ Logs obtidos com sucesso"
else
    echo "❌ Não foi possível obter logs do backend"
fi
echo ""

echo "📁 BACKUP STATUS"
echo "================"
if [ -d "backups" ]; then
    echo "• Total de backups: $(ls backups/*.db 2>/dev/null | wc -l)"
    echo "• Último backup: $(ls -t backups/*.db 2>/dev/null | head -1 | xargs basename 2>/dev/null || echo 'Nenhum backup encontrado')"
    echo "• Espaço usado por backups: $(du -sh backups 2>/dev/null | cut -f1)"
else
    echo "❌ Diretório de backups não encontrado"
fi
echo ""

echo "🔍 PROCESSOS RELACIONADOS"
echo "========================="
ps aux | grep -E "(node|nginx|docker)" | grep -v grep | head -10
echo ""
EOF

# Verificação externa
log "Verificando acesso externo..."

# Ping test
if ping -c 1 $REMOTE_HOST > /dev/null 2>&1; then
    success "Servidor acessível via ping"
else
    warning "Servidor não responde ao ping"
fi

# HTTP test
if curl -s -f http://$REMOTE_HOST:8080 > /dev/null 2>&1; then
    success "Frontend acessível externamente"
else
    warning "Frontend não acessível externamente"
fi

if curl -s -f http://$REMOTE_HOST:3001/health > /dev/null 2>&1; then
    success "Backend acessível externamente"
else
    warning "Backend não acessível externamente"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
success "Monitoramento concluído!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}🛠️ Comandos úteis:${NC}"
echo "• Restart: ./scripts/restart.sh"
echo "• Backup: ./scripts/backup.sh"
echo "• Logs: ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST 'cd madrilusa && docker-compose logs -f'"
echo ""