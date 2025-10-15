import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedContribuicoes() {
  console.log('🌱 Iniciando seed de contribuições...');

  // Seed tipos de contribuição
  const tiposContribuicao = [
    {
      titulo: "Habilidades",
      categoria: "IMIGRANTE",
      contextoIA: "Habilidades profissionais e pessoais de jovens imigrantes buscando integração no mercado português",
      textoModelo: "Tenho experiência em desenvolvimento web com React e Node.js, trabalhei 3 anos em startup de tecnologia...",
      tagsModelo: JSON.stringify(["JavaScript", "React", "Node.js", "Tecnologia", "Startup"]),
      perguntasModelo: "Descreva suas principais habilidades profissionais, experiências anteriores e competências que podem contribuir para o mercado português."
    },
    {
      titulo: "Interesse",
      categoria: "IMIGRANTE",
      contextoIA: "Interesses pessoais e profissionais de jovens imigrantes para melhor integração social",
      textoModelo: "Tenho interesse em trabalhar na área de tecnologia, especialmente em empresas inovadoras. Gosto de participar de eventos culturais e comunitários...",
      tagsModelo: JSON.stringify(["Tecnologia", "Cultura", "Comunidade", "Inovação"]),
      perguntasModelo: "Descreva seus interesses pessoais e profissionais, áreas que gostaria de explorar e atividades que aprecia."
    },
    {
      titulo: "Personalidade",
      categoria: "IMIGRANTE",
      contextoIA: "Características pessoais e traços de personalidade que facilitam a integração social e profissional",
      textoModelo: "Sou uma pessoa comunicativa, adaptável e que gosta de trabalhar em equipe. Tenho facilidade em aprender novas línguas e culturas...",
      tagsModelo: JSON.stringify(["Comunicativo", "Adaptável", "Trabalho em Equipe", "Proativo"]),
      perguntasModelo: "Descreva suas principais características pessoais, pontos fortes e aspectos da sua personalidade."
    },
    {
      titulo: "Oportunidades",
      categoria: "EMPRESA",
      contextoIA: "Oportunidades de emprego, estágios e parcerias oferecidas por empresas para jovens imigrantes",
      textoModelo: "Procuramos desenvolvedor junior para nossa equipe de tecnologia. Oferecemos formação, ambiente multicultural...",
      tagsModelo: JSON.stringify(["Emprego", "Tecnologia", "Junior", "Formação", "Multicultural"]),
      perguntasModelo: "Descreva a oportunidade oferecida, requisitos, benefícios e como os candidatos podem se candidatar."
    },
    {
      titulo: "Cursos",
      categoria: "ACADEMIA",
      contextoIA: "Cursos e programas de formação oferecidos por instituições acadêmicas",
      textoModelo: "Curso de Português para Estrangeiros - 40 horas, certificado reconhecido, turmas de manhã e tarde...",
      tagsModelo: JSON.stringify(["Português", "Formação", "Certificado", "Idiomas"]),
      perguntasModelo: "Descreva o curso oferecido, duração, certificação, horários e como os interessados podem se inscrever."
    },
    {
      titulo: "Eventos",
      categoria: "ACADEMIA",
      contextoIA: "Eventos acadêmicos, workshops e seminários para capacitação",
      textoModelo: "Workshop sobre Empreendedorismo Social - 8 horas, palestrantes internacionais, networking...",
      tagsModelo: JSON.stringify(["Workshop", "Empreendedorismo", "Networking", "Capacitação"]),
      perguntasModelo: "Descreva o evento, data, local, palestrantes e como os interessados podem participar."
    },
    {
      titulo: "Eventos",
      categoria: "MUNICIPIO",
      contextoIA: "Eventos municipais de integração e desenvolvimento local",
      textoModelo: "Feira de Integração Cultural - evento anual com exposições, gastronomia típica e apresentações culturais...",
      tagsModelo: JSON.stringify(["Cultural", "Integração", "Feira", "Comunidade"]),
      perguntasModelo: "Descreva o evento municipal, objetivos, atividades previstas e como a comunidade pode participar."
    },
    {
      titulo: "Notícias",
      categoria: "MUNICIPIO",
      contextoIA: "Notícias e informações relevantes do município para a comunidade imigrante",
      textoModelo: "Novo centro de apoio ao imigrante inaugurado - oferece serviços de documentação, orientação jurídica...",
      tagsModelo: JSON.stringify(["Apoio", "Serviços", "Documentação", "Orientação"]),
      perguntasModelo: "Compartilhe informações relevantes do município que possam interessar à comunidade imigrante."
    },
    {
      titulo: "Suporte",
      categoria: "FAMILIA_ACOLHIMENTO",
      contextoIA: "Tipos de suporte e acolhimento oferecidos por famílias",
      textoModelo: "Oferecemos acolhimento temporário para jovens estudantes, ambiente familiar, apoio nos estudos...",
      tagsModelo: JSON.stringify(["Acolhimento", "Estudantes", "Apoio", "Temporário"]),
      perguntasModelo: "Descreva o tipo de suporte oferecido, duração, condições e como os interessados podem entrar em contato."
    }
  ];

  // Seed tags iniciais
  const tagsIniciais = [
    { nome: "JavaScript", categoria: "Tecnologia", cor: "#f7df1e" },
    { nome: "React", categoria: "Tecnologia", cor: "#61dafb" },
    { nome: "Node.js", categoria: "Tecnologia", cor: "#339933" },
    { nome: "Tecnologia", categoria: "Área", cor: "#0066cc" },
    { nome: "Emprego", categoria: "Oportunidade", cor: "#28a745" },
    { nome: "Formação", categoria: "Educação", cor: "#17a2b8" },
    { nome: "Português", categoria: "Idioma", cor: "#6f42c1" },
    { nome: "Cultural", categoria: "Social", cor: "#fd7e14" },
    { nome: "Apoio", categoria: "Suporte", cor: "#20c997" },
    { nome: "Acolhimento", categoria: "Família", cor: "#e83e8c" }
  ];

  try {
    // Criar tipos de contribuição
    for (const tipo of tiposContribuicao) {
      const existing = await prisma.tipoContribuicao.findFirst({
        where: {
          titulo: tipo.titulo,
          categoria: tipo.categoria
        }
      });

      if (!existing) {
        await prisma.tipoContribuicao.create({
          data: tipo
        });
        console.log(`✅ Tipo criado: ${tipo.titulo} (${tipo.categoria})`);
      } else {
        console.log(`⏭️ Tipo já existe: ${tipo.titulo} (${tipo.categoria})`);
      }
    }

    // Criar tags iniciais
    for (const tag of tagsIniciais) {
      await prisma.tagSistema.upsert({
        where: { nome: tag.nome },
        update: {},
        create: tag
      });
      console.log(`✅ Tag criada: ${tag.nome}`);
    }

    console.log('🎉 Seed de contribuições concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
}

seedContribuicoes()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
