import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button
} from 'shards-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import PhotoUpload from './PhotoUpload';

interface UserAccountDetailsProps {
  title?: string;
}

const UserAccountDetails: React.FC<UserAccountDetailsProps> = ({
  title = "Detalhes da Conta"
}) => {
  const { user, setUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telemovel: '',
    senha: ''
  });

  // Inicializar formulário com dados do utilizador
  useEffect(() => {
    if (user) {
      setFormData({
        nomeCompleto: user.nomeCompleto || '',
        email: user.email || '',
        telemovel: user.telemovel || '',
        senha: ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUploaded = (photoUrl: string) => {
    // A foto já foi actualizada no contexto pelo PhotoUpload
    // Este callback pode ser usado para feedback adicional se necessário
    console.log('Nova foto enviada:', photoUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (formData.telemovel !== user?.telemovel) {
        updateData.telemovel = formData.telemovel;
      }

      if (formData.senha.trim() !== '') {
        updateData.senha = formData.senha;
      }

      // Se nenhum campo foi alterado
      if (Object.keys(updateData).length === 0) {
        toast({
          title: "Nenhuma alteração detectada",
          description: "Não há mudanças para guardar.",
        });
        setIsSaving(false);
        return;
      }

      console.log('🔄 Atualizando perfil:', updateData);

      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('📡 Resposta do servidor:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao actualizar conta');
      }

      const result = await response.json();
      console.log('✅ Resposta completa:', result);

      // Actualizar dados do utilizador no contexto
      if (result.success && result.data) {
        console.log('💾 Atualizando contexto com:', result.data);
        setUser(result.data); // O contexto já salva no localStorage automaticamente
      } else {
        console.warn('⚠️ Resposta sem sucesso ou sem data:', result);
      }

      toast({
        title: "Conta actualizada com sucesso!",
        description: "As suas informações foram guardadas.",
      });

      // Limpar senha após guardar
      setFormData(prev => ({ ...prev, senha: '' }));

    } catch (error) {
      toast({
        title: "Erro ao actualizar conta",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Tem a certeza que deseja eliminar o seu perfil? Esta acção não pode ser desfeita.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao eliminar perfil');
      }

      toast({
        title: "Perfil eliminado com sucesso",
        description: "A sua conta foi removida permanentemente.",
      });

      // Fazer logout e redirecionar para o site institucional
      setTimeout(() => {
        logout();
      }, 1000);

    } catch (error) {
      toast({
        title: "Erro ao eliminar perfil",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              {/* Upload de Foto */}
              <div className="mb-4">
                <h6 className="mb-3">Foto de Perfil</h6>
                <PhotoUpload onPhotoUploaded={handlePhotoUploaded} />
              </div>

              <Form onSubmit={handleSubmit}>
                <Row form>
                  {/* Nome Completo */}
                  <Col md="6" className="form-group">
                    <label htmlFor="nomeCompleto">Nome Completo</label>
                    <FormInput
                      id="nomeCompleto"
                      name="nomeCompleto"
                      placeholder="Nome Completo"
                      value={formData.nomeCompleto}
                      onChange={handleInputChange}
                      required
                    />
                  </Col>
                  {/* Email */}
                  <Col md="6" className="form-group">
                    <label htmlFor="email">Email</label>
                    <FormInput
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Endereço de Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      required
                    />
                  </Col>
                </Row>
                <Row form>
                  {/* Telemóvel */}
                  <Col md="6" className="form-group">
                    <label htmlFor="telemovel">Telemóvel (opcional)</label>
                    <FormInput
                      type="tel"
                      id="telemovel"
                      name="telemovel"
                      placeholder="+351 123 456 789"
                      value={formData.telemovel}
                      onChange={handleInputChange}
                      autoComplete="tel"
                    />
                  </Col>
                  {/* Senha */}
                  <Col md="6" className="form-group">
                    <label htmlFor="senha">Nova Senha (opcional)</label>
                    <FormInput
                      type="password"
                      id="senha"
                      name="senha"
                      placeholder="Deixe em branco para manter a actual"
                      value={formData.senha}
                      onChange={handleInputChange}
                      autoComplete="new-password"
                    />
                  </Col>
                </Row>
                <div className="d-flex justify-content-between">
                  <Button
                    theme="accent"
                    type="submit"
                    disabled={isSaving}
                    style={{ backgroundColor: '#F5A623', borderColor: '#F5A623' }}
                  >
                    {isSaving ? 'A guardar...' : 'Actualizar Conta'}
                  </Button>

                  <Button
                    theme="danger"
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDeleteProfile}
                  >
                    {isDeleting ? 'A eliminar...' : 'Eliminar Perfil'}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default UserAccountDetails; 