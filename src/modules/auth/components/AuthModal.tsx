import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';
import { useAuth } from '../hooks/useAuth';
import { AuthMode } from '../types/auth.types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export const AuthModal = ({ isOpen, onClose, initialMode = 'register' }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [wasAuthenticatedBefore, setWasAuthenticatedBefore] = useState(false);
  const { isAuthenticated } = useAuth();

  // Armazenar o estado inicial de autenticação quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setWasAuthenticatedBefore(isAuthenticated);
      setMode(initialMode);
    }
  }, [isOpen, initialMode, isAuthenticated]);

  // Fechar modal apenas quando houver uma mudança de estado (não estava autenticado e agora está)
  useEffect(() => {
    if (isOpen && !wasAuthenticatedBefore && isAuthenticated) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000); // Delay de 1 segundo para mostrar o sucesso
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isOpen, onClose, wasAuthenticatedBefore]);

  const toggleMode = () => {
    setMode(mode === 'register' ? 'login' : 'register');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {mode === 'register' ? 'Criar Conta' : 'Fazer Login'}
          </DialogTitle>
        </DialogHeader>

        {/* Indicador de Desenvolvimento */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
            <div className="flex items-center">
              <span style={{ fontSize: '16px', marginRight: '8px' }}>🚀</span>
              <small className="text-blue-700">
                <strong>Modo Desenvolvimento:</strong> Login rápido disponível
              </small>
            </div>
          </div>
        )}

        <div className="p-6">
          {mode === 'register' ? (
            <RegisterForm onToggleMode={toggleMode} />
          ) : (
            <LoginForm onToggleMode={toggleMode} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 