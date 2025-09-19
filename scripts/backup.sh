#!/bin/bash

# 💾 SCRIPT DE BACKUP MANUAL PARA MADRILUSA
# Cria backup completo do banco de dados e configurações

set -e

# ===========================
# CONFIGURAÇÕES
# ===========================
REMOTE_USER="madrilusa"
REMOTE_HOST="167.99.203.215"
SSH_KEY="env/digital-ocean-tuninho-a4tunados"
LOCAL_BACKUP_DIR="./backups"

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
# BACKUP
# ===========================
log "Iniciando backup manual do Madrilusa..."

# Criar diretório local de backup
mkdir -p $LOCAL_BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Backup no servidor
log "Criando backup no servidor..."
ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST << EOF
set -e

cd /home/madrilusa/madrilusa

echo "💾 Criando backup completo..."

# Criar backup do banco
if [ -f "data/prod.db" ]; then
    cp data/prod.db backups/manual-backup-$TIMESTAMP.db
    echo "✅ Backup do banco criado: manual-backup-$TIMESTAMP.db"
else
    echo "⚠️ Banco de dados não encontrado"
fi

# Backup das configurações
tar -czf backups/config-backup-$TIMESTAMP.tar.gz \
    docker-compose.yml \
    nginx.conf \
    backend/.env \
    2>/dev/null || echo "⚠️ Alguns arquivos de configuração não encontrados"

echo "✅ Backup completo criado"

# Listar backups disponíveis
echo ""
echo "📋 Backups disponíveis:"
ls -lah backups/
EOF

# Download do backup
log "Fazendo download do backup..."
scp -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST:/home/madrilusa/madrilusa/backups/manual-backup-$TIMESTAMP.db $LOCAL_BACKUP_DIR/ 2>/dev/null || warning "Backup do banco não baixado"
scp -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST:/home/madrilusa/madrilusa/backups/config-backup-$TIMESTAMP.tar.gz $LOCAL_BACKUP_DIR/ 2>/dev/null || warning "Backup das configurações não baixado"

success "Backup concluído!"
echo ""
echo -e "${BLUE}📁 Arquivos de backup criados:${NC}"
echo "• Servidor: /home/madrilusa/madrilusa/backups/"
echo "• Local: $LOCAL_BACKUP_DIR/"
echo ""
echo -e "${BLUE}📋 Arquivos:${NC}"
ls -lah $LOCAL_BACKUP_DIR/ 2>/dev/null || echo "Nenhum backup local encontrado"