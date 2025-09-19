#!/bin/bash

# 🔒 SCRIPT DE CONFIGURAÇÃO SSL PARA MADRILUSA
# Automatiza a configuração de certificados SSL com Let's Encrypt

set -e

# ===========================
# CONFIGURAÇÕES
# ===========================
REMOTE_USER="madrilusa"
REMOTE_HOST="167.99.203.215"
SSH_KEY="env/digital-ocean-tuninho-a4tunados"

# Domínios (substituir pelos domínios reais)
DOMAIN="madrilusa.com"
WWW_DOMAIN="www.madrilusa.com"

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
# CONFIGURAÇÃO SSL
# ===========================
log "Configurando SSL para $DOMAIN e $WWW_DOMAIN..."

read -p "Tem certeza que os domínios $DOMAIN e $WWW_DOMAIN estão apontando para $REMOTE_HOST? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    error "Configure o DNS primeiro antes de continuar"
fi

ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST << EOF
set -e

echo "🔒 Configurando certificados SSL..."

# Parar nginx temporariamente
sudo systemctl stop nginx

# Obter certificados SSL
sudo certbot certonly --standalone \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    --non-interactive \
    --agree-tos \
    --email admin@$DOMAIN

# Verificar se certificados foram criados
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ Certificados SSL criados com sucesso"
else
    echo "❌ Falha na criação dos certificados"
    exit 1
fi

# Configurar renovação automática
echo "🔄 Configurando renovação automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Reiniciar nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ SSL configurado com sucesso!"
EOF

success "Configuração SSL concluída"