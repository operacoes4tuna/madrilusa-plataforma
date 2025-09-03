// Rotas para Gestão de Configurações Parametrizáveis do SinergIA V2

import { Router } from 'express';
import { configuracaoSinergiaController } from './configuracao-sinergia.controller';
import { authenticateToken } from '../../shared/middleware/auth';
import { requireAdmin, requireConfigAdmin, logConfigOperation } from '../../shared/middleware/adminAuth';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);

// Middleware de logging para todas as operações de configuração
router.use(logConfigOperation);

/**
 * ROTAS PÚBLICAS (apenas autenticação)
 */

/**
 * GET /api/sinergia-config/status
 * Status geral do sistema
 */
router.get('/status', configuracaoSinergiaController.getStatusSistema);

/**
 * GET /api/sinergia-config/ativa
 * Busca configuração ativa (usado pelo sistema)
 */
router.get('/ativa', configuracaoSinergiaController.getConfiguracaoAtiva);

/**
 * GET /api/sinergia-config/templates
 * Lista templates disponíveis
 */
router.get('/templates', configuracaoSinergiaController.listarTemplates);

/**
 * POST /api/sinergia-config/validar
 * Valida configuração sem salvar
 */
router.post('/validar', configuracaoSinergiaController.validarConfiguracao);

/**
 * POST /api/sinergia-config/simular
 * Simula impacto de uma configuração
 */
router.post('/simular', configuracaoSinergiaController.simularImpacto);

/**
 * ROTAS ADMINISTRATIVAS (requerem admin)
 */

/**
 * GET /api/sinergia-config
 * Lista todas as configurações
 */
router.get('/', requireAdmin, configuracaoSinergiaController.listarConfiguracoes);

/**
 * GET /api/sinergia-config/:id
 * Busca configuração específica por ID
 */
router.get('/:id', requireAdmin, configuracaoSinergiaController.getConfiguracaoPorId);

/**
 * GET /api/sinergia-config/:id/historico
 * Busca histórico de uma configuração
 */
router.get('/:id/historico', requireAdmin, configuracaoSinergiaController.getHistoricoConfiguracao);

/**
 * ROTAS CRÍTICAS (requerem admin + logging extra)
 */

/**
 * POST /api/sinergia-config
 * Cria nova configuração
 */
router.post('/', requireConfigAdmin, configuracaoSinergiaController.criarConfiguracao);

/**
 * POST /api/sinergia-config/template/:templateNome
 * Aplica template pré-definido
 */
router.post('/template/:templateNome', requireConfigAdmin, configuracaoSinergiaController.aplicarTemplate);

/**
 * PUT /api/sinergia-config/:id/ativar
 * Ativa uma configuração existente
 */
router.put('/:id/ativar', requireConfigAdmin, configuracaoSinergiaController.ativarConfiguracao);

export default router;
