import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { AuthMode } from '@/modules/auth/types/auth.types';

interface AuthPageProps {
  initialMode?: AuthMode;
}

export const AuthPage = ({ initialMode = 'register' }: AuthPageProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const navigate = useNavigate();

  const toggleMode = () => {
    setMode(mode === 'register' ? 'login' : 'register');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            <img
              src="/logo_madrilusa/logo madrilusa.png"
              alt="Madrilusa"
              className="h-8 w-auto"
            />
            
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-lg shadow-card-custom p-6 border border-border">
            {mode === 'register' ? (
              <RegisterForm onToggleMode={toggleMode} />
            ) : (
              <LoginForm onToggleMode={toggleMode} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}; 