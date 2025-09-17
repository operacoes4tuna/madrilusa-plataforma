import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types/auth.types';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const { login, isLoggingIn, quickLogin } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  // Botões de login rápido para desenvolvimento
  const quickLoginButtons = [
    {
      categoria: 'IMIGRANTE',
      email: 'imigrante@madrilusa.com.pt',
      label: 'Imigrante',
      icon: '🌍',
      color: '#28a745'
    },
    {
      categoria: 'EMPRESA',
      email: 'empresa@madrilusa.com.pt', 
      label: 'Empresa',
      icon: '🏢',
      color: '#007bff'
    },
    {
      categoria: 'MUNICIPIO',
      email: 'municipio@madrilusa.com.pt',
      label: 'Município', 
      icon: '🏛️',
      color: '#ffc107'
    },
    {
      categoria: 'ACADEMIA',
      email: 'academia@madrilusa.com.pt',
      label: 'Academia',
      icon: '🎓',
      color: '#17a2b8'
    },
    {
      categoria: 'FAMILIA_ACOLHIMENTO',
      email: 'familia@madrilusa.com.pt',
      label: 'Família',
      icon: '👨‍👩‍👧‍👦',
      color: '#e83e8c'
    },
    {
      categoria: 'ADMIN',
      email: 'admin@madrilusa.com.pt',
      label: 'Admin',
      icon: '🛡️',
      color: '#6f42c1'
    }
  ];

  const handleQuickLogin = (email: string) => {
    if (quickLogin) {
      quickLogin(email);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">Fazer Login</h2>
        <p className="text-muted-foreground">
          Acesse sua conta Madrilusa
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="login-form">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="seu.email@exemplo.com"
            className={errors.email ? 'border-destructive' : ''}
            data-testid="login-email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <Input
            id="senha"
            type="password"
            {...register('senha')}
            placeholder="Sua senha"
            className={errors.senha ? 'border-destructive' : ''}
            data-testid="login-password"
          />
          {errors.senha && (
            <p className="text-sm text-destructive">{errors.senha.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-glow"
          disabled={isLoggingIn}
          data-testid="login-submit"
        >
          {isLoggingIn ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Ainda não tem cadastro?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:underline font-medium"
          >
            Clique aqui para se cadastrar
          </button>
        </p>
      </div>

      {/* Login Rápido - Apenas Desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center mb-3">
            <small className="text-muted d-flex align-items-center justify-content-center">
              <span style={{ fontSize: '14px', marginRight: '4px' }}>⚡</span>
              Login Rápido - Desenvolvimento
            </small>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {quickLoginButtons.map(button => (
              <Button
                key={button.categoria}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin(button.email)}
                disabled={isLoggingIn}
                className="d-flex align-items-center"
                style={{ 
                  borderColor: button.color,
                  color: button.color,
                  fontSize: '12px',
                  padding: '6px 12px'
                }}
              >
                <span style={{ marginRight: '4px' }}>{button.icon}</span>
                {button.label}
              </Button>
            ))}
          </div>
          <div className="text-center mt-2">
            <small className="text-muted" style={{ fontSize: '11px' }}>
              Senha padrão: vcgvcg
            </small>
          </div>
        </div>
      )}
    </div>
  );
}; 