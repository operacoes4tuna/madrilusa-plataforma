import { Router } from 'express';
import { contribuicoesController } from './contribuicoes.controller';

const router = Router();

// ===== ROTAS PARA USUÁRIOS =====

// Contribuições do usuário
router.post('/user/:userId', contribuicoesController.createContribuicao);
router.get('/user/:userId', contribuicoesController.getMinhasContribuicoes);
router.get('/user/:userId/formatadas', contribuicoesController.getContribuicoesComTipo);
router.get('/user/:userId/tipos-disponiveis', contribuicoesController.getTiposParaUsuario);
router.get('/user/:userId/tipo/:tipoId', contribuicoesController.getContribuicoesPorTipo);
router.get('/:id', contribuicoesController.getContribuicaoById);
router.put('/:id', contribuicoesController.updateContribuicao);
router.delete('/:id', contribuicoesController.deleteContribuicao);

// Detalhes de tipos
router.get('/tipo/:tipoId/detalhes', contribuicoesController.getTipoDetalhes);

// Contribuições públicas
router.get('/publicas/list', contribuicoesController.getContribuicoesPublicas);

// Tipos disponíveis
router.get('/tipos/disponiveis', contribuicoesController.getTiposDisponiveis);

// Tags
router.get('/tags/list', contribuicoesController.getTags);

export default router;
