#!/usr/bin/env node

// 🛡️ MADRILUSA - SCRIPT DE BACKUP AUTOMATIZADO
// Cria backup dos arquivos críticos para desenvolvimento

const fs = require('fs');
const path = require('path');

function createTimestamp() {
  const now = new Date();
  return now.toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/:/g, '');
}

function createBackup() {
  console.log('🛡️  Criando backup do estado atual...');

  const timestamp = createTimestamp();
  const backupDir = `backups/backup_${timestamp}_manual`;

  // Criar diretório de backup
  if (!fs.existsSync('backups')) {
    fs.mkdirSync('backups');
  }

  try {
    // Backup do .env
    if (fs.existsSync('backend/.env')) {
      fs.copyFileSync('backend/.env', `backups/.env_${timestamp}`);
      console.log(`✅ .env backup criado: .env_${timestamp}`);
    }

    // Backup do banco principal
    if (fs.existsSync('backend/dev.db')) {
      fs.copyFileSync('backend/dev.db', `backups/dev_${timestamp}.db`);
      console.log(`✅ Database backup criado: dev_${timestamp}.db`);
    }

    // Backup do banco Prisma
    if (fs.existsSync('backend/prisma/dev.db')) {
      fs.copyFileSync('backend/prisma/dev.db', `backups/prisma_dev_${timestamp}.db`);
      console.log(`✅ Prisma database backup criado: prisma_dev_${timestamp}.db`);
    }

    console.log('');
    console.log('✅ BACKUP CONCLUÍDO COM SUCESSO!');
    console.log('================================');
    console.log(`📁 Arquivos salvos em: backups/`);
    console.log(`🕐 Timestamp: ${timestamp}`);

  } catch (error) {
    console.error('❌ Erro ao criar backup:', error.message);
    process.exit(1);
  }
}

// Verificar se estamos no diretório correto
if (!fs.existsSync('package.json') || !fs.existsSync('backend')) {
  console.error('❌ Execute este script a partir da raiz do projeto Madrilusa!');
  process.exit(1);
}

createBackup();