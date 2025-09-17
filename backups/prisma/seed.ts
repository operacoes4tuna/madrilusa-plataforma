import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log('🛡️ Criando usuário administrador...');
  
  try {
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@madrilusa.com' },
      update: {
        // Se já existe, atualiza dados para garantir categoria ADMIN
        senha: 'madrilusa1234tuna',
        categoria: 'ADMIN',
        nomeCompleto: 'Administrador Madrilusa'
      },
      create: {
        nomeCompleto: 'Administrador Madrilusa',
        email: 'admin@madrilusa.com',
        senha: 'madrilusa1234tuna', // Sem hash por simplicidade
        categoria: 'ADMIN',
        telemovel: null,
        foto: null
      }
    });

    console.log('✅ Usuário admin criado/atualizado com sucesso:');
    console.log(`   📧 Email: ${adminUser.email}`);
    console.log(`   🔐 Senha: madrilusa1234tuna`);
    console.log(`   🏷️ Categoria: ${adminUser.categoria}`);
    console.log(`   📅 Criado em: ${adminUser.createdAt}`);
    
    return adminUser;
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
    throw error;
  }
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');
  
  try {
    // Criar usuário admin
    await createAdminUser();
    
    console.log('🎉 Seed concluído com sucesso!');
    console.log('');
    console.log('🚀 Sistema pronto para uso:');
    console.log('   Frontend: http://localhost:8080');
    console.log('   Backend: http://localhost:3001');
    console.log('   Admin: admin@madrilusa.com / madrilusa1234tuna');
    
  } catch (error) {
    console.error('💥 Erro durante o seed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('💥 Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Conexão com banco de dados encerrada');
  }); 