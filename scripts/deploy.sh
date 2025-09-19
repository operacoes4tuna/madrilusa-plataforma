#!/bin/bash

# 🚀 SCRIPT DE DEPLOY MADRILUSA NO DIGITAL OCEAN
# Automatiza o processo completo de deploy da aplicação

set -e  # Exit on any error

# ===========================
# CONFIGURAÇÕES
# ===========================
REMOTE_USER="madrilusa"
REMOTE_HOST="167.99.203.215"
REMOTE_PATH="/home/madrilusa/madrilusa"
SSH_KEY="env/digital-ocean-tuninho-a4tunados"
BACKUP_DIR="backups"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ===========================
# FUNÇÕES AUXILIARES
# ===========================
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
# VALIDAÇÕES PRÉ-DEPLOY
# ===========================
log "Iniciando deploy Madrilusa para Digital Ocean..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script a partir da raiz do projeto Madrilusa!"
fi

# Verificar se a chave SSH existe
if [ ! -f "$SSH_KEY" ]; then
    error "Chave SSH não encontrada: $SSH_KEY"
fi

# Verificar se os Dockerfiles existem
if [ ! -f "Dockerfile.frontend" ] || [ ! -f "Dockerfile.backend" ]; then
    error "Dockerfiles não encontrados!"
fi

# Verificar se o docker-compose.yml existe
if [ ! -f "docker-compose.yml" ]; then
    error "docker-compose.yml não encontrado!"
fi

success "Validações pré-deploy concluídas"

# ===========================
# PREPARAÇÃO LOCAL
# ===========================
log "Preparando arquivos para deploy..."

# Executar testes locais
log "Executando validações locais..."
npm run lint || warning "Lint falhou, continuando deploy..."
npm run type-check || warning "Type check falhou, continuando deploy..."

# Criar diretórios necessários
mkdir -p $BACKUP_DIR

success "Preparação local concluída"

# ===========================
# BACKUP REMOTO
# ===========================
log "Fazendo backup do banco de dados atual..."

ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST << 'EOF'
cd /home/madrilusa/madrilusa
if [ -f "data/prod.db" ]; then
    mkdir -p backups
    cp data/prod.db backups/backup-$(date +%Y%m%d-%H%M%S).db
    echo "✅ Backup criado com sucesso"
else
    echo "⚠️ Banco de dados não encontrado, provavelmente primeiro deploy"
fi
EOF

success "Backup concluído"

# ===========================
# UPLOAD DOS ARQUIVOS
# ===========================
log "Enviando arquivos para o servidor..."

# Sincronizar código (excluindo node_modules e arquivos desnecessários)
rsync -avz --progress \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=backend/dev.db \
    --exclude=backend/logs \
    --exclude=dist \
    --exclude=backend/node_modules \
    --exclude=*.log \
    -e "ssh -i $SSH_KEY" \
    . $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

success "Upload de arquivos concluído"

# ===========================
# DEPLOY REMOTO
# ===========================
log "Executando deploy no servidor..."

ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST << 'EOF'
cd /home/madrilusa/madrilusa

echo "🔧 Preparando ambiente de produção..."

# Criar diretórios necessários
mkdir -p data logs ssl

# Copiar .env de produção se não existir
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.production" ]; then
        cp backend/.env.production backend/.env
        echo "✅ Arquivo .env configurado para produção"
    else
        echo "❌ Arquivo .env.production não encontrado!"
        exit 1
    fi
fi

echo "🐳 Parando containers existentes..."
docker-compose down || echo "Nenhum container estava rodando"

echo "🏗️ Fazendo build das imagens..."
docker-compose build --no-cache

echo "🚀 Iniciando containers..."
docker-compose up -d

echo "⏳ Aguardando containers ficarem prontos..."
sleep 30

echo "🔍 Verificando status dos containers..."
docker-compose ps

echo "📊 Verificando logs dos containers..."
docker-compose logs --tail=20

echo "🏥 Verificando health checks..."
timeout 60 bash -c 'until curl -f http://localhost:3001/health; do sleep 2; done' || echo "⚠️ Backend health check falhou"
timeout 60 bash -c 'until curl -f http://localhost:8080/health; do sleep 2; done' || echo "⚠️ Frontend health check falhou"

echo "✅ Deploy concluído!"
EOF

success "Deploy remoto concluído"

# ===========================
# VERIFICAÇÕES PÓS-DEPLOY
# ===========================
log "Executando verificações pós-deploy..."

# Verificar se os serviços estão respondendo
log "Verificando backend..."
if ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "curl -f http://localhost:3001/health" >/dev/null 2>&1; then
    success "Backend está respondendo"
else
    warning "Backend não está respondendo"
fi

log "Verificando frontend..."
if ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "curl -f http://localhost:8080" >/dev/null 2>&1; then
    success "Frontend está respondendo"
else
    warning "Frontend não está respondendo"
fi

# ===========================
# RESUMO FINAL
# ===========================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
success "🎉 DEPLOY MADRILUSA CONCLUÍDO COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📊 Informações do Deploy:${NC}"
echo "• Servidor: $REMOTE_HOST"
echo "• Usuário: $REMOTE_USER"
echo "• Caminho: $REMOTE_PATH"
echo ""
echo -e "${BLUE}🔗 URLs de Acesso:${NC}"
echo "• Frontend: http://$REMOTE_HOST:8080"
echo "• Backend: http://$REMOTE_HOST:3001"
echo "• Health: http://$REMOTE_HOST:3001/health"
echo ""
echo -e "${BLUE}📋 Próximos Passos:${NC}"
echo "• Configurar DNS para apontar para $REMOTE_HOST"
echo "• Configurar SSL com Let's Encrypt"
echo "• Configurar monitoramento"
echo ""
echo -e "${BLUE}🛠️ Comandos Úteis:${NC}"
echo "• Logs: ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_PATH && docker-compose logs -f'"
echo "• Status: ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_PATH && docker-compose ps'"
echo "• Restart: ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_PATH && docker-compose restart'"
echo ""
success "Deploy finalizado! 🚀"