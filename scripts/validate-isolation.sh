#!/bin/bash

# 🔒 Script de Validação de Isolamento - Madrilusa
# Garante que home institucional e plataforma permanecem isoladas

echo "🔍 Iniciando validação de isolamento..."
echo ""

# Contadores
errors=0
warnings=0

# Cores para output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Função para erro
error() {
    echo -e "${RED}❌ ERRO:${NC} $1"
    ((errors++))
}

# Função para warning
warning() {
    echo -e "${YELLOW}⚠️  AVISO:${NC} $1"
    ((warnings++))
}

# Função para sucesso
success() {
    echo -e "${GREEN}✅${NC} $1"
}

echo "📋 Verificação 1: Imports reversos (plataforma importando institucional)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if grep -r "from.*institutional\|import.*institutional" src/app/ src/modules/ 2>/dev/null; then
    error "Plataforma está importando componentes institucionais!"
    echo "   Arquivos da plataforma NÃO devem importar de /src/institutional/"
else
    success "Nenhum import reverso detectado"
fi
echo ""

echo "📋 Verificação 2: Uso de componentes UI compartilhados na home"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
shared_ui_count=$(grep -r "@/components/ui" src/institutional/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$shared_ui_count" -gt 0 ]; then
    warning "Home institucional usa $shared_ui_count imports de componentes UI compartilhados"
    echo "   Recomendado: Migrar para /src/institutional/components/ui/"
    grep -r "@/components/ui" src/institutional/ 2>/dev/null | head -5
    if [ "$shared_ui_count" -gt 5 ]; then
        echo "   ... e mais $((shared_ui_count - 5)) ocorrências"
    fi
else
    success "Home usa apenas componentes UI isolados"
fi
echo ""

echo "📋 Verificação 3: Uso de estilos institutional na plataforma"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if grep -r "institutional-theme\.css\|institutional-layout\|institutional-button\|institutional-card" src/app/ 2>/dev/null; then
    error "Plataforma está usando estilos institucionais!"
    echo "   Arquivos da plataforma NÃO devem usar classes .institutional-*"
else
    success "Estilos institucionais isolados"
fi
echo ""

echo "📋 Verificação 4: Assets compartilhados sendo usados incorretamente"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
institutional_using_shared=$(grep -r "/logo_madrilusa/" src/institutional/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$institutional_using_shared" -gt 0 ]; then
    warning "Home institucional usa $institutional_using_shared referências a assets compartilhados"
    echo "   Recomendado: Usar /public/institutional-assets/"
    grep -r "/logo_madrilusa/" src/institutional/ 2>/dev/null
else
    success "Home usa apenas assets isolados"
fi
echo ""

echo "📋 Verificação 5: Estrutura de diretórios de isolamento"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "src/institutional/components/ui" ]; then
    success "Diretório de componentes UI isolados existe"
else
    warning "Diretório src/institutional/components/ui não encontrado"
    echo "   Execute: mkdir -p src/institutional/components/ui"
fi

if [ -d "public/institutional-assets" ]; then
    success "Diretório de assets isolados existe"
else
    warning "Diretório public/institutional-assets não encontrado"
    echo "   Execute: mkdir -p public/institutional-assets"
fi
echo ""

echo "📋 Verificação 6: Componentes shared sendo editados"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "src/shared/components" ]; then
    shared_components=$(ls -1 src/shared/components/ 2>/dev/null | wc -l | tr -d ' ')
    success "Diretório shared possui $shared_components componente(s)"
    echo "   ⚠️  Lembre-se: componentes shared são usados por toda a aplicação"
    echo "   Chatbot.tsx é compartilhado - editar com MUITO cuidado!"
else
    success "Nenhum componente shared encontrado"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO DA VALIDAÇÃO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ ISOLAMENTO PERFEITO!${NC}"
    echo "   Nenhum problema detectado. Home e plataforma estão completamente isoladas."
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  ISOLAMENTO OK COM AVISOS${NC}"
    echo "   $warnings aviso(s) encontrado(s)"
    echo "   Recomenda-se corrigir para isolamento total"
    exit 0
else
    echo -e "${RED}❌ ISOLAMENTO COMPROMETIDO!${NC}"
    echo "   $errors erro(s) crítico(s)"
    echo "   $warnings aviso(s)"
    echo "   CORRIJA IMEDIATAMENTE para evitar efeitos colaterais!"
    exit 1
fi
