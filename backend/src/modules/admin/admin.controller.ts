import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import type { AdminUpdateUserRequest, UserFilters } from './admin.types';

const adminService = new AdminService();

export const adminController = {
  
  // ✨ GET /api/admin/stats - Dashboard com totalizadores
  async getStats(req: Request, res: Response) {
    try {
      const stats = await adminService.getAdminStats();
      
      res.json({
        success: true,
        data: stats,
        message: 'Estatísticas administrativas obtidas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas admin:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível obter as estatísticas'
      });
    }
  },

  // ✨ GET /api/admin/users - Lista todos os usuários
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await adminService.getAllUsersWithProfiles();
      
      res.json({
        success: true,
        data: users,
        message: `${users.length} usuários encontrados`
      });
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível obter a lista de usuários'
      });
    }
  },

  // ✨ GET /api/admin/users/filtered - Lista usuários com filtros
  async getUsersFiltered(req: Request, res: Response) {
    try {
      const filters: UserFilters = {
        categoria: req.query.categoria as string,
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const users = await adminService.getUsersFiltered(filters);
      
      res.json({
        success: true,
        data: users,
        message: `${users.length} usuários encontrados com os filtros aplicados`
      });
    } catch (error) {
      console.error('Erro ao buscar usuários filtrados:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível filtrar os usuários'
      });
    }
  },

  // ✨ GET /api/admin/user/:id/complete - Usuário específico com perfis
  async getUserComplete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const user = await adminService.getUserByIdComplete(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: user,
        message: 'Usuário encontrado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar usuário completo:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível obter os dados do usuário'
      });
    }
  },

  // ✨ PUT /api/admin/user/:id - Atualizar dados básicos do usuário
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: AdminUpdateUserRequest = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      // Validações básicas
      if (updateData.email && !/\S+@\S+\.\S+/.test(updateData.email)) {
        return res.status(400).json({
          success: false,
          error: 'Email inválido'
        });
      }

      const updatedUser = await adminService.updateUserBasicData(id, updateData);
      
      res.json({
        success: true,
        data: updatedUser,
        message: 'Usuário atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      // Tratamento de erros específicos
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado') {
          return res.status(404).json({
            success: false,
            error: error.message
          });
        }
        
        if (error.message.includes('já está em uso') || error.message.includes('inválida')) {
          return res.status(400).json({
            success: false,
            error: error.message
          });
        }
      }
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível atualizar o usuário'
      });
    }
  },

  // ✨ DELETE /api/admin/user/:id - Remover usuário
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      await adminService.deleteUser(id);
      
      res.json({
        success: true,
        message: 'Usuário removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      
      // Tratamento de erros específicos
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado') {
          return res.status(404).json({
            success: false,
            error: error.message
          });
        }
        
        if (error.message.includes('administradores')) {
          return res.status(403).json({
            success: false,
            error: error.message
          });
        }
      }
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível remover o usuário'
      });
    }
  },

  // ✨ GET /api/admin/users/category/:categoria - Usuários por categoria
  async getUsersByCategory(req: Request, res: Response) {
    try {
      const { categoria } = req.params;
      
      if (!categoria) {
        return res.status(400).json({
          success: false,
          error: 'Categoria é obrigatória'
        });
      }

      const filters: UserFilters = { categoria };
      const users = await adminService.getUsersFiltered(filters);
      
      res.json({
        success: true,
        data: users,
        message: `${users.length} usuários encontrados na categoria ${categoria}`
      });
    } catch (error) {
      console.error('Erro ao buscar usuários por categoria:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar usuários da categoria'
      });
    }
  }
}; 