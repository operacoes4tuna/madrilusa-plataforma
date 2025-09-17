import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOportunidadesTrabalho() {
  console.log('🚀 Iniciando seed de oportunidades de trabalho...');

  try {
    // Buscar usuário empresa
    const empresa = await prisma.user.findUnique({
      where: { email: 'empresa@madrilusa.com.pt' }
    });

    if (!empresa) {
      console.log('❌ Usuário empresa não encontrado');
      return;
    }

    // Verificar se já tem oportunidades
    const oportunidadesExistentes = await prisma.oportunidadeTrabalho.findFirst({
      where: { userId: empresa.id }
    });

    if (oportunidadesExistentes) {
      console.log('⏭️ Empresa já possui oportunidades de trabalho');
      return;
    }

    console.log(`💼 Criando oportunidades de trabalho para ${empresa.nomeCompleto}...`);
    
    // Oportunidade 1: Desenvolvedor Frontend
    const oportunidade1 = {
      titulo: "Desenvolvedor Frontend - React",
      nomeCargo: "Desenvolvedor Frontend",
      nomeProfissao: "Programador",
      descricaoCargo: "Desenvolvimento de interfaces web modernas usando React, TypeScript e tecnologias atuais. Trabalho em equipa jovem e dinâmica.",
      
      // Critérios
      genero: "INDIFERENTE",
      idade: "18-35 anos",
      municipioResidencia: "Lisboa",
      transporteProprio: "S",
      fluenciaPortugues: "S",
      
      // Denominações
      denominacoes: JSON.stringify([
        "Frontend Developer", 
        "Programador Web", 
        "Desenvolvedor de Interfaces",
        "React Developer"
      ]),
      
      // Experiências aceitas
      experienciasAceitas: JSON.stringify([
        "Desenvolvimento web",
        "React ou Angular",
        "JavaScript/TypeScript",
        "Projetos pessoais de programação"
      ]),
      
      // Formação
      nivelEscolaridade: "Licenciatura",
      areasFormacao: JSON.stringify([
        "Engenharia Informática",
        "Ciências da Computação", 
        "Sistemas de Informação",
        "Desenvolvimento Web"
      ]),
      
      // Idiomas
      idiomasPreferenciais: JSON.stringify([
        { idioma: "Português", nivel: "Avançado" },
        { idioma: "Inglês", nivel: "Intermédio" }
      ]),
      
      // Habilidades
      habilidades: JSON.stringify([
        "React",
        "TypeScript", 
        "CSS/SCSS",
        "Git",
        "Trabalho em equipa"
      ]),
      
      // Características
      caracteristicas: JSON.stringify([
        "Proativo",
        "Criativo",
        "Comunicativo",
        "Orientado para resultados"
      ])
    };

    // Oportunidade 2: Designer Gráfico
    const oportunidade2 = {
      titulo: "Designer Gráfico - Marketing Digital",
      nomeCargo: "Designer Gráfico",
      nomeProfissao: "Designer",
      descricaoCargo: "Criação de materiais visuais para campanhas de marketing digital, redes sociais e comunicação empresarial.",
      
      // Critérios
      genero: "INDIFERENTE",
      idade: "20-40 anos", 
      municipioResidencia: "Lisboa",
      transporteProprio: "INDIFERENTE",
      fluenciaPortugues: "S",
      
      // Denominações
      denominacoes: JSON.stringify([
        "Graphic Designer",
        "Designer Visual",
        "Designer de Comunicação",
        "Criativo Publicitário"
      ]),
      
      // Experiências aceitas
      experienciasAceitas: JSON.stringify([
        "Design gráfico",
        "Marketing digital",
        "Redes sociais",
        "Adobe Creative Suite",
        "Projetos freelance de design"
      ]),
      
      // Formação
      nivelEscolaridade: "Ensino Secundário",
      areasFormacao: JSON.stringify([
        "Design",
        "Comunicação Visual",
        "Marketing",
        "Artes Visuais",
        "Multimedia"
      ]),
      
      // Idiomas
      idiomasPreferenciais: JSON.stringify([
        { idioma: "Português", nivel: "Avançado" },
        { idioma: "Inglês", nivel: "Básico" }
      ]),
      
      // Habilidades
      habilidades: JSON.stringify([
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Figma",
        "Criatividade",
        "Gestão de redes sociais"
      ]),
      
      // Características
      caracteristicas: JSON.stringify([
        "Criativo",
        "Organizado", 
        "Atento aos detalhes",
        "Flexível"
      ])
    };

    // Criar oportunidades
    const oportunidadeCriada1 = await prisma.oportunidadeTrabalho.create({
      data: {
        userId: empresa.id,
        ...oportunidade1
      }
    });

    const oportunidadeCriada2 = await prisma.oportunidadeTrabalho.create({
      data: {
        userId: empresa.id,
        ...oportunidade2
      }
    });

    console.log(`✅ Oportunidade criada: ${oportunidadeCriada1.titulo}`);
    console.log(`✅ Oportunidade criada: ${oportunidadeCriada2.titulo}`);

    console.log(`🎉 Oportunidades de trabalho criadas com sucesso!`);
    console.log(`📊 Total: 2 oportunidades para ${empresa.nomeCompleto}`);

  } catch (error) {
    console.error('❌ Erro ao criar oportunidades de trabalho:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedOportunidadesTrabalho()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
