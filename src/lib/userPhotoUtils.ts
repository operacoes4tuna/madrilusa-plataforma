/**
 * Utilitário para gerenciar URLs de foto de usuário
 * Garante consistência em toda a aplicação
 */

interface User {
  foto?: string | null;
}

/**
 * Obtém a URL correta da foto do usuário
 * @param user - Objeto do usuário
 * @returns URL da foto ou logo padrão
 */
export const getUserPhotoUrl = (user?: User | null): string => {
  if (!user?.foto) {
    return "/logo_madrilusa/logo madrilusa.png";
  }

  // Se a foto já tem a URL completa (http), usar direto
  if (user.foto.startsWith('http')) {
    return user.foto;
  }

  // Se começa com /uploads, é uma foto relativa - usar sem backend
  if (user.foto.startsWith('/uploads')) {
    return user.foto;
  }

  // Senão, construir URL do backend (desenvolvimento)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return `${apiUrl}${user.foto}`;
}; 