#!/bin/bash

# 🔧 SCRIPT DE SETUP INICIAL DO SERVIDOR DIGITAL OCEAN
# Prepara o servidor Ubuntu para receber a aplicação Madrilusa

set -e  # Exit on any error

# ===========================
# CONFIGURAÇÕES
# ===========================
REMOTE_HOST="167.99.203.215"
SSH_KEY="env/digital-ocean-tuninho-a4tunados"
NEW_USER="madrilusa"
APP_PATH="/home/madrilusa/madrilusa"

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
# VALIDAÇÕES
# ===========================
log "Iniciando setup do servidor Digital Ocean..."

# Verificar se a chave SSH existe
if [ ! -f "$SSH_KEY" ]; then
    error "Chave SSH não encontrada: $SSH_KEY"
fi

success "Validações concluídas"

# ===========================
# SETUP DO SERVIDOR
# ===========================
log "Conectando ao servidor e executando setup inicial..."

ssh -i $SSH_KEY root@$REMOTE_HOST << 'EOF'
set -e

echo "🔧 Iniciando configuração do servidor Ubuntu..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências básicas
echo "📦 Instalando dependências básicas..."
apt install -y curl wget git htop nano unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Instalar Node.js 18 LTS
echo "📦 Instalando Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verificar instalação do Node.js
node_version=$(node --version)
npm_version=$(npm --version)
echo "✅ Node.js instalado: $node_version"
echo "✅ npm instalado: $npm_version"

# Instalar Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io

# Instalar Docker Compose
echo "🐳 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalação do Docker
docker_version=$(docker --version)
compose_version=$(docker-compose --version)
echo "✅ Docker instalado: $docker_version"
echo "✅ Docker Compose instalado: $compose_version"

# Instalar nginx
echo "🌐 Instalando nginx..."
apt install -y nginx

# Instalar certbot para SSL
echo "🔒 Instalando certbot para SSL..."
apt install -y certbot python3-certbot-nginx

# Configurar firewall
echo "🛡️ Configurando firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status

# Criar usuário madrilusa
echo "👤 Criando usuário madrilusa..."
if ! id "madrilusa" &>/dev/null; then
    useradd -m -s /bin/bash madrilusa
    echo "✅ Usuário madrilusa criado"
else
    echo "⚠️ Usuário madrilusa já existe"
fi

# Adicionar usuário aos grupos necessários
usermod -aG docker madrilusa
usermod -aG sudo madrilusa

# Configurar chaves SSH para o usuário madrilusa
echo "🔑 Configurando chaves SSH para usuário madrilusa..."
mkdir -p /home/madrilusa/.ssh
cp /root/.ssh/authorized_keys /home/madrilusa/.ssh/authorized_keys
chown -R madrilusa:madrilusa /home/madrilusa/.ssh
chmod 700 /home/madrilusa/.ssh
chmod 600 /home/madrilusa/.ssh/authorized_keys

# Criar estrutura de diretórios para a aplicação
echo "📁 Criando estrutura de diretórios..."
mkdir -p /home/madrilusa/madrilusa/data
mkdir -p /home/madrilusa/madrilusa/logs
mkdir -p /home/madrilusa/madrilusa/backups
mkdir -p /home/madrilusa/madrilusa/ssl
chown -R madrilusa:madrilusa /home/madrilusa/madrilusa

# Configurar logrotate para logs da aplicação
echo "📋 Configurando rotação de logs..."
cat > /etc/logrotate.d/madrilusa << 'LOGROTATE_EOF'
/home/madrilusa/madrilusa/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    copytruncate
    su madrilusa madrilusa
}
LOGROTATE_EOF

# Configurar backup automático do banco de dados
echo "💾 Configurando backup automático..."
crontab -u madrilusa -l 2>/dev/null | { cat; echo "0 2 * * * cp /home/madrilusa/madrilusa/data/prod.db /home/madrilusa/madrilusa/backups/backup-\$(date +\%Y\%m\%d).db"; } | crontab -u madrilusa -

# Configurar limpeza automática de backups antigos (manter apenas 30 dias)
crontab -u madrilusa -l 2>/dev/null | { cat; echo "0 3 * * * find /home/madrilusa/madrilusa/backups -name 'backup-*.db' -mtime +30 -delete"; } | crontab -u madrilusa -

# Instalar utilitários de monitoramento
echo "📊 Instalando utilitários de monitoramento..."
apt install -y htop iotop nethogs ncdu

echo "✅ Setup do servidor concluído com sucesso!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO DA INSTALAÇÃO:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "• Sistema: Ubuntu atualizado"
echo "• Node.js: $node_version"
echo "• Docker: $docker_version"
echo "• Docker Compose: $compose_version"
echo "• nginx: Instalado"
echo "• Certbot: Instalado para SSL"
echo "• Usuário: madrilusa criado"
echo "• Firewall: Configurado"
echo "• Backups: Automatizados (diário às 2h)"
echo "• Logs: Rotação configurada"
echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "• Execute: ./scripts/deploy.sh"
echo "• Configure DNS para apontar para este servidor"
echo "• Configure SSL: certbot --nginx -d seudominio.com"
echo ""
EOF

success "Setup do servidor concluído"

# ===========================
# VERIFICAÇÕES PÓS-SETUP
# ===========================
log "Executando verificações pós-setup..."

# Testar conexão com o usuário madrilusa
log "Testando conexão com usuário madrilusa..."
if ssh -i $SSH_KEY madrilusa@$REMOTE_HOST "echo 'Conexão com usuário madrilusa OK'" 2>/dev/null; then
    success "Usuário madrilusa configurado corretamente"
else
    warning "Problema na configuração do usuário madrilusa"
fi

# Verificar se Docker está funcionando
log "Verificando Docker..."
if ssh -i $SSH_KEY madrilusa@$REMOTE_HOST "docker --version" 2>/dev/null; then
    success "Docker configurado corretamente"
else
    warning "Problema na configuração do Docker"
fi

# ===========================
# SCRIPT DE MONITORAMENTO
# ===========================
log "Criando script de monitoramento..."

ssh -i $SSH_KEY madrilusa@$REMOTE_HOST << 'EOF'
cat > /home/madrilusa/madrilusa/monitor.sh << 'MONITOR_EOF'
#!/bin/bash

echo "🖥️  MONITORAMENTO SERVIDOR MADRILUSA"
echo "===================================="
echo ""

echo "📊 STATUS DOS CONTAINERS:"
docker-compose ps 2>/dev/null || echo "Docker Compose não iniciado"
echo ""

echo "💾 USO DE DISCO:"
df -h
echo ""

echo "🧠 USO DE MEMÓRIA:"
free -h
echo ""

echo "🔄 PROCESSOS DOCKER:"
docker stats --no-stream 2>/dev/null || echo "Nenhum container rodando"
echo ""

echo "📋 ÚLTIMAS 10 LINHAS DOS LOGS:"
if [ -f "logs/madrilusa-backend.log" ]; then
    tail -10 logs/madrilusa-backend.log
else
    echo "Log do backend não encontrado"
fi
echo ""

echo "🌐 CONECTIVIDADE:"
curl -s -o /dev/null -w "Backend: %{http_code}\n" http://localhost:3001/health || echo "Backend: Offline"
curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:8080/health || echo "Frontend: Offline"
MONITOR_EOF

chmod +x /home/madrilusa/madrilusa/monitor.sh
EOF

success "Script de monitoramento criado"

# ===========================
# RESUMO FINAL
# ===========================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
success "🎉 SETUP INICIAL CONCLUÍDO COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📊 Servidor Preparado:${NC}"
echo "• IP: $REMOTE_HOST"
echo "• Usuário: $NEW_USER"
echo "• Caminho da app: $APP_PATH"
echo ""
echo -e "${BLUE}🛠️ Ferramentas Instaladas:${NC}"
echo "• Node.js 18 LTS + npm"
echo "• Docker + Docker Compose"
echo "• nginx + certbot"
echo "• Ferramentas de monitoramento"
echo ""
echo -e "${BLUE}🔧 Configurações Automáticas:${NC}"
echo "• Backup diário do banco (2h da manhã)"
echo "• Rotação de logs (14 dias)"
echo "• Firewall configurado"
echo "• Usuário com permissões Docker"
echo ""
echo -e "${BLUE}📋 Próximos Passos:${NC}"
echo "1. Execute: ./scripts/deploy.sh"
echo "2. Configure seu domínio para apontar para $REMOTE_HOST"
echo "3. Configure SSL: certbot --nginx -d seudominio.com"
echo ""
echo -e "${BLUE}🔍 Comandos Úteis:${NC}"
echo "• Monitorar: ssh -i $SSH_KEY $NEW_USER@$REMOTE_HOST './madrilusa/monitor.sh'"
echo "• Logs: ssh -i $SSH_KEY $NEW_USER@$REMOTE_HOST 'cd madrilusa && docker-compose logs -f'"
echo "• Status: ssh -i $SSH_KEY $NEW_USER@$REMOTE_HOST 'cd madrilusa && docker-compose ps'"
echo ""
success "Servidor pronto para receber a aplicação Madrilusa! 🚀"