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
  const { login, isLoggingIn } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">Fazer Login</h2>
        <p className="text-muted-foreground">
          Acesse sua conta Madrilusa
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="seu.email@exemplo.com"
            className={errors.email ? 'border-destructive' : ''}
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
          />
          {errors.senha && (
            <p className="text-sm text-destructive">{errors.senha.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-glow"
          disabled={isLoggingIn}
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
    </div>
  );
}; 