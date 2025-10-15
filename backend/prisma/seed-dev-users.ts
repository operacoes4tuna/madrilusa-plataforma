import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDevUsers() {
  console.log('🚀 Iniciando criação de usuários de desenvolvimento...');

  const devUsers = [
    {
      user: {
        nomeCompleto: "Empresa de Desenvolvimento",
        email: "empresa@madrilusa.com.pt",
        senha: "vcgvcg",
        categoria: "EMPRESA",
        telemovel: "+351 912 345 678"
      },
      perfil: {
        nomeEmpresa: "Tech Solutions Madrilusa",
        pessoaContacto: "João Silva",
        morada: "Rua da Inovação, 123, Lisboa",
        observacoes: "Empresa de tecnologia focada em inovação social e integração de jovens imigrantes"
      },
      contribuicoes: [
        {
          tipo: "Oportunidades",
          descricao: "Desenvolvedor Frontend React - Posição junior para jovem talento com experiência em React e TypeScript. Oferecemos formação contínua, ambiente multicultural e oportunidade de crescimento.",
          tags: ["React", "JavaScript", "Frontend", "Junior", "Formação"]
        },
        {
          tipo: "Oportunidades", 
          descricao: "Estágio em UX/UI Design - Programa de estágio de 6 meses para design de interfaces. Mentoria especializada, projetos reais e possibilidade de contratação.",
          tags: ["Design", "UX/UI", "Estágio", "Mentoria", "Criatividade"]
        }
      ]
    },
    {
      user: {
        nomeCompleto: "Imigrante de Desenvolvimento",
        email: "imigrante@madrilusa.com.pt", 
        senha: "vcgvcg",
        categoria: "IMIGRANTE",
        telemovel: "+351 913 456 789"
      },
      perfil: {
        nacionalidade: "Brasileira",
        dataNascimento: new Date('1995-06-15'),
        objetivos: JSON.stringify(["Emprego", "Formação"]),
        mensagem: "Busco oportunidades de integração profissional em Portugal. Tenho formação em tecnologia e experiência internacional.",
        aceitaNotificacoes: true,
        
        // ✨ NOVOS CAMPOS - Informações Adicionais
        genero: "M",
        municipioResidencia: "Lisboa",
        transporteProprio: true,
        possibilidadeMudancaMorada: true,
        fluenciaPortugues: "Intermediária"
      },
      contribuicoes: [
        {
          tipo: "Habilidades",
          descricao: "Desenvolvedor Full-Stack com 4 anos de experiência em React, Node.js e Python. Especialista em APIs REST, bancos de dados e metodologias ágeis. Experiência em startups de fintech.",
          tags: ["React", "Node.js", "Python", "Full-Stack", "APIs", "Fintech"]
        },
        {
          tipo: "Habilidades",
          descricao: "Designer UX/UI com portfólio internacional. Experiência em Figma, Adobe Creative Suite e prototipagem. Especialista em design thinking e pesquisa de usuário.",
          tags: ["Design", "UX/UI", "Figma", "Adobe", "Design Thinking", "Prototipagem"]
        }
      ]
    },
    {
      user: {
        nomeCompleto: "Município de Desenvolvimento",
        email: "municipio@madrilusa.com.pt",
        senha: "vcgvcg", 
        categoria: "MUNICIPIO",
        telemovel: "+351 914 567 890"
      },
      perfil: {
        nomeMunicipio: "Município de Inovação",
        distrito: "Lisboa",
        pessoaContacto: "Maria Santos",
        funcaoCargo: "Vereadora de Desenvolvimento Social",
        projetosApoio: "CLAIM, CLDS+, Portugal 2030",
        disponibilidadeAcoes: "Disponível para acolher ações de integração e eventos culturais",
        observacoes: "Município comprometido com a integração de jovens imigrantes e desenvolvimento sustentável"
      },
      contribuicoes: [
        {
          tipo: "Eventos",
          descricao: "Festival Multicultural de Verão - Evento anual que celebra a diversidade cultural com música, gastronomia e artesanato dos países da CPLP. Entrada gratuita, apoio a empreendedores locais.",
          tags: ["Festival", "Multicultural", "CPLP", "Gastronomia", "Empreendedorismo"]
        },
        {
          tipo: "Notícias",
          descricao: "Novo Centro de Apoio ao Imigrante inaugurado no centro da cidade. Oferece serviços de documentação, orientação jurídica, cursos de português e apoio na procura de emprego.",
          tags: ["Centro Apoio", "Documentação", "Português", "Emprego", "Orientação"]
        }
      ]
    },
    {
      user: {
        nomeCompleto: "Academia de Desenvolvimento",
        email: "academia@madrilusa.com.pt",
        senha: "vcgvcg",
        categoria: "ACADEMIA", 
        telemovel: "+351 915 678 901"
      },
      perfil: {
        nomeAcademia: "Instituto de Formação Madrilusa",
        tipoAcademia: "Centro de Formação Profissional",
        regiao: "Região Norte",
        pessoaContacto: "Prof. Carlos Oliveira",
        emailInstitucional: "formacao@madrilusa.edu.pt",
        telefone: "+351 220 123 456",
        ofertaFormativa: "Cursos de Português, Tecnologia, Empreendedorismo e Integração Cultural",
        website: "https://formacao.madrilusa.pt",
        observacoes: "Especializado em formação para jovens imigrantes com metodologias inovadoras"
      },
      contribuicoes: [
        {
          tipo: "Cursos",
          descricao: "Curso de Português para Estrangeiros - Níveis A1 a C2, certificado pelo Instituto Camões. 120 horas, turmas flexíveis, metodologia comunicativa focada na integração profissional.",
          tags: ["Português", "Certificado", "Instituto Camões", "Integração", "Profissional"]
        },
        {
          tipo: "Eventos",
          descricao: "Workshop de Empreendedorismo Social - 16 horas de formação intensiva sobre criação de negócios de impacto social. Mentoria com empreendedores de sucesso.",
          tags: ["Empreendedorismo", "Social", "Workshop", "Mentoria", "Negócios"]
        }
      ]
    },
    {
      user: {
        nomeCompleto: "Família de Desenvolvimento",
        email: "familia@madrilusa.com.pt",
        senha: "vcgvcg",
        categoria: "FAMILIA_ACOLHIMENTO",
        telemovel: "+351 916 789 012"
      },
      perfil: {
        moradaCompleta: "Rua das Flores, 45, Freguesia de São João, Concelho de Vila Nova",
        quantidadePessoas: "2 adultos + 1 adolescente",
        tiposAcolhimento: JSON.stringify(["Temporário", "Estudantes", "Jovens Profissionais"]),
        duracaoAcolhimento: JSON.stringify(["3-6 meses", "6-12 meses"]),
        observacoes: "Família experiente em acolhimento, ambiente acolhedor, apoio nos estudos e integração cultural"
      },
      contribuicoes: [
        {
          tipo: "Suporte",
          descricao: "Acolhimento familiar para estudantes universitários - Quarto individual, refeições incluídas, ambiente familiar português autêntico. Apoio na adaptação cultural e nos estudos.",
          tags: ["Acolhimento", "Universitários", "Familiar", "Cultural", "Estudos"]
        }
      ]
    }
  ];

  try {
    for (const userData of devUsers) {
      // Verificar se usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.user.email }
      });

      if (existingUser) {
        console.log(`⏭️ Usuário já existe: ${userData.user.email}`);
        continue;
      }

      // Criar usuário
      const user = await prisma.user.create({
        data: userData.user
      });
      console.log(`✅ Usuário criado: ${user.email} (${user.categoria})`);

      // Criar perfil específico baseado na categoria
      switch (user.categoria) {
        case 'EMPRESA':
          await prisma.perfilEmpresa.create({
            data: {
              userId: user.id,
              ...userData.perfil
            }
          });
          console.log(`  📋 Perfil empresa criado`);
          break;

        case 'IMIGRANTE':
          await prisma.perfilImigrante.create({
            data: {
              userId: user.id,
              ...userData.perfil
            }
          });
          console.log(`  📋 Perfil imigrante criado`);
          break;

        case 'MUNICIPIO':
          await prisma.perfilMunicipio.create({
            data: {
              userId: user.id,
              ...userData.perfil
            }
          });
          console.log(`  📋 Perfil município criado`);
          break;

        case 'ACADEMIA':
          await prisma.perfilAcademia.create({
            data: {
              userId: user.id,
              ...userData.perfil
            }
          });
          console.log(`  📋 Perfil academia criado`);
          break;

        case 'FAMILIA_ACOLHIMENTO':
          await prisma.perfilFamilia.create({
            data: {
              userId: user.id,
              ...userData.perfil
            }
          });
          console.log(`  📋 Perfil família criado`);
          break;
      }

      // Criar contribuições de exemplo
      for (const contrib of userData.contribuicoes) {
        // Buscar tipo de contribuição
        const tipoContribuicao = await prisma.tipoContribuicao.findFirst({
          where: {
            titulo: contrib.tipo,
            categoria: user.categoria
          }
        });

        if (tipoContribuicao) {
          await prisma.contribuicao.create({
            data: {
              userId: user.id,
              tipoContribuicaoId: tipoContribuicao.id,
              descricao: contrib.descricao,
              tags: JSON.stringify(contrib.tags)
            }
          });
          console.log(`  💡 Contribuição criada: ${contrib.tipo}`);

          // Incrementar uso das tags
          for (const tagName of contrib.tags) {
            await prisma.tagSistema.upsert({
              where: { nome: tagName },
              update: { usos: { increment: 1 } },
              create: {
                nome: tagName,
                usos: 1,
                categoria: getTagCategory(tagName)
              }
            });
          }
        }
      }

      // ✨ NOVO: Adicionar dados profissionais para imigrantes
      if (user.categoria === 'IMIGRANTE') {
        console.log(`📋 Criando dados profissionais para ${user.nomeCompleto}...`);
        
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
              userId: user.id,
              tipo: 'experiencia',
              dados: JSON.stringify(exp),
              titulo: `${exp.cargo} na ${exp.empresa}`,
              ordem: i + 1
            }
          });
        }

        // Criar formações
        for (let i = 0; i < formacoes.length; i++) {
          const form = formacoes[i];
          await prisma.dadosProfissionaisImigrante.create({
            data: {
              userId: user.id,
              tipo: 'formacao',
              dados: JSON.stringify(form),
              titulo: `${form.curso || form.nivelEscolaridade}${form.instituicao ? ` - ${form.instituicao}` : ''}`,
              ordem: i + 1
            }
          });
        }

        // Criar idiomas
        for (let i = 0; i < idiomas.length; i++) {
          const idioma = idiomas[i];
          await prisma.dadosProfissionaisImigrante.create({
            data: {
              userId: user.id,
              tipo: 'idioma',
              dados: JSON.stringify(idioma),
              titulo: `${idioma.idioma} (${idioma.nivel})`,
              ordem: i + 1
            }
          });
        }

        console.log(`✨ ${experiencias.length} experiências, ${formacoes.length} formações e ${idiomas.length} idiomas criados!`);
      }

      console.log(`🎉 Usuário ${user.categoria} configurado completamente!\n`);
    }

    console.log('✅ Todos os usuários de desenvolvimento foram criados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar usuários de desenvolvimento:', error);
    throw error;
  }
}

function getTagCategory(tagName: string): string {
  const categories: Record<string, string> = {
    'React': 'Tecnologia',
    'JavaScript': 'Tecnologia', 
    'Node.js': 'Tecnologia',
    'Python': 'Tecnologia',
    'Design': 'Criatividade',
    'UX/UI': 'Criatividade',
    'Figma': 'Ferramenta',
    'Adobe': 'Ferramenta',
    'Emprego': 'Oportunidade',
    'Formação': 'Educação',
    'Português': 'Idioma',
    'Cultural': 'Social',
    'Festival': 'Evento',
    'Acolhimento': 'Suporte'
  };
  return categories[tagName] || 'Geral';
}

createDevUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
