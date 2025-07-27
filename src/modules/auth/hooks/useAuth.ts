import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { User, RegisterRequest, LoginRequest } from '../types/auth.types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('madrilusa_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const userData = data.data as User;
      setUser(userData);
      localStorage.setItem('madrilusa_user', JSON.stringify(userData));
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo(a), ${userData.nomeCompleto}`,
      });
      
      // Redirecionar para dashboard
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const userData = data.data as User;
      setUser(userData);
      localStorage.setItem('madrilusa_user', JSON.stringify(userData));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) de volta, ${userData.nomeCompleto}`,
      });
      
      // Redirecionar para dashboard
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('madrilusa_user');
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const register = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };

  const login = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return {
    // State
    user,
    setUser,
    isAuthenticated: !!user,
    
    // Actions
    register,
    login,
    logout,
    
    // Loading states
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    
    // Errors
    registerError: registerMutation.error,
    loginError: loginMutation.error,
  };
}; 