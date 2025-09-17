/**
 * 🧪 DADOS FICTÍCIOS PARA TESTE DA JORNADA COMPLETA DE IMIGRANTE
 *
 * Este arquivo contém dados realistas mas fictícios para automatizar
 * todo o processo de cadastro de um imigrante na plataforma Madrilusa.
 */

export const dadosImigranteFicticio = {
  // 🎯 DADOS BÁSICOS DE REGISTRO
  registroBasico: {
    nomeCompleto: "Ana Maria Santos Silva",
    email: "ana.santos.teste@madrilusa.demo",
    telemovel: "+351 912 345 678",
    senha: "TesteSeguro123!"
  },

  // 👤 PERFIL ESPECÍFICO DE IMIGRANTE
  perfilImigrante: {
    nacionalidade: "Brasileira",
    dataNascimento: "1995-03-15", // 29 anos
    objetivos: ["Emprego", "Formação"],
    objetivoOutros: "Procuro especializar-me na área de tecnologia e contribuir para projetos inovadores em Portugal.",
    mensagem: "Sou desenvolvedora de software com 6 anos de experiência em desenvolvimento web. Tenho grande interesse em integrar-me na comunidade portuguesa e partilhar conhecimentos.",

    // ✨ INFORMAÇÕES ADICIONAIS
    genero: "F",
    municipioResidencia: "Porto",
    transporteProprio: true,
    possibilidadeMudancaMorada: true,
    fluenciaPortugues: "Avançada",
    aceitaNotificacoes: true
  },

  // 💼 EXPERIÊNCIAS PROFISSIONAIS
  experienciasProfissionais: [
    {
      cargo: "Desenvolvedora Full Stack Sénior",
      empresa: "TechBrasil Ltda",
      localizacao: "São Paulo, Brasil",
      dataInicio: "2020-01-15",
      dataFim: "2024-12-20", // Recente
      atualEmprego: false,
      descricao: "Desenvolvimento de aplicações web usando React, Node.js e PostgreSQL. Liderança de equipe de 4 desenvolvedores juniores. Implementação de práticas DevOps e CI/CD.",
      habilidades: ["React", "Node.js", "PostgreSQL", "Docker", "AWS", "TypeScript", "Git", "Scrum"]
    },
    {
      cargo: "Desenvolvedora Frontend",
      empresa: "Startup Inovação Digital",
      localizacao: "Rio de Janeiro, Brasil",
      dataInicio: "2018-06-01",
      dataFim: "2019-12-31",
      atualEmprego: false,
      descricao: "Criação de interfaces responsivas e interativas para plataforma de e-commerce. Colaboração direta com designers UX/UI.",
      habilidades: ["React", "JavaScript", "CSS3", "HTML5", "Redux", "Material-UI", "Figma"]
    },
    {
      cargo: "Estagiária de Desenvolvimento",
      empresa: "Empresa Tradicional LTDA",
      localizacao: "Brasília, Brasil",
      dataInicio: "2017-02-01",
      dataFim: "2018-05-31",
      atualEmprego: false,
      descricao: "Primeiro contacto profissional com desenvolvimento. Manutenção de sistemas legados e apoio na migração para tecnologias modernas.",
      habilidades: ["PHP", "MySQL", "jQuery", "Bootstrap", "Linux"]
    }
  ],

  // 🎓 FORMAÇÃO ACADÉMICA
  formacaoAcademica: [
    {
      grau: "Licenciatura",
      curso: "Engenharia Informática",
      instituicao: "Universidade de São Paulo (USP)",
      localizacao: "São Paulo, Brasil",
      dataInicio: "2013-03-01",
      dataFim: "2016-12-15",
      concluido: true,
      descricao: "Formação sólida em fundamentos de programação, estruturas de dados, algoritmos e engenharia de software. Projeto final: Sistema de gestão académica com interface web."
    },
    {
      grau: "Pós-Graduação",
      curso: "Desenvolvimento de Aplicações Web",
      instituicao: "Instituto Tecnológico de Campinas",
      localizacao: "Campinas, Brasil",
      dataInicio: "2017-08-01",
      dataFim: "2018-12-20",
      concluido: true,
      descricao: "Especialização em tecnologias modernas de desenvolvimento web, arquitetura de software e metodologias ágeis."
    },
    {
      grau: "Curso Técnico",
      curso: "Certificação AWS Solutions Architect",
      instituicao: "Amazon Web Services",
      localizacao: "Online",
      dataInicio: "2023-01-10",
      dataFim: "2023-06-15",
      concluido: true,
      descricao: "Certificação internacional em arquitetura de soluções na nuvem AWS. Competências em design de infraestrutura escalável e segura."
    }
  ],

  // 🌍 IDIOMAS CONHECIDOS
  idiomas: [
    {
      idioma: "Português",
      nivelFala: "Avançado",
      nivelEscrita: "Avançado",
      nivelCompreensao: "Fluente",
      observacoes: "Língua nativa. Tenho facilidade com sotaque português devido a contacto familiar."
    },
    {
      idioma: "Inglês",
      nivelFala: "Avançado",
      nivelEscrita: "Avançado",
      nivelCompreensao: "Fluente",
      observacoes: "Certificação TOEFL iBT (95 pontos). Uso diariamente no trabalho para comunicação com clientes internacionais."
    },
    {
      idioma: "Espanhol",
      nivelFala: "Intermediário",
      nivelEscrita: "Básico",
      nivelCompreensao: "Avançado",
      observacoes: "Compreensão excelente devido à proximidade com português. Preciso de melhorar a expressão escrita."
    },
    {
      idioma: "Francês",
      nivelFala: "Básico",
      nivelEscrita: "Básico",
      nivelCompreensao: "Intermediário",
      observacoes: "Estudei 2 anos no secundário. Pretendo retomar os estudos em Portugal."
    }
  ],

  // 🔧 HABILIDADES TÉCNICAS (para contribuições)
  habilidadesTecnicas: [
    {
      categoria: "Frontend",
      habilidades: [
        "React.js", "Next.js", "Vue.js", "TypeScript", "JavaScript ES6+",
        "HTML5", "CSS3", "SASS/SCSS", "Tailwind CSS", "Material-UI",
        "Bootstrap", "Responsive Design", "Progressive Web Apps (PWA)"
      ]
    },
    {
      categoria: "Backend",
      habilidades: [
        "Node.js", "Express.js", "Nest.js", "Python", "Django",
        "PHP", "Laravel", "RESTful APIs", "GraphQL", "Microservices"
      ]
    },
    {
      categoria: "Base de Dados",
      habilidades: [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma ORM",
        "Sequelize", "Database Design", "Query Optimization"
      ]
    },
    {
      categoria: "DevOps e Cloud",
      habilidades: [
        "AWS", "Docker", "Kubernetes", "CI/CD", "GitHub Actions",
        "Terraform", "Monitoring", "Linux", "Nginx"
      ]
    },
    {
      categoria: "Ferramentas",
      habilidades: [
        "Git", "VS Code", "Postman", "Figma", "Jira", "Confluence",
        "Slack", "Notion", "Trello"
      ]
    }
  ],

  // 🎯 INTERESSES E MOTIVAÇÕES
  interessesMotivacoes: [
    "Desenvolvimento sustentável",
    "Tecnologias emergentes",
    "Inteligência artificial",
    "Comunidades de código aberto",
    "Mentoria e ensino",
    "Projetos de impacto social",
    "Inovação em saúde digital",
    "Agricultura de precisão"
  ],

  // 🌟 CARACTERÍSTICAS PESSOAIS
  caracteristicasPessoais: [
    "Proativa",
    "Organizada",
    "Comunicativa",
    "Resiliente",
    "Adaptável",
    "Colaborativa",
    "Criativa",
    "Determinada",
    "Empática",
    "Curiosa"
  ],

  // 📍 PREFERÊNCIAS DE LOCALIZAÇÃO
  preferenciasLocalizacao: {
    regioesPretendidas: ["Norte", "Centro", "Grande Lisboa"],
    municipiosInteresse: ["Porto", "Coimbra", "Braga", "Aveiro", "Lisboa"],
    disponibilidadeViagem: true,
    trabalhoRemoto: "Sim, preferencialmente híbrido"
  },

  // 💰 EXPECTATIVAS PROFISSIONAIS
  expectativasProfissionais: {
    salarioMinimo: "€ 2.500",
    salarioIdeal: "€ 3.500 - € 4.500",
    tipoContrato: "Contrato sem termo",
    horarioPreferido: "Flexível (9h-18h ou 10h-19h)",
    beneficiosValorizados: [
      "Seguro de saúde",
      "Formação contínua",
      "Flexibilidade horária",
      "Trabalho remoto",
      "Ambiente multicultural"
    ]
  },

  // 🎨 PROJETOS PESSOAIS E PORTFÓLIO
  projetosPessoais: [
    {
      nome: "EcoTrack - App de Sustentabilidade",
      descricao: "Aplicação mobile que ajuda utilizadores a rastrear e reduzir pegada de carbono pessoal.",
      tecnologias: ["React Native", "Node.js", "MongoDB", "AWS"],
      url: "https://github.com/anasilva/ecotrack",
      status: "Ativo"
    },
    {
      nome: "Community Helper - Plataforma Social",
      descricao: "Rede social para conectar imigrantes com comunidades locais e serviços de apoio.",
      tecnologias: ["Next.js", "PostgreSQL", "Stripe", "MapBox"],
      url: "https://github.com/anasilva/community-helper",
      status: "Em desenvolvimento"
    }
  ]
};

// 🚀 DADOS PARA AUTOMAÇÃO DE INTERFACE
export const dadosAutomacao = {
  // Tempos de espera personalizados
  timeouts: {
    navegacao: 10000,
    formularios: 5000,
    uploads: 15000,
    apis: 8000
  },

  // Seletores específicos da interface
  seletores: {
    botaoRegistro: '[data-testid="register-button"], .btn:contains("Criar conta"), button:contains("Registar")',
    botaoLogin: '[data-testid="login-button"], .btn:contains("Login"), .btn:contains("Entrar")',
    modalRegistro: '.modal, [role="dialog"]',
    campoEmail: 'input[name="email"], input[type="email"], #email',
    campoSenha: 'input[name="senha"], input[name="password"], input[type="password"], #senha, #password',
    campoNome: 'input[name="nomeCompleto"], input[name="nome"], #nomeCompleto, #nome',
    categoriaImigrante: '[data-category="imigrante"], .card:contains("Imigrante"), button:contains("Imigrante")'
  },

  // Dados para screenshots
  screenshots: {
    diretorio: './screenshots-jornada-imigrante',
    formato: 'png',
    qualidade: 90,
    nomesPadrao: {
      landingPage: '01-landing-page',
      modalRegistro: '02-modal-registro',
      registroEtapa1: '03-registro-etapa1',
      registroEtapa2: '04-registro-etapa2',
      dashboard: '05-dashboard',
      perfilImigrante: '06-perfil-imigrante',
      experiencias: '07-experiencias-profissionais',
      formacao: '08-formacao-academica',
      idiomas: '09-idiomas-conhecidos',
      contribuicoes: '10-contribuicoes',
      sinergiaV2: '11-sinergia-v2'
    }
  }
};

export default dadosImigranteFicticio;