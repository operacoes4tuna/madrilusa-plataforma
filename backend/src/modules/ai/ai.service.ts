import OpenAI from 'openai';
import { prisma } from '../../shared/database';
import type { 
  AIContext, 
  EnhanceTextRequest, 
  EnhanceTextResponse,
  SuggestTagsRequest,
  SuggestTagsResponse,
  AIInteractionData,
  EnhancementType
} from './ai.types';

export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async enhanceText(request: EnhanceTextRequest, enhancementType: EnhancementType = 'enhance'): Promise<EnhanceTextResponse> {
    const startTime = Date.now();
    
    try {
      const prompt = this.buildEnhancePrompt(request.text, request.context, enhancementType);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4", // Usando GPT-4 (GPT-5 ainda não disponível)
        messages: [{ 
          role: "user", 
          content: prompt 
        }],
        temperature: 0.7,
        max_tokens: Math.min(request.context.maxLength, 1000),
      });

      const enhancedText = completion.choices[0]?.message?.content?.trim() || request.text;
      const tokensUsed = completion.usage?.total_tokens || 0;
      
      // Salvar interação para analytics
      if (request.userId) {
        await this.saveInteraction({
          userId: request.userId,
          tipoAcao: 'enhance_text',
          inputText: request.text,
          outputText: enhancedText,
          tokensUsed
        });
      }

      const responseTime = Date.now() - startTime;
      console.log(`✅ AI Enhancement completed in ${responseTime}ms, tokens: ${tokensUsed}`);

      return {
        originalText: request.text,
        enhancedText,
        timestamp: new Date().toISOString(),
        tokensUsed
      };

    } catch (error) {
      console.error('❌ Erro no serviço de IA:', error);
      
      // Em caso de erro, retornar texto original
      return {
        originalText: request.text,
        enhancedText: request.text,
        timestamp: new Date().toISOString(),
        tokensUsed: 0
      };
    }
  }

  async suggestTags(request: SuggestTagsRequest): Promise<SuggestTagsResponse> {
    const startTime = Date.now();
    
    try {
      // Buscar tags existentes do sistema para contexto
      const existingSystemTags = await this.getExistingTags();
      const allExistingTags = [...(request.existingTags || []), ...existingSystemTags];
      
      const prompt = this.buildTagsPrompt(request.text, request.context, allExistingTags);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ 
          role: "user", 
          content: prompt 
        }],
        temperature: 0.5,
        max_tokens: 200,
      });

      const response = completion.choices[0]?.message?.content?.trim() || '';
      const suggestedTags = this.parseTagsResponse(response);
      const tokensUsed = completion.usage?.total_tokens || 0;
      
      // Filtrar tags já selecionadas e processar
      const processedTags = await this.processTagSuggestions(
        suggestedTags, 
        request.selectedTags || [],
        existingSystemTags
      );

      // Salvar interação para analytics
      if (request.userId) {
        await this.saveInteraction({
          userId: request.userId,
          tipoAcao: 'suggest_tags',
          inputText: request.text,
          outputText: processedTags.join(', '),
          tokensUsed
        });
      }

      const responseTime = Date.now() - startTime;
      console.log(`✅ AI Tag Suggestion completed in ${responseTime}ms, tokens: ${tokensUsed}, tags: ${processedTags.length}`);

      return {
        tags: processedTags,
        timestamp: new Date().toISOString(),
        tokensUsed
      };

    } catch (error) {
      console.error('❌ Erro na sugestão de tags:', error);
      
      return {
        tags: [],
        timestamp: new Date().toISOString(),
        tokensUsed: 0
      };
    }
  }

  private buildEnhancePrompt(text: string, context: AIContext, type: EnhancementType): string {
    const baseContext = `
Você é um assistente especializado em melhorar contribuições para a plataforma Madrilusa, uma iniciativa de integração de jovens imigrantes em Portugal.

CONTEXTO DA PLATAFORMA:
${context.platformContext}

CONTEXTO DA CONTRIBUIÇÃO:
- Categoria do usuário: ${context.userCategory}
- Tipo de contribuição: ${context.contributionType}
- Orientação específica: ${context.specificGuidance || 'Não especificada'}
- Contexto adicional: ${context.typeContext || 'Não especificado'}

TEXTO ORIGINAL:
"${text}"
`;

    const taskInstructions = {
      enhance: `
TAREFA: APRIMORAMENTO GERAL
Aprimore o texto mantendo sua essência, melhorando:
- Clareza e organização das ideias
- Gramática e ortografia (português de Portugal)
- Impacto e relevância para o público-alvo
- Tom profissional mas acessível e acolhedor`,

      expand: `
TAREFA: EXPANSÃO DE CONTEÚDO
Expanda o texto adicionando:
- Detalhes relevantes e específicos
- Exemplos práticos quando apropriado
- Informações que aumentem o valor da contribuição
- Contexto adicional útil para o leitor`,

      refine: `
TAREFA: REFINAMENTO E CLAREZA
Refine o texto focando em:
- Clareza e precisão das informações
- Organização lógica das ideias
- Eliminação de redundâncias
- Fluidez da leitura`,

      correct: `
TAREFA: CORREÇÃO TÉCNICA
Corrija o texto focando apenas em:
- Gramática e ortografia
- Concordância verbal e nominal
- Pontuação adequada
- Manter exatamente o mesmo conteúdo e estilo`
    };

    return `${baseContext}

${taskInstructions[type]}

DIRETRIZES OBRIGATÓRIAS:
- Use EXCLUSIVAMENTE português de Portugal
- Mantenha o significado e intenção originais
- Tom: ${context.tone}
- Foco: ${context.focus}
- Máximo ${context.maxLength} caracteres
- ${context.additionalGuidelines || 'Seja natural e autêntico'}

IMPORTANTE:
- Se o texto já estiver bem escrito, faça apenas melhorias subtis
- Mantenha a personalidade do autor
- Foque na integração social e oportunidades em Portugal
- Use linguagem inclusiva e acolhedora

RESPOSTA (apenas o texto aprimorado, sem comentários):`;
  }

  private buildTagsPrompt(text: string, context: AIContext, existingTags: string[]): string {
    return `
Analise o seguinte texto de uma contribuição na plataforma Madrilusa e sugira tags relevantes.

CONTEXTO DA PLATAFORMA:
A Madrilusa é uma plataforma de integração de jovens imigrantes em territórios rurais portugueses.

CONTEXTO DA CONTRIBUIÇÃO:
- Categoria do usuário: ${context.userCategory}
- Tipo de contribuição: ${context.contributionType}
- Orientação específica: ${context.specificGuidance || 'Não especificada'}

TEXTO PARA ANÁLISE:
"${text}"

TAGS EXISTENTES NA PLATAFORMA (priorize quando relevantes):
${existingTags.slice(0, 50).join(', ')}

TAREFA:
Sugira entre 5 a 8 tags que:
- Descrevam o conteúdo de forma precisa
- Ajudem outros usuários a encontrar esta contribuição
- Incluam mix de tags existentes (quando relevantes) e novas (quando necessárias)
- Sejam específicas mas não excessivamente técnicas
- Usem português de Portugal
- Sejam relevantes para integração social em Portugal

DIRETRIZES:
- Priorize tags existentes quando aplicáveis
- Crie novas tags apenas quando necessário
- Use palavras-chave que facilitem buscas
- Inclua nível de experiência quando relevante (Iniciante, Intermédio, Avançado)
- Inclua localização quando mencionada
- Foque em competências, áreas e características principais

RESPOSTA (apenas as tags separadas por vírgula, sem numeração ou comentários):`;
  }

  private parseTagsResponse(response: string): string[] {
    return response
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && tag.length <= 30)
      .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)) // Capitalizar primeira letra
      .slice(0, 8);
  }

  async saveInteraction(data: AIInteractionData): Promise<void> {
    try {
      // Por enquanto, apenas log - tabela será criada na próxima etapa
      console.log('📊 AI Interaction:', {
        userId: data.userId,
        action: data.tipoAcao,
        inputLength: data.inputText.length,
        outputLength: data.outputText.length,
        tokensUsed: data.tokensUsed,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao salvar interação IA:', error);
    }
  }

  // Método para verificar saúde da API OpenAI
  async healthCheck(): Promise<{ status: string; model: string; available: boolean }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "Responda apenas: OK" }],
        max_tokens: 5,
      });

      const response = completion.choices[0]?.message?.content?.trim();
      
      return {
        status: response === 'OK' ? 'healthy' : 'degraded',
        model: 'gpt-4',
        available: true
      };
    } catch (error) {
      console.error('❌ OpenAI API não disponível:', error);
      return {
        status: 'unhealthy',
        model: 'gpt-4',
        available: false
      };
    }
  }

  // Buscar tags existentes do sistema
  private async getExistingTags(): Promise<string[]> {
    try {
      const tags = await prisma.tagSistema.findMany({
        select: { nome: true, usos: true },
        orderBy: { usos: 'desc' },
        take: 100 // Top 100 tags mais usadas
      });
      
      return tags.map(tag => tag.nome);
    } catch (error) {
      console.error('Erro ao buscar tags do sistema:', error);
      return [];
    }
  }

  // Processar sugestões de tags
  private async processTagSuggestions(
    suggestedTags: string[], 
    selectedTags: string[], 
    existingSystemTags: string[]
  ): Promise<string[]> {
    // Filtrar tags já selecionadas
    let filteredTags = suggestedTags.filter(tag => !selectedTags.includes(tag));
    
    // Priorizar tags existentes no sistema (case insensitive)
    const prioritizedTags: string[] = [];
    const newTags: string[] = [];
    
    for (const tag of filteredTags) {
      const existingTag = existingSystemTags.find(existing => 
        existing.toLowerCase() === tag.toLowerCase()
      );
      
      if (existingTag) {
        // Usar a versão exata do sistema (mantém capitalização)
        prioritizedTags.push(existingTag);
      } else {
        // Tag nova, manter sugestão da IA
        newTags.push(tag);
      }
    }
    
    // Retornar mix: tags existentes primeiro, depois novas (máximo 8)
    return [...prioritizedTags, ...newTags].slice(0, 8);
  }

  // Método para sanitizar texto antes de enviar para IA
  sanitizeInput(text: string): string {
    return text
      // Remover informações sensíveis
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARTÃO]') // Cartões de crédito
      .replace(/\b\d{9}\b/g, '[DOCUMENTO]') // Documentos portugueses
      .replace(/\b[\w\.-]+@[\w\.-]+\.\w+\b/g, '[EMAIL]') // Emails
      .replace(/\b\d{9}\s?\d{3}\s?\d{3}\b/g, '[TELEFONE]') // Telefones PT
      // Limitar tamanho
      .slice(0, 2000)
      // Limpar caracteres especiais problemáticos
      .replace(/[^\w\sÀ-ÿ.,!?;:()\-]/g, '');
  }
}
