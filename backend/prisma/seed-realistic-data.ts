import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Usuários a preservar (desenvolvimento)
const PRESERVE_EMAILS = [
  'admin@madrilusa.com.pt',
  'admin@madrilusa.com',
  'imigrante@madrilusa.com.pt',
  'empresa@madrilusa.com.pt',
  'municipio@madrilusa.com.pt',
  'academia@madrilusa.com.pt',
  'familia@madrilusa.com.pt'
];

// Dados realistas para imigrantes CPLP
const NOVOS_IMIGRANTES = [
  {
    nomeCompleto: "Maria Santos",
    email: "maria.santos@gmail.com",
    telemovel: "+351 912 345 678",
    categoria: "IMIGRANTE",
    perfil: {
      nacionalidade: "Brasileira",
      dataNascimento: new Date("1995-03-15"),
      objetivos: ["Emprego", "Formação"],
      aceitaNotificacoes: true
    },
    contribuicoes: [
      {
        tipo: "Habilidades",
        descricao: "Tenho 8 anos de experiência em gastronomia brasileira tradicional, especializada em doces regionais e conservas artesanais. Conheço técnicas de fermentação natural, produção de queijos caseiros e pratos típicos do nordeste brasileiro. Gostaria de aplicar estes conhecimentos em quintas turísticas ou restaurantes regionais portugueses, criando fusões entre a culinária brasileira e portuguesa que valorizem ambas as tradições.",
        tags: ["Gastronomia Brasileira", "Doces Tradicionais", "Conservas", "Fermentação", "Queijos", "Quintas Turísticas", "Fusão Culinária", "Nordeste", "Restaurantes"]
      },
      {
        tipo: "Interesse",
        descricao: "Fascina-me a tradição dos doces conventuais portugueses e gostaria de aprender estas técnicas em Óbidos ou Alcobaça. Tenho grande interesse em participar em festivais gastronómicos e criar uma pequena pastelaria que combine receitas brasileiras com técnicas conventuais portuguesas. O meu objetivo é estabelecer-me numa comunidade onde possa ensinar pratos brasileiros e aprender a doçaria tradicional portuguesa.",
        tags: ["Doces Conventuais", "Óbidos", "Alcobaça", "Festivais Gastronómicos", "Pastelaria", "Receitas Brasileiras", "Técnicas Conventuais", "Comunidade"]
      }
    ]
  },
  {
    nomeCompleto: "João Mukanda",
    email: "joao.mukanda@outlook.pt",
    telemovel: "+351 913 456 789",
    categoria: "IMIGRANTE",
    perfil: {
      nacionalidade: "Angolana",
      dataNascimento: new Date("1992-07-22"),
      objetivos: ["Emprego", "Regularização"],
      aceitaNotificacoes: true
    },
    contribuicoes: [
      {
        tipo: "Habilidades",
        descricao: "Tenho 10 anos de experiência em agricultura sustentável e permacultura em Angola. Conheço técnicas tradicionais africanas de cultivo de milho, mandioca e hortícolas, compostagem natural e criação de caprinos e galinhas ao ar livre. Também tenho conhecimentos em apicultura tradicional e produção de mel. Procuro oportunidades para aplicar estes conhecimentos em quintas biológicas ou projetos de agricultura familiar no Alentejo ou Ribatejo.",
        tags: ["Agricultura Sustentável", "Permacultura", "Angola", "Milho", "Mandioca", "Caprinos", "Apicultura", "Mel", "Alentejo", "Ribatejo"]
      },
      {
        tipo: "Interesse",
        descricao: "Tenho grande interesse em aprender sobre a olivicultura tradicional portuguesa e as técnicas de produção de azeite no Alentejo. Gostaria de participar nas colheitas da azeitona e aprender os processos tradicionais de extração. O meu objetivo é combinar técnicas africanas de agricultura sustentável com métodos portugueses, contribuindo para quintas que valorizem a biodiversidade e práticas ancestrais.",
        tags: ["Olivicultura", "Azeite", "Alentejo", "Colheita Azeitona", "Técnicas Africanas", "Biodiversidade", "Práticas Ancestrais", "Quintas"]
      }
    ]
  },
  {
    nomeCompleto: "Ana Tavares",
    email: "ana.tavares@sapo.pt",
    telemovel: "+351 914 567 890",
    categoria: "IMIGRANTE",
    perfil: {
      nacionalidade: "Cabo-verdiana",
      dataNascimento: new Date("1997-11-08"),
      objetivos: ["Formação", "Emprego"],
      aceitaNotificacoes: true
    },
    contribuicoes: [
      {
        tipo: "Habilidades",
        descricao: "Sou musicista tradicional cabo-verdiana com 12 anos de experiência em morna, coladeira e batuque. Toco cavaquinho, violão e percussões tradicionais. Tenho experiência em organização de eventos culturais e festivais de música tradicional. Gostaria de partilhar a música cabo-verdiana em festivais portugueses e aprender sobre o fado e música popular portuguesa, criando pontes culturais através da música.",
        tags: ["Música Cabo-verdiana", "Morna", "Coladeira", "Cavaquinho", "Percussões", "Eventos Culturais", "Festivais", "Fado", "Música Popular"]
      },
      {
        tipo: "Interesse",
        descricao: "Tenho profundo interesse em aprender sobre o fado e a música popular portuguesa, especialmente no Norte do país. Gostaria de participar em festivais de música tradicional e criar colaborações entre a música cabo-verdiana e portuguesa. O meu sonho é estabelecer uma escola de música multicultural numa aldeia portuguesa onde possa ensinar ritmos cabo-verdianos e aprender tradições musicais locais.",
        tags: ["Fado", "Música Popular", "Norte", "Festivais Musicais", "Escola de Música", "Multicultural", "Ritmos Cabo-verdianos", "Tradições Musicais"]
      }
    ]
  },
  {
    nomeCompleto: "Carlos Fernandes",
    email: "carlos.fernandes@gmail.com",
    telemovel: "+351 915 678 901",
    categoria: "IMIGRANTE",
    perfil: {
      nacionalidade: "Moçambicana",
      dataNascimento: new Date("1990-05-12"),
      objetivos: ["Emprego"],
      aceitaNotificacoes: true
    },
    contribuicoes: [
      {
        tipo: "Habilidades",
        descricao: "Tenho 15 anos de experiência em construção tradicional e restauro de edifícios históricos em Moçambique. Conheço técnicas de trabalho em pedra, adobe, madeira e materiais naturais. Especializei-me em restauro de igrejas coloniais e edifícios patrimoniais. Procuro oportunidades para aplicar estas competências na preservação do património arquitetónico português, especialmente em aldeias históricas e monumentos rurais.",
        tags: ["Construção Tradicional", "Restauro", "Pedra", "Adobe", "Madeira", "Património", "Igrejas", "Aldeias Históricas", "Monumentos"]
      }
    ]
  },
  {
    nomeCompleto: "Beatriz Silva",
    email: "beatriz.silva@hotmail.pt",
    telemovel: "+351 916 789 012",
    categoria: "IMIGRANTE",
    perfil: {
      nacionalidade: "São-tomense",
      dataNascimento: new Date("1994-09-30"),
      objetivos: ["Formação", "Emprego"],
      aceitaNotificacoes: true
    },
    contribuicoes: [
      {
        tipo: "Habilidades",
        descricao: "Tenho experiência em agricultura biológica tropical e cultivo de cacau, café e especiarias em São Tomé. Conheço técnicas de agricultura sustentável, compostagem com restos vegetais e criação de sistemas agroflorestais. Também tenho conhecimentos em produção artesanal de chocolate e conservas de frutas tropicais. Procuro oportunidades para adaptar estas técnicas à agricultura portuguesa, especialmente em quintas biológicas.",
        tags: ["Agricultura Biológica", "Cacau", "Café", "Especiarias", "Sustentável", "Agroflorestal", "Chocolate Artesanal", "Conservas", "Quintas Biológicas"]
      },
      {
        tipo: "Interesse",
        descricao: "Tenho grande interesse em aprender sobre a agricultura mediterrânica e as técnicas tradicionais de cultivo de oliveiras e vinhas em Portugal. Gostaria de participar em quintas que pratiquem agricultura biológica e sustentável, onde possa contribuir com conhecimentos tropicais e aprender métodos portugueses. O meu objetivo é criar uma pequena exploração que combine técnicas são-tomenses com tradições rurais portuguesas.",
        tags: ["Agricultura Mediterrânica", "Oliveiras", "Vinhas", "Agricultura Biológica", "Técnicas Tropicais", "Exploração", "Tradições Rurais"]
      }
    ]
  }
];

// Dados realistas para empresas rurais
const NOVAS_EMPRESAS = [
  {
    nomeCompleto: "António Silva",
    email: "geral@quintavinhaverde.pt",
    telemovel: "+351 258 123 456",
    categoria: "EMPRESA",
    perfil: {
      nomeEmpresa: "Quinta da Vinha Verde",
      pessoaContacto: "António Silva",
      morada: "Quinta da Vinha Verde, 4990-062 Ponte de Lima",
      observacoes: "Empresa familiar com 3 gerações dedicadas ao Vinho Verde. Foco em enoturismo sustentável e preservação de tradições vinícolas minhotas."
    },
    contribuicoes: [
      {
        tipo: "Oportunidades",
        descricao: "A Quinta da Vinha Verde procura colaborador para enoturismo e produção de Vinho Verde. Oferecemos formação completa em viticultura tradicional minhota, alojamento na quinta, participação nas vindimas e apoio na criação de experiências turísticas autênticas. Procuramos jovem com interesse em tradições vinícolas, facilidade de comunicação com turistas internacionais e vontade de aprender sobre a cultura minhota. Contrato anual com possibilidade de progressão.",
        tags: ["Vinho Verde", "Ponte de Lima", "Enoturismo", "Viticultura", "Vindimas", "Alojamento", "Turismo Internacional", "Cultura Minhota", "Contrato Anual"]
      }
    ]
  },
  {
    nomeCompleto: "Dr. José Robalo",
    email: "presidencia@coopolicola-alentejo.pt",
    telemovel: "+351 266 234 567",
    categoria: "EMPRESA",
    perfil: {
      nomeEmpresa: "Cooperativa Olivícola do Alentejo",
      pessoaContacto: "Dr. José Robalo",
      morada: "Rua dos Olivais, 7200-001 Reguengos de Monsaraz",
      observacoes: "Cooperativa com 200 produtores associados. Especializada em azeite DOP e turismo rural sustentável."
    },
    contribuicoes: [
      {
        tipo: "Oportunidades",
        descricao: "A Cooperativa Olivícola do Alentejo procura jovens para programa de formação em olivicultura tradicional e produção de azeite DOP. Oferecemos formação completa com mestres olivicultores, participação nas colheitas, aprendizagem de técnicas de extração e certificação em agricultura biológica. Incluímos alojamento em casa rural, refeições típicas alentejanas e integração na comunidade local. Programa de 12 meses com possibilidade de emprego permanente.",
        tags: ["Olivicultura", "Azeite DOP", "Alentejo", "Formação", "Mestres", "Colheitas", "Agricultura Biológica", "Casa Rural", "12 meses", "Emprego Permanente"]
      }
    ]
  },
  {
    nomeCompleto: "Maria João Pereira",
    email: "info@restaurantetradicional.pt",
    telemovel: "+351 244 345 678",
    categoria: "EMPRESA",
    perfil: {
      nomeEmpresa: "Restaurante O Tradicional",
      pessoaContacto: "Maria João Pereira",
      morada: "Rua Direita, 2510-001 Óbidos",
      observacoes: "Restaurante especializado em gastronomia medieval e doces conventuais. Ambiente histórico dentro das muralhas de Óbidos."
    },
    contribuicoes: [
      {
        tipo: "Oportunidades",
        descricao: "O Restaurante O Tradicional, situado no centro histórico de Óbidos, procura cozinheiro/a para especialização em gastronomia medieval e doces conventuais. Oferecemos formação com mestres pasteleiros locais, aprendizagem de receitas tradicionais portuguesas e técnicas de cozinha histórica. Ambiente de trabalho único dentro das muralhas medievais, com foco na autenticidade e qualidade. Procuramos pessoa criativa, interessada em tradições gastronómicas e capaz de inovar respeitando a tradição.",
        tags: ["Gastronomia Medieval", "Óbidos", "Doces Conventuais", "Cozinheiro", "Pasteleiros", "Receitas Tradicionais", "Muralhas Medievais", "Autenticidade"]
      }
    ]
  }
];

// Dados realistas para municípios
const NOVOS_MUNICIPIOS = [
  {
    nomeCompleto: "Dr. Ana Costa",
    email: "presidencia@cm-mertola.pt",
    telemovel: "+351 286 123 456",
    categoria: "MUNICIPIO",
    perfil: {
      nomeMunicipio: "Mértola",
      distrito: "Beja",
      pessoaContacto: "Dr. Ana Costa",
      funcaoCargo: "Vereadora do Desenvolvimento Social",
      projetosApoio: "CLAIM, CLDS 4G, Programa Aldeias Vivas",
      disponibilidadeAcoes: "Centro histórico, Casa da Cultura, espaços municipais"
    },
    contribuicoes: [
      {
        tipo: "Projetos",
        descricao: "O Município de Mértola desenvolve o projeto 'Aldeia Viva' para revitalização do centro histórico através da recuperação de ofícios tradicionais como olaria, tecelagem e cestaria. Procuramos jovens para colaborar na criação de um centro de artesanato, organização de mercados mensais de produtos locais e desenvolvimento de rotas turísticas pedestres. Oferecemos habitação a preço reduzido (150€/mês), formação com mestres locais e apoio na criação de micro-negócios. Duração inicial de 18 meses com possibilidade de estabelecimento permanente.",
        tags: ["Mértola", "Aldeia Viva", "Centro Histórico", "Olaria", "Tecelagem", "Cestaria", "Artesanato", "150€", "Mestres Locais", "18 meses"]
      },
      {
        tipo: "Notícias",
        descricao: "A Junta de Freguesia de Mértola anuncia a abertura de inscrições para o programa 'Habitação Rural Partilhada' destinado a jovens que queiram fixar-se na aldeia. O programa oferece casas tradicionais restauradas por 150€/mês, apoio na procura de emprego local, aulas de português às terças e quintas na sede da junta, e integração em atividades comunitárias. Inscrições até 30 de setembro na junta ou pelo email habitacao@jf-mertola.pt.",
        tags: ["Mértola", "Habitação Rural", "150€", "Casas Tradicionais", "Emprego Local", "Português", "Setembro", "Atividades Comunitárias"]
      }
    ]
  },
  {
    nomeCompleto: "Eng. Miguel Santos",
    email: "presidencia@cm-amarante.pt",
    telemovel: "+351 255 234 567",
    categoria: "MUNICIPIO",
    perfil: {
      nomeMunicipio: "Amarante",
      distrito: "Porto",
      pessoaContacto: "Eng. Miguel Santos",
      funcaoCargo: "Presidente da Câmara",
      projetosApoio: "NORTE 2020, CLDS 4G, Amarante Jovem",
      disponibilidadeAcoes: "Parque Florestal, Centro Cultural, Mercado Municipal"
    },
    contribuicoes: [
      {
        tipo: "Eventos",
        descricao: "A Câmara de Amarante organiza a 'Festa da Broa e do Chouriço' nos dias 12-14 de agosto, no Parque Florestal. Três dias de celebração com concurso de broas tradicionais, demonstrações de fumeiro artesanal, música popular minhota e danças regionais. Convidamos jovens imigrantes a participar com especialidades gastronómicas dos seus países, criando uma ponte cultural única. Oferecemos espaço gratuito, apoio na preparação e integração no programa oficial.",
        tags: ["Amarante", "Agosto", "Broa", "Chouriço", "Fumeiro", "Música Popular", "Danças Regionais", "Ponte Cultural", "Parque Florestal", "Gratuito"]
      }
    ]
  }
];

// Dados realistas para academias
const NOVAS_ACADEMIAS = [
  {
    nomeCompleto: "Prof. Dr. Manuel Oliveira",
    email: "direccao@esa.ipvc.pt",
    telemovel: "+351 258 345 678",
    categoria: "ACADEMIA",
    perfil: {
      nomeAcademia: "Escola Superior Agrária de Ponte de Lima",
      tipoAcademia: "Instituto Politécnico",
      regiao: "Minho",
      pessoaContacto: "Prof. Dr. Manuel Oliveira",
      emailInstitucional: "direccao@esa.ipvc.pt",
      telefone: "+351 258 909 740",
      ofertaFormativa: "Engenharia Agronómica, Viticultura e Enologia, Turismo Rural",
      website: "https://esa.ipvc.pt"
    },
    contribuicoes: [
      {
        tipo: "Cursos",
        descricao: "A Escola Superior Agrária de Ponte de Lima oferece o 'Curso de Viticultura e Enoturismo' - 200 horas distribuídas por 4 meses (fins de semana). Programa prático em vinhas do Vinho Verde, técnicas de poda, vindima, vinificação tradicional e criação de experiências enoturísticas. Inclui estágio em quintas locais, prova de vinhos, certificação e apoio na criação de projetos próprios. Formação com produtores reconhecidos da região e networking com setor vitivinícola minhoto.",
        tags: ["Viticultura", "Ponte de Lima", "Enoturismo", "200 horas", "Vinho Verde", "Poda", "Vindima", "Vinificação", "Quintas Locais", "Minhoto"]
      },
      {
        tipo: "Workshops",
        descricao: "Workshop intensivo 'Técnicas Tradicionais de Agricultura Minhota' - 32 horas distribuídas por 4 fins de semana. Aprenda métodos ancestrais de cultivo de milho, feijão e hortícolas, técnicas de rega tradicional e preparação de adubos naturais com mestres agricultores da região. Inclui visitas a quintas familiares, demonstrações práticas e certificado de participação. Dirigido a jovens interessados em agricultura sustentável e preservação de tradições rurais.",
        tags: ["Agricultura Minhota", "32 horas", "Milho", "Feijão", "Rega Tradicional", "Adubos Naturais", "Quintas Familiares", "Agricultura Sustentável"]
      }
    ]
  }
];

// Dados realistas para famílias
const NOVAS_FAMILIAS = [
  {
    nomeCompleto: "José e Maria Silva",
    email: "familia.silva@gmail.com",
    telemovel: "+351 239 456 789",
    categoria: "FAMILIA_ACOLHIMENTO",
    perfil: {
      moradaCompleta: "Quinta dos Olivais, 3140-301 Penacova",
      quantidadePessoas: "2 adultos",
      tiposAcolhimento: "Estudantes universitários, Jovens trabalhadores",
      duracaoAcolhimento: "6-12 meses",
      observacoes: "Quinta com vinha, olival e horta biológica. Ambiente familiar tradicional português."
    },
    contribuicoes: [
      {
        tipo: "Suporte",
        descricao: "A nossa família em Penacova oferece acolhimento familiar para jovem interessado em agricultura e vida rural portuguesa. Temos quinta com vinha, olival e horta biológica onde pode aprender técnicas tradicionais de cultivo. Oferecemos quarto próprio, refeições em família, participação nas atividades da quinta (vindimas, colheita azeitona, horta) e integração nas festividades locais. Procuramos jovem responsável, interessado em aprender português e partilhar a sua cultura.",
        tags: ["Penacova", "Coimbra", "Quinta", "Vinha", "Olival", "Horta Biológica", "Vindimas", "Azeitona", "6-12 meses", "Festividades Locais"]
      }
    ]
  }
];

async function preserveDevUsers() {
  console.log('🔒 Identificando usuários de desenvolvimento para preservar...');
  
  const devUsers = await prisma.user.findMany({
    where: {
      email: {
        in: PRESERVE_EMAILS
      }
    },
    select: {
      id: true,
      nomeCompleto: true,
      email: true,
      categoria: true
    }
  });

  console.log('✅ Usuários de desenvolvimento identificados:');
  devUsers.forEach(user => {
    console.log(`   🔒 ${user.nomeCompleto} (${user.email}) - ${user.categoria}`);
  });

  return devUsers.map(u => u.id);
}

async function cleanTestData(preserveIds: string[]) {
  console.log('🧹 Removendo dados de teste (preservando desenvolvimento)...');
  
  // Remover contribuições de usuários não-desenvolvimento
  const deletedContribs = await prisma.contribuicao.deleteMany({
    where: {
      userId: {
        notIn: preserveIds
      }
    }
  });
  console.log(`   🗑️ ${deletedContribs.count} contribuições de teste removidas`);

  // Remover perfis específicos de usuários não-desenvolvimento
  await prisma.perfilImigrante.deleteMany({
    where: { userId: { notIn: preserveIds } }
  });
  await prisma.perfilEmpresa.deleteMany({
    where: { userId: { notIn: preserveIds } }
  });
  await prisma.perfilMunicipio.deleteMany({
    where: { userId: { notIn: preserveIds } }
  });
  await prisma.perfilAcademia.deleteMany({
    where: { userId: { notIn: preserveIds } }
  });
  await prisma.perfilFamilia.deleteMany({
    where: { userId: { notIn: preserveIds } }
  });

  // Remover usuários de teste
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      id: {
        notIn: preserveIds
      }
    }
  });
  console.log(`   🗑️ ${deletedUsers.count} usuários de teste removidos`);
}

async function createRealisticUsers() {
  console.log('👥 Criando usuários realistas...');

  // Criar imigrantes
  for (const imigrante of NOVOS_IMIGRANTES) {
    const user = await prisma.user.create({
      data: {
        nomeCompleto: imigrante.nomeCompleto,
        email: imigrante.email,
        senha: 'madrilusa123', // Senha padrão
        telemovel: imigrante.telemovel,
        categoria: imigrante.categoria
      }
    });

    // Criar perfil específico
    await prisma.perfilImigrante.create({
      data: {
        userId: user.id,
        nacionalidade: imigrante.perfil.nacionalidade,
        dataNascimento: imigrante.perfil.dataNascimento,
        objetivos: JSON.stringify(imigrante.perfil.objetivos),
        aceitaNotificacoes: imigrante.perfil.aceitaNotificacoes
      }
    });

    // Criar contribuições
    for (const contrib of imigrante.contribuicoes) {
      const tipoContrib = await prisma.tipoContribuicao.findFirst({
        where: { 
          titulo: contrib.tipo,
          categoria: "IMIGRANTE"
        }
      });

      if (tipoContrib) {
        await prisma.contribuicao.create({
          data: {
            userId: user.id,
            tipoContribuicaoId: tipoContrib.id,
            descricao: contrib.descricao,
            tags: JSON.stringify(contrib.tags)
          }
        });
      }
    }

    console.log(`   ✅ Imigrante criado: ${imigrante.nomeCompleto} (${imigrante.perfil.nacionalidade})`);
  }

  // Criar empresas
  for (const empresa of NOVAS_EMPRESAS) {
    const user = await prisma.user.create({
      data: {
        nomeCompleto: empresa.nomeCompleto,
        email: empresa.email,
        senha: 'madrilusa123',
        telemovel: empresa.telemovel,
        categoria: empresa.categoria
      }
    });

    // Criar perfil específico
    await prisma.perfilEmpresa.create({
      data: {
        userId: user.id,
        nomeEmpresa: empresa.perfil.nomeEmpresa,
        pessoaContacto: empresa.perfil.pessoaContacto,
        morada: empresa.perfil.morada,
        observacoes: empresa.perfil.observacoes
      }
    });

    // Criar contribuições
    for (const contrib of empresa.contribuicoes) {
      const tipoContrib = await prisma.tipoContribuicao.findFirst({
        where: { 
          titulo: contrib.tipo,
          categoria: "EMPRESA"
        }
      });

      if (tipoContrib) {
        await prisma.contribuicao.create({
          data: {
            userId: user.id,
            tipoContribuicaoId: tipoContrib.id,
            descricao: contrib.descricao,
            tags: JSON.stringify(contrib.tags)
          }
        });
      }
    }

    console.log(`   ✅ Empresa criada: ${empresa.perfil.nomeEmpresa}`);
  }

  // Criar municípios
  for (const municipio of NOVOS_MUNICIPIOS) {
    const user = await prisma.user.create({
      data: {
        nomeCompleto: municipio.nomeCompleto,
        email: municipio.email,
        senha: 'madrilusa123',
        telemovel: municipio.telemovel,
        categoria: municipio.categoria
      }
    });

    // Criar perfil específico
    await prisma.perfilMunicipio.create({
      data: {
        userId: user.id,
        nomeMunicipio: municipio.perfil.nomeMunicipio,
        distrito: municipio.perfil.distrito,
        pessoaContacto: municipio.perfil.pessoaContacto,
        funcaoCargo: municipio.perfil.funcaoCargo,
        projetosApoio: municipio.perfil.projetosApoio,
        disponibilidadeAcoes: municipio.perfil.disponibilidadeAcoes
      }
    });

    // Criar contribuições
    for (const contrib of municipio.contribuicoes) {
      const tipoContrib = await prisma.tipoContribuicao.findFirst({
        where: { 
          titulo: contrib.tipo,
          categoria: "MUNICIPIO"
        }
      });

      if (tipoContrib) {
        await prisma.contribuicao.create({
          data: {
            userId: user.id,
            tipoContribuicaoId: tipoContrib.id,
            descricao: contrib.descricao,
            tags: JSON.stringify(contrib.tags)
          }
        });
      }
    }

    console.log(`   ✅ Município criado: ${municipio.perfil.nomeMunicipio}`);
  }

  // Criar academias
  for (const academia of NOVAS_ACADEMIAS) {
    const user = await prisma.user.create({
      data: {
        nomeCompleto: academia.nomeCompleto,
        email: academia.email,
        senha: 'madrilusa123',
        telemovel: academia.telemovel,
        categoria: academia.categoria
      }
    });

    // Criar perfil específico
    await prisma.perfilAcademia.create({
      data: {
        userId: user.id,
        nomeAcademia: academia.perfil.nomeAcademia,
        tipoAcademia: academia.perfil.tipoAcademia,
        regiao: academia.perfil.regiao,
        pessoaContacto: academia.perfil.pessoaContacto,
        emailInstitucional: academia.perfil.emailInstitucional,
        telefone: academia.perfil.telefone,
        ofertaFormativa: academia.perfil.ofertaFormativa,
        website: academia.perfil.website
      }
    });

    // Criar contribuições
    for (const contrib of academia.contribuicoes) {
      const tipoContrib = await prisma.tipoContribuicao.findFirst({
        where: { 
          titulo: contrib.tipo,
          categoria: "ACADEMIA"
        }
      });

      if (tipoContrib) {
        await prisma.contribuicao.create({
          data: {
            userId: user.id,
            tipoContribuicaoId: tipoContrib.id,
            descricao: contrib.descricao,
            tags: JSON.stringify(contrib.tags)
          }
        });
      }
    }

    console.log(`   ✅ Academia criada: ${academia.perfil.nomeAcademia}`);
  }

  // Criar famílias
  for (const familia of NOVAS_FAMILIAS) {
    const user = await prisma.user.create({
      data: {
        nomeCompleto: familia.nomeCompleto,
        email: familia.email,
        senha: 'madrilusa123',
        telemovel: familia.telemovel,
        categoria: familia.categoria
      }
    });

    // Criar perfil específico
    await prisma.perfilFamilia.create({
      data: {
        userId: user.id,
        moradaCompleta: familia.perfil.moradaCompleta,
        quantidadePessoas: familia.perfil.quantidadePessoas,
        tiposAcolhimento: familia.perfil.tiposAcolhimento,
        duracaoAcolhimento: familia.perfil.duracaoAcolhimento,
        observacoes: familia.perfil.observacoes
      }
    });

    // Criar contribuições
    for (const contrib of familia.contribuicoes) {
      const tipoContrib = await prisma.tipoContribuicao.findFirst({
        where: { 
          titulo: contrib.tipo,
          categoria: "FAMILIA_ACOLHIMENTO"
        }
      });

      if (tipoContrib) {
        await prisma.contribuicao.create({
          data: {
            userId: user.id,
            tipoContribuicaoId: tipoContrib.id,
            descricao: contrib.descricao,
            tags: JSON.stringify(contrib.tags)
          }
        });
      }
    }

    console.log(`   ✅ Família criada: ${familia.nomeCompleto}`);
  }
}

async function main() {
  console.log('🌱 Iniciando repopulação com dados realistas...');
  console.log('');

  try {
    // 1. Identificar usuários de desenvolvimento
    const preserveIds = await preserveDevUsers();
    console.log('');

    // 2. Limpar dados de teste
    await cleanTestData(preserveIds);
    console.log('');

    // 3. Criar usuários realistas
    await createRealisticUsers();
    console.log('');

    // 4. Estatísticas finais
    const stats = await prisma.user.groupBy({
      by: ['categoria'],
      _count: { id: true },
      where: { categoria: { not: null } }
    });

    console.log('📊 ESTATÍSTICAS FINAIS:');
    stats.forEach(stat => {
      console.log(`   ${stat.categoria}: ${stat._count.id} usuários`);
    });

    const totalContribs = await prisma.contribuicao.count();
    console.log(`   📝 CONTRIBUIÇÕES: ${totalContribs} total`);

    console.log('');
    console.log('🎉 Repopulação concluída com sucesso!');
    console.log('🔗 Sistema pronto para demonstração com dados realistas');

  } catch (error) {
    console.error('❌ Erro durante repopulação:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('💥 Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Conexão com banco encerrada');
  });
