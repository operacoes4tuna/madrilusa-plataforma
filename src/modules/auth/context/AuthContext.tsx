import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    const savedUser = localStorage.getItem('madrilusa_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('madrilusa_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Sincronizar com localStorage sempre que o user mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('madrilusa_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('madrilusa_user');
    }
  }, [user]);

  const value = {
    user,
    setUser,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
