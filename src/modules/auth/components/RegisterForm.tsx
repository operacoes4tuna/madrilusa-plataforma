import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { RegisterRequest } from '../types/auth.types';

const registerSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome completo é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const { register: registerUser, isRegistering } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterRequest) => {
    registerUser(data);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">Criar Conta</h2>
        <p className="text-muted-foreground">
          Junte-se à plataforma Madrilusa
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nomeCompleto">Nome Completo</Label>
          <Input
            id="nomeCompleto"
            {...register('nomeCompleto')}
            placeholder="Seu nome completo"
            className={errors.nomeCompleto ? 'border-destructive' : ''}
          />
          {errors.nomeCompleto && (
            <p className="text-sm text-destructive">{errors.nomeCompleto.message}</p>
          )}
        </div>

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
            placeholder="Mínimo 6 caracteres"
            className={errors.senha ? 'border-destructive' : ''}
          />
          {errors.senha && (
            <p className="text-sm text-destructive">{errors.senha.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-glow"
          disabled={isRegistering}
        >
          {isRegistering ? 'Criando conta...' : 'Criar Conta'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Já tem conta?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:underline font-medium"
          >
            Clique aqui para fazer login
          </button>
        </p>
      </div>
    </div>
  );
}; 