// Controller para Gestão de Configurações Parametrizáveis do SinergIA V2

import { Request, Response } from 'express';
import { configuracaoSinergiaService } from './configuracao-sinergia.service';
import type { ConfiguracaoCompleta } from './sinergia-config.types';
import { TEMPLATES_CONFIGURACAO } from './sinergia-config.types';

export class ConfiguracaoSinergiaController {

  /**
   * GET /api/sinergia-config/ativa
   * Busca a configuração ativa do sistema
   */
  async getConfiguracaoAtiva(req: Request, res: Response) {
    try {
      const configuracao = await configuracaoSinergiaService.getConfiguracaoAtiva();
      
      res.json({
        success: true,
        data: configuracao,
        message: 'Configuração ativa obtida com sucesso'
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao buscar configuração ativa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/sinergia-config
   * Lista todas as configurações
   */
  async listarConfiguracoes(req: Request, res: Response) {
    try {
      const configuracoes = await configuracaoSinergiaService.listarConfiguracoes();
      
      res.json({
        success: true,
        data: configuracoes,
        total: configuracoes.length,
        message: 'Configurações listadas com sucesso'
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao listar configurações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/sinergia-config/:id
   * Busca configuração por ID
   */
  async getConfiguracaoPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da configuração é obrigatório'
        });
      }

      const configuracao = await configuracaoSinergiaService.getConfiguracaoPorId(id);
      
      if (!configuracao) {
        return res.status(404).json({
          success: false,
          message: 'Configuração não encontrada'
        });
      }

      res.json({
        success: true,
        data: configuracao,
        message: 'Configuração obtida com sucesso'
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao buscar configuração por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/sinergia-config
   * Cria nova configuração
   */
  async criarConfiguracao(req: Request, res: Response) {
    try {
      const { configuracao, nome, descricao, ativar = false } = req.body;
      const userId = req.user?.id || 'sistema';

      if (!configuracao || !nome) {
        return res.status(400).json({
          success: false,
          message: 'Configuração e nome são obrigatórios'
        });
      }

      // Validar estrutura da configuração
      const requiredFields = ['pesos', 'eliminatorios', 'iaConfig', 'prefiltros', 'scoringRules', 'limites'];
      const missingFields = requiredFields.filter(field => !configuracao[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
        });
      }

      const novoId = await configuracaoSinergiaService.criarConfiguracao(
        configuracao as ConfiguracaoCompleta,
        userId,
        nome,
        descricao,
        ativar
      );

      res.status(201).json({
        success: true,
        data: { id: novoId },
        message: `Configuração ${ativar ? 'criada e ativada' : 'criada'} com sucesso`
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao criar configuração:', error);
      
      if (error instanceof Error && error.message.includes('inválida')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * PUT /api/sinergia-config/:id/ativar
   * Ativa uma configuração existente
   */
  async ativarConfiguracao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      const userId = req.user?.id || 'sistema';

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da configuração é obrigatório'
        });
      }

      await configuracaoSinergiaService.ativarConfiguracao(id, userId, motivo);

      res.json({
        success: true,
        message: 'Configuração ativada com sucesso'
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao ativar configuração:', error);
      
      if (error instanceof Error && error.message.includes('não encontrada')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/sinergia-config/simular
   * Simula impacto de uma configuração
   */
  async simularImpacto(req: Request, res: Response) {
    try {
      const { configuracao, amostraSize = 50 } = req.body;

      if (!configuracao) {
        return res.status(400).json({
          success: false,
          message: 'Configuração é obrigatória para simulação'
        });
      }

      if (amostraSize < 1 || amostraSize > 200) {
        return res.status(400).json({
          success: false,
          message: 'Tamanho da amostra deve estar entre 1 e 200'
        });
      }

      const impacto = await configuracaoSinergiaService.simularImpacto(
        configuracao as ConfiguracaoCompleta,
        amostraSize
      );

      res.json({
        success: true,
        data: impacto,
        message: 'Simulação de impacto concluída'
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao simular impacto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/sinergia-config/:id/historico
   * Busca histórico de uma configuração
   */
  async getHistoricoConfiguracao(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da configuração é obrigatório'
        });
      }

      const historico = await configuracaoSinergiaService.getHistoricoConfiguracao(id);

      res.json({
        success: true,
        data: historico,
        total: historico.length,
        message: 'Histórico obtido com sucesso'
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao buscar histórico:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/sinergia-config/template/:templateNome
   * Aplica template pré-definido
   */
  async aplicarTemplate(req: Request, res: Response) {
    try {
      const { templateNome } = req.params;
      const { ativar = false } = req.body;
      const userId = req.user?.id || 'sistema';

      if (!templateNome || !(templateNome in TEMPLATES_CONFIGURACAO)) {
        return res.status(400).json({
          success: false,
          message: 'Nome do template é inválido',
          templatesDisponiveis: Object.keys(TEMPLATES_CONFIGURACAO)
        });
      }

      const novoId = await configuracaoSinergiaService.aplicarTemplate(
        templateNome as keyof typeof TEMPLATES_CONFIGURACAO,
        userId,
        ativar
      );

      res.status(201).json({
        success: true,
        data: { id: novoId },
        message: `Template '${templateNome}' aplicado com sucesso`
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao aplicar template:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/sinergia-config/templates
   * Lista templates disponíveis
   */
  async listarTemplates(req: Request, res: Response) {
    try {
      const templates = Object.entries(TEMPLATES_CONFIGURACAO).map(([key, template]) => ({
        nome: key,
        titulo: template.nome,
        descricao: template.descricao,
        modificacoes: Object.keys(template.modificacoes)
      }));

      res.json({
        success: true,
        data: templates,
        total: templates.length,
        message: 'Templates listados com sucesso'
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao listar templates:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * POST /api/sinergia-config/validar
   * Valida uma configuração sem salvá-la
   */
  async validarConfiguracao(req: Request, res: Response) {
    try {
      const { configuracao } = req.body;

      if (!configuracao) {
        return res.status(400).json({
          success: false,
          message: 'Configuração é obrigatória para validação'
        });
      }

      // Usar validação interna do service
      const validacao = (configuracaoSinergiaService as any).validarConfiguracao(
        configuracao as ConfiguracaoCompleta
      );

      res.json({
        success: true,
        data: validacao,
        message: validacao.valido ? 'Configuração válida' : 'Configuração inválida'
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao validar configuração:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * GET /api/sinergia-config/status
   * Status geral do sistema de configurações
   */
  async getStatusSistema(req: Request, res: Response) {
    try {
      const configuracoes = await configuracaoSinergiaService.listarConfiguracoes();
      const ativa = configuracoes.find(c => c.ativa);
      
      const status = {
        configuracaoAtiva: ativa ? {
          id: ativa.id,
          nome: ativa.nome,
          versao: ativa.versao,
          criadoPor: ativa.criadoPor,
          criadaEm: ativa.createdAt
        } : null,
        totalConfiguracoes: configuracoes.length,
        versaoMaisRecente: Math.max(...configuracoes.map(c => c.versao), 0),
        templatesDisponiveis: Object.keys(TEMPLATES_CONFIGURACAO).length,
        cacheAtivo: true // Sempre ativo no service
      };

      res.json({
        success: true,
        data: status,
        message: 'Status do sistema obtido com sucesso'
      });

    } catch (error) {
      console.error('❌ CONFIG API: Erro ao obter status:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

// Instância única do controller
export const configuracaoSinergiaController = new ConfiguracaoSinergiaController();
