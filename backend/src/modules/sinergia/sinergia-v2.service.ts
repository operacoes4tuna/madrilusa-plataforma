import OpenAI from 'openai';
import { prisma } from '../../shared/database';
import type { 
  RigorousMatch,
  MatchingCriteria,
  ImigranteCompleteProfile,
  OportunidadeCompleteData,
  MatchOptions,
  SemanticAnalysis,
  ScoringWeights
} from './sinergia-v2.types';
import { DEFAULT_WEIGHTS } from './sinergia-v2.types';
import { SinergiaV2AnalyticsService } from './sinergia-v2-analytics.service';
import { configuracaoSinergiaService } from './configuracao-sinergia.service';
import type { ConfiguracaoCompleta, IAConfiguration } from './sinergia-config.types';
import { systemEventEmitter } from '../../shared/event-emitter';
import { syncManager } from '../../shared/sync-manager';

export class SinergiaV2Service {
  private openai: OpenAI;
  private weights: ScoringWeights;
  private analytics: SinergiaV2AnalyticsService;
  private configCache: ConfiguracaoCompleta | null = null;
  private configCacheExpiry: number = 0;
  private readonly CONFIG_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.weights = DEFAULT_WEIGHTS;
    this.analytics = SinergiaV2AnalyticsService.getInstance();
    
    // Configurar listeners para eventos de configuração
    this.setupEventListeners();
    
    // Registrar no sync manager
    syncManager.registerService({
      serviceName: 'SinergiaV2Service',
      clearCache: () => this.clearConfigCache()
    });
  }

  /**
   * Configurar listeners para eventos de configuração
   */
  private setupEventListeners(): void {
    // Listener para configuração ativada
    systemEventEmitter.onEvent(
      'configuracao:ativada',
      async (data) => {
        console.log(`🔄 SINERGIA V2: Configuração ativada (v${data.versao} - ${data.nome}), invalidando cache`);
        this.clearConfigCache();
        // Pré-carregar nova configuração
        await this.getConfiguracao();
      },
      'SinergiaV2Service'
    );

    // Listener para configuração atualizada
    systemEventEmitter.onEvent(
      'configuracao:atualizada',
      async (data) => {
        console.log(`🔄 SINERGIA V2: Configuração atualizada (v${data.versao} - ${data.nome}), invalidando cache`);
        this.clearConfigCache();
        // Pré-carregar nova configuração se for a ativa
        try {
          await this.getConfiguracao();
        } catch (error) {
          console.error('❌ SINERGIA V2: Erro ao recarregar configuração:', error);
        }
      },
      'SinergiaV2Service'
    );

    // Listener para invalidação específica de cache
    systemEventEmitter.onEvent(
      'cache:invalidar',
      (data) => {
        if (data.servico === 'SinergiaV2Service' || data.servico === 'all') {
          console.log(`🧹 SINERGIA V2: Cache invalidado - ${data.motivo}`);
          this.clearConfigCache();
        }
      },
      'SinergiaV2Service'
    );

    // Listener para limpeza total de cache
    systemEventEmitter.onEvent(
      'cache:limpar',
      (data) => {
        if (data.servicos.includes('SinergiaV2Service') || data.servicos.includes('all')) {
          console.log('🧹 SINERGIA V2: Limpeza total de cache solicitada');
          this.clearConfigCache();
        }
      },
      'SinergiaV2Service'
    );

    console.log('📡 SINERGIA V2: Event listeners configurados');
  }

  /**
   * Busca configuração ativa com cache
   */
  private async getConfiguracao(): Promise<ConfiguracaoCompleta> {
    try {
      // Verifica cache
      if (this.configCache && this.configCacheExpiry > Date.now()) {
        return this.configCache;
      }

      // Busca nova configuração
      const config = await configuracaoSinergiaService.getConfiguracaoAtiva();
      
      // Atualiza cache
      this.configCache = config;
      this.configCacheExpiry = Date.now() + this.CONFIG_CACHE_DURATION;
      
      // Atualiza pesos locais para compatibilidade
      this.weights = config.pesos;
      
      console.log('🎛️  SINERGIA V2: Configuração atualizada');
      console.log(`🤖 IA Config: Modelo ${config.iaConfig.modelo}, Threshold ${config.iaConfig.thresholdMinimo}%, Peso IA ${config.iaConfig.pesoIA}%`);
      console.log(`💰 IA Limits: Max Tokens ${config.iaConfig.maxTokens}, Custo Max $${config.iaConfig.custoMaximoPorAnalise}`);
      return config;

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro ao buscar configuração, usando padrão:', error);
      
      // Fallback para configuração padrão
      const defaultConfig = await configuracaoSinergiaService.getConfiguracaoAtiva();
      this.weights = defaultConfig.pesos;
      return defaultConfig;
    }
  }

  /**
   * Limpa cache de configuração (usado quando configuração é alterada)
   */
  clearConfigCache(): void {
    this.configCache = null;
    this.configCacheExpiry = 0;
    console.log('🧹 SINERGIA V2: Cache de configuração limpo');
  }

  /**
   * Método público para limpeza de cache (usado pelo Event Emitter)
   */
  public limparCacheConfiguracao(): void {
    this.clearConfigCache();
  }

  /**
   * Análise focada: Para uma oportunidade, encontrar imigrantes compatíveis
   */
  async analyzeOpportunityMatches(
    oportunidadeId: string,
    options: MatchOptions = {}
  ): Promise<RigorousMatch[]> {
    const startTime = Date.now();
    
    try {
      console.log(`🧠 SINERGIA V2: Analisando oportunidade ${oportunidadeId}`);
      
      // 1. Buscar dados completos da oportunidade
      const oportunidade = await this.getOportunidadeCompleta(oportunidadeId);
      if (!oportunidade) {
        throw new Error('Oportunidade não encontrada');
      }

      // 2. Buscar todos os imigrantes ativos
      const imigrantes = await this.getAllImigrantesCompletos();
      console.log(`📊 Encontrados ${imigrantes.length} imigrantes para análise`);

      // 3. Pré-filtro para eliminar incompatibilidades absolutas
      const candidatesPreFiltered = await this.preFilterCandidates(oportunidade, imigrantes);
      console.log(`🔍 Pré-filtro: ${candidatesPreFiltered.length} candidatos viáveis`);

      // 4. Análise rigorosa para cada candidato
      const matches: RigorousMatch[] = [];
      
      for (const imigrante of candidatesPreFiltered) {
        const match = await this.analyzeRigorousMatch(oportunidade, imigrante, options);
        
        // Aplicar filtro de score mínimo
        if (match.scoreTotal >= (options.minScore || 0)) {
          matches.push(match);
        }
      }

      // 5. Ordenar por score e limitar resultados
      matches.sort((a, b) => b.scoreTotal - a.scoreTotal);
      const limitedMatches = matches.slice(0, options.maxResults || 100);

      const processingTime = Date.now() - startTime;
      console.log(`✅ SINERGIA V2: ${limitedMatches.length} matches em ${processingTime}ms`);

      return limitedMatches;

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro na análise:', error);
      throw error;
    }
  }

  /**
   * Análise reversa: Para um imigrante, encontrar oportunidades compatíveis
   */
  async analyzeImigranteOpportunities(
    imigranteId: string,
    options: MatchOptions = {}
  ): Promise<RigorousMatch[]> {
    const startTime = Date.now();
    
    try {
      console.log(`🧠 SINERGIA V2: Analisando imigrante ${imigranteId}`);
      
      // 1. Buscar dados completos do imigrante
      const imigrante = await this.getImigranteCompleto(imigranteId);
      if (!imigrante) {
        throw new Error('Imigrante não encontrado');
      }

      // 2. Buscar todas as oportunidades ativas
      const oportunidades = await this.getAllOportunidadesCompletas();
      console.log(`📊 Encontradas ${oportunidades.length} oportunidades para análise`);

      // 3. Análise rigorosa para cada oportunidade
      const matches: RigorousMatch[] = [];
      
      for (const oportunidade of oportunidades) {
        const match = await this.analyzeRigorousMatch(oportunidade, imigrante, options);
        
        // Aplicar filtro de score mínimo
        if (match.scoreTotal >= (options.minScore || 0)) {
          matches.push(match);
        }
      }

      // 4. Ordenar por score e limitar resultados
      matches.sort((a, b) => b.scoreTotal - a.scoreTotal);
      const limitedMatches = matches.slice(0, options.maxResults || 100);

      const processingTime = Date.now() - startTime;
      console.log(`✅ SINERGIA V2: ${limitedMatches.length} matches em ${processingTime}ms`);

      return limitedMatches;

    } catch (error) {
      console.error('❌ SINERGIA V2: Erro na análise:', error);
      throw error;
    }
  }

  /**
   * Pré-filtro para eliminar incompatibilidades absolutas (sem IA)
   * Agora usa configuração parametrizável
   */
  private async preFilterCandidates(
    oportunidade: OportunidadeCompleteData,
    imigrantes: ImigranteCompleteProfile[]
  ): Promise<ImigranteCompleteProfile[]> {
    const config = await this.getConfiguracao();
    
    return imigrantes.filter(imigrante => {
      // 1. Filtro por género (configurável)
      if (config.prefiltros.genero.ativo && config.prefiltros.genero.eliminarSeNaoCorresponder) {
        if (oportunidade.genero && oportunidade.genero !== 'INDIFERENTE') {
          if (!imigrante.genero || imigrante.genero !== oportunidade.genero) {
            return false;
          }
        }
      }

      // 2. Filtro por transporte (configurável)
      if (config.prefiltros.transporteProprio.ativo && config.prefiltros.transporteProprio.eliminarSeObrigatorioENaoTem) {
        if (oportunidade.transporteProprio === 'S') {
          if (!imigrante.transporteProprio) {
            return false;
          }
        }
      }

      // 3. Filtro por fluência (configurável)
      if (config.prefiltros.fluenciaPortugues.ativo && config.prefiltros.fluenciaPortugues.eliminarSeObrigatorioENaoTem) {
        if (oportunidade.fluenciaPortugues === 'S') {
          const niveisAceitaveis = config.prefiltros.fluenciaPortugues.niveisMinimos;
          if (!imigrante.fluenciaPortugues || !niveisAceitaveis.includes(imigrante.fluenciaPortugues)) {
            return false;
          }
        }
      }

      return true;
    });
  }

  /**
   * Análise rigorosa de matching entre oportunidade e imigrante
   * Agora usa configuração parametrizável
   */
  private async analyzeRigorousMatch(
    oportunidade: OportunidadeCompleteData,
    imigrante: ImigranteCompleteProfile,
    options: MatchOptions
  ): Promise<RigorousMatch> {
    const startTime = Date.now();
    const config = await this.getConfiguracao();

    // 1. Calcular scores estruturados (sem IA) usando configuração
    const breakdown = this.calculateStructuredScore(oportunidade, imigrante, config);

    // 2. Calcular score total ponderado usando pesos da configuração
    const scoreTotal = this.calculateWeightedScore(breakdown, config.pesos);

    // 3. Análise semântica com IA (configurável)
    let semanticAnalysis: SemanticAnalysis | null = null;
    let tokensUsed = 0;
    let finalScore = scoreTotal;

    if (options.useAI !== false && config.iaConfig.habilitada && scoreTotal >= config.iaConfig.thresholdMinimo) {
      try {
        semanticAnalysis = await this.analyzeSemanticCompatibility(oportunidade, imigrante, breakdown, config.iaConfig);
        tokensUsed = semanticAnalysis.tokensUsed;
        
        // Combinar score estruturado com análise semântica usando peso configurável
        if (semanticAnalysis.tokensUsed > 0) { // Só se IA foi usada
          const pesoEstruturado = (100 - config.iaConfig.pesoIA) / 100;
          const pesoIA = config.iaConfig.pesoIA / 100;
          finalScore = Math.round((scoreTotal * pesoEstruturado) + (semanticAnalysis.score * pesoIA));
          console.log(`🔄 Score ajustado: ${scoreTotal} → ${finalScore} (com IA ${config.iaConfig.pesoIA}%)`);
        }
      } catch (error) {
        console.warn('⚠️ Erro na análise semântica, continuando sem IA:', error);
      }
    }

    // 4. Gerar listas de matches e gaps
    const { matchedItems, unmatchedItems, penalizacoes } = this.generateMatchLists(breakdown);

    // 5. Gerar justificativa
    const justificativa = this.generateJustificativa(breakdown, semanticAnalysis);

    const processingTime = Date.now() - startTime;

    // Registrar analytics
    await this.analytics.recordAnalysis({
      timestamp: new Date(),
      oportunidadeId: oportunidade.id,
      imigranteId: imigrante.id,
      scoreTotal: finalScore,
      tokensUsed,
      processingTime,
      usedAI: semanticAnalysis !== null && semanticAnalysis.tokensUsed > 0,
      breakdown
    });

    return {
      oportunidadeId: oportunidade.id,
      imigranteId: imigrante.id,
      scoreTotal: finalScore,
      breakdown,
      justificativa,
      tokensUsed,
      matchedItems,
      unmatchedItems,
      penalizacoes,
      createdAt: new Date().toISOString(),
      
      // DADOS COMPLETOS PARA MELHOR VISUALIZAÇÃO
      oportunidade: {
        titulo: oportunidade.titulo,
        nomeCargo: oportunidade.nomeCargo,
        nomeProfissao: oportunidade.nomeProfissao,
        descricaoCargo: oportunidade.descricaoCargo,
        empresa: (oportunidade as any).user?.nomeCompleto || 'Empresa',
        municipioResidencia: oportunidade.municipioResidencia,
        genero: oportunidade.genero,
        idade: oportunidade.idade,
        transporteProprio: oportunidade.transporteProprio,
        fluenciaPortugues: oportunidade.fluenciaPortugues,
        denominacoes: oportunidade.denominacoes,
        experienciasAceitas: oportunidade.experienciasAceitas,
        areasFormacao: oportunidade.areasFormacao,
        habilidades: oportunidade.habilidades,
        caracteristicas: oportunidade.caracteristicas,
        idiomasPreferenciais: oportunidade.idiomasPreferenciais,
        nivelEscolaridade: oportunidade.nivelEscolaridade
      },
      
      imigrante: {
        nomeCompleto: imigrante.nomeCompleto,
        email: imigrante.email,
        municipioResidencia: imigrante.municipioResidencia,
        genero: imigrante.genero,
        idade: imigrante.idade,
        transporteProprio: imigrante.transporteProprio,
        fluenciaPortugues: imigrante.fluenciaPortugues,
        objetivos: imigrante.objetivos,
        experiencias: imigrante.experiencias,
        formacoes: imigrante.formacoes,
        idiomas: imigrante.idiomas,
        habilidades: imigrante.habilidades,
        contribuicoesTexto: imigrante.contribuicoesTexto,
        interesses: imigrante.interesses
      },
      
      // DADOS ESTRUTURADOS PARA COMPARAÇÃO VISUAL
      dadosEstruturados: {
        empresa: (oportunidade as any).user?.nomeCompleto || 'Empresa',
        municipioResidencia: oportunidade.municipioResidencia,
        genero: oportunidade.genero,
        idade: oportunidade.idade,
        transporteProprio: oportunidade.transporteProprio,
        fluenciaPortugues: oportunidade.fluenciaPortugues
      }
    };
  }

  /**
   * Calcular scores estruturados sem IA
   * Agora usa configuração parametrizável
   */
  private calculateStructuredScore(
    oportunidade: OportunidadeCompleteData,
    imigrante: ImigranteCompleteProfile,
    config: ConfiguracaoCompleta
  ): MatchingCriteria {
    
    // 1. GÉNERO
    const genero = {
      match: this.matchGenero(oportunidade.genero, imigrante.genero),
      required: oportunidade.genero !== 'INDIFERENTE',
      score: 0,
      details: ''
    };
    genero.score = genero.match ? 100 : (genero.required ? 0 : 50);
    genero.details = this.generateGeneroDetails(oportunidade.genero, imigrante.genero, genero.match);

    // 2. IDADE
    const idade = this.calculateIdadeMatch(oportunidade.idade ?? undefined, imigrante.idade ?? undefined);

    // 3. MUNICÍPIO
    const municipio = this.calculateMunicipioMatch(oportunidade.municipioResidencia ?? undefined, imigrante.municipioResidencia ?? undefined);

    // 4. TRANSPORTE
    const transporteProprio = this.calculateTransporteMatch(oportunidade.transporteProprio, imigrante.transporteProprio);

    // 5. FLUÊNCIA
    const fluenciaPortugues = this.calculateFluenciaMatch(oportunidade.fluenciaPortugues, imigrante.fluenciaPortugues);

    // 6. EXPERIÊNCIAS
    const experiencias = this.calculateExperienciaMatch(oportunidade.experienciasAceitas, imigrante.experiencias);

    // 7. FORMAÇÃO
    const formacao = this.calculateFormacaoMatch(
      oportunidade.nivelEscolaridade,
      oportunidade.areasFormacao,
      imigrante.formacoes
    );

    // 8. IDIOMAS
    const idiomas = this.calculateIdiomasMatch(oportunidade.idiomasPreferenciais, imigrante.idiomas);

    // 9. HABILIDADES
    const habilidades = this.calculateHabilidadesMatch(oportunidade.habilidades, imigrante.habilidades);

    // 10. CARACTERÍSTICAS
    const caracteristicas = this.calculateCaracteristicasMatch(oportunidade.caracteristicas, imigrante.interesses);

    return {
      genero,
      idade,
      municipio,
      transporteProprio,
      fluenciaPortugues,
      experiencias,
      formacao,
      idiomas,
      habilidades,
      caracteristicas
    };
  }

  /**
   * Métodos auxiliares de matching específicos
   */
  private matchGenero(oportunidadeGenero: string | null, imigranteGenero?: string): boolean {
    if (!oportunidadeGenero || oportunidadeGenero === 'INDIFERENTE') return true;
    if (!imigranteGenero) return false;
    return oportunidadeGenero === imigranteGenero;
  }

  private calculateIdadeMatch(oportunidadeIdade?: string, imigranteIdade?: number) {
    // Implementar lógica de idade baseada na string da oportunidade
    return {
      match: true, // Placeholder
      difference: 0,
      score: 100,
      details: 'Idade compatível'
    };
  }

  private calculateMunicipioMatch(oportunidadeMunicipio?: string, imigranteMunicipio?: string) {
    const match = oportunidadeMunicipio === imigranteMunicipio;
    return {
      match,
      distance: match ? 0 : 100, // Placeholder para distância
      score: match ? 100 : 50,
      details: match ? 'Mesmo município' : 'Municípios diferentes'
    };
  }

  private calculateTransporteMatch(oportunidadeTransporte: string | null, imigranteTransporte?: boolean) {
    const required = oportunidadeTransporte === 'S';
    const match = required ? !!imigranteTransporte : true;
    
    return {
      match,
      required,
      score: match ? 100 : (required ? 0 : 75),
      details: required ? 
        (imigranteTransporte ? 'Transporte próprio confirmado' : 'Transporte próprio necessário mas não disponível') :
        'Transporte próprio não é requisito'
    };
  }

  private calculateFluenciaMatch(oportunidadeFluencia: string | null, imigranteFluencia?: string) {
    const required = oportunidadeFluencia === 'S';
    const niveisAceitaveis = ['Avançada', 'Fluente'];
    const match = required ? (imigranteFluencia && niveisAceitaveis.includes(imigranteFluencia)) : true;
    
    return {
      match: !!match,
      level: imigranteFluencia || 'Não informado',
      score: match ? 100 : (required ? 0 : 75),
      details: required ?
        (match ? `Fluência ${imigranteFluencia} atende requisito` : 'Fluência insuficiente para requisito') :
        'Fluência em português não é requisito obrigatório'
    };
  }

  private calculateExperienciaMatch(experienciasAceitas: string[], imigranteExperiencias: any[]) {
    const matches: string[] = [];
    
    // Comparar experiências do imigrante com as aceitas
    imigranteExperiencias.forEach(exp => {
      experienciasAceitas.forEach(aceita => {
        if (exp.cargo.toLowerCase().includes(aceita.toLowerCase()) ||
            aceita.toLowerCase().includes(exp.cargo.toLowerCase())) {
          matches.push(exp.cargo);
        }
      });
    });

    const percentage = experienciasAceitas.length > 0 ? 
      (matches.length / experienciasAceitas.length) * 100 : 0;

    return {
      matches,
      total: experienciasAceitas.length,
      percentage,
      score: percentage,
      details: `${matches.length} de ${experienciasAceitas.length} experiências compatíveis`
    };
  }

  private calculateFormacaoMatch(
    nivelEscolaridade?: string,
    areasFormacao: string[] = [],
    imigranteFormacoes: any[] = []
  ) {
    // Placeholder - implementar lógica de formação
    return {
      match: true,
      areas: areasFormacao,
      score: 75,
      details: 'Formação compatível'
    };
  }

  private calculateIdiomasMatch(idiomasPreferenciais: any[], imigranteIdiomas: any[]) {
    const matches: string[] = [];
    const levels: string[] = [];

    idiomasPreferenciais.forEach(prefIdioma => {
      const match = imigranteIdiomas.find(imiIdioma => 
        imiIdioma.idioma.toLowerCase() === prefIdioma.idioma.toLowerCase()
      );
      
      if (match) {
        matches.push(match.idioma);
        levels.push(match.nivel);
      }
    });

    const score = idiomasPreferenciais.length > 0 ?
      (matches.length / idiomasPreferenciais.length) * 100 : 100;

    return {
      matches,
      levels,
      score,
      details: `${matches.length} de ${idiomasPreferenciais.length} idiomas compatíveis`
    };
  }

  private calculateHabilidadesMatch(oportunidadeHabilidades: string[], imigranteHabilidades: string[]) {
    const matches = oportunidadeHabilidades.filter(hab =>
      imigranteHabilidades.some(imiHab => 
        imiHab.toLowerCase().includes(hab.toLowerCase()) ||
        hab.toLowerCase().includes(imiHab.toLowerCase())
      )
    );

    const percentage = oportunidadeHabilidades.length > 0 ?
      (matches.length / oportunidadeHabilidades.length) * 100 : 100;

    return {
      matches,
      percentage,
      score: percentage,
      details: `${matches.length} de ${oportunidadeHabilidades.length} habilidades compatíveis`
    };
  }

  private calculateCaracteristicasMatch(oportunidadeCaracteristicas: string[], imigranteInteresses: string[]) {
    // Placeholder - matching de características de personalidade
    return {
      matches: [],
      percentage: 50,
      score: 50,
      details: 'Análise de características em desenvolvimento'
    };
  }

  /**
   * Calcular score total ponderado
   * Agora usa pesos configuráveis
   */
  private calculateWeightedScore(breakdown: MatchingCriteria, weights: ScoringWeights): number {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    
    let weightedSum = 0;
    weightedSum += breakdown.genero.score * (weights.genero / totalWeight);
    weightedSum += breakdown.idade.score * (weights.idade / totalWeight);
    weightedSum += breakdown.municipio.score * (weights.municipio / totalWeight);
    weightedSum += breakdown.transporteProprio.score * (weights.transporteProprio / totalWeight);
    weightedSum += breakdown.fluenciaPortugues.score * (weights.fluenciaPortugues / totalWeight);
    weightedSum += breakdown.experiencias.score * (weights.experiencias / totalWeight);
    weightedSum += breakdown.formacao.score * (weights.formacao / totalWeight);
    weightedSum += breakdown.idiomas.score * (weights.idiomas / totalWeight);
    weightedSum += breakdown.habilidades.score * (weights.habilidades / totalWeight);
    weightedSum += breakdown.caracteristicas.score * (weights.caracteristicas / totalWeight);

    return Math.round(weightedSum);
  }

  /**
   * Análise semântica com IA (apenas para scores altos)
   * Agora usa configuração de IA parametrizável
   */
  private async analyzeSemanticCompatibility(
    oportunidade: OportunidadeCompleteData,
    imigrante: ImigranteCompleteProfile,
    structuredScore: MatchingCriteria,
    iaConfig: IAConfiguration
  ): Promise<SemanticAnalysis> {
    const startTime = Date.now();
    
    try {
      console.log(`🤖 IA: Iniciando análise semântica para match ${oportunidade.id} ↔ ${imigrante.id}`);
      console.log(`🤖 IA: Usando configuração - Modelo: ${iaConfig.modelo}, Temp: ${iaConfig.temperatura}, Max Tokens: ${iaConfig.maxTokens}`);
      
      // Validar modelo disponível
      const modeloFinal = this.validarModeloDisponivel(iaConfig.modelo);
      if (modeloFinal !== iaConfig.modelo) {
        console.warn(`⚠️ IA: Modelo ${iaConfig.modelo} não disponível, usando fallback: ${modeloFinal}`);
      }
      
      // Construir prompt otimizado
      const prompt = this.buildSemanticAnalysisPrompt(oportunidade, imigrante, structuredScore);
      
      const completion = await this.openai.chat.completions.create({
        model: modeloFinal,
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt()
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        temperature: iaConfig.temperatura,
        max_tokens: iaConfig.maxTokens
      });

      const response = completion.choices[0]?.message?.content;
      const tokensUsed = completion.usage?.total_tokens || 0;
      
      // Validar custo máximo da análise
      const custoEstimado = this.calcularCustoTokens(tokensUsed, modeloFinal);
      if (custoEstimado > iaConfig.custoMaximoPorAnalise) {
        console.warn(`⚠️ IA: Custo excedido: $${custoEstimado.toFixed(4)} > $${iaConfig.custoMaximoPorAnalise} - Continuando com aviso`);
        // Não lança erro, apenas avisa - decisão de design para não quebrar o matching
      }
      
      console.log(`💰 IA: Custo da análise: $${custoEstimado.toFixed(4)} (${tokensUsed} tokens)`);
      
      if (!response) {
        throw new Error('Resposta vazia da IA');
      }

      // Parse da resposta (tentar JSON, fallback para texto)
      let analysis: any = {};
      
      try {
        // Tentar extrair JSON da resposta
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: analisar texto livre
          analysis = this.parseTextResponse(response);
        }
      } catch (parseError) {
        console.warn('⚠️ Erro no parse JSON, usando análise de texto:', parseError);
        analysis = this.parseTextResponse(response);
      }
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ IA: Análise semântica concluída em ${processingTime}ms, tokens: ${tokensUsed}`);

      return {
        experienciasMatched: analysis.experiencias_matched || [],
        experienciasMissing: analysis.experiencias_missing || [],
        habilidadesMatched: analysis.habilidades_matched || [],
        habilidadesMissing: analysis.habilidades_missing || [],
        score: Math.min(100, Math.max(0, analysis.score || 50)),
        justificativa: analysis.justificativa || response.substring(0, 500),
        tokensUsed
      };

    } catch (error) {
      console.error('❌ IA: Erro na análise semântica:', error);
      console.log(`🔄 IA: Fallback para análise sem IA (configuração: ${iaConfig.modelo}, max tokens: ${iaConfig.maxTokens})`);
      
      // Fallback: retornar análise básica sem IA
      return {
        experienciasMatched: structuredScore.experiencias.matches.slice(0, 3),
        experienciasMissing: [],
        habilidadesMatched: structuredScore.habilidades.matches.slice(0, 3),
        habilidadesMissing: [],
        score: Math.round(structuredScore.experiencias.score * 0.6 + structuredScore.habilidades.score * 0.4),
        justificativa: `Análise baseada em correspondência estruturada (IA indisponível: ${error instanceof Error ? error.message : 'Erro desconhecido'})`,
        tokensUsed: 0
      };
    }
  }

  /**
   * Métodos auxiliares de busca de dados
   */
  private async getOportunidadeCompleta(id: string): Promise<OportunidadeCompleteData | null> {
    const oportunidade = await prisma.oportunidadeTrabalho.findUnique({
      where: { id, ativo: true },
      include: {
        user: {
          select: {
            nomeCompleto: true,
            email: true
          }
        }
      }
    });

    if (!oportunidade) return null;

    return {
      ...oportunidade,
      denominacoes: JSON.parse(oportunidade.denominacoes || '[]') as string[],
      experienciasAceitas: JSON.parse(oportunidade.experienciasAceitas || '[]') as string[],
      areasFormacao: JSON.parse(oportunidade.areasFormacao || '[]') as string[],
      idiomasPreferenciais: JSON.parse(oportunidade.idiomasPreferenciais || '[]') as any[],
      habilidades: JSON.parse(oportunidade.habilidades || '[]') as string[],
      caracteristicas: JSON.parse(oportunidade.caracteristicas || '[]') as string[]
    } as OportunidadeCompleteData;
  }

  private async getAllOportunidadesCompletas(): Promise<OportunidadeCompleteData[]> {
    const oportunidades = await prisma.oportunidadeTrabalho.findMany({
      where: { ativo: true },
      include: {
        user: {
          select: {
            nomeCompleto: true,
            email: true
          }
        }
      }
    });

    return oportunidades.map(op => ({
      ...op,
      denominacoes: JSON.parse(op.denominacoes || '[]') as string[],
      experienciasAceitas: JSON.parse(op.experienciasAceitas || '[]') as string[],
      areasFormacao: JSON.parse(op.areasFormacao || '[]') as string[],
      idiomasPreferenciais: JSON.parse(op.idiomasPreferenciais || '[]') as any[],
      habilidades: JSON.parse(op.habilidades || '[]') as string[],
      caracteristicas: JSON.parse(op.caracteristicas || '[]') as string[]
    } as OportunidadeCompleteData));
  }

  private async getImigranteCompleto(id: string): Promise<ImigranteCompleteProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id, categoria: 'IMIGRANTE' },
      include: {
        perfilImigrante: true,
        contribuicoes: {
          where: { ativo: true },
          include: {
            tipoContribuicao: true
          }
        },
        dadosProfissionais: {
          where: { ativo: true }
        }
      }
    });

    if (!user) return null;

    return this.transformToCompleteProfile(user);
  }

  private async getAllImigrantesCompletos(): Promise<ImigranteCompleteProfile[]> {
    const users = await prisma.user.findMany({
      where: { categoria: 'IMIGRANTE' },
      include: {
        perfilImigrante: true,
        contribuicoes: {
          where: { ativo: true },
          include: {
            tipoContribuicao: true
          }
        },
        dadosProfissionais: {
          where: { ativo: true }
        }
      }
    });

    return users.map(user => this.transformToCompleteProfile(user));
  }

  private transformToCompleteProfile(user: any): ImigranteCompleteProfile {
    // Calcular idade se data de nascimento disponível
    let idade: number | undefined;
    if (user.perfilImigrante?.dataNascimento) {
      const hoje = new Date();
      const nascimento = new Date(user.perfilImigrante.dataNascimento);
      idade = hoje.getFullYear() - nascimento.getFullYear();
    }

    // Extrair dados profissionais
    const experiencias = user.dadosProfissionais
      .filter((dp: any) => dp.tipo === 'experiencia')
      .map((dp: any) => JSON.parse(dp.dados));

    const formacoes = user.dadosProfissionais
      .filter((dp: any) => dp.tipo === 'formacao')
      .map((dp: any) => JSON.parse(dp.dados));

    const idiomas = user.dadosProfissionais
      .filter((dp: any) => dp.tipo === 'idioma')
      .map((dp: any) => JSON.parse(dp.dados));

    // Extrair habilidades das contribuições
    const habilidades = user.contribuicoes.map((c: any) => c.descricao);
    const contribuicoesTexto = user.contribuicoes.map((c: any) => c.descricao);

    return {
      id: user.id,
      nomeCompleto: user.nomeCompleto,
      email: user.email,
      genero: user.perfilImigrante?.genero,
      municipioResidencia: user.perfilImigrante?.municipioResidencia,
      transporteProprio: user.perfilImigrante?.transporteProprio,
      fluenciaPortugues: user.perfilImigrante?.fluenciaPortugues,
      idade,
      experiencias: experiencias.flat(),
      formacoes: formacoes.flat(),
      idiomas: idiomas.flat(),
      habilidades,
      interesses: user.perfilImigrante?.objetivos || [],
      objetivos: user.perfilImigrante?.objetivos || [],
      contribuicoesTexto
    };
  }

  /**
   * Métodos auxiliares de geração de conteúdo
   */
  private generateGeneroDetails(oportunidadeGenero: string | null, imigranteGenero?: string, match?: boolean): string {
    if (!oportunidadeGenero || oportunidadeGenero === 'INDIFERENTE') {
      return 'Género não é critério para esta oportunidade';
    }
    
    if (match) {
      return `Género ${imigranteGenero} corresponde ao requisito`;
    } else {
      return `Género ${imigranteGenero || 'não informado'} não corresponde ao requisito (${oportunidadeGenero})`;
    }
  }

  private generateMatchLists(breakdown: MatchingCriteria) {
    const matchedItems: string[] = [];
    const unmatchedItems: string[] = [];
    const penalizacoes: string[] = [];

    // Analisar cada critério
    if (breakdown.genero.match) {
      matchedItems.push('Género compatível');
    } else if (breakdown.genero.required) {
      unmatchedItems.push('Género não corresponde ao requisito');
      penalizacoes.push('Critério eliminatório: género');
    }

    if (breakdown.transporteProprio.match) {
      matchedItems.push('Transporte próprio atende requisito');
    } else if (breakdown.transporteProprio.required) {
      unmatchedItems.push('Transporte próprio necessário mas não disponível');
      penalizacoes.push('Critério eliminatório: transporte');
    }

    // Adicionar matches de experiências
    breakdown.experiencias.matches.forEach(exp => {
      matchedItems.push(`Experiência: ${exp}`);
    });

    // Adicionar matches de idiomas
    breakdown.idiomas.matches.forEach(idioma => {
      matchedItems.push(`Idioma: ${idioma}`);
    });

    return { matchedItems, unmatchedItems, penalizacoes };
  }

  private generateJustificativa(breakdown: MatchingCriteria, semanticAnalysis: SemanticAnalysis | null): string {
    const pontos = [];

    // 1. CRITÉRIOS ELIMINATÓRIOS
    if (!breakdown.genero.match && breakdown.genero.required) {
      pontos.push(`❌ ELIMINATÓRIO: Género não corresponde ao requisito obrigatório`);
    }

    if (!breakdown.transporteProprio.match && breakdown.transporteProprio.required) {
      pontos.push(`❌ ELIMINATÓRIO: Transporte próprio necessário mas não disponível`);
    }

    // Verificação de critério eliminatório para fluência deve usar a configuração
    if (!breakdown.fluenciaPortugues.match && breakdown.fluenciaPortugues.score === 0) {
      pontos.push(`❌ ELIMINATÓRIO: Fluência em português insuficiente`);
    }

    // 2. PONTOS FORTES ESTRUTURADOS
    if (breakdown.genero.match && breakdown.genero.required) {
      pontos.push(`✅ Género corresponde ao requisito específico`);
    }
    
    if (breakdown.transporteProprio.match && breakdown.transporteProprio.required) {
      pontos.push(`✅ Transporte próprio disponível conforme necessário`);
    }

    if (breakdown.municipio.match) {
      pontos.push(`✅ Localização geográfica compatível (mesmo município)`);
    }

    if (breakdown.experiencias.percentage >= 70) {
      pontos.push(`✅ FORTE: ${breakdown.experiencias.percentage.toFixed(0)}% das experiências requeridas correspondem`);
    } else if (breakdown.experiencias.percentage >= 40) {
      pontos.push(`✅ ${breakdown.experiencias.percentage.toFixed(0)}% das experiências requeridas correspondem`);
    }

    if (breakdown.formacao.match) {
      pontos.push(`✅ Formação acadêmica compatível com requisitos`);
    }

    if (breakdown.idiomas.score >= 80) {
      pontos.push(`✅ Idiomas requeridos atendidos: ${breakdown.idiomas.matches.join(', ')}`);
    }

    // 3. INSIGHTS DA ANÁLISE SEMÂNTICA (IA)
    if (semanticAnalysis && semanticAnalysis.tokensUsed > 0) {
      pontos.push(`\n🤖 ANÁLISE SEMÂNTICA (IA):`);
      
      if (semanticAnalysis.experienciasMatched.length > 0) {
        pontos.push(`✅ IA identificou experiências compatíveis: ${semanticAnalysis.experienciasMatched.join(', ')}`);
      }
      
      if (semanticAnalysis.habilidadesMatched.length > 0) {
        pontos.push(`✅ IA identificou habilidades transferíveis: ${semanticAnalysis.habilidadesMatched.join(', ')}`);
      }
      
      if (semanticAnalysis.experienciasMissing.length > 0) {
        pontos.push(`⚠️ IA identificou experiências em falta: ${semanticAnalysis.experienciasMissing.join(', ')}`);
      }
      
      if (semanticAnalysis.justificativa && semanticAnalysis.justificativa !== 'Análise realizada pela IA') {
        pontos.push(`💭 ${semanticAnalysis.justificativa}`);
      }
    }

    // 4. PONTOS DE ATENÇÃO
    if (breakdown.experiencias.percentage < 30) {
      pontos.push(`⚠️ ATENÇÃO: Apenas ${breakdown.experiencias.percentage.toFixed(0)}% das experiências requeridas correspondem`);
    }

    if (breakdown.habilidades.percentage < 50) {
      pontos.push(`⚠️ Habilidades técnicas podem precisar de desenvolvimento`);
    }

    if (!breakdown.municipio.match) {
      pontos.push(`⚠️ Localização geográfica diferente pode requerer relocação`);
    }

    // 5. RESUMO FINAL
    const totalScore = this.calculateOverallCompatibility(breakdown);
    if (totalScore >= 80) {
      pontos.push(`\n🎯 ALTA COMPATIBILIDADE: Candidato muito adequado para a oportunidade`);
    } else if (totalScore >= 60) {
      pontos.push(`\n🎯 BOA COMPATIBILIDADE: Candidato adequado com alguns pontos de atenção`);
    } else if (totalScore >= 40) {
      pontos.push(`\n🎯 COMPATIBILIDADE MODERADA: Candidato pode ser considerado com ressalvas`);
    } else {
      pontos.push(`\n🎯 BAIXA COMPATIBILIDADE: Candidato não atende requisitos essenciais`);
    }

    return pontos.join('\n');
  }

  private calculateOverallCompatibility(breakdown: MatchingCriteria): number {
    // Calcular compatibilidade geral baseada nos critérios mais importantes
    let score = 0;
    let weight = 0;

    // Critérios eliminatórios têm peso máximo
    if (breakdown.genero.required) {
      score += breakdown.genero.score * 0.2;
      weight += 0.2;
    }
    
    if (breakdown.transporteProprio.required) {
      score += breakdown.transporteProprio.score * 0.2;
      weight += 0.2;
    }

    // Critérios profissionais
    score += breakdown.experiencias.score * 0.3;
    weight += 0.3;

    score += breakdown.formacao.score * 0.2;
    weight += 0.2;

    // Critérios complementares
    score += breakdown.municipio.score * 0.1;
    weight += 0.1;

    return weight > 0 ? score / weight : 0;
  }

  /**
   * Sistema de prompts otimizados para IA
   */
  private getSystemPrompt(): string {
    return `
Você é um especialista em matching profissional para integração de imigrantes no mercado de trabalho português.

INSTRUÇÕES CRÍTICAS:
1. Seja EXTREMAMENTE RIGOROSO e conservador nas avaliações
2. Identifique APENAS correspondências DIRETAS e CLARAS
3. NÃO infira habilidades não explicitamente mencionadas
4. Use critérios objetivos, não subjetivos
5. Considere o contexto cultural português
6. Responda SEMPRE em formato JSON válido

CONTEXTO:
- Plataforma: Madrilusa (integração de jovens imigrantes em Portugal)
- Objetivo: Matching preciso entre oportunidades de empresas e perfis de imigrantes
- Foco: Territórios rurais portugueses

FORMATO DE RESPOSTA OBRIGATÓRIO:
{
  "experiencias_matched": ["experiência1", "experiência2"],
  "experiencias_missing": ["experiência_necessária1"],
  "habilidades_matched": ["habilidade1", "habilidade2"],
  "habilidades_missing": ["habilidade_necessária1"],
  "score": 0-100,
  "justificativa": "Explicação objetiva e detalhada"
}`;
  }

  private buildSemanticAnalysisPrompt(
    oportunidade: OportunidadeCompleteData,
    imigrante: ImigranteCompleteProfile,
    structuredScore: MatchingCriteria
  ): string {
    // Preparar dados completos da oportunidade (sem limitações)
    const oportunidadeData = {
      cargo: oportunidade.nomeCargo,
      profissao: oportunidade.nomeProfissao || 'Não especificado',
      descricao: oportunidade.descricaoCargo || 'Não especificado',
      denominacoes: oportunidade.denominacoes, // TODAS as denominações
      experiencias_aceitas: oportunidade.experienciasAceitas, // TODAS as experiências
      habilidades_necessarias: oportunidade.habilidades, // TODAS as habilidades
      caracteristicas_desejadas: oportunidade.caracteristicas, // TODAS as características
      areas_formacao: oportunidade.areasFormacao, // TODAS as áreas
      idiomas_preferenciais: oportunidade.idiomasPreferenciais, // TODOS os idiomas
      nivel_escolaridade: oportunidade.nivelEscolaridade,
      municipio: oportunidade.municipioResidencia,
      genero_requisito: oportunidade.genero,
      idade_requisito: oportunidade.idade,
      transporte_requisito: oportunidade.transporteProprio,
      fluencia_requisito: oportunidade.fluenciaPortugues
    };

    // Preparar dados completos do imigrante (sem limitações)
    const imigranteData = {
      // Dados pessoais completos
      nome: imigrante.nomeCompleto,
      email: imigrante.email,
      genero: imigrante.genero,
      idade: imigrante.idade,
      municipio_residencia: imigrante.municipioResidencia,
      transporte_proprio: imigrante.transporteProprio,
      fluencia_portugues: imigrante.fluenciaPortugues,
      objetivos: Array.isArray(imigrante.objetivos) ? imigrante.objetivos : [],
      
      // TODAS as experiências profissionais
      experiencias: imigrante.experiencias.map(exp => ({
        cargo: exp.cargo,
        empresa: exp.empresa,
        tempo: exp.tempoNoCargo,
        descricao: exp.descricao // Descrição completa
      })),
      
      // TODAS as formações
      formacoes: imigrante.formacoes.map(form => ({
        nivel: form.nivelEscolaridade,
        area: form.areaEstudo,
        instituicao: form.instituicao
      })),
      
      // TODOS os idiomas
      idiomas: imigrante.idiomas.map(idioma => ({
        idioma: idioma.idioma,
        nivel: idioma.nivel
      })),
      
      // TODAS as habilidades e contribuições (com validação de arrays)
      habilidades: Array.isArray(imigrante.habilidades) ? imigrante.habilidades : [],
      contribuicoes: Array.isArray(imigrante.contribuicoesTexto) ? imigrante.contribuicoesTexto : [],
      interesses: Array.isArray(imigrante.interesses) ? imigrante.interesses : []
    };

    // Incluir contexto do score estruturado
    const contextoScore = {
      score_experiencias: structuredScore.experiencias.score,
      matches_experiencias: structuredScore.experiencias.matches,
      score_habilidades: structuredScore.habilidades.score,
      matches_habilidades: structuredScore.habilidades.matches
    };

    return `
ANÁLISE DE COMPATIBILIDADE PROFISSIONAL COMPLETA

OPORTUNIDADE DE TRABALHO DETALHADA:
- Cargo: ${oportunidadeData.cargo}
- Profissão: ${oportunidadeData.profissao}
- Descrição completa: ${oportunidadeData.descricao}
- Denominações aceitas: ${oportunidadeData.denominacoes.join(', ')}
- Experiências aceitas: ${oportunidadeData.experiencias_aceitas.join(', ')}
- Habilidades necessárias: ${oportunidadeData.habilidades_necessarias.join(', ')}
- Características desejadas: ${oportunidadeData.caracteristicas_desejadas.join(', ')}
- Áreas de formação aceitas: ${oportunidadeData.areas_formacao.join(', ')}
- Idiomas preferenciais: ${oportunidadeData.idiomas_preferenciais.map(i => `${i.idioma} (${i.nivel})`).join(', ')}
- Nível escolaridade mínimo: ${oportunidadeData.nivel_escolaridade || 'Não especificado'}
- Localização: ${oportunidadeData.municipio || 'Não especificado'}
- Requisitos demográficos: Género ${oportunidadeData.genero_requisito}, Idade ${oportunidadeData.idade_requisito}
- Requisitos essenciais: Transporte ${oportunidadeData.transporte_requisito}, Fluência ${oportunidadeData.fluencia_requisito}

PERFIL COMPLETO DO CANDIDATO:
- Nome: ${imigranteData.nome}
- Email: ${imigranteData.email}
- Dados pessoais: ${imigranteData.genero}, ${imigranteData.idade} anos, ${imigranteData.municipio_residencia}
- Transporte próprio: ${imigranteData.transporte_proprio ? 'Sim' : 'Não'}
- Fluência português: ${imigranteData.fluencia_portugues}
- Objetivos: ${imigranteData.objetivos.length > 0 ? imigranteData.objetivos.join(', ') : 'Não informado'}

- TODAS as Experiências Profissionais:
${imigranteData.experiencias.length > 0 ? 
  imigranteData.experiencias.map(exp => 
    `  • ${exp.cargo} em ${exp.empresa} (${exp.tempo})${exp.descricao ? ' - ' + exp.descricao : ''}`
  ).join('\n') : '  • Nenhuma experiência registrada'
}

- TODAS as Formações Acadêmicas:
${imigranteData.formacoes.length > 0 ?
  imigranteData.formacoes.map(form => 
    `  • ${form.nivel} em ${form.area} - ${form.instituicao}`
  ).join('\n') : '  • Nenhuma formação registrada'
}

- TODOS os Idiomas:
${imigranteData.idiomas.length > 0 ?
  imigranteData.idiomas.map(idioma => 
    `  • ${idioma.idioma} - Nível ${idioma.nivel}`
  ).join('\n') : '  • Nenhum idioma registrado'
}

- TODAS as Habilidades: ${imigranteData.habilidades.length > 0 ? imigranteData.habilidades.join(', ') : 'Nenhuma habilidade registrada'}

- TODAS as Contribuições/Interesses:
${imigranteData.contribuicoes.length > 0 ?
  imigranteData.contribuicoes.map(c => `  • ${c}`).join('\n') : '  • Nenhuma contribuição registrada'
}

- Interesses Pessoais: ${imigranteData.interesses.length > 0 ? imigranteData.interesses.join(', ') : 'Não informado'}

CONTEXTO DA ANÁLISE ESTRUTURADA:
- Score experiências (estruturado): ${contextoScore.score_experiencias}%
- Matches experiências encontrados: ${contextoScore.matches_experiencias.join(', ')}
- Score habilidades (estruturado): ${contextoScore.score_habilidades}%
- Matches habilidades encontrados: ${contextoScore.matches_habilidades.join(', ')}

TAREFA:
Analise a compatibilidade semântica entre esta oportunidade e candidato.
Identifique correspondências que podem não ter sido capturadas pela análise estruturada.
Seja rigoroso: apenas correspondências CLARAS e DIRETAS devem ser consideradas.

Considere:
1. Experiências similares com nomes diferentes
2. Habilidades transferíveis entre áreas
3. Competências adquiridas através de formação
4. Potencial de adaptação baseado em experiência prévia

NÃO considere:
1. Habilidades não explicitamente mencionadas
2. Potencial teórico sem evidência
3. Correspondências vagas ou genéricas
4. Suposições sobre capacidades

Forneça score de 0-100 baseado APENAS em evidências concretas.
`;
  }

  /**
   * Métodos para analytics e monitoramento
   */
  getCostMetrics() {
    return this.analytics.getCostMetrics();
  }

  getPerformanceMetrics() {
    return this.analytics.getPerformanceMetrics();
  }

  getDetailedStats() {
    return this.analytics.getDetailedStats();
  }

  resetAnalytics() {
    this.analytics.resetMetrics();
  }

  /**
   * Parse de resposta em texto livre quando JSON falha
   */
  private parseTextResponse(response: string): any {
    const analysis: any = {
      experiencias_matched: [],
      experiencias_missing: [],
      habilidades_matched: [],
      habilidades_missing: [],
      score: 50,
      justificativa: response
    };

    try {
      // Extrair score se mencionado
      const scoreMatch = response.match(/(\d{1,3})%|score[:\s]*(\d{1,3})/i);
      if (scoreMatch) {
        analysis.score = parseInt(scoreMatch[1] || scoreMatch[2]);
      }

      // Extrair experiências mencionadas
      const expMatches = response.match(/experiência[s]?[:\s]*([^.\n]+)/gi);
      if (expMatches) {
        analysis.experiencias_matched = expMatches.map(match => 
          match.replace(/experiência[s]?[:\s]*/gi, '').trim()
        ).slice(0, 3);
      }

      // Extrair habilidades mencionadas
      const habMatches = response.match(/habilidade[s]?[:\s]*([^.\n]+)/gi);
      if (habMatches) {
        analysis.habilidades_matched = habMatches.map(match => 
          match.replace(/habilidade[s]?[:\s]*/gi, '').trim()
        ).slice(0, 3);
      }

    } catch (error) {
      console.warn('⚠️ Erro no parse de texto, usando fallback:', error);
    }

    return analysis;
  }

  /**
   * Validar se modelo está disponível e retornar fallback se necessário
   */
  private validarModeloDisponivel(modelo: string): string {
    const modelosDisponiveis = [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k'
    ];

    if (modelosDisponiveis.includes(modelo)) {
      return modelo;
    }

    console.warn(`⚠️ IA: Modelo ${modelo} não está na lista de disponíveis`);
    
    // Fallback inteligente baseado no modelo solicitado
    if (modelo.includes('gpt-4')) {
      return 'gpt-4';
    } else if (modelo.includes('gpt-3.5') || modelo.includes('turbo')) {
      return 'gpt-3.5-turbo';
    } else {
      return 'gpt-4'; // Fallback padrão
    }
  }

  /**
   * Calcular custo estimado baseado nos tokens e modelo usado
   */
  private calcularCustoTokens(tokens: number, modelo: string): number {
    // Custos por 1k tokens (valores aproximados da OpenAI)
    const custosPor1kTokens: { [key: string]: number } = {
      'gpt-4': 0.03,              // $0.03 por 1k tokens
      'gpt-4-turbo': 0.01,        // $0.01 por 1k tokens
      'gpt-3.5-turbo': 0.002,     // $0.002 por 1k tokens  
      'gpt-3.5-turbo-16k': 0.004  // $0.004 por 1k tokens
    };

    const custoPor1k = custosPor1kTokens[modelo] || custosPor1kTokens['gpt-4'];
    const custo = (tokens / 1000) * custoPor1k;
    
    return custo;
  }
}
