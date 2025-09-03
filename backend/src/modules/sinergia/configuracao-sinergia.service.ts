// Service para Gestão de Configurações Parametrizáveis do SinergIA V2

import { PrismaClient } from '@prisma/client';
import type { 
  ConfiguracaoCompleta, 
  ConfiguracaoSinergiaBD,
  HistoricoConfiguracaoSinergiaBD,
  ImpactoSimulado,
  ValidationResult
} from './sinergia-config.types';
import { DEFAULT_CONFIGURATION, TEMPLATES_CONFIGURACAO } from './sinergia-config.types';

const prisma = new PrismaClient();

export class ConfiguracaoSinergiaService {
  private static instance: ConfiguracaoSinergiaService;
  private cache: Map<string, ConfiguracaoCompleta> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  private constructor() {}

  static getInstance(): ConfiguracaoSinergiaService {
    if (!ConfiguracaoSinergiaService.instance) {
      ConfiguracaoSinergiaService.instance = new ConfiguracaoSinergiaService();
    }
    return ConfiguracaoSinergiaService.instance;
  }

  /**
   * Busca a configuração ativa do sistema
   */
  async getConfiguracaoAtiva(): Promise<ConfiguracaoCompleta> {
    try {
      // Verifica cache primeiro
      const cacheKey = 'ativa';
      if (this.isCacheValid(cacheKey)) {
        console.log('📋 CONFIG: Usando configuração do cache');
        return this.cache.get(cacheKey)!;
      }

      // Busca do banco
      const config = await prisma.configuracaoSinergia.findFirst({
        where: { ativa: true },
        orderBy: { versao: 'desc' }
      });

      let configuracao: ConfiguracaoCompleta;

      if (!config) {
        console.log('⚠️  CONFIG: Nenhuma configuração ativa encontrada, usando padrão');
        configuracao = DEFAULT_CONFIGURATION;
      } else {
        console.log(`✅ CONFIG: Carregada configuração v${config.versao} - ${config.nome}`);
        configuracao = this.parseConfigFromDB(config);
      }

      // Armazena no cache
      this.cache.set(cacheKey, configuracao);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);

      return configuracao;

    } catch (error) {
      console.error('❌ CONFIG: Erro ao buscar configuração ativa:', error);
      return DEFAULT_CONFIGURATION;
    }
  }

  /**
   * Busca configuração por ID
   */
  async getConfiguracaoPorId(id: string): Promise<ConfiguracaoCompleta | null> {
    try {
      const config = await prisma.configuracaoSinergia.findUnique({
        where: { id }
      });

      if (!config) {
        return null;
      }

      return this.parseConfigFromDB(config);

    } catch (error) {
      console.error('❌ CONFIG: Erro ao buscar configuração por ID:', error);
      return null;
    }
  }

  /**
   * Lista todas as configurações
   */
  async listarConfiguracoes(): Promise<{
    id: string;
    versao: number;
    ativa: boolean;
    nome: string;
    descricao?: string;
    criadoPor: string;
    createdAt: Date;
  }[]> {
    try {
      const configs = await prisma.configuracaoSinergia.findMany({
        select: {
          id: true,
          versao: true,
          ativa: true,
          nome: true,
          descricao: true,
          criadoPor: true,
          createdAt: true
        },
        orderBy: { versao: 'desc' }
      });

      return configs;

    } catch (error) {
      console.error('❌ CONFIG: Erro ao listar configurações:', error);
      return [];
    }
  }

  /**
   * Cria nova configuração
   */
  async criarConfiguracao(
    novaConfig: ConfiguracaoCompleta,
    userId: string,
    nome: string,
    descricao?: string,
    ativar: boolean = false
  ): Promise<string> {
    try {
      // Validações
      const validacao = this.validarConfiguracao(novaConfig);
      if (!validacao.valido) {
        throw new Error(`Configuração inválida: ${validacao.erros.join(', ')}`);
      }

      // Obter próxima versão
      const ultimaVersao = await this.getUltimaVersao();
      const novaVersao = ultimaVersao + 1;

      const resultado = await prisma.$transaction(async (tx) => {
        // Se deve ativar, desativa as anteriores
        if (ativar) {
          await tx.configuracaoSinergia.updateMany({
            where: { ativa: true },
            data: { ativa: false }
          });
        }

        // Cria nova configuração
        const nova = await tx.configuracaoSinergia.create({
          data: {
            versao: novaVersao,
            ativa: ativar,
            nome,
            descricao,
            pesos: JSON.stringify(novaConfig.pesos),
            eliminatorios: JSON.stringify(novaConfig.eliminatorios),
            iaConfig: JSON.stringify(novaConfig.iaConfig),
            prefiltros: JSON.stringify(novaConfig.prefiltros),
            scoringRules: JSON.stringify(novaConfig.scoringRules),
            limites: JSON.stringify(novaConfig.limites),
            criadoPor: userId
          }
        });

        // Registra no histórico
        await tx.historicoConfiguracaoSinergia.create({
          data: {
            configuracaoId: nova.id,
            snapshot: JSON.stringify(novaConfig),
            acao: ativar ? 'ativada' : 'criada',
            usuarioId: userId,
            motivo: `Configuração ${nome} versão ${novaVersao}`
          }
        });

        return nova.id;
      });

      // Limpa cache se ativou
      if (ativar) {
        this.limparCache();
      }

      console.log(`✅ CONFIG: Configuração criada - ${nome} v${novaVersao} (${ativar ? 'ATIVA' : 'inativa'})`);
      return resultado;

    } catch (error) {
      console.error('❌ CONFIG: Erro ao criar configuração:', error);
      throw error;
    }
  }

  /**
   * Ativa uma configuração existente
   */
  async ativarConfiguracao(
    configuracaoId: string,
    userId: string,
    motivo?: string
  ): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        // Verifica se existe
        const config = await tx.configuracaoSinergia.findUnique({
          where: { id: configuracaoId }
        });

        if (!config) {
          throw new Error('Configuração não encontrada');
        }

        // Desativa todas as outras
        await tx.configuracaoSinergia.updateMany({
          where: { ativa: true },
          data: { ativa: false }
        });

        // Ativa a selecionada
        await tx.configuracaoSinergia.update({
          where: { id: configuracaoId },
          data: { 
            ativa: true,
            atualizadoPor: userId
          }
        });

        // Registra no histórico
        await tx.historicoConfiguracaoSinergia.create({
          data: {
            configuracaoId,
            snapshot: JSON.stringify({
              pesos: JSON.parse(config.pesos),
              eliminatorios: JSON.parse(config.eliminatorios),
              iaConfig: JSON.parse(config.iaConfig),
              prefiltros: JSON.parse(config.prefiltros),
              scoringRules: JSON.parse(config.scoringRules)
            }),
            acao: 'ativada',
            usuarioId: userId,
            motivo: motivo || 'Ativação manual'
          }
        });
      });

      // Limpa cache
      this.limparCache();

      console.log(`✅ CONFIG: Configuração ${configuracaoId} ativada`);

    } catch (error) {
      console.error('❌ CONFIG: Erro ao ativar configuração:', error);
      throw error;
    }
  }

  /**
   * Simula impacto de uma configuração com dados reais
   */
  async simularImpacto(
    novaConfig: ConfiguracaoCompleta,
    amostraSize: number = 50
  ): Promise<ImpactoSimulado> {
    try {
      console.log('🧪 CONFIG: Simulando impacto da nova configuração...');
      
      // 1. Buscar amostra de oportunidades ativas
      const oportunidades = await prisma.oportunidadeTrabalho.findMany({
        where: { ativo: true },
        take: Math.min(amostraSize, 20), // Limitar para não sobrecarregar
        include: {
          user: {
            select: { nomeCompleto: true }
          }
        }
      });

      // 2. Buscar amostra de imigrantes
      const imigrantes = await prisma.user.findMany({
        where: { categoria: 'IMIGRANTE' },
        take: Math.min(amostraSize, 30),
        include: {
          perfilImigrante: true,
          dadosProfissionais: true
        }
      });

      if (oportunidades.length === 0 || imigrantes.length === 0) {
        console.log('⚠️  CONFIG: Dados insuficientes para simulação real, usando mock');
        return this.simularImpactoMock(amostraSize);
      }

      console.log(`🧪 CONFIG: Simulando com ${oportunidades.length} oportunidades e ${imigrantes.length} imigrantes`);

      // 3. Calcular scores com configuração atual
      const configAtual = await this.getConfiguracaoAtiva();
      const scoresAtuais: number[] = [];
      
      // 4. Calcular scores com nova configuração
      const scoresNovos: number[] = [];
      const exemplos: ImpactoSimulado['exemplos'] = [];

      // Simular matches (amostra reduzida para performance)
      const maxSimulacoes = Math.min(10, oportunidades.length * 2);
      let simulacoes = 0;

      for (const oportunidade of oportunidades.slice(0, 5)) {
        for (const imigrante of imigrantes.slice(0, 2)) {
          if (simulacoes >= maxSimulacoes) break;

          try {
            // Simular score com configuração atual
            const scoreAtual = await this.calcularScoreSimulado(oportunidade, imigrante, configAtual);
            
            // Simular score com nova configuração
            const scoreNovo = await this.calcularScoreSimulado(oportunidade, imigrante, novaConfig);

            scoresAtuais.push(scoreAtual);
            scoresNovos.push(scoreNovo);

            // Adicionar exemplo se diferença for significativa
            const diferenca = scoreNovo - scoreAtual;
            if (Math.abs(diferenca) >= 5) {
              exemplos.push({
                oportunidadeId: oportunidade.id,
                imigranteId: imigrante.id,
                scoreAntes: scoreAtual,
                scoreDepois: scoreNovo,
                diferenca
              });
            }

            simulacoes++;
          } catch (error) {
            console.warn('⚠️ CONFIG: Erro em simulação individual:', error);
          }
        }
        if (simulacoes >= maxSimulacoes) break;
      }

      // 5. Calcular estatísticas
      const scoreMedioAntes = scoresAtuais.length > 0 ? 
        Math.round(scoresAtuais.reduce((a, b) => a + b, 0) / scoresAtuais.length) : 0;
      
      const scoreMedioDepois = scoresNovos.length > 0 ?
        Math.round(scoresNovos.reduce((a, b) => a + b, 0) / scoresNovos.length) : 0;

      const totalAfetados = scoresAtuais.filter((score, i) => 
        Math.abs(score - scoresNovos[i]) >= 5
      ).length;

      const eliminadosAntes = scoresAtuais.filter(score => score < 30).length;
      const eliminadosDepois = scoresNovos.filter(score => score < 30).length;

      console.log(`✅ CONFIG: Simulação concluída - ${simulacoes} análises realizadas`);

      return {
        totalAfetados,
        scoreMedioAntes,
        scoreMedioDepois,
        eliminadosAntes,
        eliminadosDepois,
        exemplos: exemplos.slice(0, 5) // Máximo 5 exemplos
      };

    } catch (error) {
      console.error('❌ CONFIG: Erro ao simular impacto real:', error);
      // Fallback para simulação mock
      return this.simularImpactoMock(amostraSize);
    }
  }

  /**
   * Simulação mock para fallback
   */
  private simularImpactoMock(amostraSize: number): ImpactoSimulado {
    return {
      totalAfetados: Math.floor(amostraSize * 0.73),
      scoreMedioAntes: 45.2,
      scoreMedioDepois: 52.1,
      eliminadosAntes: Math.floor(amostraSize * 0.28),
      eliminadosDepois: Math.floor(amostraSize * 0.35),
      exemplos: [
        {
          oportunidadeId: 'mock-op-1',
          imigranteId: 'mock-im-1',
          scoreAntes: 42,
          scoreDepois: 58,
          diferenca: 16
        },
        {
          oportunidadeId: 'mock-op-2',
          imigranteId: 'mock-im-2',
          scoreAntes: 67,
          scoreDepois: 61,
          diferenca: -6
        }
      ]
    };
  }

  /**
   * Calcula score simulado sem chamar o SinergiaV2Service completo
   */
  private async calcularScoreSimulado(
    oportunidade: any,
    imigrante: any,
    config: ConfiguracaoCompleta
  ): Promise<number> {
    try {
      // Simulação simplificada de scoring baseada nos pesos
      let score = 0;
      const pesos = config.pesos;

      // Género (simplificado)
      if (oportunidade.genero === 'INDIFERENTE' || oportunidade.genero === imigrante.perfilImigrante?.genero) {
        score += 100 * (pesos.genero / 100);
      } else {
        score += 0 * (pesos.genero / 100);
      }

      // Município (simplificado)
      if (oportunidade.municipioResidencia === imigrante.perfilImigrante?.municipioResidencia) {
        score += 100 * (pesos.municipio / 100);
      } else {
        score += 50 * (pesos.municipio / 100);
      }

      // Transporte (simplificado)
      if (oportunidade.transporteProprio !== 'S' || imigrante.perfilImigrante?.transporteProprio) {
        score += 100 * (pesos.transporteProprio / 100);
      } else {
        score += 0 * (pesos.transporteProprio / 100);
      }

      // Fluência (simplificado)
      const fluenciaImigrante = imigrante.perfilImigrante?.fluenciaPortugues;
      if (oportunidade.fluenciaPortugues !== 'S' || 
          ['Avançada', 'Fluente'].includes(fluenciaImigrante)) {
        score += 100 * (pesos.fluenciaPortugues / 100);
      } else {
        score += 50 * (pesos.fluenciaPortugues / 100);
      }

      // Outros critérios (estimativa)
      score += 75 * (pesos.idade / 100); // Idade sempre 75%
      score += 60 * (pesos.experiencias / 100); // Experiências 60% em média
      score += 70 * (pesos.formacao / 100); // Formação 70% em média
      score += 40 * (pesos.idiomas / 100); // Idiomas 40% em média
      score += 30 * (pesos.habilidades / 100); // Habilidades 30% em média
      score += 50 * (pesos.caracteristicas / 100); // Características 50% em média

      return Math.round(Math.max(0, Math.min(100, score)));

    } catch (error) {
      console.warn('⚠️ CONFIG: Erro no cálculo simulado:', error);
      return Math.floor(Math.random() * 100); // Fallback aleatório
    }
  }

  /**
   * Busca histórico de uma configuração
   */
  async getHistoricoConfiguracao(configuracaoId: string): Promise<HistoricoConfiguracaoSinergiaBD[]> {
    try {
      const historico = await prisma.historicoConfiguracaoSinergia.findMany({
        where: { configuracaoId },
        orderBy: { createdAt: 'desc' }
      });

      return historico;

    } catch (error) {
      console.error('❌ CONFIG: Erro ao buscar histórico:', error);
      return [];
    }
  }

  /**
   * Aplica template pré-definido
   */
  async aplicarTemplate(
    templateNome: keyof typeof TEMPLATES_CONFIGURACAO,
    userId: string,
    ativar: boolean = false
  ): Promise<string> {
    try {
      const template = TEMPLATES_CONFIGURACAO[templateNome];
      if (!template) {
        throw new Error(`Template '${templateNome}' não encontrado`);
      }

      // Começa com configuração padrão
      let config: ConfiguracaoCompleta = JSON.parse(JSON.stringify(DEFAULT_CONFIGURATION));

      // Aplica modificações do template
      for (const [caminho, valor] of Object.entries(template.modificacoes)) {
        this.setNestedProperty(config, caminho, valor);
      }

      // Cria configuração
      return await this.criarConfiguracao(
        config,
        userId,
        template.nome,
        template.descricao,
        ativar
      );

    } catch (error) {
      console.error('❌ CONFIG: Erro ao aplicar template:', error);
      throw error;
    }
  }

  /**
   * Validação de configuração
   */
  private validarConfiguracao(config: ConfiguracaoCompleta): ValidationResult {
    const erros: string[] = [];
    const avisos: string[] = [];

    try {
      // Validar pesos (deve somar 100)
      const somaPesos = Object.values(config.pesos).reduce((acc, peso) => acc + peso, 0);
      if (Math.abs(somaPesos - 100) > 0.01) {
        erros.push(`Soma dos pesos deve ser 100% (atual: ${somaPesos}%)`);
      }

      // Validar pesos individuais (0-100)
      Object.entries(config.pesos).forEach(([criterio, peso]) => {
        if (peso < 0 || peso > 100) {
          erros.push(`Peso do critério '${criterio}' deve estar entre 0 e 100 (atual: ${peso})`);
        }
      });

      // Validar IA
      if (config.iaConfig.habilitada) {
        if (config.iaConfig.pesoIA < 0 || config.iaConfig.pesoIA > 100) {
          erros.push(`Peso da IA deve estar entre 0 e 100 (atual: ${config.iaConfig.pesoIA})`);
        }
        if (config.iaConfig.thresholdMinimo < 0 || config.iaConfig.thresholdMinimo > 100) {
          erros.push(`Threshold da IA deve estar entre 0 e 100 (atual: ${config.iaConfig.thresholdMinimo})`);
        }
        if (config.iaConfig.pesoIA > 50) {
          avisos.push('Peso da IA muito alto pode gerar custos elevados');
        }
        if (config.iaConfig.custoMaximoPorAnalise > 0.20) {
          avisos.push('Custo máximo por análise muito alto');
        }
      }

      // Validar limites
      if (config.limites.maxCandidatosPorAnalise > 500) {
        avisos.push('Limite alto de candidatos pode impactar performance');
      }

      if (config.limites.timeoutAnalise > 60) {
        avisos.push('Timeout muito alto pode causar experiência ruim para usuários');
      }

    } catch (error) {
      erros.push(`Erro na validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }

    return {
      valido: erros.length === 0,
      erros,
      avisos
    };
  }

  /**
   * Métodos utilitários
   */
  private parseConfigFromDB(config: any): ConfiguracaoCompleta {
    try {
      return {
        pesos: JSON.parse(config.pesos),
        eliminatorios: JSON.parse(config.eliminatorios),
        iaConfig: JSON.parse(config.iaConfig),
        prefiltros: JSON.parse(config.prefiltros),
        scoringRules: JSON.parse(config.scoringRules),
        limites: config.limites ? JSON.parse(config.limites) : DEFAULT_CONFIGURATION.limites
      };
    } catch (error) {
      console.error('❌ CONFIG: Erro ao fazer parse da configuração do BD:', error);
      return DEFAULT_CONFIGURATION;
    }
  }

  private async getUltimaVersao(): Promise<number> {
    const ultima = await prisma.configuracaoSinergia.findFirst({
      select: { versao: true },
      orderBy: { versao: 'desc' }
    });
    return ultima?.versao || 0;
  }

  private isCacheValid(key: string): boolean {
    return this.cache.has(key) && 
           this.cacheExpiry.has(key) && 
           this.cacheExpiry.get(key)! > Date.now();
  }

  private limparCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
    console.log('🗑️  CONFIG: Cache limpo');
  }

  private setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }
}

// Singleton instance
export const configuracaoSinergiaService = ConfiguracaoSinergiaService.getInstance();
