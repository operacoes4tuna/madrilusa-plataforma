import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDadosProfissionais() {
  console.log('🚀 Iniciando seed de dados profissionais...');

  try {
    // Buscar usuário imigrante
    const imigrante = await prisma.user.findUnique({
      where: { email: 'imigrante@madrilusa.com.pt' }
    });

    if (!imigrante) {
      console.log('❌ Usuário imigrante não encontrado');
      return;
    }

    // Verificar se já tem dados profissionais
    const dadosExistentes = await prisma.dadosProfissionaisImigrante.findFirst({
      where: { userId: imigrante.id }
    });

    if (dadosExistentes) {
      console.log('⏭️ Usuário já possui dados profissionais');
      return;
    }

    console.log(`📋 Criando dados profissionais para ${imigrante.nomeCompleto}...`);
    
    // Experiências profissionais
    const experiencias = [
      {
        cargo: "Desenvolvedor Frontend",
        empresa: "Tech Solutions Ltda",
        tempoNoCargo: "2 a 5 anos"
      },
      {
        cargo: "Designer Gráfico",
        empresa: "Creative Studio",
        tempoNoCargo: "1 a 2 anos"
      }
    ];

    // Formações
    const formacoes = [
      {
        nivelEscolaridade: "Licenciatura",
        curso: "Engenharia Informática",
        instituicao: "Universidade de Lisboa",
        dataTermino: "2022-07-15"
      },
      {
        nivelEscolaridade: "Ensino Secundário",
        curso: "",
        instituicao: "Escola Secundária Central",
        dataTermino: "2018-06-20"
      }
    ];

    // Idiomas
    const idiomas = [
      {
        idioma: "Inglês",
        nivel: "Avançado"
      },
      {
        idioma: "Espanhol",
        nivel: "Intermédio"
      },
      {
        idioma: "Francês",
        nivel: "Básico"
      }
    ];

    // Criar experiências
    for (let i = 0; i < experiencias.length; i++) {
      const exp = experiencias[i];
      await prisma.dadosProfissionaisImigrante.create({
        data: {
          userId: imigrante.id,
          tipo: 'experiencia',
          dados: JSON.stringify(exp),
          titulo: `${exp.cargo} na ${exp.empresa}`,
          ordem: i + 1
        }
      });
      console.log(`✅ Experiência criada: ${exp.cargo} na ${exp.empresa}`);
    }

    // Criar formações
    for (let i = 0; i < formacoes.length; i++) {
      const form = formacoes[i];
      const titulo = `${form.curso || form.nivelEscolaridade}${form.instituicao ? ` - ${form.instituicao}` : ''}`;
      await prisma.dadosProfissionaisImigrante.create({
        data: {
          userId: imigrante.id,
          tipo: 'formacao',
          dados: JSON.stringify(form),
          titulo: titulo,
          ordem: i + 1
        }
      });
      console.log(`✅ Formação criada: ${titulo}`);
    }

    // Criar idiomas
    for (let i = 0; i < idiomas.length; i++) {
      const idioma = idiomas[i];
      await prisma.dadosProfissionaisImigrante.create({
        data: {
          userId: imigrante.id,
          tipo: 'idioma',
          dados: JSON.stringify(idioma),
          titulo: `${idioma.idioma} (${idioma.nivel})`,
          ordem: i + 1
        }
      });
      console.log(`✅ Idioma criado: ${idioma.idioma} (${idioma.nivel})`);
    }

    console.log(`🎉 Dados profissionais criados com sucesso!`);
    console.log(`📊 Total: ${experiencias.length} experiências, ${formacoes.length} formações, ${idiomas.length} idiomas`);

  } catch (error) {
    console.error('❌ Erro ao criar dados profissionais:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDadosProfissionais()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
