import OpenAI from 'openai';
import { prisma } from '../../shared/database';
import type { 
  UserProfile,
  Match,
  CategoryResults,
  SinergiaResults,
  SinergiaAnalysisRequest,
  AIMatchResponse
} from './sinergia.types';

export class SinergiaService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Função principal - Analisar sinergia do usuário
  async analyzeUserSynergy(userId: string, options: Partial<SinergiaAnalysisRequest> = {}): Promise<SinergiaResults> {
    const startTime = Date.now();
    
    try {
      console.log(`🧠 SINERGIA: Iniciando análise para usuário ${userId}`);
      
      // 1. Buscar e consolidar perfil do usuário
      const userProfile = await this.consolidateUserProfile(userId);
      
      if (!userProfile.fullDescription.trim()) {
        throw new Error('Usuário não possui contribuições para análise');
      }

      // 2. Analisar sinergia por categoria
      const maxMatches = options.maxMatchesPerCategory || 10;
      const minScore = options.minScoreThreshold || 30;

      console.log(`🔍 SINERGIA: Processando ${maxMatches} contribuições por categoria, score mínimo ${minScore}%`);

      const [empresas, municipios, academias, familias] = await Promise.all([
        this.analyzeCategorySynergy(userProfile, 'EMPRESA', maxMatches, minScore),
        this.analyzeCategorySynergy(userProfile, 'MUNICIPIO', maxMatches, minScore),
        this.analyzeCategorySynergy(userProfile, 'ACADEMIA', maxMatches, minScore),
        this.analyzeCategorySynergy(userProfile, 'FAMILIA_ACOLHIMENTO', maxMatches, minScore)
      ]);

      const totalMatches = empresas.totalFound + municipios.totalFound + academias.totalFound + familias.totalFound;
      const processingTime = Date.now() - startTime;

      console.log(`✅ SINERGIA: Análise concluída em ${processingTime}ms - ${totalMatches} matches encontrados`);

      return {
        userId,
        processedAt: new Date().toISOString(),
        totalMatches,
        empresas,
        municipios,
        academias,
        familias
      };

    } catch (error) {
      console.error('❌ SINERGIA: Erro na análise:', error);
      throw error;
    }
  }

  // Consolidar perfil do usuário
  async consolidateUserProfile(userId: string): Promise<UserProfile> {
    try {
      // Buscar usuário e suas contribuições
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          contribuicoes: {
            where: { ativo: true },
            include: {
              tipoContribuicao: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (user.contribuicoes.length === 0) {
        throw new Error('Usuário não possui contribuições ativas');
      }

      // Consolidar todas as descrições
      const allDescriptions = user.contribuicoes
        .map(c => c.descricao)
        .join(' ');

      // Consolidar todas as tags (únicas)
      const allTags: string[] = [];
      user.contribuicoes.forEach(c => {
        if (c.tags) {
          try {
            const tags = typeof c.tags === 'string' ? JSON.parse(c.tags) : c.tags;
            if (Array.isArray(tags)) {
              allTags.push(...tags);
            }
          } catch (error) {
            console.warn('Erro ao fazer parse das tags:', error);
          }
        }
      });

      const uniqueTags = [...new Set(allTags)];

      // Tipos de contribuição
      const contributionTypes = user.contribuicoes.map(c => c.tipoContribuicao.titulo);

      return {
        userId: user.id,
        categoria: user.categoria || 'UNKNOWN',
        fullDescription: allDescriptions,
        allTags: uniqueTags,
        contributionTypes: [...new Set(contributionTypes)],
        contributionsCount: user.contribuicoes.length
      };

    } catch (error) {
      console.error('Erro ao consolidar perfil do usuário:', error);
      throw error;
    }
  }

  // Analisar sinergia com uma categoria específica
  async analyzeCategorySynergy(
    userProfile: UserProfile, 
    targetCategory: string, 
    maxMatches: number,
    minScore: number
  ): Promise<CategoryResults> {
    try {
      console.log(`🔍 SINERGIA: Analisando categoria ${targetCategory}`);

      // Skip se for a mesma categoria do usuário
      if (userProfile.categoria === targetCategory) {
        return {
          categoria: targetCategory,
          totalFound: 0,
          topMatches: [],
          averageScore: 0
        };
      }

      // Buscar contribuições da categoria alvo
      const categoryContributions = await this.getCategoryContributions(targetCategory, maxMatches);

      if (categoryContributions.length === 0) {
        console.log(`⚪ SINERGIA: Categoria ${targetCategory} - nenhuma contribuição encontrada`);
        return {
          categoria: targetCategory,
          totalFound: 0,
          topMatches: [],
          averageScore: 0
        };
      }

      console.log(`📊 SINERGIA: Categoria ${targetCategory} - ${categoryContributions.length} contribuições para analisar`);

      // Processar matches com IA sequencialmente (para controlar custos)
      const matches: Match[] = [];
      
      for (let i = 0; i < categoryContributions.length; i++) {
        const contrib = categoryContributions[i];
        
        try {
          console.log(`🔄 SINERGIA: Processando match ${i + 1}/${categoryContributions.length} - ${targetCategory}`);
          
          const matchResult = await this.analyzeIndividualMatch(userProfile, contrib);
          
          if (matchResult.score >= minScore) {
            matches.push(matchResult);
            console.log(`✅ MATCH ENCONTRADO: ${matchResult.score}% - ${matchResult.contributionType}`);
          } else {
            console.log(`⚪ MATCH BAIXO: ${matchResult.score}% - descartado (< ${minScore}%)`);
          }
        } catch (error) {
          console.warn(`❌ Erro ao analisar match com contribuição ${contrib.id}:`, error);
          // Continuar com outras contribuições
        }

        // Pequena pausa para não sobrecarregar a API
        if (i < categoryContributions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Ordenar por score e pegar top matches
      const sortedMatches = matches.sort((a, b) => b.score - a.score);
      const topMatches = sortedMatches.slice(0, 3); // Top 3 apenas para MVP

      const averageScore = matches.length > 0 
        ? matches.reduce((sum, match) => sum + match.score, 0) / matches.length 
        : 0;

      console.log(`✅ SINERGIA: Categoria ${targetCategory} - ${matches.length} matches válidos encontrados (score médio: ${Math.round(averageScore)}%)`);

      return {
        categoria: targetCategory,
        totalFound: matches.length,
        topMatches,
        averageScore: Math.round(averageScore)
      };

    } catch (error) {
      console.error(`❌ Erro ao analisar categoria ${targetCategory}:`, error);
      return {
        categoria: targetCategory,
        totalFound: 0,
        topMatches: [],
        averageScore: 0
      };
    }
  }

  // Buscar contribuições de uma categoria específica
  async getCategoryContributions(categoria: string, limit: number = 10) {
    try {
      const contributions = await prisma.contribuicao.findMany({
        where: {
          ativo: true,
          user: {
            categoria: categoria
          }
        },
        include: {
          user: {
            select: {
              id: true,
              categoria: true,
              nomeCompleto: true // Para logs, não será exposto
            }
          },
          tipoContribuicao: {
            select: {
              id: true,
              titulo: true,
              categoria: true
            }
          }
        },
        take: limit,
        orderBy: {
          createdAt: 'desc' // Mais recentes primeiro
        }
      });

      return contributions;
    } catch (error) {
      console.error(`Erro ao buscar contribuições da categoria ${categoria}:`, error);
      return [];
    }
  }

  // Analisar match individual com IA
  async analyzeIndividualMatch(userProfile: UserProfile, targetContribution: any): Promise<Match> {
    try {
      // Preparar tags da contribuição alvo
      let targetTags: string[] = [];
      if (targetContribution.tags) {
        try {
          targetTags = typeof targetContribution.tags === 'string' 
            ? JSON.parse(targetContribution.tags) 
            : targetContribution.tags;
        } catch (error) {
          targetTags = [];
        }
      }

      // Construir prompt para IA
      const prompt = this.buildMatchingPrompt(userProfile, targetContribution, targetTags);

      // Chamar OpenAI
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3, // Mais determinístico
        max_tokens: 300,
      });

      const response = completion.choices[0]?.message?.content?.trim() || '';
      const parsedResult = this.parseMatchingResponse(response);

      // Calcular tags em comum
      const commonTags = userProfile.allTags.filter(tag => 
        targetTags.some(ttag => ttag.toLowerCase() === tag.toLowerCase())
      );

      return {
        score: parsedResult.porcentagem,
        explanation: parsedResult.explicacao,
        contributionType: targetContribution.tipoContribuicao.titulo,
        targetCategory: targetContribution.user.categoria,
        targetContributionId: targetContribution.id,
        commonTags
      };

    } catch (error) {
      console.error('Erro ao analisar match individual:', error);
      
      // Fallback: match baseado apenas em tags comuns
      return this.calculateFallbackMatch(userProfile, targetContribution);
    }
  }

  // Construir prompt para matching
  private buildMatchingPrompt(userProfile: UserProfile, targetContrib: any, targetTags: string[]): string {
    return `
Você é um especialista em matching para a plataforma Madrilusa de integração social de jovens imigrantes em Portugal.

PERFIL DO USUÁRIO:
Categoria: ${userProfile.categoria}
Contribuições: "${userProfile.fullDescription.substring(0, 500)}..."
Tags: ${userProfile.allTags.join(', ')}
Tipos: ${userProfile.contributionTypes.join(', ')}

CONTRIBUIÇÃO PARA COMPARAR:
Categoria: ${targetContrib.user.categoria}
Tipo: ${targetContrib.tipoContribuicao.titulo}
Descrição: "${targetContrib.descricao}"
Tags: ${targetTags.join(', ')}

TAREFA:
Analise se há sinergia considerando:
1. Complementaridade de necessidades/ofertas
2. Compatibilidade de competências
3. Relevância para integração social em Portugal
4. Potencial de colaboração prática

RESPOSTA (formato exato):
SINERGIA: [número de 0 a 100]%
MOTIVO: [Uma frase clara explicando a sinergia em português de Portugal]

Exemplo:
SINERGIA: 85%
MOTIVO: Habilidades em JavaScript combinam perfeitamente com oportunidade de desenvolvedor frontend.
`;
  }

  // Parse da resposta da IA
  private parseMatchingResponse(response: string): { porcentagem: number; explicacao: string } {
    try {
      // Extrair porcentagem
      const sinergiaMatch = response.match(/SINERGIA:\s*(\d+)%/i);
      const porcentagem = sinergiaMatch ? parseInt(sinergiaMatch[1]) : 0;

      // Extrair motivo
      const motivoMatch = response.match(/MOTIVO:\s*(.+)/i);
      const explicacao = motivoMatch ? motivoMatch[1].trim() : 'Sinergia detectada pela análise de IA.';

      return {
        porcentagem: Math.min(100, Math.max(0, porcentagem)), // Garantir 0-100
        explicacao
      };
    } catch (error) {
      console.error('Erro ao fazer parse da resposta IA:', error);
      return {
        porcentagem: 0,
        explicacao: 'Erro ao processar análise de sinergia.'
      };
    }
  }

  // Fallback: match baseado em tags comuns (sem IA)
  private calculateFallbackMatch(userProfile: UserProfile, targetContrib: any): Match {
    try {
      let targetTags: string[] = [];
      if (targetContrib.tags) {
        try {
          targetTags = typeof targetContrib.tags === 'string' 
            ? JSON.parse(targetContrib.tags) 
            : targetContrib.tags;
        } catch (error) {
          targetTags = [];
        }
      }

      const commonTags = userProfile.allTags.filter(tag => 
        targetTags.some(ttag => ttag.toLowerCase() === tag.toLowerCase())
      );

      const score = Math.min(90, commonTags.length * 20); // Max 90% para fallback

      return {
        score,
        explanation: `Compatibilidade baseada em ${commonTags.length} tags em comum: ${commonTags.join(', ')}.`,
        contributionType: targetContrib.tipoContribuicao.titulo,
        targetCategory: targetContrib.user.categoria,
        targetContributionId: targetContrib.id,
        commonTags
      };
    } catch (error) {
      return {
        score: 0,
        explanation: 'Não foi possível calcular sinergia.',
        contributionType: targetContrib.tipoContribuicao?.titulo || 'Desconhecido',
        targetCategory: targetContrib.user?.categoria || 'Desconhecido',
        targetContributionId: targetContrib.id || '',
        commonTags: []
      };
    }
  }

  // Calcular score médio
  private calculateAverageScore(matches: Match[]): number {
    if (matches.length === 0) return 0;
    
    const sum = matches.reduce((total, match) => total + match.score, 0);
    return Math.round(sum / matches.length);
  }

  // Verificar se usuário pode fazer análise (rate limiting)
  async canUserAnalyze(userId: string): Promise<{ canAnalyze: boolean; reason?: string }> {
    // Por enquanto, sempre permitir (rate limiting será implementado no middleware)
    // Futuro: verificar última análise e permitir apenas 1 por dia
    
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          contribuicoes: {
            where: { ativo: true }
          }
        }
      });

      if (!user) {
        return { canAnalyze: false, reason: 'Usuário não encontrado' };
      }

      if (user.contribuicoes.length === 0) {
        return { canAnalyze: false, reason: 'Usuário não possui contribuições para análise' };
      }

      return { canAnalyze: true };
    } catch (error) {
      console.error('Erro ao verificar permissão de análise:', error);
      return { canAnalyze: false, reason: 'Erro interno' };
    }
  }

  // Analisar match individual com IA (implementação completa)
  async analyzeIndividualMatch(userProfile: UserProfile, targetContribution: any): Promise<Match> {
    try {
      // Preparar tags da contribuição alvo
      let targetTags: string[] = [];
      if (targetContribution.tags) {
        try {
          targetTags = typeof targetContribution.tags === 'string' 
            ? JSON.parse(targetContribution.tags) 
            : targetContribution.tags;
        } catch (error) {
          targetTags = [];
        }
      }

      // Construir prompt para IA
      const prompt = this.buildMatchingPrompt(userProfile, targetContribution, targetTags);

      // Chamar OpenAI
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3, // Mais determinístico para matching
        max_tokens: 300,
      });

      const response = completion.choices[0]?.message?.content?.trim() || '';
      const parsedResult = this.parseMatchingResponse(response);

      // Calcular tags em comum
      const commonTags = userProfile.allTags.filter(tag => 
        targetTags.some(ttag => ttag.toLowerCase() === tag.toLowerCase())
      );

      console.log(`🎯 MATCH: ${parsedResult.porcentagem}% - ${parsedResult.explicacao.substring(0, 50)}...`);

      return {
        score: parsedResult.porcentagem,
        explanation: parsedResult.explicacao,
        contributionType: targetContribution.tipoContribuicao.titulo,
        targetCategory: targetContribution.user.categoria,
        targetContributionId: targetContribution.id,
        commonTags
      };

    } catch (error) {
      console.error('Erro ao analisar match individual:', error);
      
      // Fallback: match baseado apenas em tags comuns
      return this.calculateFallbackMatch(userProfile, targetContribution);
    }
  }

  // Buscar contribuições do usuário (todas ativas)
  async getUserAllContributions(userId: string) {
    try {
      const contributions = await prisma.contribuicao.findMany({
        where: {
          userId: userId,
          ativo: true
        },
        include: {
          tipoContribuicao: true
        }
      });

      return contributions;
    } catch (error) {
      console.error('Erro ao buscar contribuições do usuário:', error);
      return [];
    }
  }

  // Obter estatísticas rápidas para debugging
  async getSystemStats(): Promise<any> {
    try {
      const stats = await prisma.user.groupBy({
        by: ['categoria'],
        where: {
          categoria: {
            not: null
          }
        },
        _count: {
          id: true
        }
      });

      const contributionsStats = await prisma.contribuicao.groupBy({
        by: ['userId'],
        where: {
          ativo: true
        },
        _count: {
          id: true
        }
      });

      return {
        usersByCategory: stats,
        totalContributions: contributionsStats.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return { error: 'Erro ao obter estatísticas' };
    }
  }
}
