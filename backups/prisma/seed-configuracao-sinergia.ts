// Seed para Configuração Padrão do SinergIA V2

import { PrismaClient } from '@prisma/client';
import { DEFAULT_CONFIGURATION } from '../src/modules/sinergia/sinergia-config.types';

const prisma = new PrismaClient();

async function seedConfiguracaoSinergia() {
  try {
    console.log('🌱 SEED: Iniciando seed da configuração SinergIA V2...');

    // Verifica se já existe configuração ativa
    const existeAtiva = await prisma.configuracaoSinergia.findFirst({
      where: { ativa: true }
    });

    if (existeAtiva) {
      console.log('✅ SEED: Configuração ativa já existe, pulando seed');
      return;
    }

    // Busca um usuário admin para ser o criador (assumindo que existe)
    const adminUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { categoria: 'ADMIN' },
          { email: { contains: 'admin' } }
        ]
      }
    });

    const criadoPor = adminUser?.id || 'sistema';

    // Cria configuração padrão ativa
    const configuracaoPadrao = await prisma.configuracaoSinergia.create({
      data: {
        versao: 1,
        ativa: true,
        nome: 'Configuração Padrão SinergIA V2',
        descricao: 'Configuração inicial do sistema com os parâmetros padrão de matching',
        pesos: JSON.stringify(DEFAULT_CONFIGURATION.pesos),
        eliminatorios: JSON.stringify(DEFAULT_CONFIGURATION.eliminatorios),
        iaConfig: JSON.stringify(DEFAULT_CONFIGURATION.iaConfig),
        prefiltros: JSON.stringify(DEFAULT_CONFIGURATION.prefiltros),
        scoringRules: JSON.stringify(DEFAULT_CONFIGURATION.scoringRules),
        limites: JSON.stringify(DEFAULT_CONFIGURATION.limites),
        criadoPor
      }
    });

    console.log(`✅ SEED: Configuração padrão criada com ID: ${configuracaoPadrao.id}`);

    // Registra no histórico
    await prisma.historicoConfiguracaoSinergia.create({
      data: {
        configuracaoId: configuracaoPadrao.id,
        snapshot: JSON.stringify(DEFAULT_CONFIGURATION),
        acao: 'criada',
        usuarioId: criadoPor,
        motivo: 'Configuração inicial do sistema via seed'
      }
    });

    console.log('✅ SEED: Histórico inicial registrado');

    // Cria algumas configurações de template para demonstração
    const templates = [
      {
        nome: 'Matching Ultra Rigoroso',
        descricao: 'Configuração que prioriza correspondência exata em todos os critérios',
        modificacoes: {
          pesos: {
            ...DEFAULT_CONFIGURATION.pesos,
            experiencias: 30,
            formacao: 25,
            municipio: 20
          },
          iaConfig: {
            ...DEFAULT_CONFIGURATION.iaConfig,
            thresholdMinimo: 60,
            pesoIA: 20
          }
        }
      },
      {
        nome: 'Matching Flexível',
        descricao: 'Configuração mais tolerante que foca no potencial do candidato',
        modificacoes: {
          eliminatorios: {
            ...DEFAULT_CONFIGURATION.eliminatorios,
            genero: {
              ...DEFAULT_CONFIGURATION.eliminatorios.genero,
              ativo: false
            },
            transporteProprio: {
              ...DEFAULT_CONFIGURATION.eliminatorios.transporteProprio,
              ativo: false
            }
          },
          iaConfig: {
            ...DEFAULT_CONFIGURATION.iaConfig,
            thresholdMinimo: 20,
            pesoIA: 40
          }
        }
      },
      {
        nome: 'Matching Econômico',
        descricao: 'Configuração que reduz o uso de IA para economizar custos',
        modificacoes: {
          iaConfig: {
            ...DEFAULT_CONFIGURATION.iaConfig,
            habilitada: false,
            thresholdMinimo: 70,
            pesoIA: 15
          }
        }
      }
    ];

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const versao = i + 2; // Começa na versão 2

      const config = await prisma.configuracaoSinergia.create({
        data: {
          versao,
          ativa: false,
          nome: template.nome,
          descricao: template.descricao,
          pesos: JSON.stringify(template.modificacoes.pesos || DEFAULT_CONFIGURATION.pesos),
          eliminatorios: JSON.stringify(template.modificacoes.eliminatorios || DEFAULT_CONFIGURATION.eliminatorios),
          iaConfig: JSON.stringify(template.modificacoes.iaConfig || DEFAULT_CONFIGURATION.iaConfig),
          prefiltros: JSON.stringify(DEFAULT_CONFIGURATION.prefiltros),
          scoringRules: JSON.stringify(DEFAULT_CONFIGURATION.scoringRules),
          criadoPor
        }
      });

      // Registra no histórico
      await prisma.historicoConfiguracaoSinergia.create({
        data: {
          configuracaoId: config.id,
          snapshot: JSON.stringify({
            pesos: template.modificacoes.pesos || DEFAULT_CONFIGURATION.pesos,
            eliminatorios: template.modificacoes.eliminatorios || DEFAULT_CONFIGURATION.eliminatorios,
            iaConfig: template.modificacoes.iaConfig || DEFAULT_CONFIGURATION.iaConfig,
            prefiltros: DEFAULT_CONFIGURATION.prefiltros,
            scoringRules: DEFAULT_CONFIGURATION.scoringRules,
            limites: DEFAULT_CONFIGURATION.limites
          }),
          acao: 'criada',
          usuarioId: criadoPor,
          motivo: `Template ${template.nome} criado via seed`
        }
      });

      console.log(`✅ SEED: Template '${template.nome}' criado (v${versao})`);
    }

    console.log('🎉 SEED: Configuração SinergIA V2 completada com sucesso!');
    console.log('📊 Resumo:');
    console.log('   • 1 configuração padrão ATIVA');
    console.log('   • 3 templates de exemplo INATIVOS');
    console.log('   • 4 entradas no histórico');

  } catch (error) {
    console.error('❌ SEED: Erro ao criar configuração SinergIA V2:', error);
    throw error;
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedConfiguracaoSinergia()
    .then(() => {
      console.log('✅ Seed executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no seed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

export default seedConfiguracaoSinergia;
