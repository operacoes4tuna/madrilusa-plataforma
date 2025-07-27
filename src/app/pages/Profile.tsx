import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para o formulário
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: ''
  });

  // Preencher formulário com dados do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        nomeCompleto: user.nomeCompleto || '',
        email: user.email || '',
        senha: ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Preparar dados para envio (só incluir campos que mudaram)
      const updateData: any = {};
      
      if (formData.nomeCompleto !== user?.nomeCompleto) {
        updateData.nomeCompleto = formData.nomeCompleto;
      }
      
      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      
      if (formData.senha.trim() !== '') {
        updateData.senha = formData.senha;
      }

      // Se nenhum campo foi alterado
      if (Object.keys(updateData).length === 0) {
        toast({
          title: "Nenhuma alteração detectada",
          description: "Não há mudanças para salvar.",
        });
        return;
      }

      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar perfil');
      }

      const result = await response.json();
      
      // Atualizar dados do usuário no contexto de auth
      if (result.success && result.data) {
        setUser(result.data);
        localStorage.setItem('madrilusa_user', JSON.stringify(result.data));
      }

      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram salvas.",
      });

      // Limpar senha após salvar
      setFormData(prev => ({ ...prev, senha: '' }));
      
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar perfil');
      }

      toast({
        title: "Perfil deletado com sucesso",
        description: "Sua conta foi removida permanentemente.",
      });

      // Fazer logout e redirecionar
      logout();
      navigate('/');
      
    } catch (error) {
      toast({
        title: "Erro ao deletar perfil",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--app-primary)' }}>
          Editar Perfil
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Profile Form */}
      <div className="app-card max-w-2xl">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nomeCompleto">Nome Completo</Label>
            <Input
              id="nomeCompleto"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleInputChange}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Nova Senha (opcional)</Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="Deixe em branco para manter a atual"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="app-button-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setFormData({
                nomeCompleto: user?.nomeCompleto || '',
                email: user?.email || '',
                senha: ''
              })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="app-card max-w-2xl">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--app-foreground)' }}>
          Informações da Conta
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">ID do Usuário:</span>
            <span className="font-mono text-xs">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Membro desde:</span>
            <span>{new Date(user?.createdAt || '').toLocaleDateString('pt-PT')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Última atualização:</span>
            <span>{new Date(user?.updatedAt || '').toLocaleDateString('pt-PT')}</span>
          </div>
        </div>
      </div>

      {/* Delete Profile Section */}
      <div className="app-card max-w-2xl border-red-200">
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          Zona de Perigo
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Ao deletar seu perfil, todos os seus dados serão removidos permanentemente. Esta ação não pode ser desfeita.
        </p>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              Deletar Meu Perfil
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza que deseja deletar seu perfil?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteProfile}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Deletando...' : 'Sim, deletar perfil'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Profile; 