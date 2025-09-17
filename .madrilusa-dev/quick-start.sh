#!/bin/bash

# 🚀 MADRILUSA - SETUP AUTOMATIZADO PARA DESENVOLVIMENTO
# Script para configuração rápida do projeto sem fricção

echo "🚀 Configurando Madrilusa para desenvolvimento..."
echo "=================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
  echo "❌ Execute este script a partir da raiz do projeto Madrilusa!"
  exit 1
fi

# Verificar se backend existe
if [ ! -d "backend" ]; then
  echo "❌ Pasta backend não encontrada!"
  exit 1
fi

echo "📦 Instalando dependências do frontend..."
npm install --legacy-peer-deps

echo "📦 Instalando dependências do backend..."
cd backend
npm install

echo "🔧 Configurando arquivo de ambiente..."
if [ -f "../.madrilusa-dev/.env.development" ]; then
  cp "../.madrilusa-dev/.env.development" ".env"
  echo "✅ Arquivo .env configurado"
else
  echo "⚠️  Arquivo .env.development não encontrado, usando template..."
  cp "../.madrilusa-dev/.env.template" ".env"
  echo "❗ ATENÇÃO: Configure sua chave OpenAI no arquivo backend/.env"
fi

echo "🗄️ Configurando banco de dados..."
if [ -f "../.madrilusa-dev/dev-seed.db" ]; then
  cp "../.madrilusa-dev/dev-seed.db" "dev.db"
  cp "../.madrilusa-dev/dev-seed.db" "prisma/dev.db"
  echo "✅ Banco de dados configurado com dados de desenvolvimento"
else
  echo "⚠️  Banco seed não encontrado, será necessário popular manualmente"
fi

echo "⚡ Gerando Prisma Client..."
npx prisma generate

echo ""
echo "✅ SETUP CONCLUÍDO COM SUCESSO!"
echo "================================"
echo ""
echo "🎯 Para iniciar o projeto:"
echo "   npm run dev:full"
echo ""
echo "🌐 URLs disponíveis:"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:3001"
echo "   Prisma:   http://localhost:5555 (npm run db:studio)"
echo ""
echo "🔐 Login de teste:"
echo "   Admin: admin@madrilusa.com.pt / vcgvcg"
echo ""

cd ..
echo "🚀 Execute agora: npm run dev:full"