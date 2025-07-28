import type { User, PerfilImigrante, PerfilEmpresa, PerfilMunicipio, PerfilAcademia, PerfilFamilia } from '../../../../shared-types/api.types';

// ✨ ADMIN - Tipos para estatísticas do dashboard
export interface AdminStats {
  totalUsers: number;
  usersByCategory: {
    IMIGRANTE: number;
    EMPRESA: number;
    MUNICIPIO: number;
    ACADEMIA: number;
    FAMILIA_ACOLHIMENTO: number;
    ADMIN: number;
  };
  recentUsers: number;           // Últimos 7 dias
  profilesCompleted: number;     // Usuários com perfil específico preenchido
}

// ✨ ADMIN - Usuário com todos os perfis incluídos
export interface UserWithProfiles extends User {
  perfilImigrante?: PerfilImigrante;
  perfilEmpresa?: PerfilEmpresa;
  perfilMunicipio?: PerfilMunicipio;
  perfilAcademia?: PerfilAcademia;
  perfilFamilia?: PerfilFamilia;
}

// ✨ ADMIN - Request para editar usuário
export interface AdminUpdateUserRequest {
  nomeCompleto?: string;
  email?: string;
  telemovel?: string;
  categoria?: string;
}

// ✨ ADMIN - Response padrão para endpoints admin
export interface AdminResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ✨ ADMIN - Filtros para listagem de usuários
export interface UserFilters {
  categoria?: string;
  search?: string;
  limit?: number;
  offset?: number;
} 