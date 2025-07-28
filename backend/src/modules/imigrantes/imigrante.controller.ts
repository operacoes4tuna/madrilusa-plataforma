import { Request, Response } from 'express';
import { ImigranteService } from './imigrante.service';
import { 
  CreatePerfilImigranteRequest, 
  UpdatePerfilImigranteRequest,
  NACIONALIDADES 
} from './imigrante.types';

const imigranteService = new ImigranteService();

export class ImigranteController {
  // POST /api/imigrantes/perfil - Criar perfil de imigrante
  async createPerfil(req: Request, res: Response) {
    try {
      const data: CreatePerfilImigranteRequest = req.body;

      // Validações básicas
      if (!data.userId || !data.nacionalidade || !data.dataNascimento) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios: userId, nacionalidade, dataNascimento'
        });
      }

      // Validar nacionalidade
      if (!NACIONALIDADES.includes(data.nacionalidade as any)) {
        return res.status(400).json({
          success: false,
          error: 'Nacionalidade inválida'
        });
      }

      const perfil = await imigranteService.createPerfil(data);

      res.status(201).json({
        success: true,
        data: perfil,
        message: 'Perfil de imigrante criado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao criar perfil de imigrante:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao criar perfil de imigrante'
      });
    }
  }

  // GET /api/imigrantes/perfil/:userId - Buscar perfil por userId
  async getPerfilByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const perfil = await imigranteService.getPerfilByUserId(userId);

      if (!perfil) {
        return res.status(404).json({
          success: false,
          error: 'Perfil de imigrante não encontrado'
        });
      }

      res.json({
        success: true,
        data: perfil
      });

    } catch (error: any) {
      console.error('Erro ao buscar perfil de imigrante:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar perfil de imigrante'
      });
    }
  }

  // PUT /api/imigrantes/perfil/:userId - Atualizar perfil
  async updatePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data: UpdatePerfilImigranteRequest = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      // Validar nacionalidade se fornecida
      if (data.nacionalidade && !NACIONALIDADES.includes(data.nacionalidade as any)) {
        return res.status(400).json({
          success: false,
          error: 'Nacionalidade inválida'
        });
      }

      const perfil = await imigranteService.updatePerfil(userId, data);

      res.json({
        success: true,
        data: perfil,
        message: 'Perfil de imigrante atualizado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao atualizar perfil de imigrante:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar perfil de imigrante'
      });
    }
  }

  // DELETE /api/imigrantes/perfil/:userId - Deletar perfil
  async deletePerfil(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      await imigranteService.deletePerfil(userId);

      res.json({
        success: true,
        message: 'Perfil de imigrante deletado com sucesso'
      });

    } catch (error: any) {
      console.error('Erro ao deletar perfil de imigrante:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao deletar perfil de imigrante'
      });
    }
  }

  // GET /api/imigrantes/perfis - Listar todos os perfis (admin)
  async listPerfis(req: Request, res: Response) {
    try {
      const perfis = await imigranteService.listPerfis();

      res.json({
        success: true,
        data: perfis,
        count: perfis.length
      });

    } catch (error: any) {
      console.error('Erro ao listar perfis de imigrantes:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar perfis de imigrantes'
      });
    }
  }

  // GET /api/imigrantes/has-perfil/:userId - Verificar se usuário tem perfil
  async hasPerfilImigrante(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'UserId é obrigatório'
        });
      }

      const hasPerfil = await imigranteService.hasPerfilImigrante(userId);

      res.json({
        success: true,
        data: { hasPerfil }
      });

    } catch (error: any) {
      console.error('Erro ao verificar perfil de imigrante:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao verificar perfil de imigrante'
      });
    }
  }

  // GET /api/imigrantes/nacionalidades - Listar nacionalidades disponíveis
  async getNacionalidades(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: NACIONALIDADES
      });
    } catch (error: any) {
      console.error('Erro ao buscar nacionalidades:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar nacionalidades'
      });
    }
  }
} 