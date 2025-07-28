import { PrismaClient } from '@prisma/client';
import type { 
  AdminStats, 
  UserWithProfiles, 
  AdminUpdateUserRequest,
  UserFilters 
} from './admin.types';
import { USER_CATEGORIES } from '../../../../shared-types/api.types';

const prisma = new PrismaClient();

export class AdminService {
  
  // ✨ DASHBOARD - Buscar estatísticas administrativas
  async getAdminStats(): Promise<AdminStats> {
    try {
      // Total de usuários
      const totalUsers = await prisma.user.count();

      // Contagem por categoria
      const categoryCountsRaw = await prisma.user.groupBy({
        by: ['categoria'],
        _count: {
          categoria: true,
        },
      });

      // Formatar contagens por categoria
      const usersByCategory = {
        IMIGRANTE: 0,
        EMPRESA: 0,
        MUNICIPIO: 0,
        ACADEMIA: 0,
        FAMILIA_ACOLHIMENTO: 0,
        ADMIN: 0,
      };

      categoryCountsRaw.forEach(item => {
        if (item.categoria && item.categoria in usersByCategory) {
          usersByCategory[item.categoria as keyof typeof usersByCategory] = item._count.categoria;
        }
      });

      // Usuários recentes (últimos 7 dias)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      });

      // Perfis completos (usuários com pelo menos um perfil específico)
      const profilesCompleted = await prisma.user.count({
        where: {
          OR: [
            { perfilImigrante: { isNot: null } },
            { perfilEmpresa: { isNot: null } },
            { perfilMunicipio: { isNot: null } },
            { perfilAcademia: { isNot: null } },
            { perfilFamilia: { isNot: null } },
          ],
        },
      });

      return {
        totalUsers,
        usersByCategory,
        recentUsers,
        profilesCompleted,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas admin:', error);
      throw new Error('Erro ao buscar estatísticas administrativas');
    }
  }

  // ✨ GESTÃO - Buscar todos os usuários com perfis completos
  async getAllUsersWithProfiles(): Promise<UserWithProfiles[]> {
    try {
      const users = await prisma.user.findMany({
        include: {
          perfilImigrante: true,
          perfilEmpresa: true,
          perfilMunicipio: true,
          perfilAcademia: true,
          perfilFamilia: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Mapear e deserializar objetivos dos imigrantes se existirem
      return users.map(user => ({
        ...user,
        perfilImigrante: user.perfilImigrante ? {
          ...user.perfilImigrante,
          objetivos: user.perfilImigrante.objetivos ? 
            JSON.parse(user.perfilImigrante.objetivos) : []
        } : undefined
      })) as UserWithProfiles[];
    } catch (error) {
      console.error('Erro ao buscar usuários com perfis:', error);
      throw new Error('Erro ao buscar usuários');
    }
  }

  // ✨ GESTÃO - Buscar usuários filtrados
  async getUsersFiltered(filters: UserFilters): Promise<UserWithProfiles[]> {
    try {
      const where: any = {};

      // Filtro por categoria
      if (filters.categoria && filters.categoria !== 'ALL') {
        where.categoria = filters.categoria;
      }

      // Filtro por busca (nome ou email)
      if (filters.search) {
        where.OR = [
          { nomeCompleto: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const users = await prisma.user.findMany({
        where,
        include: {
          perfilImigrante: true,
          perfilEmpresa: true,
          perfilMunicipio: true,
          perfilAcademia: true,
          perfilFamilia: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: filters.limit || 100,
        skip: filters.offset || 0,
      });

      return users.map(user => ({
        ...user,
        perfilImigrante: user.perfilImigrante ? {
          ...user.perfilImigrante,
          objetivos: user.perfilImigrante.objetivos ? 
            JSON.parse(user.perfilImigrante.objetivos) : []
        } : undefined
      })) as UserWithProfiles[];
    } catch (error) {
      console.error('Erro ao buscar usuários filtrados:', error);
      throw new Error('Erro ao buscar usuários filtrados');
    }
  }

  // ✨ GESTÃO - Buscar usuário específico com perfil completo
  async getUserByIdComplete(userId: string): Promise<UserWithProfiles | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          perfilImigrante: true,
          perfilEmpresa: true,
          perfilMunicipio: true,
          perfilAcademia: true,
          perfilFamilia: true,
        },
      });

      if (!user) return null;

      return {
        ...user,
        perfilImigrante: user.perfilImigrante ? {
          ...user.perfilImigrante,
          objetivos: user.perfilImigrante.objetivos ? 
            JSON.parse(user.perfilImigrante.objetivos) : []
        } : undefined
      } as UserWithProfiles;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw new Error('Erro ao buscar usuário');
    }
  }

  // ✨ GESTÃO - Atualizar dados básicos do usuário
  async updateUserBasicData(userId: string, data: AdminUpdateUserRequest): Promise<UserWithProfiles> {
    try {
      // Verificar se usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new Error('Usuário não encontrado');
      }

      // Validar categoria se fornecida
      if (data.categoria && !Object.values(USER_CATEGORIES).includes(data.categoria as any)) {
        throw new Error('Categoria inválida');
      }

      // Verificar se email já existe (se estiver sendo alterado)
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: data.email.toLowerCase() },
        });

        if (emailExists) {
          throw new Error('Email já está em uso por outro usuário');
        }
      }

      // Atualizar usuário
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.nomeCompleto && { nomeCompleto: data.nomeCompleto }),
          ...(data.email && { email: data.email.toLowerCase() }),
          ...(data.telemovel !== undefined && { telemovel: data.telemovel }),
          ...(data.categoria && { categoria: data.categoria }),
        },
        include: {
          perfilImigrante: true,
          perfilEmpresa: true,
          perfilMunicipio: true,
          perfilAcademia: true,
          perfilFamilia: true,
        },
      });

      return {
        ...updatedUser,
        perfilImigrante: updatedUser.perfilImigrante ? {
          ...updatedUser.perfilImigrante,
          objetivos: updatedUser.perfilImigrante.objetivos ? 
            JSON.parse(updatedUser.perfilImigrante.objetivos) : []
        } : undefined
      } as UserWithProfiles;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error; // Re-throw para manter mensagem específica
    }
  }

  // ✨ GESTÃO - Remover usuário (com cascata automática dos perfis)
  async deleteUser(userId: string): Promise<void> {
    try {
      // Verificar se usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se não é admin (proteção básica)
      if (existingUser.categoria === USER_CATEGORIES.ADMIN) {
        throw new Error('Não é possível remover usuários administradores');
      }

      // Remover usuário (cascata automática remove perfis)
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      throw error;
    }
  }

  // ✨ UTILS - Buscar contagem por categoria
  async getUserCountByCategory(): Promise<AdminStats['usersByCategory']> {
    const categoryCountsRaw = await prisma.user.groupBy({
      by: ['categoria'],
      _count: {
        categoria: true,
      },
    });

    const usersByCategory = {
      IMIGRANTE: 0,
      EMPRESA: 0,
      MUNICIPIO: 0,
      ACADEMIA: 0,
      FAMILIA_ACOLHIMENTO: 0,
      ADMIN: 0,
    };

    categoryCountsRaw.forEach(item => {
      if (item.categoria && item.categoria in usersByCategory) {
        usersByCategory[item.categoria as keyof typeof usersByCategory] = item._count.categoria;
      }
    });

    return usersByCategory;
  }
} 